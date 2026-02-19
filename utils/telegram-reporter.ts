import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

class TelegramReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private startTime = 0;

  onBegin(_config: FullConfig, _suite: Suite): void {
    this.startTime = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    switch (result.status) {
      case 'passed':
        this.passed++;
        break;
      case 'failed':
      case 'timedOut':
        this.failed++;
        break;
      case 'skipped':
        this.skipped++;
        break;
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) return;

    const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
    const total = this.passed + this.failed + this.skipped;
    const status = this.failed > 0 ? '🔴 FAILED' : '🟢 PASSED';

    const text = [
      `<b>E2E ${status}</b>`,
      ``,
      `✅ Passed: ${this.passed}`,
      `❌ Failed: ${this.failed}`,
      `⏭ Skipped: ${this.skipped}`,
      `📊 Total: ${total}`,
      `⏱ Duration: ${duration}s`,
      `🏷 Status: ${result.status}`,
    ].join('\n');

    try {
      await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
        }
      );
    } catch (e) {
      console.error('Telegram reporter error:', e);
    }
  }
}

export default TelegramReporter;
