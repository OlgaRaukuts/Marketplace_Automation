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

});