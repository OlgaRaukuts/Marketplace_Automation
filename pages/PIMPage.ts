import { Page, Locator,expect } from "@playwright/test";

export class PIMPage{
readonly page: Page;
readonly addEmployeeButton: Locator;
readonly firstNameInput: Locator;
readonly lastNameInput: Locator;
readonly saveButton: Locator;

constructor(page: Page){
    this.page = page;
    this.addEmployeeButton = page.getByRole('button',{name: 'Add'});
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.saveButton = page.getByRole('button',{name:'Save'});

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
        await this.saveButton.click();
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
    /** Verify that employee was added successfully */
    async isEmployeeAddedSuccessfully(): Promise<void>{
        // Assuming 'Harry Potter' is the name you entered
        const employeeNameHeader = this.page.locator('.orangehrm-edit-employee-name h6');
        // Assert the employee name is visible and correct
        await expect(employeeNameHeader).toBeVisible();
        await expect(employeeNameHeader).toHaveText('Harry Potter');
    }
}