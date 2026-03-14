import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate via UI', async ({ page }) => {
    // 1. Give the CI runner extra time (60 seconds) just for this setup phase
    setup.setTimeout(60000); 

    const baseUrl = 'https://opensource-demo.orangehrmlive.com';

    // 2. Disguise the runner slightly to avoid basic bot detection
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
    });

    // 3. Remove 'networkidle' and just wait for the DOM to be ready
    await page.goto(`${baseUrl}/web/index.php/auth/login`, { waitUntil: 'domcontentloaded' });

    // 4. Wait for the actual element (this is your true source of truth)
    const usernameInput = page.getByPlaceholder('Username');
    await usernameInput.waitFor({ state: 'visible', timeout: 45000 }); // Wait up to 45s for the box to appear
    await usernameInput.fill('Admin');
    
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // 5. Verify login was successful
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 6. Save the storage state
    await page.context().storageState({ path: authFile });
});