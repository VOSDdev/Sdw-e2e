import { type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ArticlePage extends BasePage {
  readonly bodyContainer = this.getByTestId('content-body-container');
  readonly likeButton = this.getByTestId('content-like');
  readonly favoriteButton = this.getByTestId('content-favorite');
  readonly shareButton = this.getByTestId('content-share');
  readonly tagsList = this.getByTestId('content-tags-list');
  readonly similarList = this.getByTestId('content-similar-list');
  readonly purchaseButton = this.getByTestId('content-purchase-button');
  readonly viewsCount = this.getByTestId('content-views-count');
  readonly dateButton = this.getByTestId('content-date');

  /** All <img> inside the similar articles section */
  get similarImages(): Locator {
    return this.similarList.locator('img.similar-img');
  }

  async open(categorySlug: string, contentSlug: string): Promise<void> {
    await this.navigate(`/ru/categories/${categorySlug}/${contentSlug}`);
  }
}
