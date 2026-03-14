import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate via UI', async ({ page }) => {
    // 1. Give the CI runner extra time (60 seconds) just for this setup phase
    setup.setTimeout(60000); 

    const baseUrl = 'https://opensource-demo.orangehrmlive.com';

    // 2. Disguise the runner slightly and request English
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
    });

    // 3. Wait for the DOM to be ready
    await page.goto(`${baseUrl}/web/index.php/auth/login`, { waitUntil: 'domcontentloaded' });

    // 4. Language-Agnostic Locators: Use HTML 'name' attributes instead of visible text
    const usernameInput = page.locator('input[name="username"]');
    
    // Wait up to 45s for the box to appear, completely ignoring what language the placeholder is in
    await usernameInput.waitFor({ state: 'visible', timeout: 45000 }); 
    await usernameInput.fill('Admin');
    
    // Find the password box by its name attribute
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill('admin123');
    
    // Find the login button by its type instead of the word "Login"
    const loginButton = page.locator('button[type="submit"]');
    await loginButton.click();
    
    // 5. Verify login was successful
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // 6. Save the storage state
    await page.context().storageState({ path: authFile });
});