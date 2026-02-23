import { test as base, type BrowserContext, type Page } from '@playwright/test';
import { users } from './users';

type AuthFixtures = {
  authenticatedContext: BrowserContext;
  authedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/ru/signin');
    await page.waitForLoadState('networkidle');
    await page.getByTestId('login-email-input').fill(users.regular.email);
    await page.getByTestId('login-password-input').fill(users.regular.password);

    // Click submit and wait for the API response
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

    // Wait for the app to process auth token and settle
    await page.waitForTimeout(3000);
    await page.close();

    await use(context);
    await context.close();
  },

  authedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  },
});

export { expect } from '@playwright/test';
