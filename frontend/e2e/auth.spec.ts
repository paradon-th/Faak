import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('User can navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Check if the nav has login link
    const loginLink = page.getByRole('link', { name: /Login|เข้าสู่ระบบ/i });
    await expect(loginLink).toBeVisible();
    
    await loginLink.click();
    
    // Should be on login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: /Login|เข้าสู่ระบบ/i })).toBeVisible();
  });

  test('Partner can login (Mock test using seeded data)', async ({ page }) => {
    await page.goto('/login');
    
    // Fill the login form (using seeded partner data)
    await page.getByPlaceholder(/Email|อีเมล/i).fill('partner@faak.com');
    await page.getByPlaceholder(/Password|รหัสผ่าน/i).fill('partner123');
    
    // Click login button
    await page.getByRole('button', { name: /Login|เข้าสู่ระบบ/i }).click();
    
    // Depending on the flow, it should redirect to partner dashboard or home
    await expect(page).toHaveURL(/.*\/partner\/dashboard/);
    
    // Check if logout button is visible
    await expect(page.getByText(/Logout|ออกจากระบบ/i)).toBeVisible();
  });
});
