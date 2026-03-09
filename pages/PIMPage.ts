import { Page, Locator,expect } from "@playwright/test";

export class PIMPage{
readonly page: Page;
readonly addEmployeeButton: Locator;
readonly firstNameInput: Locator;
readonly lastNameInput: Locator;
readonly saveEmployeeButton: Locator;
readonly saveButton: Locator;


constructor(page: Page){
    this.page = page;
    this.addEmployeeButton = page.getByRole('button',{name: 'Add'});
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.saveEmployeeButton = page.getByRole('button',{name:'Save'});
    this.saveButton = page.locator('form').filter({ hasText: 'Employee Full Name' })
                          .getByRole('button', { name: 'Save' });
}

    /** Wait for the page to load completely */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Navigate to the PIM page */
    async navigateToPIM(): Promise<void> {
        await this.page.goto('/pim/viewEmployeeList');
    }

    /** Add a new employee  */
    async addEmployee(firstName: string, lastName: string): Promise<void>{
        await this.waitForPageLoad();
        await this.addEmployeeButton.click();
        // Implementation for adding employee
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.saveEmployeeButton.click();
    }
    /** Add an employee without first name*/
    async addEmployeeWithoutFirstName(): Promise<void>{
        await this.waitForPageLoad();
        await this.addEmployeeButton.click();
        await this.lastNameInput.fill('Smith');
        await this.saveEmployeeButton.click();
    }

    /**Verify that the PIM page is displayed */
    async isPIMPageDisplayed(): Promise<void>{
        await expect(this.page).toHaveURL(/\/pim\/viewEmployeeList/);
    }

    /** Verify that the employee list is displayed */
    async isEmployeeListDisplayed(): Promise<void>{
        const row = this.page.locator('.oxd-table-card', { hasText: 'Amelia' });
        await expect(row).toBeVisible();
    }

    /** Verification: Check that we are on the employee profile page */
    async verifyProfilePage(fullName: string): Promise<void> {
        const header = this.page.locator('.orangehrm-edit-employee-name h6');
        await expect(header).toBeVisible();
        await expect(header).toHaveText(fullName);
  }

  /** Verification: Check that the employee exists in the table */
    async verifyEmployeeInTable(fullName: string): Promise<void> {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: fullName });
        await expect(row).toBeVisible();
  }

    /** Verify that error message is displayed when trying to add employee without first name */
    async isErrorMessageDisplayed(): Promise<void>{
        const firstNameError = this.page.locator('.oxd-input-group', { hasText: 'First Name' })
                           .locator('.oxd-input-field-error-message');
        await expect(firstNameError).toHaveText('Required');     
    }
}