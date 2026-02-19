import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly heroContainer = this.getByTestId('home-hero-container');
  readonly featuredList = this.getByTestId('home-featured-list');
  readonly searchInput = this.getByTestId('home-search-input');
  readonly searchButton = this.getByTestId('home-search-button');
  readonly navContainer = this.getByTestId('home-nav-container');

  async open(): Promise<void> {
    await this.navigate('/');
  }
}
