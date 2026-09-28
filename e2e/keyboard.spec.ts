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

test("a glossary preview opens from the keyboard, stays clear of its button and closes with Esc", async ({ page }) => {
  await page.goto("/kryteria/1.4.3");
  const tip = page.getByRole("button", { name: "Definicja: współczynnik kontrastu" });
  await tip.focus();
  await page.keyboard.press("Enter");
  await expect(tip).toHaveAttribute("aria-expanded", "true");
  const status = page.getByRole("status").filter({ hasText: "współczynnik kontrastu" });
  await expect(status).toContainText("Czarny na białym to 21 do 1");

  const bubble = status.locator("div").first();
  const [a, b] = [await tip.boundingBox(), await bubble.boundingBox()];
  expect(a && b && (b.y >= a.y + a.height || b.y + b.height <= a.y)).toBe(true);

  await page.keyboard.press("Escape");
  await expect(tip).toHaveAttribute("aria-expanded", "false");
  await expect(tip).toBeFocused();
  await expect(status).toHaveCount(0);
});

test("glossary terms link to their entry on /slownik", async ({ page }) => {
  await page.goto("/kryteria/1.4.3");
  await page.getByRole("link", { name: "współczynnik kontrastu" }).click();
  await expect(page).toHaveURL(/\/slownik#wspolczynnik-kontrastu$/);
  await expect(page.getByRole("heading", { level: 3, name: "współczynnik kontrastu" })).toBeInViewport();
});

test("the role filter works from the keyboard and explains what it hides", async ({ page }) => {
  await page.goto("/kryteria");
  const tester = page.getByRole("checkbox", { name: "tester" });
  await tester.focus();
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(/rola=/);
  await expect(page.getByText("Filtr ról pokazuje tylko kryteria z opisaną treścią.")).toBeVisible();
  await expect(page.getByRole("link", { name: /^2\.1\.1 Klawiatura/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^1\.2\.3 / })).toHaveCount(0);
  await expect(tester).toBeFocused();
});

test("search from the home page works from the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Szukaj w kryteriach, przykładach, przepisach i słowniku").fill("kontrast");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/szukaj\?q=kontrast/);
  await expect(page.getByRole("status").filter({ hasText: "dla „kontrast”" })).toBeVisible();
  await page.keyboard.press("Tab");
  const first = page.getByRole("link", { name: /^1\.4\.3 Kontrast \(minimum\)/ });
  await expect(first).toBeVisible();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/kryteria/1.4.3");
});
