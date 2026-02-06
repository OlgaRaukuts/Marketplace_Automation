import {test, expect} from '@playwright/test';

test.describe('Cart Page Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://automationteststore.com',{waitUntil: 'domcontentloaded',});
    });

    test('should load products page', async ({ page }) => {
        await expect(page).toHaveURL(/automationteststore\.com/);
    });

    test('should add a product to the cart -> open cart and verify product exists', async ({ page }) => {
        await page.locator('#featured').locator('a.productcart[data-id="50"]').click();
        await page.locator('li[data-id="menu_cart"] > a:visible').click();
        await expect(page.locator('input[name="quantity[50]"]')).toBeVisible();
    });

    test('should add a product to the cart -> quick basket exists', async ({ page }) => {
        await page.locator('#featured a.productcart[data-id="50"]').click();
        const productCard = page.locator('#featured div.pricetag.jumbotron', {
      has: page.locator('a.productcart[data-id="50"]'), });
        await expect(productCard).toBeVisible();
        await expect(productCard).toHaveClass(/added_to_cart/);
        const quickBasket = productCard.locator('.quick_basket');
        await expect(quickBasket).toBeVisible();
        await expect(quickBasket.locator('a[title="Added to cart"]')).toBeVisible();
    });

        test('should add multiple products to the cart -> open cart and verify product exists', async ({ page }) => {
        await page.locator('#featured').locator('a.productcart[data-id="50"]').click();
        await page.locator('#featured').locator('a.productcart[data-id="51"]').click();
        await page.locator('li[data-id="menu_cart"] > a:visible').click();
        await expect(page.locator('input[name="quantity[50]"]')).toBeVisible();
        await expect(page.locator('input[name="quantity[51]"]')).toBeVisible();
    });

        test('should remove a product from the cart -> open cart and verify product exists', async ({ page }) => {
        await page.locator('#featured').locator('a.productcart[data-id="50"]').click();
        await page.locator('li[data-id="menu_cart"] > a:visible').click();
        await expect(page.locator('input[name="quantity[50]"]')).toBeVisible();
        await page.locator('a[href*="remove=50"]').click();
        await expect(page.locator('.container-fluid.cart-info.product-list')).toHaveCount(0);
    });
        test('verify cart total', async ({ page }) => {
        await page.locator('#featured').locator('a.productcart[data-id="50"]').click();
        await page.locator('li[data-id="menu_cart"] > a:visible').click();
         const quantityInput = page.locator('input[name="quantity[50]"]');
        await expect(quantityInput).toBeVisible();  
        await expect(quantityInput).toHaveValue('1');
        await quantityInput.fill('2');
        await page.getByRole('button',{name: 'Update'}).click();
        await expect(quantityInput).toHaveValue('2');
        const subTotalRow = page.locator('#totals_table tr', {hasText: 'Sub-Total:'});
        await expect(subTotalRow).toContainText('$59.00');
    });


});