import { expect, test } from "@playwright/test";

test("Navigate to Hazard Info shows Earthquake Harzard info", async ({
  page
}) => {
  await page.goto("http://localhost:8080/");

  await page
    .getByRole("link", {
      name: "Learn Your Hazards Learn all about common hazards."
    })
    .click();

  await page.getByText("Earthquake").click();
  await page.getByRole("button", { name: "Before" }).click();
  await expect(
    page.getByText("Practice how to drop, cover, and hold on")
  ).toBeVisible();
  await page
    .getByRole("banner")
    .getByRole("button")
    .click();
  await expect(
    page.getByText("Practice how to drop, cover, and hold on")
  ).not.toBeVisible();
});
