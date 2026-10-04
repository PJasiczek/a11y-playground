import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { brokenExamples, tags } from "./axe";

test.describe("Struktura strony", () => {
  test("outlines the page, lists it, moves focus and survives a reload", async ({ page }) => {
    await page.goto("/kryteria/1.4.3");
    await page.getByRole("button", { name: /^Struktura strony/ }).click();
    const panel = page.locator("#struktura-panel");
    const landmarks = panel.getByRole("button", { name: "Punkty orientacyjne" });
    await landmarks.click();
    await expect(landmarks).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("header").first()).toHaveAttribute("data-a11y-landmark", "baner");
    await expect(page.getByRole("navigation", { name: "Główna" })).toHaveAttribute("data-a11y-landmark", "nawigacja: Główna");
    await expect(panel.getByText("Brak stopki", { exact: false })).toBeVisible();

    const { violations } = await new AxeBuilder({ page }).withTags(tags).exclude(brokenExamples).analyze();
    expect(violations).toEqual([]);

    await panel.getByRole("button", { name: "nawigacja Okruszki" }).click();
    await expect(page.getByRole("navigation", { name: "Okruszki" })).toBeFocused();
    await expect(panel).toBeHidden();

    await page.reload();
    await expect(page.getByRole("navigation", { name: "Główna" })).toHaveAttribute("data-a11y-landmark", "nawigacja: Główna");
  });

  test("outlines headings and takes every outline off when switched off", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Struktura strony/ }).click();
    const headings = page.locator("#struktura-panel").getByRole("button", { name: "Nagłówki" });
    await headings.click();
    await expect(page.locator("main h1")).toHaveAttribute("data-a11y-heading", "H1");
    await headings.click();
    await expect(page.locator("[data-a11y-heading], [data-a11y-landmark]")).toHaveCount(0);
    await expect(page.locator("#a11y-structure-styles")).toHaveCount(0);
  });
});
