import { test, expect } from '../../../fixtures/pages';

let createdPlaylistName: string | undefined;

test.afterEach(async ({ playlistPage }) => {
  if (createdPlaylistName) {
    await playlistPage.deletePlaylist(createdPlaylistName);
    createdPlaylistName = undefined;
  }
});

test('creates a new playlist and shows it in the library', async ({ page, playlistPage }) => {
  await playlistPage.goto();

  createdPlaylistName = await playlistPage.createPlaylist();

  await expect(playlistPage.getPlaylistInLibrary(createdPlaylistName)).toBeVisible();
  await expect(page).toHaveURL(/\/playlist\//);
});
