import { test, expect } from '@playwright/test';
import { ArticlePage } from '../../pages/article.page';
import { ARTICLES } from '../../fixtures/test-data';

const { categorySlug, contentSlug } = ARTICLES.withSimilar;

test.describe('@content Content Page', () => {
  let article: ArticlePage;

  test.beforeEach(async ({ page }) => {
    article = new ArticlePage(page);
    await article.open(categorySlug, contentSlug);
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });
  });

  // ─── Title & Body ───────────────────────────────────────────

  test('page has a non-empty title', async () => {
    const title = await article.getTitle();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('article body is visible and has text content', async () => {
    await expect(article.bodyContainer).toBeVisible();
    const text = await article.bodyContainer.textContent();
    expect(text?.trim().length).toBeGreaterThan(10);
  });

  // ─── Date & Views ──────────────────────────────────────────

  test('publication date is displayed', async () => {
    await expect(article.dateButton).toBeVisible();
    const dateText = await article.dateButton.textContent();
    // Date format: DD.MM.YYYY
    expect(dateText?.trim()).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });

  test('view count is displayed', async () => {
    await expect(article.viewsCount).toBeVisible();
    const text = await article.viewsCount.textContent();
    // Should contain a number
    expect(text).toMatch(/\d+/);
  });

  // ─── Action Buttons ────────────────────────────────────────

  test('like button is visible and shows count', async () => {
    await expect(article.likeButton).toBeVisible();
    const text = await article.likeButton.textContent();
    // Like count is a number (can be 0)
    expect(text?.trim()).toMatch(/^\d+$/);
  });

  test('favorite button is visible', async () => {
    await expect(article.favoriteButton).toBeVisible();
  });

  test('share button is visible', async () => {
    await expect(article.shareButton).toBeVisible();
    const text = await article.shareButton.textContent();
    expect(text).toContain('Поделиться');
  });

  // ─── Tags ──────────────────────────────────────────────────

  test('tags list is visible with at least one tag', async ({ page }) => {
    await article.scrollUntilVisible(article.tagsList);
    await expect(article.tagsList).toBeVisible({ timeout: 5_000 });

    const count = await article.tagChips.count();
    expect(count).toBeGreaterThan(0);
  });

  test('tag chips display readable text', async ({ page }) => {
    await article.scrollUntilVisible(article.tagsList);
    await expect(article.tagsList).toBeVisible({ timeout: 5_000 });

    const firstTag = article.tagChips.first();
    await expect(firstTag).toBeVisible();
    const tagText = await firstTag.textContent();
    expect(tagText?.trim().length).toBeGreaterThan(0);
  });

  // ─── Similar Articles ──────────────────────────────────────

  test('similar articles block is visible and contains articles', async ({ page }) => {
    await article.scrollUntilVisible(article.similarList);
    await expect(article.similarList).toBeVisible({ timeout: 10_000 });

    const images = article.similarList.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('similar articles with real previews load successfully', async ({ page }) => {
    await article.scrollUntilVisible(article.similarList);
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

      // Skip articles without real preview
      if (!src.includes('/upload/')) continue;

      realImageCount++;

      if (src.includes('clouds.webp')) {
        issues.push(`Image #${i}: placeholder clouds.webp`);
        continue;
      }

      const loaded = await img.evaluate((el: HTMLImageElement) => {
        return new Promise<boolean>((resolve) => {
          if (el.naturalWidth > 0) return resolve(true);
          el.onload = () => resolve(true);
          el.onerror = () => resolve(false);
          setTimeout(() => resolve(el.naturalWidth > 0), 5000);
        });
      });

      if (!loaded) {
        issues.push(`Image #${i}: "${src}" → 404 or broken`);
      }
    }

    if (issues.length > 0) {
      throw new Error(`Broken images in similar articles:\n${issues.join('\n')}`);
    }

    expect(realImageCount, 'At least one similar article should have a real preview').toBeGreaterThan(0);
  });

  // ─── SEO Meta ──────────────────────────────────────────────

  test('page has correct meta description', async ({ page }) => {
    const desc = await page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute('content'),
    );
    expect(desc?.trim().length).toBeGreaterThan(0);
  });

  test('page has Open Graph tags', async ({ page }) => {
    const ogTitle = await page.$eval(
      'meta[property="og:title"]',
      (el) => el.getAttribute('content'),
    ).catch(() => null);

    const ogDesc = await page.$eval(
      'meta[property="og:description"]',
      (el) => el.getAttribute('content'),
    ).catch(() => null);

    const ogImage = await page.$eval(
      'meta[property="og:image"]',
      (el) => el.getAttribute('content'),
    ).catch(() => null);

    expect(ogTitle?.trim().length).toBeGreaterThan(0);
    expect(ogDesc?.trim().length).toBeGreaterThan(0);
    expect(ogImage).toBeTruthy();
    expect(ogImage).toContain('https://');
  });

  // ─── Scroll to Top ────────────────────────────────────────

  test('scroll-to-top button appears after scrolling', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
    await page.waitForTimeout(500);

    await expect(article.scrollTopButton).toBeVisible({ timeout: 5_000 });
  });

  // ─── Navigation (breadcrumbs) ─────────────────────────────

  test('clicking browser back returns to previous page', async ({ page }) => {
    // Navigate to category first, then to article
    await page.goto('/ru');
    await page.waitForLoadState('domcontentloaded');
    await article.open(categorySlug, contentSlug);
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });

    await page.goBack();
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/ru');
  });
});
