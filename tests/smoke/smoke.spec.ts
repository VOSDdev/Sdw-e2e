import { test, expect } from '@playwright/test';
import { PUBLIC_PAGES } from '../../fixtures/test-data';
import { HomePage } from '../../pages/home.page';
import { HeaderComponent } from '../../pages/header.page';
import { FooterComponent } from '../../pages/footer.page';

test.describe('Smoke Tests @smoke', () => {
  for (const { name, path } of PUBLIC_PAGES) {
    test(`${name} page loads successfully`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('body')).toBeVisible();
      await expect(page).not.toHaveTitle(/error|404|500/i);
    });
  }

  test('Homepage has banner and CTA', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await expect(home.bannerContainer).toBeVisible();
    await expect(home.bannerTitle).toBeVisible();
    await expect(home.bannerCta).toBeVisible();
  });

  test('Header navigation elements visible', async ({ page }) => {
    const header = new HeaderComponent(page);
    await page.goto('/');
    await expect(header.burgerButton).toBeVisible();
    await expect(header.searchLink).toBeVisible();
    await expect(header.navMainLink).toBeVisible();
    await expect(header.loginLink).toBeVisible();
  });

  test('Footer is visible', async ({ page }) => {
    const footer = new FooterComponent(page);
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(footer.container).toBeVisible({ timeout: 5000 });
    await expect(footer.copyrightText).toBeVisible();
  });
});
