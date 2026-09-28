import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { type } from "arktype";
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { tags } from "./axe";

// Only the part of the frontmatter this test needs; the app validates the rest.
const Declared = type({ bad: { "axe?": "string[]" } });

// Every folder in content/praktyka, with the axe rules its broken variant declares.
const examples = readdirSync("content/praktyka").map((slug) => {
  const source = readFileSync(`content/praktyka/${slug}/index.md`, "utf8");
  const { bad } = Declared.assert(parse(source.split(/^---$/m)[1] ?? ""));
  return { slug, declared: bad.axe ?? [] };
});

for (const { slug, declared } of examples) {
  test.describe(slug, () => {
    test("the broken fragment stays inside its sandboxed iframe", async ({ page }) => {
      await page.goto(`/praktyka/${slug}`);
      for (const start of await page.getByRole("button", { name: "Uruchom przykład" }).all()) await start.click();
      const frame = page.locator('iframe[data-variant="bad"]');
      await expect(frame).toHaveAttribute("sandbox", "allow-scripts");
      await expect(page.frameLocator('iframe[data-variant="bad"]').locator('[data-example-root="bad"]')).toHaveCount(1);
      // Nothing from either fragment is part of this page's own document.
      await expect(page.locator("[data-example-root]")).toHaveCount(0);
    });

    test("the fixed fragment passes axe on its own", async ({ page }) => {
      await page.goto(`/demo/${slug}/good`);
      const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(violations).toEqual([]);
    });

    test("the broken fragment fails the way its notes say", async ({ page }) => {
      await page.goto(`/demo/${slug}/bad`);
      const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(violations.map((v) => v.id)).toEqual(expect.arrayContaining(declared));
    });
  });
}
