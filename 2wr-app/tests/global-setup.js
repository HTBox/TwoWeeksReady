// global-setup.js
const { chromium, expect } = require("@playwright/test");

module.exports = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:8080/");

  // Save not signed-in state to 'newuser-storageState.json'.
  await page
    .context()
    .storageState({ path: "./tests/_storagestate/newuser-storageState.json" });

  await page.getByTestId("welcome-next-button").click();
  await expect(
    page.getByRole("heading", { name: "You and earthquake risk" })
  ).toBeVisible();
  await page.getByTestId("welcome-next-button").click();
  await expect(
    page.getByRole("heading", { name: "Let's get started!" })
  ).toBeVisible();
  await page.getByTestId("welcome-next-button").click();

  await page
    .getByLabel("Email address")
    .fill(process.env.TWO_WEEKS_READY_E2E_TEST_USERNAME);
  await page
    .getByLabel("Password")
    .fill(process.env.TWO_WEEKS_READY_E2E_TEST_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ url: "http://localhost:8080/prepare" }),
    page.locator('button[name="action"]').click()
  ]);

  // Save signed-in state to 'storageState.json'.
  await page
    .context()
    .storageState({ path: "./tests/_storagestate/storageState.json" });

  // TODO: Add a environment variable to allow for optional seeding of data by calling admin APIs
  // const token = await page.evaluate(async () =>await document.getElementById("app").__vue__.$auth.getTokenSilently());
  // const response = await page.request.post("http://localhost:7071/api/hazardinfo-create", {
  //   data: {
  //     name: "Earthquake",
  //     beforeSafetyDetails: "Practice how to drop, cover, and hold on"
  //   },
  //   headers: {
  //     'Authorization': `Bearer  ${token}`,
  //   },
  // });
  // expect(response.ok()).toBeTruthy();
  await browser.close();
};
