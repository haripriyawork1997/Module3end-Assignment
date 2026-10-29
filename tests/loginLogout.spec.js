const { test, expect } = require('@playwright/test');

test('SauceDemo Login and Logout Verification', async ({ page }) => {
  // 1. Navigate to the SauceDemo login page
  await page.goto('https://www.saucedemo.com/v1/index.html');

  // 2. Enter login credentials
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  // 3. Click the Login button
  await page.locator('#login-button').click();

  // 4 & 5. Verify successful login and inventory page URL redirection
  await expect(page).toHaveURL(/.*inventory\.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 6. Click the menu button (hamburger menu) on the left side
  await page.locator('.bm-burger-button button').click();

  // 7. Click the Logout option
  // Ensure the menu transition finishes and the logout link is visible/clickable
  const logoutLink = page.locator('#logout_sidebar_link');
  await expect(logoutLink).toBeVisible();
  await logoutLink.click();

  // 8 & 9. Verify redirection back to the login page and URL containing index.html
  await expect(page).toHaveURL( "https://www.saucedemo.com/");

  // 10. Verify that the username field, password field, and Login button are visible after logout
  await expect(page.locator('#user-name')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.locator('#login-button')).toBeVisible();
});