import fs from 'fs';
import path from 'path';
import { chromium, type FullConfig } from '@playwright/test';
import credentials from '../test-data/credentials.json';
import { loginViaUi } from '../../helpers/auth';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

async function globalSetup(config: FullConfig): Promise<void> {
  const authFile = path.resolve(process.cwd(), 'playwright/.auth/user.json');
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: BASE_URL,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const page = await context.newPage();

  await loginViaUi(page, {
    username: credentials.admin.username,
    password: credentials.admin.password,
    startUrl: '/web/index.php/auth/login',
    successUrl: /.*dashboard/,
  });

  const cookies = await context.cookies();
  if (!cookies.length) {
    throw new Error('Global setup login failed: no cookies captured.');
  }

  await context.storageState({ path: authFile });
  await browser.close();
}

export default globalSetup;
