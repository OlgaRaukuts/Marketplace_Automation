import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication Flows', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('Successful Login', async () => {
        await loginPage.login('Admin', 'admin123');
        await loginPage.expectedLoginSuccess();
    });

    test('Successful Logout', async () => {
        await loginPage.login('Admin', 'admin123');
        await loginPage.expectedLoginSuccess();
        
        await loginPage.logout();
        await loginPage.expectLoggedOut();
    });
});