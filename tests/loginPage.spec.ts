import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';


test.describe('Login Page Tests', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    })

    test('should load login page', async ({ page }) => {
        await expect(page).toHaveTitle(/Account Login/);
    });

    test('Login with valid credentials', async ({page}) => {
        await loginPage.login('OlyaTest', 'Test123$');
        await loginPage.expectedLoginSuccess();
    });

      test('Login with invalid username', async () => {
        await loginPage.login('OlyaTesty', 'Test123$');
        await loginPage.expectLoginError();
        });

     test('Login with invalid password', async () => {
        await loginPage.login('OlyaTest', 'Test1233$');
        await loginPage.expectLoginError();
        });

     test('Login with blank fields', async () => {
        await loginPage.login(' ', ' ');
        await loginPage.expectLoginError();
        });

     test('Password should be masked', async () => {
          await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
          await loginPage.passwordInput.fill('Test123$$');
          await expect(loginPage.passwordInput).toHaveValue('Test123$$');
        });

     test('Logout', async () => {
        await loginPage.login('OlyaTest', 'Test123$');
        await loginPage.expectedLoginSuccess();
        await loginPage.logout();
        await loginPage.expectLoggedOut();
        });

    });
