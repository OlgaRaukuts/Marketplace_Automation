import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { PIMPage } from "../pages/PIMPage";

test.describe('PIM Page Tests', () => {
    let loginPage: LoginPage;
    let pimPage: PIMPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        pimPage = new PIMPage(page);

        await loginPage.goto();
        await loginPage.login('Admin', 'admin123');
        await loginPage.expectedLoginSuccess();
        await pimPage.navigateToPIM();
    });

    test('should display PIM page', async () => {
        await pimPage.isPIMPageDisplayed();
    });

    test('should display employee list', async () => {
        await pimPage.isEmployeeListDisplayed();
    })

test('should add a new employee', async () => {
    await pimPage.addEmployee('Harry', 'Potter');
    await pimPage.verifyProfilePage('Harry Potter');
    await pimPage.navigateToPIM();
    await pimPage.searchEmployeeByName('Harry Potter');
    await pimPage.verifyEmployeeInTable('Harry', 'Potter');
});

test('should display error when trying to add employee without first name', async () => {
    await pimPage.addEmployeeWithoutFirstName();
    await pimPage.isErrorMessageDisplayed();
});

test('should search for an employee by name', async () => {
    await pimPage.searchEmployeeByName('Amelia Brown');
    await pimPage.verifyEmployeeInTable('Amelia','Brown' );
});

test('should navigate to employee profile page when clicking on employee name', async ()=> {
    await pimPage.searchEmployeeByName('Amelia Brown');
    await pimPage.clickEditEmployee('Amelia', 'Brown');
    await pimPage.verifyProfilePage('Amelia Brown');
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
    await pimPage.searchEmployeeByName('Harry Potter');
    await pimPage.deleteEmployee('Harry', 'Potter');
    await pimPage.isEmployeeDeleted('Harry', 'Potter');
});

});