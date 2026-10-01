import { test, expect } from '../../../fixtures/pages';

test.use({ storageState: { cookies: [], origins: [] } });

test('search specific artist and clear out filed by pressing clear button', async ({ searchPage }) => {
  await searchPage.goto();
  await searchPage.search('Coldplay');

  await expect(searchPage.getArtistResult('Coldplay')).toBeVisible();
  await expect(searchPage.searchInput).toHaveValue('Coldplay');

  await searchPage.clear();

  await expect(searchPage.searchInput).toHaveValue('');
  await expect(searchPage.clearButton).toBeHidden();
});
