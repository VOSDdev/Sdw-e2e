import { BasePage } from './base.page';

export class ArticlePage extends BasePage {
  readonly bodyContainer = this.getByTestId('content-body-container');
  readonly likeButton = this.getByTestId('content-like');
  readonly favoriteButton = this.getByTestId('content-favorite');
  readonly shareButton = this.getByTestId('content-share');
  readonly tagsList = this.getByTestId('content-tags-list');
  readonly similarList = this.getByTestId('content-similar-list');
  readonly purchaseButton = this.getByTestId('content-purchase-button');

  async open(slug: string): Promise<void> {
    await this.navigate(`/articles/${slug}`);
  }
}
