import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfileGatePage extends BasePage {
  readonly heading: Locator;
  readonly profileLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('[data-uia="profile-gate-label"]');
    this.profileLinks = page.locator('[data-uia="profile-link"]');
  }
}
