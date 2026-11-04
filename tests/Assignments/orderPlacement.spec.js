const { test, expect } = require('@playwright/test');

test('Online Grocery Order Placement - Broccoli', async ({ page }) => {
  // 1. Application Launch and Product Selection
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

  // Locate the Broccoli product card and click 'ADD TO CART' (Note: site spelling is 'Brocolli')
  const broccoliProduct = page.locator('.product').filter({ hasText: 'Brocolli - 1 Kg' });
  await expect(broccoliProduct).toBeVisible();
  await broccoliProduct.locator('button', { hasText: 'ADD TO CART' }).click();

  // 2. Shopping Cart Navigation
  // Open the shopping cart dropdown/modal
  await page.locator('.cart-icon').click();

  // Verify that Broccoli is present in the cart preview
  const cartItemText = page.locator('.cart-item .product-name').first();
  await expect(cartItemText).toContainText('Brocolli - 1 Kg');

  // Proceed to the checkout page
  await page.locator('text=PROCEED TO CHECKOUT').click();

  // 3. Checkout and Order Submission
  // Verify we are on the cart/checkout review page and click 'Place Order'
  await page.locator('text=Place Order').click();

  // Select 'India' from the country dropdown using Playwright's selectOption method
  const countryDropdown = page.locator('select');
  await countryDropdown.selectOption('India');

  // Accept the terms and conditions checkbox
  await page.locator('.chkAgree').click();

  // Click Proceed to finalise the order
  await page.locator('button', { hasText: 'Proceed' }).click();

  // 4. Assertions and Confirmation
  // Locate the confirmation message element
  const confirmationMessageLocator = page.locator("text=Thank you");
 
  await expect(confirmationMessageLocator).toBeVisible();
  
  const confirmationText = await confirmationMessageLocator.textContent();
  
  // 5. Console Output and Reliability
  console.log(`Order Confirmation Message: ${confirmationText.trim()}`);

  // Assert that the confirmation message contains the required success text
  expect(confirmationText).toContain("Thank you, your order has been placed successfully  You'll be redirected to Home page shortly!!");
});