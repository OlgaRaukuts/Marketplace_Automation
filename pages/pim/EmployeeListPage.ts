import { BasePage } from '../BasePage';
import { type Page, type Locator, expect } from '@playwright/test';
import { clickButton, fillInput, waitVisible } from '../../helpers/ui-actions';

/**
 * EmployeeListPage manages search filters, table actions, and employee deletions.
 * Follows Single Responsibility Principle (SRP) for /pim/viewEmployeeList.
 */
export class EmployeeListPage extends BasePage {
  readonly addEmployeeButton: Locator;
  readonly employeeNameSearchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addEmployeeButton = page.getByRole('button', { name: 'Add' });
    this.employeeNameSearchInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Name' })
      .getByPlaceholder('Type for hints...');
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  /** Navigate to the Employee List view */
  async goto(): Promise<void> {
    const pimLink = this.page.getByRole('link', { name: 'PIM' });
    if (await pimLink.isVisible().catch(() => false)) {
      await clickButton(pimLink);
    } else {
      await super.goto('/web/index.php/pim/viewEmployeeList');
    }
    await expect(this.page.getByRole('heading', { name: 'Employee Information' })).toBeVisible({ timeout: 30_000 });
  }

  /** Search for an employee by name */
  async searchEmployeeByName(fullName: string): Promise<void> {
    await waitVisible(this.employeeNameSearchInput, 15_000);
    await fillInput(this.employeeNameSearchInput, fullName, { clear: true });

    const searchResponse = this.page
      .waitForResponse(
        (res) =>
          res.url().includes('/employees') &&
          res.request().method() === 'GET' &&
          !res.url().includes('nameOrId='),
        { timeout: 10_000 },
      )
      .catch(() => null);

    await clickButton(this.searchButton);
    await searchResponse;
    await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 5000 }).catch(() => null);
    await this.waitForPageLoad();
  }

  /** Search without selecting a dropdown hint */
  async searchEmployee(fullName: string): Promise<void> {
    await expect(this.employeeNameSearchInput).toBeVisible({ timeout: 15_000 });
    await fillInput(this.employeeNameSearchInput, fullName, { clear: true });
    await clickButton(this.searchButton);
  }

  /** Delete a specific employee row by first and last name */
  async deleteEmployee(firstName: string, lastName: string): Promise<void> {
    const row = this.page
      .locator('.oxd-table-card')
      .filter({ hasText: firstName })
      .filter({ hasText: lastName })
      .first();
    const trashBtn = row.locator('button:has(.bi-trash), .bi-trash').first();
    await clickButton(trashBtn, { timeout: 30_000 });
    const confirmButton = this.page.getByRole('button', { name: 'Yes, Delete' });
    await confirmButton.waitFor({ state: 'visible', timeout: 15_000 });

    const deleteResponse = this.page
      .waitForResponse(
        (res) => res.url().includes('/employees') && res.request().method() === 'DELETE',
        { timeout: 15_000 },
      )
      .catch(() => null);

    await clickButton(confirmButton);
    await deleteResponse;
    await this.page.locator('.oxd-dialog-sheet').waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => null);
    await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 10_000 }).catch(() => null);
  }

  /** Delete the first record visible in the search result table */
  async deleteFirstResult(): Promise<void> {
    await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 5000 }).catch(() => null);
    const firstRow = this.page.locator('.oxd-table-card').first();
    const noRecords = this.page.getByText('No Records Found');
    await firstRow.or(noRecords).waitFor({ state: 'visible', timeout: 15_000 });

    if (await noRecords.isVisible()) {
      return;
    }

    await clickButton(firstRow.locator('button:has(.bi-trash), .bi-trash').first());
    const confirmButton = this.page.getByRole('button', { name: /Yes, Delete/i });
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });

    const deleteResponse = this.page
      .waitForResponse(
        (res) => res.url().includes('/employees') && res.request().method() === 'DELETE',
        { timeout: 10_000 },
      )
      .catch(() => null);

    await clickButton(confirmButton);
    await deleteResponse;
    await this.page.locator('.oxd-dialog-sheet').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
    await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 5000 }).catch(() => null);
  }

  /** Verify that the employee is deleted from the table */
  async isEmployeeDeleted(firstName: string, lastName: string): Promise<void> {
    const row = this.page
      .locator('.oxd-table-card')
      .filter({ hasText: firstName })
      .filter({ hasText: lastName });

    try {
      await expect(row).toHaveCount(0, { timeout: 10_000 });
    } catch {
      await this.searchEmployeeByName(`${firstName} ${lastName}`);
      await expect(row).toHaveCount(0, { timeout: 10_000 });
    }
  }

  /** Verify that the PIM view is displayed */
  async isDisplayed(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList/, { timeout: 30_000 });
    await expect(this.page.getByRole('heading', { name: 'Employee Information' })).toBeVisible({ timeout: 30_000 });
  }

  /** Verify that the table list is displayed */
  async isListDisplayed(): Promise<void> {
    await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'detached', timeout: 30_000 }).catch(() => null);
    const tableElement = this.page.locator('.oxd-table-card, .orangehrm-container, .oxd-table-body').first();
    await expect(tableElement).toBeVisible({ timeout: 30_000 });
  }

  /** Verify that an employee row is visible in the table */
  async verifyEmployeeInTable(firstName: string, lastName: string): Promise<void> {
    const row = this.page
      .locator('.oxd-table-card')
      .filter({ hasText: firstName })
      .filter({ hasText: lastName })
      .first();
    await expect(row).toBeVisible({ timeout: 30_000 });
  }

  /** Click edit pencil icon on employee row */
  async clickEditEmployee(firstName: string, lastName: string): Promise<void> {
    const row = this.page
      .locator('.oxd-table-card')
      .filter({ hasText: firstName })
      .filter({ hasText: lastName });
    await clickButton(row.locator('.bi-pencil-fill'));
  }
}
