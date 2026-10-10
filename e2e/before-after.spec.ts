import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { type } from "arktype";
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { tags } from "./axe";

// The whole-page demo: the KMW home page, broken and fixed, each in the whole window with the
// app's demo bar in front of it.

const fixed = "/demo/przed-i-po/po";

// Only the part of the frontmatter this test needs; the app validates the rest.
const Declared = type({ axe: "string[]" });
const declared = readdirSync("content/przed-i-po/problemy").flatMap((file) => {
  const source = readFileSync(`content/przed-i-po/problemy/${file}`, "utf8");
  return Declared.assert(parse(source.split(/^---$/m)[1] ?? "")).axe;
});

test("the broken page fails axe exactly the way its problems say", async ({ page }) => {
  await page.goto("/demo/przed-i-po/przed");
  const { violations } = await new AxeBuilder({ page }).withTags(tags).exclude("#demo-pasek").analyze();
  expect(violations.map((v) => v.id).toSorted()).toEqual([...new Set(declared)].toSorted());
});

test("the marked page puts a numbered link on every problem with a place", async ({ page }) => {
  await page.goto("/demo/przed-i-po/przed-znaczniki");
  const markers = page.locator("#demo-znaczniki a");
  // Four problems belong to the whole page and are listed in the bar instead.
  await expect(markers).toHaveCount(16);
  await expect(page.getByRole("list", { name: "Problemy całej strony" }).getByRole("link")).toHaveCount(4);
  await expect(page.getByRole("link", { name: "Problem 7: Podmenu otwiera się tylko pod myszą" })).toHaveAttribute(
    "href",
    "/praktyka/przed-i-po/7",
  );
  const { violations } = await new AxeBuilder({ page }).withTags(tags).include("#demo-pasek").include("#demo-znaczniki").analyze();
  expect(violations).toEqual([]);
});

/** The fixed page opens its disruption notice on arrival; most checks start after it is closed. */
async function openFixed(page: Page) {
  await page.goto(fixed);
  await page.getByRole("dialog", { name: "Utrudnienia w ruchu" }).getByRole("button", { name: "Zamknij" }).click();
}

test("the fixed page passes axe", async ({ page }) => {
  await page.goto(fixed);
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(violations).toEqual([]);
});

for (const view of ["przed", "po"]) {
  test(`the demo bar passes axe on the ${view} page`, async ({ page }) => {
    await page.goto(`/demo/przed-i-po/${view}`);
    const { violations } = await new AxeBuilder({ page }).withTags(tags).include("#demo-pasek").analyze();
    expect(violations).toEqual([]);
  });
}

test("the fixed disruption notice takes focus and closes with Esc", async ({ page }) => {
  await page.goto(fixed);
  const dialog = page.getByRole("dialog", { name: "Utrudnienia w ruchu" });
  await expect(dialog.getByRole("button", { name: "Zamknij" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  const reopen = page.getByRole("button", { name: "Szczegóły utrudnień" });
  await reopen.click();
  await page.keyboard.press("Escape");
  await expect(reopen).toBeFocused();
});

test("the fixed menu opens with Enter and closes with Esc", async ({ page }) => {
  await openFixed(page);
  const timetables = page.getByRole("button", { name: "Rozkłady" });
  await timetables.focus();
  await page.keyboard.press("Enter");
  await expect(timetables).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Tramwaje" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(timetables).toHaveAttribute("aria-expanded", "false");
  await expect(timetables).toBeFocused();
});

test("the fixed carousel stays still until asked", async ({ page }) => {
  await openFixed(page);
  const rotate = page.getByRole("button", { name: "Przewijaj samoczynnie" });
  await expect(rotate).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Następny komunikat" }).click();
  await expect(page.getByRole("heading", { name: "Nocą jeżdżą linie N1 i N2" })).toBeVisible();
});

test("a bad submit focuses the error summary, whose links reach the fields", async ({ page }) => {
  await openFixed(page);
  await page.getByRole("textbox", { name: "E-mail (wymagane)" }).fill("jan.przyklad.pl");
  await page.getByRole("button", { name: "Wyślij zgłoszenie" }).click();
  const summary = page.locator(".wynik");
  await expect(summary).toBeFocused();
  await expect(summary.getByRole("heading")).toHaveText("Popraw 5 pól");
  await summary.getByRole("link", { name: "E-mail: wpisz adres w formacie nazwa@domena.pl" }).click();
  const email = page.getByRole("textbox", { name: "E-mail (wymagane)" });
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription(/Wpisz adres w formacie nazwa@domena.pl/);
});

test("on the fixed page nothing covers the focused element", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await openFixed(page);
  for (let step = 0; step < 60; step += 1) {
    await page.keyboard.press("Tab");
    const covered = await page.evaluate(() => {
      const el = document.activeElement;
      if (!(el instanceof HTMLElement) || el === document.body) return null;
      const box = el.getBoundingClientRect();
      const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return top && !el.contains(top) && !top.contains(el) ? el.outerHTML.slice(0, 80) : null;
    });
    expect(covered).toBeNull();
  }
});

test("the fixed page fits 320 pixels without scrolling sideways", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await openFixed(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
