import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly bannerContainer = this.getByTestId('home-banner-container');
  readonly bannerTitle = this.getByTestId('home-banner-title-text');
  readonly bannerCta = this.getByTestId('home-banner-cta-button');
  readonly contentContainer = this.getByTestId('home-content-container');

  async open(): Promise<void> {
    await this.navigate('/');
  }
}
