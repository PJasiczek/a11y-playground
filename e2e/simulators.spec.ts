import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { brokenExamples, tags } from "./axe";

/**
 * Sends the message the example page sends to its frames. A demo opened on its own is its own
 * parent, so it can be driven the same way.
 */
async function simulate(page: Page, simulation: string | null) {
  await page.evaluate((value) => {
    window.postMessage({ a11ySimulation: value }, "*");
  }, simulation);
}

test.describe("demo documents", () => {
  test("take a simulation and drop it", async ({ page }) => {
    await page.goto("/demo/formularz-z-bledami/bad");
    await simulate(page, "deuteranopia");
    await expect(page.locator("html")).toHaveAttribute("data-symulacja", "deuteranopia");
    await simulate(page, null);
    await expect(page.locator("html")).not.toHaveAttribute("data-symulacja");
  });

  test("in keyboard mode a mouse click does nothing and shows the notice", async ({ page }) => {
    await page.goto("/demo/ikona-jako-przycisk/bad");
    await simulate(page, "klawiatura");
    await expect(page.locator("html")).toHaveAttribute("data-symulacja", "klawiatura");
    await page.getByText("×").click();
    await expect(page.getByText("Zapisano zmiany w profilu.")).toBeVisible();
    await expect(page.locator(".a11y-sim-notice")).toBeVisible();
  });

  test("in keyboard mode Enter still works and every stop gets a number", async ({ page }) => {
    await page.goto("/demo/ikona-jako-przycisk/good");
    await simulate(page, "klawiatura");
    await expect(page.locator("html")).toHaveAttribute("data-symulacja", "klawiatura");
    await page.keyboard.press("Tab");
    await expect(page.locator(".a11y-sim-badge")).toHaveText("1");
    const close = page.getByRole("button", { name: "Zamknij komunikat" });
    await close.click();
    await expect(page.getByText("Zapisano zmiany w profilu.")).toBeVisible();
    await expect(close).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Zapisano zmiany w profilu.")).toBeHidden();
  });
});

test("a card on /symulatory leads to its section, and the section into an example", async ({ page }) => {
  await page.goto("/symulatory");
  await page.getByRole("link", { name: "Tylko klawiatura" }).click();
  await expect(page).toHaveURL(/#klawiatura$/);
  await page.getByRole("region", { name: "Tylko klawiatura" }).getByRole("link", { name: "Okno modalne i fokus" }).click();
  await expect(page).toHaveURL(/\/praktyka\/okno-modalne-i-fokus\?symulacja=klawiatura$/);
  await expect(page.getByRole("radio", { name: /^Tylko klawiatura/ })).toBeChecked();
});

test.describe("the picker on an example page", () => {
  test("works from the keyboard, lands in the URL and survives a reload", async ({ page }) => {
    await page.goto("/praktyka/formularz-z-bledami");
    await page.getByRole("radio", { name: /^Bez symulacji/ }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(page).toHaveURL(/\?symulacja=deuteranopia$/);
    await expect(page.getByRole("heading", { name: "Co pokazuje ta symulacja" })).toBeVisible();
    // The example's own note, not the general description of colour vision.
    await expect(page.getByText(/^Wpisz adres bez małpy i wyślij formularz\. W wersji zepsutej czerwona ramka/)).toBeVisible();
    await expect(page.frameLocator('iframe[data-variant="bad"]').locator("html")).toHaveAttribute("data-symulacja", "deuteranopia");
    await expect(page.frameLocator('iframe[data-variant="good"]').locator("html")).toHaveAttribute("data-symulacja", "deuteranopia");
    await page.reload();
    await expect(page.getByRole("radio", { name: /^Deuteranopia/ })).toBeChecked();
    await expect(page.frameLocator('iframe[data-variant="bad"]').locator("html")).toHaveAttribute("data-symulacja", "deuteranopia");
  });

  test("keyboard mode lists focus stops and counts blocked clicks", async ({ page }) => {
    await page.goto("/praktyka/ikona-jako-przycisk?symulacja=klawiatura");
    const good = page.frameLocator('iframe[data-variant="good"]');
    await expect(good.locator("html")).toHaveAttribute("data-symulacja", "klawiatura");
    await good.getByRole("button", { name: "Zamknij komunikat" }).focus();
    const goodPane = page.getByRole("region", { name: "Poprawne" });
    await expect(goodPane.getByRole("listitem")).toHaveText(["Zamknij komunikat (przycisk)"]);

    const bad = page.frameLocator('iframe[data-variant="bad"]');
    await expect(bad.locator("html")).toHaveAttribute("data-symulacja", "klawiatura");
    await bad.getByText("×").click();
    await expect(page.getByRole("region", { name: "Zepsute" }).getByText("Zablokowane kliknięcia: 1")).toBeVisible();
  });

  test("the screen reader table lines up both variants and marks the difference", async ({ page }) => {
    await page.goto("/praktyka/ikona-jako-przycisk?symulacja=czytnik");
    const reading = page.getByRole("table", { name: "Czytanie po kolei" });
    const second = reading.getByRole("row", { name: /^2 \(różni się\)/ });
    await expect(second).toContainText("tekst, nie przycisk");
    await expect(second).toContainText("Zamknij komunikat, przycisk");
    await expect(page.getByRole("table", { name: "Kolejność Tab" }).getByRole("row", { name: /^1 \(różni się\)/ })).toContainText("nic");
  });

  test("at 320 pixels the fixed width example overflows and its fix fits", async ({ page }) => {
    await page.goto("/praktyka/sztywna-szerokosc?symulacja=320px");
    await expect(page.getByRole("region", { name: "Zepsute" }).getByText("Nie mieści się.")).toBeVisible();
    await expect(page.getByRole("region", { name: "Poprawne" }).getByText("Mieści się.")).toBeVisible();
  });
});

for (const simulation of ["deuteranopia", "slabe-widzenie", "klawiatura", "czytnik", "320px", "tekst-200"]) {
  test(`an example page with ${simulation} has no axe violations`, async ({ page }) => {
    await page.goto(`/praktyka/formularz-z-bledami?symulacja=${simulation}`);
    await expect(page.frameLocator('iframe[data-variant="good"]').locator("html")).toHaveAttribute("data-symulacja", simulation);
    const { violations } = await new AxeBuilder({ page }).withTags(tags).exclude(brokenExamples).analyze();
    expect(violations).toEqual([]);
  });
}
