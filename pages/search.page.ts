import { BasePage } from './base.page';

export class SearchPage extends BasePage {
  readonly searchInput = this.getByTestId('search-input');
  readonly resultsContainer = this.getByTestId('search-results-container');
  readonly resultItem = this.getByTestId('search-result-item');
  readonly resultsCount = this.getByTestId('search-results-count-text');
  readonly emptyText = this.getByTestId('search-empty-text');
  readonly filterDialog = this.getByTestId('search-filter-dialog');

  async open(query?: string): Promise<void> {
    const path = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
    await this.navigate(path);
  }
}
