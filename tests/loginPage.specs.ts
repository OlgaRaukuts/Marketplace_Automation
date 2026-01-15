import {test} from '@playwright/test';

test.describe('Login Page Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://automationteststore.com/index.php?rt=account/login');
    })
})