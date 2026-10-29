const { test, expect } = require('@playwright/test');
test.describe('Login Form Validation Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test case
    await page.goto('https://freelance-learn-automation.vercel.app/login');
  });

  test('Test Case 1: Empty Login Attempt', async ({ page }) => {
    // 2. Leave both email and password fields empty
    // 3. Click the Sign In button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 4. Verify that the error message is displayed
    const errorMessage = page.locator('.errorMessage'); // Adjust locator based on actual DOM structure if necessary
    await expect(errorMessage).toContainText('Email and Password is required');
  });

  test('Test Case 2: Login with Email Only', async ({ page }) => {
    // 2. Enter email in the email field
    await page.getByPlaceholder('Enter Email').fill('sibi@gmail.com');
    // 3. Leave password field empty
    // 4. Click the Sign In button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 5. Verify that the password-required error message is displayed
    const errorMessage = page.locator('.errorMessage');
    await expect(errorMessage).toContainText('Password is required');
  });

  test('Test Case 3: Login with Password Only', async ({ page }) => {
    // 2. Leave email field empty
    // 3. Enter password in the password field
    await page.getByPlaceholder('Enter Password').fill('sibi@gmail.com');
    // 4. Click the Sign In button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 5. Verify that the email-required error message is displayed
    const errorMessage = page.locator('.errorMessage');
    await expect(errorMessage).toContainText('Email is required');
  });

  test('Test Case 4: Login with Invalid Credentials', async ({ page }) => {
    // 2. Enter email
    await page.getByPlaceholder('Enter Email').fill('sibi@gmail.com');
    // 3. Enter password
    await page.getByPlaceholder('Enter Password').fill('sibi@gmail.com');
    // 4. Click the Sign In button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 5. Verify that mismatch error message is displayed
    const errorMessage = page.locator('.errorMessage');
    await expect(errorMessage).toContainText( "USER Email Doesn't Exist");
  });

});