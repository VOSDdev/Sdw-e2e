import { BasePage } from './base.page';

export class SearchPage extends BasePage {
  readonly searchInput = this.getByTestId('search-query-input');
  readonly searchButton = this.getByTestId('search-submit-button');
  readonly resultList = this.getByTestId('search-result-list');
  readonly resultCount = this.getByTestId('search-result-count');

  async open(query?: string): Promise<void> {
    const path = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
    await this.navigate(path);
  }
}
