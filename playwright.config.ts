import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const authStorageState = 'playwright/.auth/user.json';
const isCI = !!process.env.CI;

const crossBrowserProjects = [
  { name: 'chromium', device: 'Desktop Chrome' },
  { name: 'firefox', device: 'Desktop Firefox' },
  { name: 'webkit', device: 'Desktop Safari' },
] as const;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/setup/global.setup.ts',
  timeout: 60 * 1000,
  // If a snapshot is missing, create it and pass the test
  updateSnapshots: 'missing',
  expect: {
    /* Увеличиваем время ожидания для проверок (toBeVisible и тд) до 15 секунд */
    timeout: 15 * 1000,
    toHaveScreenshot: {
      maxDiffPixels: 100, // Small buffer for anti-aliasing differences
      threshold: 0.2,
      maxDiffPixelRatio: 0.05,
    },
  },

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Fewer workers reduce load on the shared OrangeHRM demo DB */
  workers: isCI ? 2 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isCI
    ? [['html'], ['github'], ['allure-playwright']]
    : [['html'], ['allure-playwright']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // 1. Force the browser language to English
    locale: 'en-US',

    // 2. Force a North American timezone
    timezoneId: 'America/New_York',

    // 3. Force the network headers to request English content
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  /* Configure projects for major browsers */
  projects: crossBrowserProjects.map(({ name, device }) => ({
    name,
    use: {
      ...devices[device],
      storageState: authStorageState,
    },
  })),

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
