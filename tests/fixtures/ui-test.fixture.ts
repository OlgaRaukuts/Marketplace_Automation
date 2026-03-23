import { test as base, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { PIMPage } from '../../pages/PIMPage';
import { LoginPage } from '../../pages/LoginPage';

type MyFixtures = {
    loginPage: LoginPage;
    pimPage: PIMPage;
    newEmployeeData: { firstName: string; lastName: string; fullName: string; email: string };
    tempEmployee: { firstName: string; lastName: string; fullName: string; empNumber?: number };
    bulkNewEmployeeData: Array<{ firstName: string; lastName: string; fullName: string }>;
    tempBulkEmployees: Array<{ firstName: string; lastName: string; fullName: string; empNumber?: number }>;
};

export const test = base.extend<MyFixtures>({
    
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    pimPage: async ({ page }, use) => {
       const pimPage = new PIMPage(page);
        
        await page.goto('/web/index.php/pim/viewEmployeeList');
        if (page.url().includes('login')) {
            console.log('Session missing. Performing emergency login...');
            await page.locator('input[name="username"]').fill('Admin');
            await page.locator('input[name="password"]').fill('admin123');
            await page.locator('button[type="submit"]').click();
            await page.waitForURL('**/pim/viewEmployeeList');
        }

        await page.waitForSelector('.oxd-table', { state: 'visible', timeout: 20000 });
        await use(pimPage);
    },

    newEmployeeData: async ({}, use) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const fullName = `${firstName} ${lastName}`; 
        const email = faker.internet.email({ firstName, lastName });

        await use({ firstName, lastName, fullName, email });
    },

    bulkNewEmployeeData: async ({}, use) => {
        const employees = Array.from({ length: 3 }).map(() => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            return { firstName, lastName, fullName: `${firstName} ${lastName}` };
        });
        await use(employees);
    },

    tempEmployee: async ({ request, newEmployeeData }, use) => {
        // --- SETUP (via API) ---
        const response = await request.post('/web/index.php/api/v2/pim/employees', {
            data: {
                firstName: newEmployeeData.firstName,
                middleName: '',
                lastName: newEmployeeData.lastName,
                employeeId: '' 
            }
        });

        expect(response.ok()).toBeTruthy(); 
   
        const responseBody = await response.json();
        const empNumber = responseBody.data.empNumber; 

        // --- YIELD TO TEST ---
        await use({ ...newEmployeeData, empNumber });

        // --- TEARDOWN (via API) ---
        if (empNumber) {
            await request.delete('/web/index.php/api/v2/pim/employees', {
                data: { ids: [empNumber] }
            });
        }
    },

    tempBulkEmployees: async ({ request, bulkNewEmployeeData }, use) => {
        const createdEmployees = [];

        // --- SETUP (via API) ---
        for (const emp of bulkNewEmployeeData) {
            const response = await request.post('/web/index.php/api/v2/pim/employees', {
                data: {
                    firstName: emp.firstName,
                    middleName: '',
                    lastName: emp.lastName,
                    employeeId: ''
                }
            });
            
            if (response.ok()) {
                const body = await response.json();
                createdEmployees.push({ ...emp, empNumber: body.data.empNumber });
            }
        }

        // --- YIELD TO TEST ---
        await use(createdEmployees);

        // --- TEARDOWN (via API) ---
        const idsToDelete = createdEmployees.map(emp => emp.empNumber);
        if (idsToDelete.length > 0) {
            await request.delete('/web/index.php/api/v2/pim/employees', {
                data: { ids: idsToDelete }
            });
        }
    }
});

export { expect };