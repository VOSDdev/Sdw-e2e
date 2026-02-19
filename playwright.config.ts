import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://dev.sanatanadharma.world';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 2,
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,

  reporter: [
    ['html', { open: 'never' }],
    ['./utils/telegram-reporter.ts'],
  ],

  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'] },
    },
  ],
});
