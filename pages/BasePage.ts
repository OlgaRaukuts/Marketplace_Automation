import { type Page, type Locator } from '@playwright/test';
import { clickButton, waitVisible, waitForDomContentLoaded } from '../helpers/ui-actions';

/**
 * BasePage encapsulates common browser navigation and shared header elements.
 * Follows Dependency Inversion by using relative paths that resolve to Playwright's baseURL.
 */
export abstract class BasePage {
  readonly page: Page;
  readonly userProfileDropdown: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userProfileDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
  }

  /** Navigate using a relative path that resolves against Playwright's configured baseURL */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /** Wait for DOM content to be loaded */
  async waitForPageLoad(): Promise<void> {
    await waitForDomContentLoaded(this.page);
  }

  /** Common logout action across any authenticated page */
  async logout(): Promise<void> {
    await waitVisible(this.userProfileDropdown, 15_000);
    await clickButton(this.userProfileDropdown);
    await waitVisible(this.logoutLink, 10_000);
    await clickButton(this.logoutLink);
    await this.waitForPageLoad();
  }
}
