import {test, expect} from '@playwright/test';
import {CartPage} from '../pages/CartPage';

test.describe('Cart Page Tests', () => {
   let cartPage: CartPage;

    test.beforeEach(async ({page}) => {
        cartPage = new CartPage(page);
        await cartPage.goto();
    })


    test('should load products page', async ({ page }) => {
        await expect(page).toHaveURL(/automationteststore\.com/);
    });

    test('should add a product to the cart -> open cart and verify product exists', async ({ page }) => {
        await cartPage.addProductById('50');
        await expect(page.locator('input[name="quantity[50]"]')).toBeVisible();
    });

    test('should add a product to the cart -> quick basket exists', async () => {
        await cartPage.addProductById('50');
        await cartPage.expectQuickBasketEffect('50');
    });

        test('should add multiple products to the cart -> open cart and verify product exists', async () => {
        const products = ['50', '51'];
        // Add each product to the cart
        for (const id of products) {
            await cartPage.addProductById(id);
        }
        await cartPage.navigateToCart();
        // Verify both exist in the cart page
        await cartPage.expectProductsInCart(products);
    });

        test('should remove a product from the cart -> open cart and verify product exists', async () => {
        await cartPage.addProductById('50');
        await cartPage.navigateToCart();
        await cartPage.expectProductsInCart(['50']);
        await cartPage.removeProductById('50');
        await cartPage.expectCartToBeEmpty();
    });
        test('verify cart total', async () => {
        await cartPage.addProductById('50');
        await cartPage.navigateToCart();
        await cartPage.expectProductsInCart(['50']);
        await cartPage.expectProductQuantity('50', '1');
        await cartPage.updateProductQuantity('50', '2');
        await cartPage.expectProductQuantity('50', '2');
        await cartPage.expectSubTotal('$59.00');
    });

});