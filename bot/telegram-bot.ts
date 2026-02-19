/**
 * SDW E2E Telegram Bot
 * Commands: /test, /smoke, /auth, /status, /report, /help
 * 
 * Run: npx ts-node bot/telegram-bot.ts
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

import { execSync, exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ALLOWED_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003563548274';
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

async function sendMessage(chatId: number | string, text: string, replyTo?: number): Promise<void> {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  };
  if (replyTo) body.reply_to_message_id = replyTo;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error('Send error:', e);
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
        // Fallback: parse from exit code
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

async function handleCommand(chatId: number, text: string, messageId: number, from: string): Promise<void> {
  // Security: only allowed chat
  if (String(chatId) !== String(ALLOWED_CHAT_ID)) {
    await sendMessage(chatId, '⛔ Unauthorized chat');
    return;
  }

  const cmd = text.split(/\s+/)[0]?.toLowerCase().replace(/@\w+$/, '');

  switch (cmd) {
    case '/test': {
      if (currentRun) {
        await sendMessage(chatId, '⏳ Тесты уже запущены, подождите...', messageId);
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
        await sendMessage(chatId, '⏳ Тесты уже запущены, подождите...', messageId);
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
        await sendMessage(chatId, '⏳ Тесты уже запущены, подождите...', messageId);
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
      if (!last) {
        await sendMessage(chatId, '📭 Нет результатов. Запустите /test', messageId);
      } else {
        await sendMessage(chatId, formatResult(last), messageId);
      }
      break;
    }

    case '/report': {
      const last = getLastResult();
      if (!last) {
        await sendMessage(chatId, '📭 Нет результатов. Запустите /test', messageId);
        return;
      }
      const detailed = formatResult(last);
      const extra = [
        detailed,
        '',
        `<b>📋 Config:</b>`,
        `Target: ${process.env.BASE_URL || 'https://dev.sanatanadharma.world'}`,
        `Browser: Chromium`,
        `Retries: 2`,
      ].join('\n');
      await sendMessage(chatId, extra, messageId);
      break;
    }

    case '/help': {
      const help = [
        '<b>🧪 SDW E2E Bot</b>',
        '',
        '/test — Запустить все тесты',
        '/smoke — Только smoke тесты',
        '/auth — Только auth тесты',
        '/status — Последний результат',
        '/report — Подробный отчёт',
        '/help — Эта справка',
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
  }
}

async function main(): Promise<void> {
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is required');
    process.exit(1);
  }

  console.log('🤖 SDW E2E Bot started');
  console.log(`📢 Chat: ${ALLOWED_CHAT_ID}`);

  // Set bot commands
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      commands: [
        { command: 'test', description: 'Запустить все тесты' },
        { command: 'smoke', description: 'Smoke тесты' },
        { command: 'auth', description: 'Auth тесты' },
        { command: 'status', description: 'Последний результат' },
        { command: 'report', description: 'Подробный отчёт' },
        { command: 'help', description: 'Справка' },
      ],
    }),
  });

  // Long polling loop
  while (true) {
    await pollUpdates();
  }
}

main().catch(console.error);
