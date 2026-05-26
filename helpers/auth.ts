import type { Page } from '@playwright/test';
import { clickButton, fillInput, waitForDomContentLoaded } from './ui-actions';

type LoginOptions = {
  username: string;
  password: string;
  startUrl: string;
  successUrl: string | RegExp;
};

export async function loginViaUi(page: Page, opts: LoginOptions): Promise<void> {
  await page.goto(opts.startUrl, { waitUntil: 'domcontentloaded' });

  const usernameInput = page.locator('input[name="username"]');
  const passwordInput = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');

  await fillInput(usernameInput, opts.username);
  await fillInput(passwordInput, opts.password);
  await clickButton(submitButton);

  await page.waitForURL(opts.successUrl, { timeout: 20_000 });
  await waitForDomContentLoaded(page);
}

export async function ensureLoggedIn(
  page: Page,
  opts: LoginOptions & { loginUrlIncludes?: string },
): Promise<void> {
  const loginUrlIncludes = opts.loginUrlIncludes ?? 'login';

  await page.goto(opts.startUrl, { waitUntil: 'domcontentloaded' });
  if (!page.url().includes(loginUrlIncludes)) {
    return;
  }

  await loginViaUi(page, opts);
}
