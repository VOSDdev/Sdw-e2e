import { test, expect } from '../../fixtures/auth.fixture';
import { ArticlePage } from '../../pages/article.page';
import { ARTICLES } from '../../fixtures/test-data';

const { categorySlug, contentSlug } = ARTICLES.withSimilar;

// Auth interactions only run on chromium — mobile viewport
// shows a different login modal that needs separate handling
test.describe('@content Authenticated Interactions', () => {
  test.describe.configure({ mode: 'serial' });
  test.skip(({ browserName }) => browserName !== 'chromium', 'Auth tests: chromium only');

  test('like toggle: click adds selected, click again removes it', async ({ authedPage }) => {
    const article = new ArticlePage(authedPage);
    await article.open(categorySlug, contentSlug);
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });

    const likeBtn = article.likeButton;

    // Clean state: if already liked, unlike first
    const alreadyLiked = await likeBtn.evaluate((el) =>
      el.classList.contains('selected'),
    );
    if (alreadyLiked) {
      await likeBtn.click();
      await expect(likeBtn).not.toHaveClass(/selected/, { timeout: 5_000 });
    }

    // ── Like ──
    await likeBtn.click();
    await expect(likeBtn).toHaveClass(/selected/, { timeout: 5_000 });

    // ── Unlike ──
    await likeBtn.click();
    await expect(likeBtn).not.toHaveClass(/selected/, { timeout: 5_000 });
  });

  test('like persists after page reload', async ({ authedPage }) => {
    const article = new ArticlePage(authedPage);
    await article.open(categorySlug, contentSlug);
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });

    const likeBtn = article.likeButton;

    // Ensure unliked
    const alreadyLiked = await likeBtn.evaluate((el) =>
      el.classList.contains('selected'),
    );
    if (alreadyLiked) {
      await likeBtn.click();
      await expect(likeBtn).not.toHaveClass(/selected/, { timeout: 5_000 });
    }

    // Like and reload
    await likeBtn.click();
    await expect(likeBtn).toHaveClass(/selected/, { timeout: 5_000 });

    await authedPage.reload();
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });
    await expect(article.likeButton).toHaveClass(/selected/, { timeout: 5_000 });

    // Cleanup: unlike
    await article.likeButton.click();
    await expect(article.likeButton).not.toHaveClass(/selected/, { timeout: 5_000 });
  });

  test('favorite toggle: click adds selected, click again removes it', async ({ authedPage }) => {
    const article = new ArticlePage(authedPage);
    await article.open(categorySlug, contentSlug);
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });

    const favBtn = article.favoriteButton;

    // Clean state
    const alreadyFav = await favBtn.evaluate((el) =>
      el.classList.contains('selected'),
    );
    if (alreadyFav) {
      await favBtn.click();
      await expect(favBtn).not.toHaveClass(/selected/, { timeout: 5_000 });
    }

    // ── Add to favorites ──
    await favBtn.click();
    await expect(favBtn).toHaveClass(/selected/, { timeout: 5_000 });

    // ── Remove from favorites ──
    await favBtn.click();
    await expect(favBtn).not.toHaveClass(/selected/, { timeout: 5_000 });
  });

  test('favorite persists after page reload', async ({ authedPage }) => {
    const article = new ArticlePage(authedPage);
    await article.open(categorySlug, contentSlug);
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });

    const favBtn = article.favoriteButton;

    // Ensure not favorited
    const alreadyFav = await favBtn.evaluate((el) =>
      el.classList.contains('selected'),
    );
    if (alreadyFav) {
      await favBtn.click();
      await expect(favBtn).not.toHaveClass(/selected/, { timeout: 5_000 });
    }

    // Favorite and reload
    await favBtn.click();
    await expect(favBtn).toHaveClass(/selected/, { timeout: 5_000 });

    await authedPage.reload();
    await expect(article.bodyContainer).toBeVisible({ timeout: 15_000 });
    await expect(article.favoriteButton).toHaveClass(/selected/, { timeout: 5_000 });

    // Cleanup: remove favorite
    await article.favoriteButton.click();
    await expect(article.favoriteButton).not.toHaveClass(/selected/, { timeout: 5_000 });
  });
});
