import { Page, Locator, expect } from "@playwright/test"; // Added 'expect' here

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorAlert: Locator;
    readonly logoutLink: Locator;
    readonly continueButton: Locator;
    readonly accountHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#loginFrm_loginname');
        this.passwordInput = page.locator('#loginFrm_password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorAlert = page.locator('.alert.alert-error.alert-danger');
        this.logoutLink = page.locator('a[title="Logoff"]');
        this.continueButton = page.getByRole('link', { name: 'Continue' });
        this.accountHeading = page.getByRole('heading', { level: 1, name: /My Account/ })
    }

    /** Wait for the page to load completely */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Navigate to the Login page and wait for it to load */
    async goto(): Promise<void> {
        await this.page.goto('https://automationteststore.com/index.php?rt=account/login');
        await this.waitForPageLoad();
    }

    /** Login to the page */
    async login(username: string, password: string): Promise<void> {
        if (username) await this.usernameInput.fill(username);
        if (password) await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /** Getting error alert text - uses ?? to ensure a string is always returned */
    async errorAlertText(): Promise<string> {
        return (await this.errorAlert.textContent()) ?? '';
    }

    /** Logout from the account */
    async logout(): Promise<void> {
        await this.logoutLink.click();
    }

    /** Check if the user is logged out with auto-waiting assertions */
    async expectLoggedOut(): Promise<void> {
        await expect(this.page).toHaveURL(/account\/logout/);
        await expect(this.continueButton).toBeVisible();
    }

    /** Verifies the user is successfully logged in and redirected to the Account page */
    async expectedLoginSuccess(): Promise<void>{
        await expect(this.page).toHaveURL(/account\/account/);
        await expect(this.accountHeading).toBeVisible();
    }

    /** Verify that the login error message is displayed */
    async expectLoginError(): Promise<void> {
        await expect(this.errorAlert).toBeVisible();
        await expect(this.errorAlert).toHaveText(/Incorrect login or password provided/);
    }
    

}