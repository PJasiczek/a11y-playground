import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { type } from "arktype";
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { tags } from "./axe";

// Only the part of the frontmatter this test needs; the app validates the rest.
const Declared = type({ steps: type({ keys: "string[]" }).array() });

// Every folder in content/wzorce, with the keys of its exercise.
const patterns = readdirSync("content/wzorce").map((slug) => {
  const source = readFileSync(`content/wzorce/${slug}/index.md`, "utf8");
  return { slug, steps: Declared.assert(parse(source.split(/^---$/m)[1] ?? "")).steps };
});

// Key names as the exercise shows them, as Playwright presses them.
const playwrightKeys: Record<string, string> = { Spacja: "Space", Esc: "Escape", "↑": "ArrowUp", "↓": "ArrowDown", "←": "ArrowLeft", "→": "ArrowRight" };

for (const { slug, steps } of patterns) {
  test.describe(slug, () => {
    // The exercise is the keyboard walk: every step's text must come out of the live log.
    test("the exercise can be done from the keyboard", async ({ page }) => {
      test.skip(steps.length === 0, "no exercise");
      await page.goto(`/praktyka/wzorce/${slug}`);
      await page.waitForLoadState("networkidle");
      // The frame comes right after the keyboard-only toggle, so Tab from there enters it.
      await page.getByRole("checkbox", { name: "Tylko klawiatura" }).focus();
      for (const step of steps) {
        const [key = "Tab"] = step.keys;
        await page.keyboard.press(playwrightKeys[key] ?? key);
        await page.waitForTimeout(50);
      }
      await expect(page.getByRole("heading", { name: `Sprawdź sam: ${String(steps.length)} z ${String(steps.length)}` })).toBeVisible();
    });

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
