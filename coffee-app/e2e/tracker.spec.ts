// Tests that act like a real user in a real browser.
import { expect, test, type Page } from "@playwright/test";

async function addPurchase(page: Page, item: string, price: string) {
  await page.getByTestId("item-input").fill(item);
  await page.getByTestId("price-input").fill(price);
  await page.getByTestId("add-button").click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("starts empty", async ({ page }) => {
  await expect(page.getByTestId("total")).toHaveText("$0.00");
  await expect(page.getByText("No purchases yet")).toBeVisible();
});

test("adding purchases updates the totals", async ({ page }) => {
  await addPurchase(page, "Latte", "5.50");
  await addPurchase(page, "Muffin", "4.50");
  await expect(page.getByTestId("total")).toHaveText("$10.00");
  await expect(page.getByTestId("remaining")).toHaveText("$20.00");
  await expect(page.getByTestId("count")).toHaveText("2");
  await expect(page.getByTestId("purchase-row")).toHaveCount(2);
});

test("deleting a purchase removes it", async ({ page }) => {
  await addPurchase(page, "Latte", "5.50");
  await addPurchase(page, "Muffin", "4.50");
  await page.getByRole("button", { name: "Delete Latte" }).click();
  await expect(page.getByTestId("purchase-row")).toHaveCount(1);
  await expect(page.getByTestId("total")).toHaveText("$4.50");
});

test("going over budget shows a negative amount", async ({ page }) => {
  await page.getByTestId("budget-input").fill("5");
  await addPurchase(page, "Latte", "5.50");
  await expect(page.getByTestId("remaining")).toHaveText("-$0.50");
});

test("bad input shows an error and adds nothing", async ({ page }) => {
  await addPurchase(page, "", "5");
  await expect(page.getByTestId("error")).toHaveText("Enter what you bought.");
  await addPurchase(page, "Latte", "abc");
  await expect(page.getByTestId("error")).toHaveText("Enter a price as a number.");
  await expect(page.getByTestId("purchase-row")).toHaveCount(0);
});
