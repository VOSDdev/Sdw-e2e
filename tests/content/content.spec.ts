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
    // Wait for the article body to render before any scroll
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });
  });

  test('similar articles show real preview images, not placeholders', async ({ page }) => {
    // Incrementally scroll until similar section appears or timeout
    const maxScrolls = 20;
    for (let i = 0; i < maxScrolls; i++) {
      const visible = await article.similarList.isVisible().catch(() => false);
      if (visible) break;
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(500);
    }

    await expect(article.similarList).toBeVisible({ timeout: 10_000 });

    const images = article.similarImages;
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);

      await img.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(img).toBeVisible();

      const src = await img.getAttribute('src') ?? await img.getAttribute('ngSrc') ?? '';

      expect(
        src,
        `Similar image #${i} should use real preview (/upload/), got: ${src}`,
      ).toContain('/upload/');

      expect(
        src,
        `Similar image #${i} should NOT be the placeholder`,
      ).not.toContain('clouds.webp');

      // Verify image actually loaded
      const naturalWidth = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth,
      );
      expect(
        naturalWidth,
        `Similar image #${i} should be loaded (naturalWidth > 0)`,
      ).toBeGreaterThan(0);
    }
  });
});
