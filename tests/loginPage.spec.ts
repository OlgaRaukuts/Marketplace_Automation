import { test } from './fixtures/ui-test.fixture';
import credentials from './test-data/credentials.json';

// This forces these tests to ignore the global storageState and start logged out
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication Flows', () => {
  test('Successful Login', async ({ loginPage }) => {
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await loginPage.expectedLoginSuccess();
  });

  test('Successful Logout', async ({ loginPage }) => {
    // We must log in first to test the logout
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await loginPage.expectedLoginSuccess();

    await loginPage.logout();
    await loginPage.expectLoggedOut();
  });
});
