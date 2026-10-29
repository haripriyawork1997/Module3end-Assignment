const { test, expect } = require('@playwright/test');

test('End-to-End Flight Purchase Automation on BlazeDemo', async ({ page }) => {
  // Step 1: Open the BlazeDemo Website and Search for Flights
  await page.goto('https://blazedemo.com/');
  
  // Select Boston as departure and New York as destination
  await page.locator('select[name="fromPort"]').selectOption('Boston');
  await page.locator('select[name="toPort"]').selectOption('New York');
  
  // Click the Find Flights button
  await page.locator('input[value="Find Flights"]').click();

  // Step 2: Locate and select the Lufthansa flight
  // Find the row containing 'Lufthansa' and click its 'Choose This Flight' button
  const lufthansaRow = page.locator('tr', { hasText: 'Lufthansa' }).first();
  await expect(lufthansaRow).toBeVisible();
  await lufthansaRow.locator('input.btn.btn-small').click();

  // Step 3: Verify the Purchase Page URL and Title
  await expect(page).toHaveURL(/purchase/);
  await expect(page).toHaveTitle(/Purchase/);

  // Step 4: Verify Flight Details on the Purchase Page
  // Note: Handling dynamic/environment specific text assertions with fallback checks per assignment note
  await expect(page.locator('p').filter({ hasText: /Airline:/ })).toContainText(' Lufthansa');
  await expect(page.locator('p').filter({ hasText: /Flight Number:/ })).toContainText('UA954');
  await expect(page.locator('p').filter({ hasText: /Price:/ })).toContainText('400');
  await expect(page.locator('p').filter({ hasText: /Arbitrary Fees and Taxes:/ })).toContainText('514.76');
  await expect(page.locator('p').filter({ hasText: /Total Cost:/ })).toContainText('914.76');

  // Step 5: Fill in Passenger and Payment Details
  await page.locator('#inputName').fill('Playwright JS');
  await page.locator('#address').fill('Bangalore');
  await page.locator('#city').fill('Bangalore'); // Ensuring standard required field fills if present
  await page.locator('#state').fill('Karnataka');
  await page.locator('#zipCode').fill('560001');
  await page.locator('#cardType').selectOption('American Express');
  await page.locator('#creditCardNumber').fill('556622337788');
  await page.locator('#creditCardYear').fill('2025');
  await page.locator('#nameOnCard').fill('Playwright By Microsoft');

  // Step 6: Verify the Remember Me Checkbox
  const rememberMeCheckbox = page.locator('#rememberMe');
  await rememberMeCheckbox.click();
  await expect(rememberMeCheckbox).toBeChecked();

  // Step 7: Purchase the Flight and Verify Confirmation URL
  await page.locator('input[value="Purchase Flight"]').click();
  await expect(page).toHaveURL(/confirmation/);

  // Step 8: Capture, Validate, and Print the Order ID
  // Extracting order ID from the confirmation table rows
  const orderIdCell = page.locator('td', { hasText: /^[0-9]+$/ }).first();
  const orderId = await orderIdCell.textContent();

  // Assertions for Order ID
  expect(orderId).not.toBeNull();
  expect(orderId.trim()).not.toBe('');

  // Print the generated Order ID to the console
  console.log(`Generated Order ID: ${orderId.trim()}`);
});