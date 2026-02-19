import { test as base, type BrowserContext } from '@playwright/test';
import { users } from './users';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(__dirname, '../.auth/user.json');

type AuthFixtures = {
  authenticatedContext: BrowserContext;
};

export const test = base.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/login');
    await page.getByTestId('login-email-input').fill(users.regular.email);
    await page.getByTestId('login-password-input').fill(users.regular.password);
    await page.getByTestId('login-submit-button').click();
    await page.waitForURL('**/');

    await context.storageState({ path: STORAGE_STATE_PATH });
    await use(context);
    await context.close();
  },
});

export { expect } from '@playwright/test';
