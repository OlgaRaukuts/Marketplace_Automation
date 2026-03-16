import { test, expect } from "@playwright/test";
import { PIMPage } from "../pages/PIMPage";
import empData from '../tests/test-data/employees.json';

test.describe('PIM Page Tests', () => {
    let pimPage: PIMPage;

    test.beforeEach(async ({ page }) => {
        pimPage = new PIMPage(page);
        
        await page.goto('/web/index.php/pim/viewEmployeeList');
        
        await page.waitForSelector('.oxd-table', { state: 'visible', timeout: 20000 });
    });

    test('should display PIM page', async () => {
        await pimPage.isPIMPageDisplayed();
    });

    test('should display employee list', async () => {
        await pimPage.isEmployeeListDisplayed();
    })

    test('should add a new employee', async () => {
        const emp = empData.newEmployee;
        await pimPage.addEmployee(emp.firstName, emp.lastName);
        await pimPage.verifyProfilePage(emp.fullName);
        await pimPage.navigateToPIM();
        await pimPage.searchEmployeeByName(emp.fullName);
        await pimPage.verifyEmployeeInTable(emp.firstName, emp.lastName);
    });

    test('should display error when trying to add employee without first name', async () => {
        await pimPage.addEmployeeWithoutFirstName();
        await pimPage.isErrorMessageDisplayed();
    });

    test('should search for an employee by name', async () => {
        const emp = empData.existingEmployee;
        await pimPage.searchEmployeeByName(emp.fullName);
        await pimPage.verifyEmployeeInTable(emp.firstName, emp.lastName);
    });

    test('should navigate to employee profile page when clicking on employee name', async ()=> {
        const emp = empData.existingEmployee;
        await pimPage.searchEmployeeByName(emp.fullName);
        await pimPage.verifyEmployeeInTable(emp.firstName, emp.lastName);
    });

    test('should delete an employee', async () => {
        const uniqueFirstName = `Test_${Date.now()}`;
        const uniqueLastName = 'DeleteMe';
        const fullName = `${uniqueFirstName} ${uniqueLastName}`;
        await pimPage.addEmployee(uniqueFirstName, uniqueLastName);
        await pimPage.verifyProfilePage(fullName);
      
        await pimPage.navigateToPIM();

    
        await pimPage.searchEmployeeByName(fullName);
        await pimPage.deleteEmployee(uniqueFirstName, uniqueLastName);
        await pimPage.isEmployeeDeleted(uniqueFirstName, uniqueLastName);
    });

    test('should add several new employees', async ({ page }) => {
        test.setTimeout(90000); 
        for (const emp of empData.bulkEmployees) {
            await pimPage.addEmployee(emp.firstName, emp.lastName);
            await pimPage.verifyProfilePage(emp.fullName);
            await page.waitForLoadState('networkidle'); 
            await pimPage.navigateToPIM();
            await pimPage.searchEmployeeByName(emp.fullName);
            await pimPage.verifyEmployeeInTable(emp.firstName, emp.lastName);
            await page.getByRole('button', { name: 'Reset' }).click();
        }
    });

    test('should delete employees one by one', async () => {
        for (const emp of empData.bulkEmployees) {
            await pimPage.searchEmployeeByName(emp.firstName); 
            await pimPage.deleteFirstResult(); 
            await pimPage.isEmployeeDeleted(emp.firstName, emp.lastName);
        }
    }); 
});