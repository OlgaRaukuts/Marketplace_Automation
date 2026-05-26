import type { Locator, Page } from '@playwright/test';

export async function waitVisible(locator: Locator, timeout = 15_000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
}

export async function clickButton(
  locator: Locator,
  options?: { timeout?: number; force?: boolean },
): Promise<void> {
  const timeout = options?.timeout ?? 15_000;
  await waitVisible(locator, timeout);
  await locator.click({ force: options?.force });
}

export async function fillInput(
  locator: Locator,
  value: string,
  options?: { timeout?: number; clear?: boolean },
): Promise<void> {
  const timeout = options?.timeout ?? 15_000;
  await waitVisible(locator, timeout);
  if (options?.clear) {
    await locator.clear();
  }
  await locator.fill(value);
}

export async function clearAndTypeSequentially(
  locator: Locator,
  value: string,
  options?: { timeout?: number; delay?: number },
): Promise<void> {
  const timeout = options?.timeout ?? 15_000;
  const delay = options?.delay ?? 100;
  await waitVisible(locator, timeout);
  await locator.click();
  await locator.clear();
  await locator.pressSequentially(value, { delay });
}

export async function waitForDomContentLoaded(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
}
