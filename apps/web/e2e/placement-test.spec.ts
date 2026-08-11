import { expect, test } from "@playwright/test";

test("adaptive diagnosis calculates and saves a CEFR level", async ({ page }) => {
  await page.goto("/placement-test");
  for (let index = 0; index < 10; index += 1) {
    await expect(page.getByText(new RegExp(`Pytanie ${index + 1} z 10`))).toBeVisible();
    await page.locator(".choice").first().click();
  }
  await expect(page.getByText("Diagnoza zakończona")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Twój poziom to/ })).toBeVisible();
  await page.getByRole("button", { name: /Zapisz poziom/ }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});
