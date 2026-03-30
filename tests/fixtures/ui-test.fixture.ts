import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { PIMPage } from '../../pages/PIMPage';
import { LoginPage } from '../../pages/LoginPage';
import credentials from '../test-data/credentials.json';
import { ensureLoggedIn } from '../../helpers/auth';

type MyFixtures = {
    loginPage: LoginPage;
    pimPage: PIMPage;
    newEmployeeData: { firstName: string; lastName: string; fullName: string; email: string };
    tempEmployee: { firstName: string; lastName: string; fullName: string; empNumber?: number };
    bulkNewEmployeeData: Array<{ firstName: string; lastName: string; fullName: string }>;
    tempBulkEmployees: Array<{ firstName: string; lastName: string; fullName: string; empNumber?: number }>;
};

async function createEmployeeViaApi(
    request: APIRequestContext,
    data: { firstName: string; middleName?: string; lastName: string; employeeId?: string },
    maxAttempts = 3
): Promise<{ body: any }> {
    let lastErrorBody: string | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const response = await request.post('/web/index.php/api/v2/pim/employees', {
            data: {
                firstName: data.firstName,
                middleName: data.middleName ?? '',
                lastName: data.lastName,
                employeeId: data.employeeId ?? '',
            },
        });

        if (response.ok()) {
            const body: any = await response.json();
            return { body };
        }

        lastErrorBody = await response.text();

        if (attempt < maxAttempts) {
            await new Promise(res => setTimeout(res, 500));
        }
    }

    throw new Error(
        `Failed to create employee via API after ${maxAttempts} attempts. Last response body: ${lastErrorBody ?? 'no body'}`
    );
}

export const test = base.extend<MyFixtures>({
    
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    pimPage: async ({ page }, use) => {
       const pimPage = new PIMPage(page);
        
        await ensureLoggedIn(page, {
            username: credentials.admin.username,
            password: credentials.admin.password,
            startUrl: '/web/index.php/pim/viewEmployeeList',
            successUrl: '**/pim/viewEmployeeList',
        });

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

    tempEmployee: async ({ page, pimPage, newEmployeeData }, use) => {
        const { body: responseBody } = await createEmployeeViaApi(page.request, {
            firstName: newEmployeeData.firstName,
            lastName: newEmployeeData.lastName,
        });

        const empNumber = responseBody.data?.empNumber;

        // --- YIELD TO TEST ---
        await use({ ...newEmployeeData, empNumber });

        // --- TEARDOWN (via API) ---
        if (empNumber) {
            await page.request.delete('/web/index.php/api/v2/pim/employees', {
                data: { ids: [empNumber] }
            });
        }
    },

    tempBulkEmployees: async ({ page, pimPage, bulkNewEmployeeData }, use) => {
        const createdEmployees: Array<{ firstName: string; lastName: string; fullName: string; empNumber?: number }> = [];

        // --- SETUP (via API) ---
        for (const emp of bulkNewEmployeeData) {
            const { body } = await createEmployeeViaApi(page.request, {
                firstName: emp.firstName,
                lastName: emp.lastName,
            });
            createdEmployees.push({ ...emp, empNumber: body.data?.empNumber });
        }

        // --- YIELD TO TEST ---
        await use(createdEmployees);

        // --- TEARDOWN (via API) ---
        const idsToDelete = createdEmployees.map(emp => emp.empNumber);
        if (idsToDelete.length > 0) {
            await page.request.delete('/web/index.php/api/v2/pim/employees', {
                data: { ids: idsToDelete }
            });
        }
    }
});

export { expect };