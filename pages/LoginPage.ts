import { Page, Locator, expect } from "@playwright/test"; // Added 'expect' here

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorAlert: Locator;
    readonly requiredMessage: Locator;
    readonly logoutLink: Locator;
    readonly dashboard: Locator;
    readonly loginHeading: Locator;
    readonly userProfileDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorAlert = page.locator('p', { hasText: 'Invalid credentials' });
        this.requiredMessage = page.locator('text=Required');
        this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
        this.dashboard = page.getByRole('heading',{level: 6, name: 'Dashboard'});
        this.loginHeading = page.getByRole('heading', { level: 5, name: 'Login' });
        this.userProfileDropdown = page.locator('.oxd-userdropdown-tab');
    }

    /** Wait for the page to load completely */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Navigate to the Login page and wait for it to load */
    async goto(): Promise<void> {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
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

    /** Getting required message text */
    async requiredMessageText(): Promise<string>{
        return (await this.requiredMessage.textContent()) ?? '';
    }


    /** Logout from the account */
    async logout(): Promise<void> {
        await this.userProfileDropdown.click();
        await this.logoutLink.click();
    }


    /** Check if the user is logged out with auto-waiting assertions */
    async expectLoggedOut(): Promise<void> {
        await expect(this.page).toHaveURL(/.*\/auth\/login/);
        await expect(this.loginHeading).toBeVisible();
    }

    /** Verifies the user is successfully logged in and redirected to the Account page */
    async expectedLoginSuccess(): Promise<void>{
        await expect(this.page).toHaveURL(/dashboard/);
        await expect(this.dashboard).toBeVisible();
    }

    /** Verify that the login error message is displayed */
    async expectLoginError(): Promise<void> {
        await expect(this.errorAlert).toBeVisible();
        await expect(this.errorAlert).toHaveText(/Invalid credentials/);
    }
    
/** Verify that the required message is displayed */
    async expectRequiredMessage(): Promise<void> {
        // Assert that exactly 2 error messages appear on the screen
        await expect(this.requiredMessage).toHaveCount(2);
        
        // Assert that the first one contains the text "Required"
        await expect(this.requiredMessage.first()).toHaveText(/Required/i);
    }

}