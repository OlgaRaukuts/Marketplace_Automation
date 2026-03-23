import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate via UI', async ({ page }) => {
    setup.setTimeout(60000); 

    // Disguise the runner slightly and request English
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
    });

    await page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });

    //Language-Agnostic Locators: Use HTML 'name' attributes instead of visible text
    const usernameInput = page.locator('input[name="username"]');

    await usernameInput.waitFor({ state: 'visible', timeout: 45000 }); 
    await usernameInput.fill('Admin');
    
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill('admin123');
    
    const loginButton = page.locator('button[type="submit"]');
    await loginButton.click();
  
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    const cookies = await page.context().cookies();
    if (cookies.length === 0) {
        throw new Error('No cookies found! Authentication likely failed.');
    }

    await page.context().storageState({ path: authFile });
});