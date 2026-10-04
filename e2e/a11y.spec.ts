import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { brokenExamples, tags } from "./axe";

// Routes scanned by axe. Grows with the app; representative pages, not every criterion page.
const routes = [
  "/",
  "/kryteria",
  "/kryteria/1.4.3",
  "/kryteria/1.4.6",
  "/kryteria/2.4.11",
  "/kryteria/4.1.1",
  "/wcag-3",
  "/wcag-3?pokaz=nowe",
  "/prawo",
  "/prawo/ustawa-2019-848",
  "/prawo/ustawa-2019-848/art-5",
  "/prawo/ustawa-2019-848/zal",
  "/prawo/ustawa-2024-731/art-20",
  "/prawo/en-301-549",
  "/mapowanie",
  "/praktyka",
  "/praktyka/ikona-jako-przycisk",
  "/praktyka/wzorce",
  "/praktyka/wzorce/rozwin-zwin",
  "/symulatory",
  "/sciezki",
  "/sciezki/programista",
  "/sciezki/programista/klawiatura-i-fokus",
  "/sciezki/programista/punkty-orientacyjne",
  "/slownik",
  "/szukaj",
];

for (const route of routes) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${route} has no axe violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(route);
      const { violations } = await new AxeBuilder({ page }).withTags(tags).exclude(brokenExamples).analyze();
      expect(violations).toEqual([]);
    });
  }

  // 2.3.3 Animation from Interactions, claimed in src/content/app-meets.ts: the interface itself
  // never animates. Example frames are separate documents and do not count here.
  test(`${route} runs no animations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  });

  // 2.5.5 Target Size (Enhanced), which we opt into. Inline links in running text are exempt,
  // and so is the skip link while it is visually hidden (keyboard.spec.ts checks it on focus).
  test(`${route} has 44px targets`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const tooSmall = await page
      .locator("a, button, input, select, summary")
      .evaluateAll((elements) =>
        elements
          .filter((el) => !el.closest("p") && !el.matches(".sr-only") && el.getClientRects().length > 0)
          .map((el) => {
            // A link stretched with an absolute ::after is as big as its positioned card, and a
            // radio or checkbox is as big as the label that wraps it: both activate the control.
            const stretched = getComputedStyle(el, "::after").position === "absolute";
            const target = stretched && el instanceof HTMLElement ? (el.offsetParent ?? el) : (el.closest("label") ?? el);
            const { width, height } = target.getBoundingClientRect();
            return { text: el.textContent.trim(), width, height };
          })
          .filter(({ width, height }) => width < 44 || height < 44),
      );
    expect(tooSmall).toEqual([]);
  });
}

test("normative text opens from the keyboard and has no axe violations", async ({ page }) => {
  await page.goto("/kryteria/1.4.3");
  const summary = page.getByText("Rozwiń dosłowne brzmienie kryterium 1.4.3");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Logotyp", { exact: true })).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).withTags(tags).exclude(brokenExamples).analyze();
  expect(violations).toEqual([]);
});

for (const [query, label] of [
  ["kontrast", "with results"],
  ["qqqzzz", "without results"],
] as const) {
  test(`/szukaj ${label} has no axe violations`, async ({ page }) => {
    await page.goto(`/szukaj?q=${query}`);
    await expect(page.getByRole("status").filter({ hasText: query })).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).withTags(tags).exclude(brokenExamples).analyze();
    expect(violations).toEqual([]);
  });
}
