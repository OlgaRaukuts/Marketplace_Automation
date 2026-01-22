import {test, expect} from '@playwright/test';

test.describe('Login Page Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://automationteststore.com/index.php?rt=account/login');
    })
    test('should load login page', async ({ page }) => {
        await expect(page).toHaveTitle(/Account Login/);
    });
})