import { test, expect } from '@playwright/test';
import { ArticlePage } from '../../pages/article.page';
import { ARTICLES } from '../../fixtures/test-data';

test.describe('@content Content Page', () => {
  let article: ArticlePage;

  test.beforeEach(async ({ page }) => {
    article = new ArticlePage(page);
    await article.open(
      ARTICLES.withSimilar.categorySlug,
      ARTICLES.withSimilar.contentSlug,
    );
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });
  });

  test('similar articles block is visible and contains articles', async ({ page }) => {
    // Scroll until similar section appears
    const maxScrolls = 20;
    for (let i = 0; i < maxScrolls; i++) {
      const visible = await article.similarList.isVisible().catch(() => false);
      if (visible) break;
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(500);
    }

    await expect(article.similarList).toBeVisible({ timeout: 10_000 });

    const images = article.similarList.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('similar articles with preview images show real images, not placeholders', async ({ page }) => {
    // Scroll until similar section appears
    const maxScrolls = 20;
    for (let i = 0; i < maxScrolls; i++) {
      const visible = await article.similarList.isVisible().catch(() => false);
      if (visible) break;
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(500);
    }

    await expect(article.similarList).toBeVisible({ timeout: 10_000 });

    const images = article.similarList.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    let realImageCount = 0;
    const issues: string[] = [];

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await img.scrollIntoViewIfNeeded();

      const src = await img.getAttribute('src') ?? await img.getAttribute('ngSrc') ?? '';

      // Skip articles without real preview (no /upload/ in src)
      if (!src.includes('/upload/')) {
        continue;
      }

      realImageCount++;

      // Real preview should NOT be the placeholder
      if (src.includes('clouds.webp')) {
        issues.push(`Image #${i}: uses placeholder clouds.webp`);
        continue;
      }

      // Wait for image to actually load
      const loaded = await img.evaluate((el: HTMLImageElement) => {
        return new Promise<boolean>((resolve) => {
          if (el.naturalWidth > 0) return resolve(true);
          el.onload = () => resolve(true);
          el.onerror = () => resolve(false);
          setTimeout(() => resolve(el.naturalWidth > 0), 5000);
        });
      });

      if (!loaded) {
        issues.push(`Image #${i}: src="${src}" failed to load (naturalWidth=0)`);
      }
    }

    // Report all issues at once
    if (issues.length > 0) {
      throw new Error(`Image issues found:\n${issues.join('\n')}`);
    }

    // At least one article should have a real preview image
    expect(
      realImageCount,
      'Expected at least one similar article with a real preview image (/upload/)',
    ).toBeGreaterThan(0);
  });
});
