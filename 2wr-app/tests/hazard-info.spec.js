import { expect, test } from "@playwright/test";

test("Navigate to Hazard Info shows Earthquake Harzard info", async ({
  page
}) => {
  await page.goto("./");

  await page.route("**/api/hazardinfo-list", route =>
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        {
          id: "e0dfdb93-016b-4899-a13a-879f5f35c365",
          name: "Earthquake",
          description:
            "An earthquake is a sudden, rapid shaking of the ground. Earthquakes can cause injuries and property damage by causing heavy items to fall, windows to break, and damage to buildings, roads and other structures.",
          iconUrl: "/images/hazards/earthquake.png",
          mediaUrl: "/images/hazards/earthquake-description.png",
          externalLinks: [
            "https://mil.wa.gov/earthquake",
            "https://mil.wa.gov/alerts",
            "https://mil.wa.gov/shakeout",
            "https://shakeout.org/washington"
          ],
          beforeSafetyDetails:
            '<p><span style="font-size: 14pt;"><strong>Practice how to drop, cover, and hold on</strong> with your family and co-workers.</span></p>\n<p><span style="font-size: 14pt;">Check if your Emergency Alerts are turned on for your mobile phone: https://mil.wa.gov/alerts.</span></p>\n<p><span style="font-size: 14pt;"><strong>Secure heavy items</strong> like bookshelves, televisions, refrigerators, and wall hangings to the wall or another fixed structure.</span></p>\n<p><span style="font-size: 14pt;">Consider <strong>purchasing earthquake insurance</strong>. A typical homeowner\'s insurance policy does not cover earthquake damage.</span></p>\n<p><span style="font-size: 14pt;"><strong>Complete home retrofitting projects</strong> to fix structural issues and minimize damage during an earthquake.</span></p>\n<p><span style="font-size: 14pt;"><strong>Store two weeks of supplies at home</strong>. Keep in mind each person\'s specific needs -- don\'t forget pets!</span></p>',
          duringSafetyDetails:
            "<p><em>During</em> Be <strong>Careful</strong></p>\n<p><strong>More instructions</strong></p>",
          afterSafetyDetails: "<p><strong><em>After</em> </strong>Get Help</p>"
        },
        {
          id: "961d3750-63f8-44a4-9598-f59996d8b60d",
          name: "Volcano",
          description: "Volcanos should be avoided. They are very dangerous",
          iconUrl: "/images/hazards/volcano.png",
          mediaUrl: "/images/hazards/volcano.png",
          externalLinks: null,
          beforeSafetyDetails:
            '<p>Hi there. This is a t<strong>hing I\'m testing</strong></p>\n<p><strong><img src="http://localhost:8080//images/hazards/volcano.png" alt="/images/hazards/volcano.png" width="148" height="148" /></strong></p>',
          duringSafetyDetails: null,
          afterSafetyDetails: null
        }
      ])
    })
  );

  await page
    .getByRole("link", {
      name: "Learn Your Hazards Learn all about common hazards."
    })
    .click();

  await page.route(
    "**/api/hazardinfo-by-id/{e0dfdb93-016b-4899-a13a-879f5f35c365}",
    route =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: "e0dfdb93-016b-4899-a13a-879f5f35c365",
          name: "Earthquake",
          description:
            "An earthquake is a sudden, rapid shaking of the ground. Earthquakes can cause injuries and property damage by causing heavy items to fall, windows to break, and damage to buildings, roads and other structures.",
          iconUrl: "/images/hazards/earthquake.png",
          mediaUrl: "/images/hazards/earthquake-description.png",
          externalLinks: [
            "https://mil.wa.gov/earthquake",
            "https://mil.wa.gov/alerts",
            "https://mil.wa.gov/shakeout",
            "https://shakeout.org/washington"
          ],
          beforeSafetyDetails:
            '<p><span style="font-size: 14pt;"><strong>Practice how to drop, cover, and hold on</strong> with your family and co-workers.</span></p>\n<p><span style="font-size: 14pt;">Check if your Emergency Alerts are turned on for your mobile phone: https://mil.wa.gov/alerts.</span></p>\n<p><span style="font-size: 14pt;"><strong>Secure heavy items</strong> like bookshelves, televisions, refrigerators, and wall hangings to the wall or another fixed structure.</span></p>\n<p><span style="font-size: 14pt;">Consider <strong>purchasing earthquake insurance</strong>. A typical homeowner\'s insurance policy does not cover earthquake damage.</span></p>\n<p><span style="font-size: 14pt;"><strong>Complete home retrofitting projects</strong> to fix structural issues and minimize damage during an earthquake.</span></p>\n<p><span style="font-size: 14pt;"><strong>Store two weeks of supplies at home</strong>. Keep in mind each person\'s specific needs -- don\'t forget pets!</span></p>',
          duringSafetyDetails:
            "<p><em>During</em> Be <strong>Careful</strong></p>\n<p><strong>More instructions</strong></p>",
          afterSafetyDetails: "<p><strong><em>After</em> </strong>Get Help</p>"
        })
      })
  );

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
