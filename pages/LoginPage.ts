import { Page, Locator } from "@playwright/test";

export class LoginPage{
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.usernameInput = page.locator('##loginFrm_loginname');
        this.passwordInput = page.locator('#loginFrm_password');
        this.loginButton = page.getByRole('button',{name:'Login'});
    }

    /**
   * Wait for the page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

   /**
   * Navigate to the Login page and wait for it to load
   */
  async goto(): Promise<void> {
    await this.page.goto('https://automationteststore.com/index.php?rt=account/login');
    await this.waitForPageLoad();
  }


}