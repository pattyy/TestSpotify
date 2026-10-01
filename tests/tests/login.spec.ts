import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';

// Always start unauthenticated here, regardless of the shared storageState
// default in playwright.config.ts — this spec is what exercises the real
// login UI, so it must not reuse an already-authenticated session.
test.use({ storageState: { cookies: [], origins: [] } });

test('logs in with valid credentials and reaches the Spotify home screen', async ({ page }) => {
  const email = process.env.SPOTIFY_EMAIL!;
  const password = process.env.SPOTIFY_PASSWORD!;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(page).not.toHaveURL(/\/login/);
  await expect(homePage.userMenuButton).toBeVisible();
});
