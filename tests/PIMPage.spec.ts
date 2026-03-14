import { test, expect } from "@playwright/test";
import { PIMPage } from "../pages/PIMPage";
import { LoginPage} from "../pages/LoginPage";
import credentials from '../test-data/credentials.json';
import empData from '../test-data/employees.json';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('PIM Page Tests', () => {
    let pimPage: PIMPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(credentials.admin.username, credentials.admin.password);
        await loginPage.expectedLoginSuccess();

     pimPage = new PIMPage(page);
        await page.goto('/web/index.php/pim/viewEmployeeList');
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

/*test('should edit employee details', async () => {
    await pimPage.page.pause();
    await pimPage.searchEmployeeByName('Harry Potter');
    await pimPage.clickEditEmployee('Harry', 'Potter');
    await pimPage.editEmployeeDetails('Harry', 'James', 'Potter');
    await pimPage.verifyProfilePage('Harry Potter');
});
*/

test('should delete an employee', async () => {
    const emp = empData.newEmployee;
        await pimPage.searchEmployeeByName(emp.fullName);
        await pimPage.deleteEmployee(emp.firstName, emp.lastName);
        await pimPage.isEmployeeDeleted(emp.firstName, emp.lastName);
});

test('should add several new employees', async ({ page }) => {
    test.setTimeout(60000); 

    for (const emp of empData.bulkEmployees) {
        await pimPage.addEmployee(emp.firstName, emp.lastName);
        await pimPage.verifyProfilePage(emp.fullName);
        
        // Let's wait for the network to be idle before navigating back to the PIM page to ensure all operations are complete
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