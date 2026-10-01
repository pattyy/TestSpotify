import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly userMenuButton: Locator;
  readonly logoutButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userMenuButton = page.locator('[data-testid="user-widget-link"]');
    this.logoutButton = page.getByTestId('user-widget-dropdown-logout');
    this.loginButton = page.getByTestId('login-button');
  }

  async goto(): Promise<void> {
    await super.goto('https://open.spotify.com/');
  }

  async logout(): Promise<void> {
    await this.userMenuButton.click();
    await this.logoutButton.click();
  }
}
