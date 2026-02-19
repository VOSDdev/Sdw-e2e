import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput = this.getByTestId('login-email-input');
  readonly passwordInput = this.getByTestId('login-password-input');
  readonly submitButton = this.getByTestId('login-submit-button');
  readonly errorText = this.getByTestId('login-error-text');

  async open(): Promise<void> {
    await this.navigate('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
