import { test as setup, expect } from '@playwright/test';
import credentials from '../test-data/credentials.json';
import { loginViaUi } from '../../helpers/auth';

const authFile = 'playwright/.auth/user.json';

setup('authenticate via UI', async ({ page }) => {
    setup.setTimeout(60000); 

    // Disguise the runner slightly and request English
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
    });

    await loginViaUi(page, {
        username: credentials.admin.username,
        password: credentials.admin.password,
        startUrl: '/web/index.php/auth/login',
        successUrl: /.*dashboard/,
    });
  
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    const cookies = await page.context().cookies();
    if (cookies.length === 0) {
        throw new Error('No cookies found! Authentication likely failed.');
    }

    await page.context().storageState({ path: authFile });
});