import { test, expect } from '@playwright/test';

test.describe('(Mocking Tests) - Employee List - Negative Scenarios', () => {
    
    test('Should display error toast when Employee API returns 500', async ({ page }) => {

        await page.goto('/web/index.php/dashboard/index');

        // Setup mock for Employee API to return 500 error
        await page.route('**/api/v2/pim/employees**', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ 
                    error: 'Internal Server Error',
                    message: 'Simulated Backend Failure' 
                })
            });
        });

        // Go to PIM page - using a locator that is not dependent on language (looking for href)
        await page.locator('a[href*="viewPimModule"]').click();

        // Check for error toast - using a locator that is not dependent on language (looking for class and role)
        const errorToast = page.locator('.oxd-toast--error');
        await expect(errorToast).toBeVisible();
        await expect(errorToast).toContainText(/Error|Something went wrong/i);
    });

    test('Should display mocked employee data in the table', async ({ page }) => {

        await page.goto('/web/index.php/dashboard/index');

        // setup mock for Employee API to retun custom employee data
        await page.route('**/api/v2/pim/employees**', async route => {
            
            // Form fake response with 2 employee records
            const fakeResponse = {
                data: [
                    {
                        empNumber: 1001,
                        lastName: 'Vader',
                        firstName: 'Darth',
                        middleName: '',
                        employeeId: 'SITH-01',
                        terminationId: null,
                        jobTitle: { id: 1, title: 'Supreme Commander' },
                        subunit: { id: 1, name: 'Death Star' },
                        supervisors: []
                    },
                    {
                        empNumber: 1002,
                        lastName: 'Skywalker',
                        firstName: 'Luke',
                        middleName: '',
                        employeeId: 'JEDI-01',
                        terminationId: null,
                        jobTitle: { id: 2, title: 'Jedi Knight' },
                        subunit: { id: 2, name: 'Rebel Alliance' },
                        supervisors: []
                    }
                ],
                meta: { 
                    total: 2 
                }
            };

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(fakeResponse)
            });
        });

        // Go to PIM page - using a locator that is not dependent on language (looking for href)
        await page.locator('a[href*="viewPimModule"]').click();

        const table = page.locator('.oxd-table');
        await expect(table).toBeVisible();

        // Verify that the mocked employee data is displayed in the table
        await expect(page.getByText('Darth')).toBeVisible();
        await expect(page.getByText('Vader')).toBeVisible();
        await expect(page.getByText('Supreme Commander')).toBeVisible();

        await expect(page.getByText('Luke')).toBeVisible();
        await expect(page.getByText('Skywalker')).toBeVisible();
        await expect(page.getByText('Jedi Knight')).toBeVisible();
        
        const recordsFoundText = page.locator('.orangehrm-horizontal-padding', { hasText: 'Records Found' });
        await expect(recordsFoundText).toContainText('(2) Records Found');
    });
});