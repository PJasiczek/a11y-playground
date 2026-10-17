import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { tags } from "./axe";

// Fresh storage: no choice made yet. gtag.js is stubbed, and every request for it is counted.
test.use({ storageState: { cookies: [], origins: [] } });

async function stubGtag(page: Page) {
  const requests: string[] = [];
  await page.route("https://www.googletagmanager.com/**", (route) => {
    requests.push(route.request().url());
    return route.fulfill({ contentType: "text/javascript", body: "" });
  });
  return requests;
}

const banner = (page: Page) => page.getByRole("region", { name: "Statystyki odwiedzin" });

test("nothing loads before consent, and the banner passes axe", async ({ page }) => {
  const requests = await stubGtag(page);
  await page.goto("/");
  await expect(banner(page)).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).withTags(tags).include("section[aria-labelledby=zgoda-tytul]").analyze();
  expect(violations).toEqual([]);
  await page.waitForLoadState("networkidle");
  expect(requests).toEqual([]);
});

test("agreeing loads GA, closes the banner and moves focus to main", async ({ page }) => {
  const requests = await stubGtag(page);
  await page.goto("/");
  await banner(page).getByRole("button", { name: "Zgadzam się" }).click();
  await expect(banner(page)).toBeHidden();
  await expect(page.locator("main")).toBeFocused();
  await expect.poll(() => requests).toEqual(["https://www.googletagmanager.com/gtag/js?id=G-TEST000000"]);

  // The choice survives a reload, and GA comes back with it.
  await page.reload();
  await expect(page.getByRole("button", { name: "Ustawienia cookies (zgoda)" })).toBeVisible();
  await expect(banner(page)).toBeHidden();
  await expect.poll(() => requests.length).toBe(2);
});

test("consent can be withdrawn from the footer, which deletes the GA cookies", async ({ page, context }) => {
  await stubGtag(page);
  await page.goto("/");
  await banner(page).getByRole("button", { name: "Zgadzam się" }).click();
  await context.addCookies([{ name: "_ga", value: "GA1.1.1.1", url: page.url() }]);

  const settings = page.getByRole("button", { name: "Ustawienia cookies (zgoda)" });
  await settings.focus();
  await page.keyboard.press("Enter");
  await expect(banner(page)).toBeFocused();
  await banner(page).getByRole("button", { name: "Odrzuć" }).click();

  await expect(page.getByRole("button", { name: "Ustawienia cookies (odrzucone)" })).toBeFocused();
  expect((await context.cookies()).map((cookie) => cookie.name)).not.toContain("_ga");
});

test("focus scrolled into view stops above the banner (2.4.11)", async ({ page }) => {
  await stubGtag(page);
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/kryteria");
  const top = await banner(page).evaluate((element) => element.getBoundingClientRect().top);
  // Links far below the fold: Tab onto each one scrolls it into view from below.
  const links = page.locator("main a[href^='/kryteria/']");
  for (const index of [30, 31, 60]) {
    await links.nth(index - 1).evaluate((link: HTMLElement) => {
      link.focus({ preventScroll: true });
    });
    await page.keyboard.press("Tab");
    await expect(links.nth(index)).toBeFocused();
    const box = await links.nth(index).boundingBox();
    expect(box && box.y + box.height).toBeLessThanOrEqual(top);
  }
});
