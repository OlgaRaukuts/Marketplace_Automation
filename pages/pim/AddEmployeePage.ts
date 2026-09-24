import { BasePage } from '../BasePage';
import { type Page, type Locator } from '@playwright/test';
import { clickButton, fillInput, waitVisible } from '../../helpers/ui-actions';

/**
 * AddEmployeePage manages the Add Employee form and submission.
 * Follows Single Responsibility Principle (SRP) for /pim/addEmployee.
 */
export class AddEmployeePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly saveEmployeeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.middleNameInput = page.getByPlaceholder('Middle Name');
    this.employeeIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');
    this.saveButton = page
      .locator('form')
      .filter({ hasText: 'Employee Full Name' })
      .getByRole('button', { name: 'Save' });
    this.saveEmployeeButton = page.getByRole('button', { name: 'Save' });
  }

  /** Navigate to the Add Employee page */
  async goto(): Promise<void> {
    await super.goto('/web/index.php/pim/addEmployee');
  }

  /** Fill employee fields and submit form with automated network synchronization */
  async fillAndSave(firstName: string, lastName: string, employeeId?: string): Promise<void> {
    await waitVisible(this.firstNameInput, 15_000);
    await fillInput(this.firstNameInput, firstName);
    await fillInput(this.lastNameInput, lastName);

    const uniqueId = employeeId ?? `${Math.floor(100000 + Math.random() * 900000)}`;
    if (await this.employeeIdInput.isVisible().catch(() => false)) {
      await fillInput(this.employeeIdInput, uniqueId, { clear: true });
    }

    await this.saveButton.scrollIntoViewIfNeeded();

    const postPromise = this.page
      .waitForResponse(
        (res) => res.url().includes('/api/v2/pim/employees') && res.request().method() === 'POST',
        { timeout: 8000 },
      )
      .catch(() => null);

    await clickButton(this.saveButton);
    const postResponse = await postPromise;
    if (!postResponse) {
      await this.saveButton.click({ force: true }).catch(() => null);
    }
  }

  /** Add employee with blank first name for negative validation testing */
  async addWithoutFirstName(): Promise<void> {
    await fillInput(this.lastNameInput, 'Smith');
    await clickButton(this.saveEmployeeButton);
  }

  /** Get locator for First Name validation error message */
  async getFirstNameErrorLocator(): Promise<Locator> {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('input[name="firstName"]') })
      .locator('.oxd-input-field-error-message');
  }
}
