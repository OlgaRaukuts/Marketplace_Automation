import {test, expect} from '@playwright/test';

test.describe('Cart Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://automationteststore.com',{waitUntil: 'domcontentloaded',});
    });

    test('should load products page', async ({ page }) => {
        await expect(page).toHaveURL(/automationteststore\.com/);
    });

    test('should add a product to cart -> open cart and verify product exists', async ({ page }) => {
        await page.locator('#featured').locator('a.productcart[data-id="50"]').click();
        await page.locator('li[data-id="menu_cart"] > a:visible').click();
        await expect(page.locator('input[name="quantity[50]"]')).toBeVisible();
    });

    test('should add a product to cart -> quick basket exists', async ({ page }) => {
        await page.locator('#featured a.productcart[data-id="50"]').click();
        const productCard = page.locator('#featured div.pricetag.jumbotron', {
      has: page.locator('a.productcart[data-id="50"]'), });
        await expect(productCard).toBeVisible();
        await expect(productCard).toHaveClass(/added_to_cart/);
        const quickBasket = productCard.locator('.quick_basket');
        await expect(quickBasket).toBeVisible();
        await expect(quickBasket.locator('a[title="Added to cart"]')).toBeVisible();
    });

        test('should add multiple products to cart -> open cart and verify product exists', async ({ page }) => {
        await page.locator('#featured').locator('a.productcart[data-id="50"]').click();
        await page.locator('#featured').locator('a.productcart[data-id="51"]').click();
        await page.locator('li[data-id="menu_cart"] > a:visible').click();
        await expect(page.locator('input[name="quantity[50]"]')).toBeVisible();
        await expect(page.locator('input[name="quantity[51]"]')).toBeVisible();
    });

});