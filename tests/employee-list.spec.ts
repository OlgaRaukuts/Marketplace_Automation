import { test, expect } from './fixtures';

test.describe('(Mocking Tests) - Employee List', () => {
  test('Should display error toast when API returns 500', async ({ page, mockApi }) => {
    await mockApi.mockEmployeeList(500, { error: 'Internal Server Error' });
    await page.goto('/web/index.php/pim/viewEmployeeList');

    await expect(
      page.locator('.oxd-toast, .oxd-toast--danger, .oxd-toast--error').first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('Should display "No Records Found" when employee list is empty', async ({
    page,
    mockApi,
  }) => {
    await mockApi.mockEmployeeList(200, { data: [], meta: { total: 0 } });
    await page.goto('/web/index.php/pim/viewEmployeeList');

    const noRecords = page.getByText(/No Records Found|\(0\) Records Found/i).first();
    await expect(noRecords).toBeVisible({ timeout: 20_000 });
  });
});

