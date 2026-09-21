import { mergeTests } from '@playwright/test';
import { test as uiTest } from './ui-test.fixture';
import { test as mockTest } from './api-mock.fixture';

/**
 * Unified test runner containing all UI fixtures (loginPage, pimPage, tempEmployee, etc.)
 * and Mocking fixtures (mockApi).
 */
export const test = mergeTests(uiTest, mockTest);
export { expect } from '@playwright/test';
