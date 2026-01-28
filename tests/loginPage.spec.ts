import {test, expect} from '@playwright/test';

test.describe('Login Page Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://automationteststore.com/index.php?rt=account/login');
    })
    test('should load login page', async ({ page }) => {
        await expect(page).toHaveTitle(/Account Login/);
    });

    test('Login with valid credentials', async ({page}) => {
        await page.locator('#loginFrm_loginname').fill('OlyaTest');
        await page.locator('#loginFrm_password').fill('Test123$');
        await page.getByRole('button',{name:'Login'}).click();
        await expect(page).toHaveURL(/account\/account/);
        await expect(page.getByRole('heading', { level: 1, name: /My Account/ })).toBeVisible();
    });

      test('Login with invalid username', async ({page}) => {
        await page.locator('#loginFrm_loginname').fill('OlyaTest1');
        await page.getByRole('button',{name:'Login'}).click();
        const errorAlert = page.locator('.alert.alert-error.alert-danger');
        await expect(errorAlert).toHaveText(/Incorrect login or password provided/);
        });

     test('Login with invalid password', async ({page}) => {
        await page.locator('#loginFrm_loginname').fill('OlyaTest1');
        await page.locator('#loginFrm_password').fill('Test123$$');
        await page.getByRole('button',{name:'Login'}).click();
        const errorAlert = page.locator('.alert.alert-error.alert-danger');
        await expect(errorAlert).toHaveText(/Incorrect login or password provided/);
        });

     test('Login with blank fields', async ({page}) => {
        await page.getByRole('button',{name:'Login'}).click();
        const errorAlert = page.locator('.alert.alert-error.alert-danger');
        await expect(errorAlert).toHaveText(/Incorrect login or password provided/);
        });
     test('Password should be masked', async ({page}) => {
          const password = page.locator('#loginFrm_password');
          await expect(password).toHaveAttribute('type', 'password');
          await password.fill('Test123$$');
          await expect(password).toHaveValue('Test123$$');
        });
     test('Logout', async ({page}) => {
        await page.locator('#loginFrm_loginname').fill('OlyaTest');
        await page.locator('#loginFrm_password').fill('Test123$');
        await page.getByRole('button',{name:'Login'}).click();
        await expect(page).toHaveURL(/account\/account/);
        await expect(page.getByRole('heading', { level: 1, name: /My Account/ })).toBeVisible();
        await page.locator('a[title="Logoff"]').click();
        await expect(page).toHaveURL(/account\/logout/);
        await expect(page.getByRole('link',{name:'Continue'})).toBeVisible();
        });
    });