import { test, expect } from './fixtures/api-mock.fixture';
import credentials from './test-data/credentials.json';
import { ensureLoggedIn } from '../helpers/auth';

test.describe('(Mocking Tests) - Employee List - Refactored', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page, {
      username: credentials.admin.username,
      password: credentials.admin.password,
      startUrl: '/web/index.php/dashboard/index',
      successUrl: '**/dashboard/index',
    });
  });

  test('Should display error toast when API returns 500', async ({ page, mockApi }) => {
    // Go straight to the dashboard (already logged in)
    await page.goto('/web/index.php/dashboard/index');

    // Use the robust locator for the header
    await expect(page.locator('.oxd-topbar-header-breadcrumb-module')).toHaveText('Dashboard');

    await mockApi.mockEmployeeList(500, { error: 'Internal Server Error' });

    await page.locator('a[href*="viewPimModule"]').click();
    await expect(page.locator('.oxd-toast--error')).toBeVisible();
  });

  test('Should display "No Records Found" when employee list is empty', async ({
    page,
    mockApi,
  }) => {
    await page.goto('/web/index.php/dashboard/index');
    await expect(page).toHaveURL(/.*dashboard/);

    await mockApi.mockEmployeeList(200, { data: [], meta: { total: 0 } });

    await page.locator('a[href*="viewPimModule"]').click();

    const noRecords = page.locator('.orangehrm-paper-container').getByText('No Records Found');

    await expect(noRecords).toBeVisible({ timeout: 15000 });
  });
});
