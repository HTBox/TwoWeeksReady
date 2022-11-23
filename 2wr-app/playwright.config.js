// playwright.config.js
// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */

if (
  !process.env.TWO_WEEKS_READY_E2E_TEST_USERNAME ||
  !process.env.TWO_WEEKS_READY_E2E_TEST_PASSWORD
) {
  console.error(
    "TWO_WEEKS_READY_E2E_TEST_USERNAME and TWO_WEEKS_READY_E2E_TEST_PASSWORD environment variables must be set for end-to-end tests to run."
  );
  process.exit(-1);
}

const config = {
  timeout: 30000,
  webServer: {
    command: "npm run serve",
    url: "http://localhost:8080",
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  },
  globalSetup: require.resolve("./tests/global-setup"),
  use: {
    baseURL: "http://localhost:8080/",
    screenshot: "only-on-failure",
    recording: "retain-on-failure",
    trace: "retain-on-failure",
    // Tell all tests to load signed-in state from 'storageState.json'.
    storageState: "./tests/_storagestate/storageState.json"
  },
  reporter: [["list"], ["html", { output: "reports/report.html" }]]
};
module.exports = config;
