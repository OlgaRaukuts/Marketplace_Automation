import { test, expect } from './fixtures/api-mock.fixture';

test.describe('(Mocking Tests) - Employee List - Refactored', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/web/index.php/auth/login');
        await page.getByPlaceholder('Username').fill('Admin');
        await page.getByPlaceholder('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 20000 });
    });

    test('Should display error toast when API returns 500', async ({ page, mockApi }) => {
        await mockApi.mockEmployeeList(500, { error: 'Internal Server Error' });
        await page.locator('a[href*="viewPimModule"]').click();
    
        await expect(page.locator('.oxd-toast--error')).toBeVisible();
    });

    test('Should display "No Records Found" when employee list is empty', async ({ page, mockApi }) => {
  
        await mockApi.mockEmployeeList(200, { data: [], meta: { total: 0 } });

      
        await page.locator('a[href*="viewPimModule"]').click();
        
        const noRecordsMessage = page.locator('.oxd-table-empty-message, span, p')
            .filter({ hasText: 'No Records Found' })
            .first();
        await expect(noRecordsMessage).toBeVisible();
    });

    test('Should display mocked employee data in the table', async ({ page, mockApi }) => {
   
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
        await expect(page.getByText('Supreme Commander')).toBeVisible(); // Added this for extra coverage!
    });

});