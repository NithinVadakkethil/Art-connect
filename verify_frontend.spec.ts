import { test, expect } from '@playwright/test';

test('verify frontend changes', async ({ page }) => {
  await page.goto('http://localhost:8000');

  // Login as admin
  await page.getByPlaceholder('Email').fill('admin@frameglobe.com');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('http://localhost:8000/admin-dashboard');

  // Verify Artist Profiles tab
  await page.getByRole('button', { name: 'Artist Profiles' }).click();
  await expect(page.getByText('All Artists')).toBeVisible();

  // Take a screenshot
  await page.screenshot({ path: 'artist_profiles_screenshot.png' });
});
