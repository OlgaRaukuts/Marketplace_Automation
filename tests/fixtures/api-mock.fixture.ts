import { test as base } from '@playwright/test';

// type for our custom fixtures
type MockFixtures = {
  mockApi: {
    mockEmployeeList: (status: number, data?: any) => Promise<void>;
  };
};

// Expand base test with custom fixtures
export const test = base.extend<MockFixtures>({
  mockApi: async ({ page }, use) => {
    const apiHelper = {
      // method for mocking Employee List API
      mockEmployeeList: async (status: number, data: any = {}) => {
        await page.route('**/api/v2/pim/employees**', async (route) => {
          await route.fulfill({
            status: status,
            contentType: 'application/json',
            body: JSON.stringify(data),
          });
        });
      },
    };

    await use(apiHelper);
  },
});

export { expect } from '@playwright/test';
