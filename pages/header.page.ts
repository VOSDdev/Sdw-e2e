import { BasePage } from './base.page';

export class HeaderComponent extends BasePage {
  readonly logo = this.getByTestId('header-logo-link');
  readonly burgerButton = this.getByTestId('header-burger-button');
  readonly searchLink = this.getByTestId('header-search-link');
  readonly aiChatLink = this.getByTestId('header-ai-chat-link');
  readonly languageDropdown = this.getByTestId('header-language-dropdown');
  readonly userMenuButton = this.getByTestId('header-user-menu-button');
  readonly loginLink = this.getByTestId('header-login-link');
  readonly logoutButton = this.getByTestId('header-logout-button');
  readonly navMainLink = this.getByTestId('header-nav-main-link');
  readonly navForumLink = this.getByTestId('header-nav-forum-link');
  readonly supportDropdown = this.getByTestId('header-support-dropdown');
}
