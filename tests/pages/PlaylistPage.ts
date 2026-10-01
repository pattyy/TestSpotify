import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PlaylistPage extends BasePage {
  readonly createPlaylistButton: Locator;
  readonly createButton: Locator;
  readonly libraryItems: Locator;
  readonly entityTitle: Locator;
  readonly moreButton: Locator;
  readonly deleteMenuItem: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    //this.createPlaylistButton = page.getByTestId('create-playlist-button');
    this.createPlaylistButton = page.locator("div[aria-labelledby='listrow-title-global-create-playlist']")
    this.createButton = page.getByLabel('Create');
    this.libraryItems = page.getByTestId('rootlist-item');
    this.entityTitle = page.getByTestId('entityTitle');
    this.moreButton = page.getByTestId('more-button');
    this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Delete', exact: true });
  }

  async goto(): Promise<void> {
    await super.goto('https://open.spotify.com/');
  }

  async createPlaylist(): Promise<string> {
    await this.createButton.click();
    await this.createPlaylistButton.click();

    try {
      await this.page.waitForURL(/\/playlist\//, { timeout: 10000 });
    } catch {
      throw new Error('Creating a playlist did not navigate to a new playlist page.');
    }

    await this.entityTitle.waitFor({ state: 'visible', timeout: 10000 });
    const name = (await this.entityTitle.textContent())?.trim();

    if (!name) {
      throw new Error('New playlist was created but its title could not be read.');
    }

    return name;
  }

  getPlaylistInLibrary(name: string): Locator {
    return this.libraryItems.filter({ hasText: name });
  }

  async deletePlaylist(name: string): Promise<void> {
    const playlistRow = this.getPlaylistInLibrary(name);
    await playlistRow.click();
    await this.moreButton.click();
    await this.deleteMenuItem.click();
    await this.confirmDeleteButton.click();
    await playlistRow.waitFor({ state: 'hidden', timeout: 10000 });
  }
}
