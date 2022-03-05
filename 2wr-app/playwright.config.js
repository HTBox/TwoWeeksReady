// playwright.config.js
// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    timeout: 120 * 1000,
    webServer: {
        command: 'npm run serve',
        port: 8080,
        timeout: 120 * 1000,
    },
    reporter: process.env.CI ? 'github' : 'list',
};
module.exports = config;