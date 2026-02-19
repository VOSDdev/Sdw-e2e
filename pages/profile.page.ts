import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  readonly avatarContainer = this.getByTestId('profile-avatar-container');
  readonly nameText = this.getByTestId('profile-name-text');
  readonly editButton = this.getByTestId('profile-edit-button');
  readonly favoritesList = this.getByTestId('profile-favorites-list');

  async open(): Promise<void> {
    await this.navigate('/profile');
  }
}
