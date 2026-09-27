import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Routes scanned by axe. Grows with the app; representative pages, not every criterion page.
const routes = ["/"];

// wcag2aaa is included on purpose: we opt into 1.4.6 Contrast (Enhanced).
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa"];

for (const route of routes) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${route} has no axe violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(route);
      const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(violations).toEqual([]);
    });
  }

  // 2.5.5 Target Size (Enhanced), which we opt into. Inline links in running text are exempt,
  // and so is anything visually hidden with .sr-only.
  test(`${route} has 44px targets`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const tooSmall = await page
      .locator("a, button, input, select, summary")
      .evaluateAll((elements) =>
        elements
          .filter((el) => !el.closest("p") && !el.matches(".sr-only") && el.getClientRects().length > 0)
          .map((el) => {
            // A link stretched with an absolute ::after is as big as its positioned card.
            const stretched = getComputedStyle(el, "::after").position === "absolute";
            const target = stretched && el instanceof HTMLElement ? (el.offsetParent ?? el) : el;
            const { width, height } = target.getBoundingClientRect();
            return { text: el.textContent.trim(), width, height };
          })
          .filter(({ width, height }) => width < 44 || height < 44),
      );
    expect(tooSmall).toEqual([]);
  });
}
