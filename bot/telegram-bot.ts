/**
 * SDW E2E Telegram Bot
 * Commands: /test, /smoke, /auth, /status, /report, /help
 * AI: Handles natural language queries via OpenClaw
 * 
 * Run: npx tsx bot/telegram-bot.ts
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, OPENCLAW_API_URL
 */

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ALLOWED_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003563548274';
const OPENCLAW_API_URL = process.env.OPENCLAW_API_URL;
const BASE_DIR = path.resolve(__dirname, '..');
const RESULTS_FILE = path.join(BASE_DIR, '.last-run.json');

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    chat: { id: number };
    from?: { first_name: string; username?: string };
    text?: string;
    date: number;
  };
}

interface RunResult {
  timestamp: string;
  suite: string;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  status: 'passed' | 'failed';
  failedTests: string[];
}

let offset = 0;
let currentRun: string | null = null;

async function sendMessage(chatId: number | string, text: string, replyTo?: number): Promise<number | undefined> {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  };
  if (replyTo) body.reply_to_message_id = replyTo;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json() as { ok: boolean; result: { message_id: number } };
    if (data.ok) return data.result.message_id;
  } catch (e) {
    console.error('Send error:', e);
  }
}

async function editMessage(chatId: number | string, messageId: number, text: string): Promise<void> {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
      }),
    });
  } catch (e) {
    console.error('Edit error:', e);
  }
}

function runTests(suite: string, grep: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const cmd = `cd ${BASE_DIR} && npx playwright test --grep "${grep}" --project=chromium --reporter=json 2>/dev/null`;

    exec(cmd, { maxBuffer: 10 * 1024 * 1024, timeout: 120_000 }, (error, stdout) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      let passed = 0, failed = 0, skipped = 0;
      const failedTests: string[] = [];

      try {
        const json = JSON.parse(stdout);
        for (const s of json.suites || []) {
          for (const inner of s.suites || []) {
            for (const spec of inner.specs || []) {
              for (const test of spec.tests || []) {
                const status = test.status || test.expectedStatus;
                if (status === 'expected') passed++;
                else if (status === 'unexpected') {
                  failed++;
                  failedTests.push(spec.title);
                } else if (status === 'skipped') skipped++;
              }
            }
          }
        }
      } catch {
        if (error) {
          failed = 1;
          failedTests.push('Parse error — check logs');
        } else {
          passed = 1;
        }
      }

      const result: RunResult = {
        timestamp: new Date().toISOString(),
        suite,
        passed,
        failed,
        skipped,
        duration: `${duration}s`,
        status: failed > 0 ? 'failed' : 'passed',
        failedTests,
      };

      fs.writeFileSync(RESULTS_FILE, JSON.stringify(result, null, 2));
      resolve(result);
    });
  });
}

function formatResult(r: RunResult): string {
  const icon = r.status === 'passed' ? '🟢' : '🔴';
  const total = r.passed + r.failed + r.skipped;
  const lines = [
    `<b>${icon} E2E: ${r.suite}</b>`,
    ``,
    `✅ Passed: ${r.passed}`,
    `❌ Failed: ${r.failed}`,
    `⏭ Skipped: ${r.skipped}`,
    `📊 Total: ${total}`,
    `⏱ Duration: ${r.duration}`,
    `🕐 ${new Date(r.timestamp).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
  ];

  if (r.failedTests.length > 0) {
    lines.push('', '<b>Failed:</b>');
    for (const t of r.failedTests.slice(0, 10)) {
      lines.push(`  • ${t}`);
    }
    if (r.failedTests.length > 10) {
      lines.push(`  ... и ещё ${r.failedTests.length - 10}`);
    }
  }

  return lines.join('\n');
}

function getLastResult(): RunResult | null {
  try {
    return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
  } catch {
    return null;
  }
}

async function handleAI(chatId: number, text: string, messageId: number, from: string): Promise<void> {
  if (!OPENCLAW_API_URL) {
    await sendMessage(chatId, '⚠️ AI отключен (нет OPENCLAW_API_URL)', messageId);
    return;
  }

  const thinkingMsgId = await sendMessage(chatId, '🧠 Думаю...', messageId);
  if (!thinkingMsgId) return;

  try {
    const response = await fetch(OPENCLAW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer openclaw-internal-token' // Optional, for future use
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are the QA Automation Lead for sanatanadharma.world.
Your name is "SDW QA".
You are running on the Editorial server.
You have access to:
1. Source code mirror: /app/source (read-only)
2. E2E Tests repo: /app (read/write)
3. Shell commands: npm, npx playwright, git

Your goal is to answer questions about tests, write new tests based on user requests, and analyze test results.
When writing tests:
- Use /app/pages/ Page Objects.
- Follow data-testid conventions.
- Tests go into /app/tests/.
- Always check if a test file exists before creating a new one.

User: ${from}`
          },
          { role: 'user', content: text }
        ],
        model: 'anthropic/claude-3-5-sonnet-20240620', // Or whatever default is
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { choices: { message: { content: string } }[] };
    const answer = data.choices[0]?.message?.content || '⚠️ Пустой ответ от AI';

    // Telegram text limit is 4096. Truncate if needed.
    const safeAnswer = answer.length > 4000 ? answer.slice(0, 4000) + '...' : answer;
    
    // Convert Markdown to HTML-ish or just send as text. 
    // Telegram HTML parser is strict. It's safer to strip markdown or use no parse_mode if AI output is complex.
    // For now, let's try to send with HTML but fallback if it fails.
    // Actually, simpler: send as plain text if it contains code blocks, or try to format.
    // Let's just send safeAnswer. Since we use parse_mode='HTML' in sendMessage/editMessage, we need to be careful.
    // AI models output Markdown.
    // Quick fix: Replace ``` with <pre> and ` with <code> is hard reliably.
    // Better: Send as Markdown if possible, or plain text.
    // I'll disable parse_mode for AI replies to avoid errors with unclosed tags.
    
    // Re-implement editMessage to support disabling parse_mode
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: thinkingMsgId,
        text: safeAnswer,
        // parse_mode: 'Markdown' // Optional, often flaky. Let's stick to plain text for AI for stability.
      }),
    });

  } catch (e) {
    console.error('AI Error:', e);
    await editMessage(chatId, thinkingMsgId, `❌ Ошибка AI: ${String(e)}`);
  }
}

async function handleCommand(chatId: number, text: string, messageId: number, from: string): Promise<void> {
  // Security
  if (String(chatId) !== String(ALLOWED_CHAT_ID)) {
    await sendMessage(chatId, '⛔ Unauthorized chat');
    return;
  }

  // Remove @botname
  const cleanText = text.replace(/@\w+\s?/, '').trim();
  
  if (!cleanText.startsWith('/')) {
    // It's a natural language query -> AI
    await handleAI(chatId, cleanText, messageId, from);
    return;
  }

  const cmd = cleanText.split(/\s+/)[0]?.toLowerCase();

  switch (cmd) {
    case '/test': {
      if (currentRun) {
        await sendMessage(chatId, '⏳ Тесты уже запущены...', messageId);
        return;
      }
      currentRun = 'all';
      await sendMessage(chatId, `🚀 Запуск всех тестов...\n👤 ${from}`, messageId);
      const result = await runTests('All Tests', '@smoke|@auth');
      currentRun = null;
      await sendMessage(chatId, formatResult(result));
      break;
    }

    case '/smoke': {
      if (currentRun) {
        await sendMessage(chatId, '⏳ Тесты уже запущены...', messageId);
        return;
      }
      currentRun = 'smoke';
      await sendMessage(chatId, `🚀 Запуск smoke тестов...\n👤 ${from}`, messageId);
      const result = await runTests('Smoke Tests', '@smoke');
      currentRun = null;
      await sendMessage(chatId, formatResult(result));
      break;
    }

    case '/auth': {
      if (currentRun) {
        await sendMessage(chatId, '⏳ Тесты уже запущены...', messageId);
        return;
      }
      currentRun = 'auth';
      await sendMessage(chatId, `🚀 Запуск auth тестов...\n👤 ${from}`, messageId);
      const result = await runTests('Auth Tests', '@auth');
      currentRun = null;
      await sendMessage(chatId, formatResult(result));
      break;
    }

    case '/status': {
      const last = getLastResult();
      if (!last) await sendMessage(chatId, '📭 Нет результатов', messageId);
      else await sendMessage(chatId, formatResult(last), messageId);
      break;
    }

    case '/report': {
      const last = getLastResult();
      if (!last) {
        await sendMessage(chatId, '📭 Нет результатов', messageId);
        return;
      }
      const detailed = formatResult(last);
      const extra = [
        detailed,
        '',
        `<b>📋 Config:</b>`,
        `Target: ${process.env.BASE_URL || 'https://dev.sanatanadharma.world'}`,
        `Browser: Chromium`,
      ].join('\n');
      await sendMessage(chatId, extra, messageId);
      break;
    }

    case '/help': {
      const help = [
        '<b>🧪 SDW E2E Bot</b>',
        '',
        '/test — All tests',
        '/smoke — Smoke tests',
        '/auth — Auth tests',
        '/status — Last result',
        '/report — Detailed report',
        '',
        '🤖 <b>AI Chat:</b> Just send a text message!',
        'Example: "Check the lectures page" or "Write a test for search"',
      ].join('\n');
      await sendMessage(chatId, help, messageId);
      break;
    }
  }
}

async function pollUpdates(): Promise<void> {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30&allowed_updates=["message"]`
    );
    const data = (await res.json()) as { ok: boolean; result: TelegramUpdate[] };

    if (!data.ok) return;

    for (const update of data.result) {
      offset = update.update_id + 1;
      const msg = update.message;
      if (!msg?.text) continue;

      const from = msg.from?.first_name || msg.from?.username || 'Unknown';
      await handleCommand(msg.chat.id, msg.text, msg.message_id, from);
    }
  } catch (e) {
    console.error('Poll error:', e);
    // Add delay on error to avoid loop
    await new Promise(r => setTimeout(r, 2000));
  }
}

async function main(): Promise<void> {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is required');
    process.exit(1);
  }

  console.log('🤖 SDW E2E Bot started');
  console.log(`📢 Chat: ${ALLOWED_CHAT_ID}`);
  console.log(`🧠 AI URL: ${OPENCLAW_API_URL}`);

  // Poll
  while (true) {
    await pollUpdates();
  }
}

main().catch(console.error);
