import { expect, test } from "@playwright/test";

test("skip link is the first stop and moves focus into main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Przejdź do treści" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  const box = await skip.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("navigating from the keyboard moves focus to the new h1 and announces the title", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("navigation", { name: "Główna" }).getByRole("link", { name: "Prawo" });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/prawo");
  await expect(page.getByRole("heading", { level: 1, name: "Prawo" })).toBeFocused();
  await expect(page.locator("[aria-live=polite]")).toHaveText("Prawo · a11y playground");
  await expect(link).toHaveAttribute("aria-current", "page");
});

test("theme toggle works from the keyboard and survives a reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Tryb ciemny" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
});

test("criteria filters work from the keyboard, keep focus and survive a reload", async ({ page }) => {
  await page.goto("/kryteria");
  const status = page.getByRole("status");
  await expect(status).toHaveText("Pokazuję 86 z 86 kryteriów WCAG 2.2");

  const version21 = page.getByRole("radio", { name: "2.1" });
  await version21.focus();
  await page.keyboard.press("Space");
  await expect(status).toHaveText("Pokazuję 78 z 78 kryteriów WCAG 2.1");
  await expect(version21).toBeFocused();

  const aaa = page.getByRole("checkbox", { name: "AAA" });
  await aaa.focus();
  await page.keyboard.press("Space");
  await expect(status).toHaveText("Pokazuję 50 z 78 kryteriów WCAG 2.1");
  await expect(aaa).toBeFocused();

  await page.reload();
  await expect(status).toHaveText("Pokazuję 50 z 78 kryteriów WCAG 2.1");
  await expect(page.getByRole("link", { name: /^4\.1\.1 Poprawność kodu/ })).toBeVisible();
});
