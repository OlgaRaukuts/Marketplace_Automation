import { test, expect } from './fixtures/ui-test.fixture';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Page - UI and Negative Tests', () => {
  test('should load login page properly', async ({ page, loginPage }) => {
    await expect(page).toHaveTitle(/OrangeHRM/);
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('Login with invalid username', async ({ loginPage }) => {
    await loginPage.login('Adminy', 'admin123');
    await loginPage.expectLoginError();
  });

  test('Login with invalid password', async ({ loginPage }) => {
    await loginPage.login('Admin', 'admin1234');
    await loginPage.expectLoginError();
  });

  test('Login with blank fields', async ({ loginPage }) => {
    await loginPage.login('', '');
    await loginPage.expectRequiredMessage();
  });

  test('Password input should be masked', async ({ loginPage }) => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await loginPage.passwordInput.fill('admin123');
    await expect(loginPage.passwordInput).toHaveValue('admin123');
  });
});
