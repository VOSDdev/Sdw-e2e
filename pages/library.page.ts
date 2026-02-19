import { BasePage } from './base.page';

export class LibraryPage extends BasePage {
  readonly contentList = this.getByTestId('library-content-list');
  readonly filterContainer = this.getByTestId('library-filter-container');
  readonly searchInput = this.getByTestId('library-search-input');

  async open(): Promise<void> {
    await this.navigate('/library');
  }
}
