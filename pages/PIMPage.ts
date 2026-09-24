import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { EmployeeListPage } from './pim/EmployeeListPage';
import { AddEmployeePage } from './pim/AddEmployeePage';
import { PersonalDetailsPage } from './pim/PersonalDetailsPage';

/**
 * PIMPage Facade
 * Orchestrates EmployeeListPage, AddEmployeePage, and PersonalDetailsPage
 * following SOLID principles (Single Responsibility + Open/Closed + Facade pattern).
 */
export class PIMPage extends BasePage {
  readonly list: EmployeeListPage;
  readonly addForm: AddEmployeePage;
  readonly personalDetails: PersonalDetailsPage;

  // Expose subpage locators for full backward compatibility
  readonly addEmployeeButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveEmployeeButton: Locator;
  readonly saveButton: Locator;
  readonly employeeNameSearchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.list = new EmployeeListPage(page);
    this.addForm = new AddEmployeePage(page);
    this.personalDetails = new PersonalDetailsPage(page);

    this.addEmployeeButton = this.list.addEmployeeButton;
    this.firstNameInput = this.addForm.firstNameInput;
    this.lastNameInput = this.addForm.lastNameInput;
    this.middleNameInput = this.addForm.middleNameInput;
    this.employeeIdInput = this.addForm.employeeIdInput;
    this.saveEmployeeButton = this.addForm.saveEmployeeButton;
    this.saveButton = this.addForm.saveButton;
    this.employeeNameSearchInput = this.list.employeeNameSearchInput;
    this.searchButton = this.list.searchButton;
  }

  /** Navigate to the PIM / Employee List view */
  async navigateToPIM(): Promise<void> {
    await this.list.goto();
  }

  /** Add a new employee */
  async addEmployee(firstName: string, lastName: string, employeeId?: string): Promise<void> {
    await this.waitForPageLoad();
    await this.addEmployeeButton.click();
    await this.addForm.fillAndSave(firstName, lastName, employeeId);
    await this.personalDetails.waitForProfilePage(firstName);
  }

  /** Add an employee without first name (negative test) */
  async addEmployeeWithoutFirstName(): Promise<void> {
    await this.waitForPageLoad();
    await this.addEmployeeButton.click();
    await this.addForm.addWithoutFirstName();
  }

  /** Search for an employee by name in the Employee List */
  async searchEmployeeByName(fullName: string): Promise<void> {
    await this.list.searchEmployeeByName(fullName);
  }

  /** Search without selecting a dropdown hint */
  async searchEmployee(fullName: string): Promise<void> {
    await this.list.searchEmployee(fullName);
  }

  /** Click edit pencil icon on employee row */
  async clickEditEmployee(firstName: string, lastName: string): Promise<void> {
    await this.list.clickEditEmployee(firstName, lastName);
  }

  /** Edit personal details in the employee profile */
  async editEmployeeDetails(
    firstName: string,
    middleName: string,
    lastName: string,
  ): Promise<void> {
    await this.personalDetails.editEmployeeDetails(firstName, middleName, lastName);
  }

  /** Delete a specific employee */
  async deleteEmployee(firstName: string, lastName: string): Promise<void> {
    await this.list.deleteEmployee(firstName, lastName);
  }

  /** Delete the first record visible in the search result table */
  async deleteFirstResult(): Promise<void> {
    await this.list.deleteFirstResult();
  }

  /** Verify that the employee is deleted from the table */
  async isEmployeeDeleted(firstName: string, lastName: string): Promise<void> {
    await this.list.isEmployeeDeleted(firstName, lastName);
  }

  /** Verify that the PIM page is displayed */
  async isPIMPageDisplayed(): Promise<void> {
    await this.list.isDisplayed();
  }

  /** Verify that the employee list is displayed */
  async isEmployeeListDisplayed(): Promise<void> {
    await this.list.isListDisplayed();
  }

  /** Verification: Check that we are on the employee profile page */
  async verifyProfilePage(fullName: string): Promise<void> {
    await this.personalDetails.verifyProfilePage(fullName);
  }

  /** Verification: Check First, Middle, and Last name in profile */
  async verifyEmployeeNames(
    firstName: string,
    middleName: string,
    lastName: string,
  ): Promise<void> {
    await this.personalDetails.verifyEmployeeNames(firstName, middleName, lastName);
  }

  /** Verification: Check that the employee exists in the table */
  async verifyEmployeeInTable(firstName: string, lastName: string): Promise<void> {
    await this.list.verifyEmployeeInTable(firstName, lastName);
  }

  /** Get locator for First Name validation error message */
  async getFirstNameErrorLocator(): Promise<Locator> {
    return this.addForm.getFirstNameErrorLocator();
  }
}
