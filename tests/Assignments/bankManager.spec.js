const { test, expect } = require('@playwright/test');

test('GlobalSQA Bank Manager Customer Management Workflow', async ({ page }) => {
  // 1. Bank Manager Login: Open the application and click Bank Manager Login
  await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  
  // Click on Bank Manager Login button
  await page.getByRole('button', { name: 'Bank Manager Login' }).click();

  // Verify access to the manager dashboard by checking visible buttons
  const addCustomerBtn = page.getByRole('button', { name: 'Add Customer' });
  const openAccountBtn = page.getByRole('button', { name: 'Open Account' });
  const customersBtn = page.getByRole('button', { name: 'Customers' });

  await expect(addCustomerBtn).toBeVisible();
  await expect(openAccountBtn).toBeVisible();
  await expect(customersBtn).toBeVisible();
  console.log('Successfully logged in as Bank Manager and verified dashboard elements.');

  // 2. Add Customer: Navigate to Add Customer and enter details
  await addCustomerBtn.click();
  
  const firstName = 'John';
  const lastName = 'Smith_' + Date.now(); // Ensures unique last name for search/delete
  const postCode = '682001';

  await page.getByPlaceholder('First Name').fill(firstName);
  await page.getByPlaceholder('Last Name').fill(lastName);
  await page.getByPlaceholder('Post Code').fill(postCode);

  // 3. Submit the form, handle the browser alert, and print its message
  page.once('dialog', async dialog => {
    const alertMessage = dialog.message();
    console.log(`Alert Message Captured on Add Customer: ${alertMessage}`);
    expect(alertMessage).toContain('Customer added successfully');
    await dialog.accept();
  });

  // Submit form (Add Customer button inside the form)
  await page.locator('button[type="submit"]').filter({ hasText: 'Add Customer' }).click();

  // 4. Open Bank Account: Navigate to Open Account, select customer and currency, click Process
  await openAccountBtn.click();

  // Select customer from dropdown
  await page.locator('#userSelect').selectOption({ label: `${firstName} ${lastName}` });

  // Choose Dollar as currency
  await page.locator('#currency').selectOption('Dollar');

  // Handle alert for account creation
  page.once('dialog', async dialog => {
    const alertMessage = dialog.message();
    console.log(`Alert Message Captured on Open Account: ${alertMessage}`);
    expect(alertMessage).toContain('Account created successfully');
    await dialog.accept();
  });

  // Click Process button
  await page.getByRole('button', { name: 'Process' }).click();

  // 5. Search and Validate: Navigate to Customers, search by last name, verify record, print details
  await customersBtn.click();

  // Search by unique last name
  const searchBox = page.getByPlaceholder('Search Customer');
  await searchBox.fill(lastName);

  // Verify exactly one matching record is displayed in the table row
  const tableRow = page.locator('tbody tr');
  await expect(tableRow).toHaveCount(1);

  // Print customer details from the row
  const rowText = await tableRow.innerText();
  console.log(`Verified Customer Details: \n${rowText}`);
  expect(rowText).toContain(firstName);
  expect(rowText).toContain(lastName);
  expect(rowText).toContain(postCode);

  // 6. Delete and Verify: Delete the matching customer and verify no matching record remains
  const deleteButton = tableRow.getByRole('button', { name: 'Delete' });
  await deleteButton.click();

  // Clear search and search again or verify row count drops to 0 / text says no data
  await searchBox.fill('');
  await searchBox.fill(lastName);

  // Verify record no longer exists
  await expect(page.locator('tbody tr')).toHaveCount(0);
  console.log(`Deletion Confirmation: Customer '${firstName} ${lastName}' has been successfully deleted and verified.`);
});