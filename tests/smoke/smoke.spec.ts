import { test, expect } from '@playwright/test';
import { PUBLIC_PAGES } from '../../fixtures/test-data';

test.describe('Smoke Tests @smoke', () => {
  for (const { name, path } of PUBLIC_PAGES) {
    test(`${name} page loads successfully`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.locator('body')).toBeVisible();
      await expect(page).not.toHaveTitle(/error|404|500/i);
    });
  }
});
