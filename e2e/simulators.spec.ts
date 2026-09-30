import { expect, type Page, test } from "@playwright/test";

/**
 * Sends the message the example page sends to its frames. A demo opened on its own is its own
 * parent, so it can be driven the same way.
 */
async function simulate(page: Page, simulation: string | null) {
  await page.evaluate((value) => {
    window.postMessage({ a11ySimulation: value }, "*");
  }, simulation);
}

test.describe("demo documents", () => {
  test("take a simulation and drop it", async ({ page }) => {
    await page.goto("/demo/formularz-z-bledami/bad");
    await simulate(page, "deuteranopia");
    await expect(page.locator("html")).toHaveAttribute("data-symulacja", "deuteranopia");
    await simulate(page, null);
    await expect(page.locator("html")).not.toHaveAttribute("data-symulacja");
  });

  test("in keyboard mode a mouse click does nothing and shows the notice", async ({ page }) => {
    await page.goto("/demo/ikona-jako-przycisk/bad");
    await simulate(page, "klawiatura");
    await expect(page.locator("html")).toHaveAttribute("data-symulacja", "klawiatura");
    await page.getByText("×").click();
    await expect(page.getByText("Zapisano zmiany w profilu.")).toBeVisible();
    await expect(page.locator(".a11y-sim-notice")).toBeVisible();
  });

  test("in keyboard mode Enter still works and every stop gets a number", async ({ page }) => {
    await page.goto("/demo/ikona-jako-przycisk/good");
    await simulate(page, "klawiatura");
    await expect(page.locator("html")).toHaveAttribute("data-symulacja", "klawiatura");
    await page.keyboard.press("Tab");
    await expect(page.locator(".a11y-sim-badge")).toHaveText("1");
    const close = page.getByRole("button", { name: "Zamknij komunikat" });
    await close.click();
    await expect(page.getByText("Zapisano zmiany w profilu.")).toBeVisible();
    await expect(close).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Zapisano zmiany w profilu.")).toBeHidden();
  });
});
