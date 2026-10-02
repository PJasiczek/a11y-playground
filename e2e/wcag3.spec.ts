import { expect, test } from "@playwright/test";

// Phase 8 promise: every WCAG 3.0 page says it describes a dated Working Draft, above the heading.
test("/wcag-3 shows the working draft badge and its date above the heading", async ({ page }) => {
  await page.goto("/wcag-3");
  const badge = page.getByText(/^\W*wersja robocza W3C$/);
  await expect(badge).toBeVisible();
  await expect(page.getByRole("link", { name: "10.09.2026" })).toBeVisible();
  const [badgeBox, headingBox] = [await badge.boundingBox(), await page.getByRole("heading", { level: 1 }).boundingBox()];
  expect(badgeBox?.y).toBeLessThan(headingBox?.y ?? 0);
});

test("the mapping filter works from the keyboard and keeps the pick in the URL", async ({ page }) => {
  await page.goto("/wcag-3");
  const status = page.getByRole("status");
  const before = (await status.textContent()) ?? "";
  const all = page.getByRole("radio", { name: "Wszystkie" });
  await all.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const onlyNew = page.getByRole("radio", { name: "Tylko nowe w 3.0" });
  await expect(onlyNew).toBeChecked();
  await expect(onlyNew).toBeFocused();
  await expect(page).toHaveURL(/pokaz=nowe/);
  await expect(page.locator("#w3-2-1-2")).toBeVisible();
  await expect(page.locator("#w3-2-1-1")).toHaveCount(0);
  await expect(status).not.toHaveText(before);
  await page.reload();
  await expect(page.getByRole("radio", { name: "Tylko nowe w 3.0" })).toBeChecked();
});
