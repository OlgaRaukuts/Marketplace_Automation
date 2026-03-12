import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Page - UI and Negative Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should load login page properly', async ({ page }) => {
        await expect(page).toHaveTitle(/OrangeHRM/);
        await expect(loginPage.loginHeading).toBeVisible();
    });

    test('Login with invalid username', async () => {
        await loginPage.login('Adminy', 'admin123');
        await loginPage.expectLoginError();
    });

    test('Login with invalid password', async () => {
        await loginPage.login('Admin', 'admin1234');
        await loginPage.expectLoginError();
    });

    test('Login with blank fields', async () => {
        await loginPage.login('', '');
        await loginPage.expectRequiredMessage();
    });

    test('Password input should be masked', async () => {
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
        await loginPage.passwordInput.fill('admin123');
        await expect(loginPage.passwordInput).toHaveValue('admin123');
    });
});