import { test as base, type Page } from '@playwright/test';
import { users } from './users';
import * as fs from 'fs';
import * as path from 'path';

const AUTH_DIR = path.resolve(__dirname, '../.auth');

type AuthFixtures = {
  authedPage: Page;
};

/**
 * Get the storage state path for the current project.
 * Each project (chromium, mobile) gets its own auth state file.
 */
function storagePath(projectName: string): string {
  return path.join(AUTH_DIR, `${projectName || 'default'}.json`);
}

export const test = base.extend<AuthFixtures>({
  authedPage: async ({ browser, contextOptions }, use, testInfo) => {
    const stateFile = storagePath(testInfo.project.name);

    // Reuse existing auth state if available (avoid repeated logins / rate limit)
    if (fs.existsSync(stateFile)) {
      const context = await browser.newContext({
        ...contextOptions,
        storageState: stateFile,
      });
      const page = await context.newPage();
      await use(page);
      await page.close();
      await context.close();
      return;
    }

    // First run: login and save state
    fs.mkdirSync(AUTH_DIR, { recursive: true });

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    await page.goto('/ru/signin');
    await page.waitForLoadState('networkidle');
    await page.getByTestId('login-email-input').fill(users.regular.email);
    await page.getByTestId('login-password-input').fill(users.regular.password);

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().includes('/api/user/signin') &&
          r.request().method() === 'POST',
        { timeout: 15_000 },
      ),
      page.getByTestId('login-submit-button').click(),
    ]);

    if (response.status() >= 300) {
      throw new Error(`Login failed: ${response.status()}`);
    }

    await page.waitForTimeout(3000);

    // Save auth state for reuse
    await context.storageState({ path: stateFile });
    
    await use(page);
    await page.close();
    await context.close();
  },
});

export { expect } from '@playwright/test';
