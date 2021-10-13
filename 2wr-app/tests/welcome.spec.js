const { text, expect, default: test } = require('@playwright/test');

test('Welcome page loads', async({ page }) => {
   
    await page.goto('/');

    await expect(page).toHaveURL(/.*welcome/);

});