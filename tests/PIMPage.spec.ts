import { test, expect } from '../tests/fixtures/ui-test.fixture';


test.describe('PIM Page Tests', () => {

    test('should display PIM page', async ({ pimPage }) => {
        await pimPage.isPIMPageDisplayed();
    });

    test('should display employee list', async ({ pimPage }) => {
        await pimPage.isEmployeeListDisplayed();
    });

    test('should add a new employee', async ({ pimPage, newEmployeeData }) => {
        await pimPage.addEmployee(newEmployeeData.firstName, newEmployeeData.lastName);
        await pimPage.verifyProfilePage(newEmployeeData.fullName);
        await pimPage.navigateToPIM();
        await pimPage.searchEmployeeByName(newEmployeeData.fullName);
        await pimPage.verifyEmployeeInTable(newEmployeeData.firstName, newEmployeeData.lastName);

        // delete the created employee to keep the databese clean
        await pimPage.deleteEmployee(newEmployeeData.firstName, newEmployeeData.lastName);
    });

    test('should search for an employee by name', async ({ pimPage, tempEmployee }) => {
        await pimPage.navigateToPIM();
        await pimPage.searchEmployeeByName(tempEmployee.fullName);
        await pimPage.verifyEmployeeInTable(tempEmployee.firstName, tempEmployee.lastName);
    });

    test('should display error when trying to add employee without first name', async ({ pimPage }) => {
        await pimPage.addEmployeeWithoutFirstName();
        const error = await pimPage.getFirstNameErrorLocator();
        await expect(error).toBeVisible();
        await expect(error).toHaveText('Required');
        await expect(error).toHaveScreenshot('first-name-required-error.png');
    });

    test('should navigate to employee profile page when clicking on employee name', async ({ pimPage, tempEmployee }) => {
        await pimPage.navigateToPIM();
        await pimPage.searchEmployeeByName(tempEmployee.fullName);
        await pimPage.verifyEmployeeInTable(tempEmployee.firstName, tempEmployee.lastName);
    });

    test('should delete an employee', async ({ pimPage, newEmployeeData }) => {
        await pimPage.addEmployee(newEmployeeData.firstName, newEmployeeData.lastName);
        await pimPage.verifyProfilePage(newEmployeeData.fullName);
      
        await pimPage.navigateToPIM();
    
        await pimPage.searchEmployeeByName(newEmployeeData.fullName);
        await pimPage.deleteEmployee(newEmployeeData.firstName, newEmployeeData.lastName);
        await pimPage.isEmployeeDeleted(newEmployeeData.firstName, newEmployeeData.lastName);
    });

    test('should add several new employees', async ({ pimPage, page, bulkNewEmployeeData }) => {
        test.setTimeout(90000); 
        for (const emp of bulkNewEmployeeData) {
            await pimPage.addEmployee(emp.firstName, emp.lastName);
            await pimPage.verifyProfilePage(emp.fullName);
            await page.waitForLoadState('networkidle'); 
            await pimPage.navigateToPIM();
            await pimPage.searchEmployeeByName(emp.fullName);
            await pimPage.verifyEmployeeInTable(emp.firstName, emp.lastName);
            await page.getByRole('button', { name: 'Reset' }).click();
        }

        for (const emp of bulkNewEmployeeData) {
            await pimPage.searchEmployeeByName(emp.fullName);
            await pimPage.deleteEmployee(emp.firstName, emp.lastName);
        }
    });

    test('should delete employees one by one', async ({ pimPage, tempBulkEmployees }) => {
        test.setTimeout(90000);
        await pimPage.navigateToPIM();
        
        for (const emp of tempBulkEmployees) {
            await pimPage.searchEmployeeByName(emp.fullName); 
            await pimPage.deleteFirstResult(); 
            await pimPage.isEmployeeDeleted(emp.firstName, emp.lastName);
        }
       
    }); 
});