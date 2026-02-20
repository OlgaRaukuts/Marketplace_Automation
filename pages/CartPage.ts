import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly cartLink: Locator;
    readonly updateButton: Locator;
    readonly totalsTable: Locator;

    constructor(page: Page){
        this.page = page;
        this.cartLink = page.locator('li[data-id="menu_cart"] > a:visible');
        this.updateButton = page.getByRole('button',{name: 'Update'});
        this.totalsTable = page.locator('#totals_table');
    }

        /** Wait for the page to load completely */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Navigate to the Login page and wait for it to load */
    async goto(): Promise<void> {
        await this.page.goto('https://automationteststore.com',{waitUntil: 'domcontentloaded'});
        await this.waitForPageLoad();
    }

    /** Finds the 'Add to Cart' button for a specific product ID */
    addToCartBtn(id: string): Locator {
        return this.page.locator(`#featured a.productcart[data-id="${id}"]`).first();
    }

    /** Finds the product card container (the pricetag area) */
    productCard(id: string): Locator {
        return this.page.locator('#featured div.pricetag.jumbotron', {
            has: this.page.locator(`a.productcart[data-id="${id}"]`),
        });
    }

    /** Finds the quantity input field once inside the Cart page */
    cartQuantityInput(id: string): Locator {
        return this.page.locator(`input[name="quantity[${id}]"]`);
    }
    totalRow(label: string): Locator {
        return this.totalsTable.locator('tr', { hasText: label });
    }

    // --- Actions ---

    async addProductById(id: string) {
        await this.addToCartBtn(id).click();
    }

    async navigateToCart() {
        await this.cartLink.click();
    }

        async removeProductById(id: string){
        await this.page.locator(`a[href*="remove=${id}"]`).click();
    }

    async updateProductQuantity(id: string, quantity: string) {
        const input = this.cartQuantityInput(id);
        await input.fill(quantity);
        await this.updateButton.click();
    }

    // --- Assertions ---

    async expectQuickBasketEffect(id: string) {
        const card = this.productCard(id);
        const quickBasket = card.locator('.quick_basket');
        
        await expect(card).toBeVisible();
        await expect(card).toHaveClass(/added_to_cart/);
        await expect(quickBasket).toBeVisible();
        await expect(quickBasket.locator('a[title="Added to cart"]')).toBeVisible();
    }

    async expectProductsInCart(ids: string[]) {
        for (const id of ids) {
            await expect(this.cartQuantityInput(id)).toBeVisible();
        }
    }

    async expectCartToBeEmpty(){
        await expect(this.page.locator('.container-fluid.cart-info.product-list')).toHaveCount(0)
    }
    async expectProductQuantity(id: string, expectedValue: string) {
        await expect(this.cartQuantityInput(id)).toHaveValue(expectedValue);
    }

    async expectSubTotal(expectedAmount: string) {
        // We look specifically at the Sub-Total row
        await expect(this.totalRow('Sub-Total:')).toContainText(expectedAmount);
    }


}