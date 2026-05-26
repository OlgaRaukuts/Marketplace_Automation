/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'playwright-report/',
    'allure-report/',
    'allure-results/',
    'test-results/',
  ],
  rules: {
    // Don't block development for formatting-only diffs; use `npm run format:check` when needed.
    'prettier/prettier': 'warn',
    // This repo uses `any` in a couple places for API mocking.
    '@typescript-eslint/no-explicit-any': 'off',
    // E2E fixtures sometimes receive parameters that aren't used in every test.
    '@typescript-eslint/no-unused-vars': 'off',
    // Common in E2E tests for debugging.
    'no-console': 'off',
    // This repo uses empty object destructuring in fixture callbacks: `async ({}, use) => ...`
    'no-empty-pattern': 'off',
  },
};

