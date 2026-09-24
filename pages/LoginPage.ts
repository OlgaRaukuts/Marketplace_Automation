import { BasePage } from './BasePage';
import { type Page, type Locator, expect } from '@playwright/test';
import { clickButton, fillInput, waitVisible } from '../helpers/ui-actions';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly requiredMessage: Locator;
  readonly loginHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorAlert = page.getByRole('alert');
    this.requiredMessage = page.locator('text=Required');
    this.loginHeading = page.getByRole('heading', { level: 5, name: 'Login' });
  }

  /** Navigate to the Login page using relative path */
  async goto(): Promise<void> {
    await super.goto('/web/index.php/auth/login');
  }

  /** Login to the application */
  async login(username: string, password: string): Promise<void> {
    await waitVisible(this.usernameInput, 15_000);
    if (username) await fillInput(this.usernameInput, username, { clear: true });
    if (password) await fillInput(this.passwordInput, password, { clear: true });
    await clickButton(this.loginButton);
  }

  /** Getting error alert text */
  async errorAlertText(): Promise<string> {
    return (await this.errorAlert.textContent()) ?? '';
  }

  /** Getting required message text */
  async requiredMessageText(): Promise<string> {
    return (await this.requiredMessage.textContent()) ?? '';
  }

  /** Check if the user is logged out */
  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/auth\/login/);
    await expect(this.loginHeading).toBeVisible();
  }

  /** Verifies the user is successfully logged in and redirected to the Dashboard */
  async expectedLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/.*dashboard.*/, { timeout: 20000 });
    await this.page.waitForSelector('h6.oxd-topbar-header-breadcrumb-module', { state: 'visible', timeout: 20000 });
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 20000 });
  }

  /** Verify that the login error message is displayed */
  async expectLoginError(): Promise<void> {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toHaveText(/Invalid credentials/);
  }

  /** Verify that the required message is displayed */
  async expectRequiredMessage(): Promise<void> {
    await expect(this.requiredMessage).toHaveCount(2);
    await expect(this.requiredMessage.first()).toHaveText(/Required/i);
  }
}

