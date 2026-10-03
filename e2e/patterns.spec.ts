import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readdirSync } from "node:fs";
import { tags } from "./axe";

// Every folder in content/wzorce.
const slugs = readdirSync("content/wzorce");

for (const slug of slugs) {
  test.describe(slug, () => {
    test("the pattern passes axe on its own", async ({ page }) => {
      await page.goto(`/demo/wzorce/${slug}`);
      const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(violations).toEqual([]);
    });

    // 2.5.5 Target Size (Enhanced), inside the frame too: patterns are teaching code. Links in
    // running text are exempt, as on the app's own pages.
    test("the pattern has 44px targets", async ({ page }) => {
      await page.goto(`/demo/wzorce/${slug}`);
      const tooSmall = await page
        .locator("a, button, input, select, summary")
        .evaluateAll((elements) =>
          elements
            .filter((el) => !el.closest("p") && el.getClientRects().length > 0)
            .map((el) => {
              const { width, height } = (el.closest("label") ?? el).getBoundingClientRect();
              return { text: el.textContent.trim(), width, height };
            })
            .filter(({ width, height }) => width < 44 || height < 44),
        );
      expect(tooSmall).toEqual([]);
    });
  });
}
