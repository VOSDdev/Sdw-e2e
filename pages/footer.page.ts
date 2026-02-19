import { BasePage } from './base.page';

export class FooterComponent extends BasePage {
  readonly container = this.getByTestId('footer-container');
  readonly copyrightText = this.getByTestId('footer-copyright-text');
}
