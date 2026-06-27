import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // We'll update this once the actual homepage is built.
  await expect(page).toHaveTitle(/Faak|Create Next App/);
});
