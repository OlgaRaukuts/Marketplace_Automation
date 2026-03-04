import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';


test.describe('Login Page Tests', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    })

    test('should load login page', async ({ page }) => {
        await expect(page).toHaveTitle(/OrangeHRM/);
    });

    test('Login with valid credentials', async ({page}) => {
        await loginPage.login('Admin', 'admin123');
        await loginPage.expectedLoginSuccess();
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

     test('Password should be masked', async () => {
          await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
          await loginPage.passwordInput.fill('admin123');
          await expect(loginPage.passwordInput).toHaveValue('admin123');
        });

     test('Logout', async () => {
        await loginPage.login('Admin', 'admin123');
        await loginPage.expectedLoginSuccess();
        await loginPage.logout();
        await loginPage.expectLoggedOut();
        });

    });
