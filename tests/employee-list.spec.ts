import { test, expect } from './fixtures/api-mock.fixture';

test.describe('(Mocking Tests) - Employee List - Refactored', () => {

    test('Should display error toast when API returns 500', async ({ page, mockApi }) => {
        await page.goto('/web/index.php/dashboard/index');

        await mockApi.mockEmployeeList(500, { error: 'Internal Server Error' });

        await page.locator('a[href*="viewPimModule"]').click();
        await expect(page.locator('.oxd-toast--error')).toBeVisible();
    });

    test('Should display "No Records Found" when employee list is empty', async ({ page, mockApi }) => {
        await page.goto('/web/index.php/dashboard/index');

        await mockApi.mockEmployeeList(200, { data: [], meta: { total: 0 } });

        await page.locator('a[href*="viewPimModule"]').click();
        const noRecordsToast = page.locator('#oxd-toaster_1').getByText('No Records Found');
        await expect(noRecordsToast).toBeVisible();
    });

    test('Should display mocked employee data in the table', async ({ page, mockApi }) => {
        await page.goto('/web/index.php/dashboard/index');

        const fakeData = {
            data: [{
                empNumber: 1001,
                lastName: 'Vader',
                firstName: 'Darth',
                jobTitle: { title: 'Supreme Commander' }
            }],
            meta: { total: 1 }
        };
        await mockApi.mockEmployeeList(200, fakeData);

        await page.locator('a[href*="viewPimModule"]').click();
        
        await expect(page.getByText('Darth')).toBeVisible();
        await expect(page.getByText('Vader')).toBeVisible();
    });

});