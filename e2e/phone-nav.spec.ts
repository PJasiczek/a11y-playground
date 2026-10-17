import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { tags } from "./axe";

test.use({ viewport: { width: 390, height: 844 } });

const nav = (page: Page) => page.getByRole("navigation", { name: "Główna" });

test("on a phone the main navigation is docked to the bottom edge", async ({ page }) => {
  await page.goto("/kryteria");
  const bar = await nav(page).boundingBox();
  expect(bar && bar.y + bar.height).toBe(844);
  await expect(nav(page).getByRole("link", { name: "Kryteria" })).toHaveAttribute("aria-current", "page");
  // "Struktura strony" sits above the bar, not on it.
  const tool = await page.getByRole("button", { name: "Struktura strony" }).boundingBox();
  expect(tool && bar && tool.y + tool.height <= bar.y).toBe(true);
});

test("Więcej opens a sheet, Escape closes it and focus returns to the button", async ({ page }) => {
  await page.goto("/kryteria");
  const more = nav(page).getByRole("button", { name: "Więcej" });
  await more.focus();
  await page.keyboard.press("Enter");
  const sheet = page.getByRole("dialog", { name: "Więcej" });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Tryb ciemny" })).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(more).toBeFocused();
});

test("a link in the sheet navigates and closes it", async ({ page }) => {
  await page.goto("/kryteria");
  await nav(page).getByRole("button", { name: "Więcej" }).click();
  await page.getByRole("dialog", { name: "Więcej" }).getByRole("link", { name: "Prawo" }).click();
  await expect(page).toHaveURL("/prawo");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1, name: "Prawo" })).toBeFocused();
});

test("on a short screen the bar stays in the header instead of covering the page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 400 });
  await page.goto("/kryteria");
  const box = await nav(page).boundingBox();
  expect(box && box.y).toBeLessThan(120);
  await page.mouse.wheel(0, 2000);
  await expect(nav(page)).not.toBeInViewport();
});
