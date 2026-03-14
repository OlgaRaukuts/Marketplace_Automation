import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import credentials from '../test-data/credentials.json';

// This forces these tests to ignore the global storageState and start logged out
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication Flows', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('Successful Login', async ({ page }) => {
        await loginPage.login(credentials.admin.username, credentials.admin.password);
        await loginPage.expectedLoginSuccess();
    });

    test('Successful Logout', async () => {
        // We must log in first to test the logout
        await loginPage.login(credentials.admin.username, credentials.admin.password);
        await loginPage.expectedLoginSuccess();
        
        await loginPage.logout();
        await loginPage.expectLoggedOut();
    });
});