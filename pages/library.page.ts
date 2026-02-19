import { BasePage } from './base.page';

export class LibraryPage extends BasePage {
  readonly booksList = this.getByTestId('library-books-list');
  readonly bookItem = this.getByTestId('library-book-item');
  readonly filterDialog = this.getByTestId('library-filter-dialog');
  readonly searchInput = this.getByTestId('library-search-input');

  async open(): Promise<void> {
    await this.navigate('/library');
  }
}
