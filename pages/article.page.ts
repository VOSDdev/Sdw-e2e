import { BasePage } from './base.page';

export class ArticlePage extends BasePage {
  readonly titleText = this.getByTestId('article-title-text');
  readonly bodyContainer = this.getByTestId('article-body-container');
  readonly likeButton = this.getByTestId('article-like-button');
  readonly likeCount = this.getByTestId('article-like-count');
  readonly favoriteButton = this.getByTestId('article-favorite-button');
  readonly shareButton = this.getByTestId('article-share-button');
  readonly commentInput = this.getByTestId('article-comment-input');
  readonly commentSubmitButton = this.getByTestId('article-commentSubmit-button');
  readonly commentList = this.getByTestId('article-comment-list');

  async open(slug: string): Promise<void> {
    await this.navigate(`/articles/${slug}`);
  }
}
