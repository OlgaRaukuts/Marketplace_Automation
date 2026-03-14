import {test as setup, expect} from "@playwright/test";
const authFile = 'playwright/.auth/user.json';

setup('authenticate via API', async ({ request }) => {
    const baseUrl = 'https://opensource-demo.orangehrmlive.com';

    // 1. Do GET-request to Login page to get session cookies and CSRF-token
    const response = await request.get(`${baseUrl}/web/index.php/auth/login`);
    const html = await response.text();

    // 2. Extract CSRF-token from the page using a regular expression
    // OrangeHRM stores it in a hidden field: <input type="hidden" name="_token" value="...">
    const tokenMatch = html.match(/name="_token" value="([^"]+)"/);
    const csrfToken = tokenMatch ? tokenMatch[1] : '';
   // If that fails, let's log the HTML to see what's actually being returned
if (!csrfToken) {
    console.log("Could not find token. HTML snippet:", html.substring(0, 1000));
}

expect(csrfToken, 'CSRF token should be found in the login page').toBeTruthy();

    // 3. Send POST-request for authentication
    const loginResponse = await request.post(`${baseUrl}/web/index.php/auth/validate`, {
        form: {
            username: 'Admin',
            password: 'admin123',
            _token: csrfToken,
        },
        headers: {
            'Referer': `${baseUrl}/web/index.php/auth/login`,
        }
    });
    expect(loginResponse.ok()).toBeTruthy();

    // 4. Save the final state (all received cookies) in a file
    await request.storageState({ path: authFile });
});