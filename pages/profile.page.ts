import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  readonly container = this.getByTestId('profile-container');
  readonly avatarImage = this.getByTestId('profile-avatar-image');
  readonly firstnameInput = this.getByTestId('profile-firstname-input');
  readonly lastnameInput = this.getByTestId('profile-lastname-input');
  readonly saveButton = this.getByTestId('profile-save');

  async open(): Promise<void> {
    await this.navigate('/profile');
  }
}
