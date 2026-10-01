import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly clearButton: Locator;
  readonly topResultCard: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-input');
    this.clearButton = page.getByTestId('clear-button');
    this.topResultCard = page.getByTestId('top-result-card');
  }

  async goto(): Promise<void> {
    await super.goto('https://open.spotify.com/');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    await this.topResultCard.waitFor({ state: 'visible' });
  }

  async clear(): Promise<void> {
    await this.clearButton.click();
  }

  getArtistResult(name: string): Locator {
    return this.topResultCard.filter({ hasText: name });
  }
}
