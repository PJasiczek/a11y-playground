import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { type } from "arktype";
import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";
import { brokenExamples, tags } from "./axe";

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
      // Examples with motion load only on request; start every one on the page.
      const start = page.getByRole("button", { name: "Uruchom przykład" });
      while ((await start.count()) > 0) await start.first().click();
      const frame = page.locator('iframe[data-variant="bad"]');
      await expect(frame).toHaveAttribute("sandbox", "allow-scripts allow-forms");
      await expect(page.frameLocator('iframe[data-variant="bad"]').locator('[data-example-root="bad"]')).toHaveCount(1);
      // Nothing from either fragment is part of this page's own document.
      await expect(page.locator("[data-example-root]")).toHaveCount(0);
    });

    test("the page passes axe with the broken iframe excluded", async ({ page }) => {
      await page.goto(`/praktyka/${slug}`);
      const { violations } = await new AxeBuilder({ page }).withTags(tags).exclude(brokenExamples).analyze();
      expect(violations).toEqual([]);
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

// Keyboard checks for the fixed variants that exist to show keyboard behaviour.
test("the fixed modal takes focus, closes with Esc and hands focus back", async ({ page }) => {
  await page.goto("/demo/okno-modalne-i-fokus/good");
  const open = page.getByRole("button", { name: "Usuń konto" });
  await open.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Usunąć konto?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Anuluj" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(open).toBeFocused();
});

test("the fixed list reorders from the keyboard and announces the new position", async ({ page }) => {
  await page.goto("/demo/przeciaganie-z-alternatywa/good");
  await page.getByRole("button", { name: "Przenieś Zadanie 1: raport w dół" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Zadanie 1: raport jest teraz na pozycji 2 z 3");
  await expect(page.getByRole("button", { name: "Przenieś Zadanie 1: raport w dół" })).toBeFocused();
});

test("the fixed form shows its error inside the sandboxed frame", async ({ page }) => {
  await page.goto("/praktyka/formularz-z-bledami");
  const frame = page.frameLocator('iframe[data-variant="good"]');
  await frame.getByRole("textbox", { name: "Adres e-mail" }).fill("jan.przyklad.pl");
  await frame.getByRole("button", { name: "Zapisz się" }).click();
  await expect(frame.getByText("Błąd: podaj adres z małpą")).toBeVisible();
});

test("the carousel loads nothing before the reader starts it", async ({ page }) => {
  await page.goto("/praktyka/karuzela-automatyczna");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Uruchom przykład" }).first().click();
  await expect(page.locator("iframe")).toHaveCount(1);
});
