import { type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ArticlePage extends BasePage {
  // Content elements
  readonly bodyContainer = this.getByTestId('content-body-container');
  readonly dateButton = this.getByTestId('content-date');
  readonly viewsCount = this.getByTestId('content-views-count');
  readonly audioPlayButton = this.getByTestId('content-audio-play-button');
  readonly scrollTopButton = this.getByTestId('content-scroll-top-button');

  // Actions
  readonly likeButton = this.getByTestId('content-like');
  readonly favoriteButton = this.getByTestId('content-favorite');
  readonly shareButton = this.getByTestId('content-share');

  // Tags & similar
  readonly tagsList = this.getByTestId('content-tags-list');
  readonly similarList = this.getByTestId('content-similar-list');

  // Purchase (paid content)
  readonly purchaseButton = this.getByTestId('content-purchase-button');

  /** All <img> inside the similar articles section */
  get similarImages(): Locator {
    return this.similarList.locator('img');
  }

  /** Individual tag chips */
  get tagChips(): Locator {
    return this.tagsList.locator('app-chip');
  }

  async open(categorySlug: string, contentSlug: string): Promise<void> {
    await this.navigate(`/ru/categories/${categorySlug}/${contentSlug}`);
  }

  /** Scroll down until a target locator is visible */
  async scrollUntilVisible(target: Locator, maxScrolls = 20): Promise<void> {
    for (let i = 0; i < maxScrolls; i++) {
      const visible = await target.isVisible().catch(() => false);
      if (visible) break;
      await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await this.page.waitForTimeout(500);
    }
  }
}
