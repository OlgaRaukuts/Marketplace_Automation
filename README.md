# Marketplace Automation (Playwright)

UI and API-assisted end-to-end test automation for the OrangeHRM demo application using Playwright and TypeScript.

## Tech Stack

- `@playwright/test` for test runner, assertions, fixtures, tracing, screenshots
- TypeScript-based test code (`.ts`)
- `@faker-js/faker` for random test data generation
- Allure reporter integration (`allure-playwright`, `allure-commandline`)

## Tested Application

- Base URL: `https://opensource-demo.orangehrmlive.com`
- Main covered modules:
  - Authentication (positive and negative scenarios)
  - PIM employee workflows (add/search/delete/validation)
  - API mocking behavior for employee list

## Project Structure

- `pages/`
  - `LoginPage.ts` - Login page object
  - `PIMPage.ts` - PIM page object and employee actions/assertions
- `helpers/`
  - `ui-actions.ts` - reusable UI actions (`clickButton`, `fillInput`, etc.)
  - `auth.ts` - shared authentication helper (`loginViaUi`)
- `tests/`
  - `loginPage.spec.ts` - login/logout happy paths
  - `loginPage-negative.spec.ts` - negative and UI login checks
  - `PIMPage.spec.ts` - core PIM flows
  - `employee-list.spec.ts` - API mock scenarios
  - `fixtures/`
    - `ui-test.fixture.ts` - custom fixtures (`loginPage`, `pimPage`, temp employees, faker data)
    - `api-mock.fixture.ts` - API mocking fixture
  - `setup/global.setup.ts` - global authentication bootstrap for storage state
  - `test-data/credentials.json` - credentials test data
- `playwright.config.ts` - global test configuration

## Prerequisites

- Node.js 18+ (recommended)
- npm
- Playwright browsers installed

## Installation

```bash
npm install
npx playwright install
```

## Running Tests

Run full suite:

```bash
npm run test
```

Run one spec:

```bash
npx playwright test tests/PIMPage.spec.ts
```

Run headed mode:

```bash
npx playwright test --headed
```

Run Playwright UI mode:

```bash
npx playwright test --ui
```

## Reports and Debugging

- HTML report:
  ```bash
  npx playwright show-report
  ```
- Traces are enabled on first retry (`trace: 'on-first-retry'`).
- Reporters configured: `html`, `github`, `allure-playwright`.

## Authentication Model

- `tests/setup/global.setup.ts` logs in once before test execution and creates `playwright/.auth/user.json`.
- The Chromium project reuses that stored authenticated state for all tests.
- Regular tests/fixtures no longer perform UI login flow on each test.

## Fixtures and Data Strategy

- Faker-based runtime test data is used for employee names.
- API-backed temporary employees are created/deleted in fixtures to keep test data isolated.
- Employee creation helper retries transient API failures and returns meaningful error details.

## Visual Assertions (Snapshots)

- Visual assertion exists for first-name validation error in `PIMPage.spec.ts`.
- If baseline snapshot is missing, functional assertions (text/CSS/visibility) still run.
- To enforce strict visual checks across environments, generate and commit snapshot baselines for target OS/browser combinations.

## Notes for CI

- Current config runs with `workers: 1` and retries on CI (`retries: 2`).
- Locale/timezone are fixed (`en-US`, `America/New_York`) to reduce flaky behavior.
- If CI lacks visual baselines, tests may skip screenshot comparison but still validate behavior.

## Future Improvements

- Add dedicated npm scripts (smoke/regression/headed/ui/allure).
- Move credentials to environment variables or secret store for non-demo environments.
- Enable multi-browser matrix (Firefox/WebKit) when baseline stability is confirmed.
