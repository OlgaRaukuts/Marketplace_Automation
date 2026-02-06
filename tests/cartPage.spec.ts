import {test, expect} from '@playwright/test';

test.describe('Cart Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://automationteststore.com');
    });

    test('should load products page', async ({ page }) => {
        await expect(page).toHaveURL(/automationteststore\.com/);
    });

    test('should add product to cart -> open cart and verify product exists', async ({ page }) => {
        await page.locator('#featured').locator('a.productcart[data-id="50"]').click();
        await page.getByRole('link', { name: 'Shopping Cart' }).click();
        await expect(page.getByText('Product Name:')).toBeVisible();
    })
});