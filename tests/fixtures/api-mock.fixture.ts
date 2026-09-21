import { test as base, type Route } from '@playwright/test';

export interface MockOptions {
  status?: number;
  data?: unknown;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  delay?: number;
}

export interface ApiMockHelper {
  /** Mock the PIM Employee List GET API */
  mockEmployeeList: (status: number, data?: unknown) => Promise<void>;
  /** Generic helper to mock any endpoint */
  mockResponse: (urlPattern: string | RegExp, options?: MockOptions) => Promise<void>;
  /** Clear a specific or all custom routes */
  clearMocks: (urlPattern?: string | RegExp) => Promise<void>;
}

export type MockFixtures = {
  mockApi: ApiMockHelper;
};

export const test = base.extend<MockFixtures>({
  mockApi: async ({ page }, use) => {
    const apiHelper: ApiMockHelper = {
      mockEmployeeList: async (status: number, data: unknown = {}) => {
        await page.route('**/api/v2/pim/employees**', async (route: Route) => {
          // Only intercept GET requests, let POST/DELETE pass through to the real API
          if (route.request().method() === 'GET') {
            await route.fulfill({
              status,
              contentType: 'application/json',
              body: typeof data === 'string' ? data : JSON.stringify(data),
            });
          } else {
            await route.fallback();
          }
        });
      },

      mockResponse: async (urlPattern: string | RegExp, options: MockOptions = {}) => {
        const { status = 200, data = {}, method = 'GET', delay = 0 } = options;

        await page.route(urlPattern, async (route: Route) => {
          if (route.request().method() === method) {
            if (delay > 0) {
              await new Promise((res) => setTimeout(res, delay));
            }
            await route.fulfill({
              status,
              contentType: 'application/json',
              body: typeof data === 'string' ? data : JSON.stringify(data),
            });
          } else {
            await route.fallback();
          }
        });
      },

      clearMocks: async (urlPattern?: string | RegExp) => {
        if (urlPattern) {
          await page.unroute(urlPattern);
        } else {
          await page.unroute('**/api/v2/pim/employees**');
        }
      },
    };

    await use(apiHelper);
  },
});

export { expect } from '@playwright/test';

