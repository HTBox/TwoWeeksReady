const { text, expect, default: test, chromium } = require('@playwright/test');
const { injectAxe, checkA11y } = require("axe-playwright");

test.describe('Welcome page accessibility test', () => {
    test.beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
        await page.goto('/welcome/');
        await injectAxe(page);
    });

    test('Check Accessability', async () => {
        await checkA11y(page, null, {
            axeOptions: {

            },
            detailedReport: true,
            detailedReportOptions: {
                html: true
            }
        });
    });
});

test('Welcome page loads', async ({ page }) => {

    await page.goto('/');

    await expect(page).toHaveURL(/.*welcome/);

});