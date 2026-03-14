import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate via UI', async ({ page }) => {
    const baseUrl = 'https://opensource-demo.orangehrmlive.com';

    // 1. Navigate to the login page using the 'page' object (executes JS)
    await page.goto(`${baseUrl}/web/index.php/auth/login`);

    // 2. Fill in the login form
    // The browser handles the CSRF token automatically behind the scenes
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    // 3. Verify login was successful (wait for dashboard)
    await expect(page).toHaveURL(/.*dashboard/);

    // 4. Save the storage state (cookies, local storage, etc.)
    await page.context().storageState({ path: authFile });
});