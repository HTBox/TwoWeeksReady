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
    use: {
        screenshot: 'only-on-failure',
    }
};
module.exports = config;