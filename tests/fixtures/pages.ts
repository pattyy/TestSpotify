import { test as base } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { PlaylistPage } from '../pages/PlaylistPage';

type PageFixtures = {
  searchPage: SearchPage;
  playlistPage: PlaylistPage;
};

export const test = base.extend<PageFixtures>({
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  playlistPage: async ({ page }, use) => {
    await use(new PlaylistPage(page));
  },
});

export { expect } from '@playwright/test';
