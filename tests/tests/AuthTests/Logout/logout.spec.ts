import { test, expect } from '@playwright/test';
import {HomePage} from '../../../pages/HomePage';

test('logs out and shows the logged-out confirmation', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();
  await expect(homePage.userMenuButton).toBeVisible();

  await homePage.logout();

  await expect(homePage.loginButton).toBeVisible();
});


