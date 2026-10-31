import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { tags } from "./axe";

for (const width of [320, 390, 768, 1024, 1280, 1440]) {
  test(`pastel playground fits ${String(width)}px and exposes every section`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('header input[type="search"], header a[href="/szukaj"]')).toHaveCount(0);
    await expect(page.getByRole("search", { name: "Szukaj na stronie głównej" })).toBeVisible();
    const heroTitle = await page.locator("#home-title").boundingBox();
    const heroLede = await page.locator(".hero-lede").boundingBox();
    if (!heroTitle || !heroLede) throw new Error("Missing hero copy");
    expect(heroLede.y - heroTitle.y - heroTitle.height).toBeGreaterThanOrEqual(20);
    await expect(page.locator(".hero-blocks a")).toHaveCount(6);
    expect(await page.locator(".playground-art").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    if (width <= 550) {
      await expect(page.getByRole("heading", { name: "Od czego zaczynamy?" })).toBeVisible();
      expect(await page.locator(".playground-art").evaluate((image: HTMLImageElement) => image.currentSrc)).toContain("playground-mobile.png");
      await expect(page.locator(".hero-mobile-cta")).toBeVisible();
    } else {
      await expect(page.locator(".mobile-playground-intro")).toBeHidden();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width >= 1000) {
      const alignment = await page.evaluate(() => {
        const main = document.querySelector("main");
        const brand = document.querySelector(".site-brand");
        const nav = document.querySelector(".desktop-nav");
        if (!main || !brand || !nav) throw new Error("Missing main navigation layout");
        return {
          left: main.getBoundingClientRect().left + parseFloat(getComputedStyle(main).paddingLeft),
          brandLeft: brand.getBoundingClientRect().left,
          navWidth: nav.getBoundingClientRect().width,
          contentWidth: main.getBoundingClientRect().width,
        };
      });
      expect(Math.abs(alignment.brandLeft - alignment.left)).toBeLessThan(2);
      expect(alignment.navWidth).toBeLessThan(alignment.contentWidth * 0.6);
    }
    const categoryHeading = await page.locator('section[aria-labelledby="kategorie"] > div').boundingBox();
    const categories = await page.locator(".category-grid").boundingBox();
    if (!categoryHeading || !categories) throw new Error("Missing category section");
    expect(categories.y - categoryHeading.y - categoryHeading.height).toBeGreaterThanOrEqual(16);
    const lawCopy = await page.locator(".law-copy").boundingBox();
    const lawBooks = await page.locator(".law-books").boundingBox();
    if (!lawCopy || !lawBooks) throw new Error("Missing law content");
    expect(Math.max(
      lawBooks.x - lawCopy.x - lawCopy.width,
      lawBooks.y - lawCopy.y - lawCopy.height,
    )).toBeGreaterThanOrEqual(16);
    const learning = await page.locator(".learning-and-law").boundingBox();
    const recent = await page.locator(".recent-section").boundingBox();
    if (!learning || !recent) throw new Error("Missing discovery sections");
    expect(recent.y - learning.y - learning.height).toBeGreaterThanOrEqual(32);
    for (const link of await page.locator(".hero-blocks a").all()) {
      const block = await link.boundingBox();
      const icon = await link.locator(".hero-icon").boundingBox();
      if (!block || !icon) throw new Error("Missing hero link or icon");
      expect(icon.x - block.x).toBeGreaterThanOrEqual(12);
    }
    const band = await page.locator(".practice-band").boundingBox();
    const demo = await page.locator(".practice-demo").boundingBox();
    expect(band && demo).toBeTruthy();
    if (band && demo) {
      // The rotated sample needs breathing room on every side, including phones.
      expect(demo.x - band.x).toBeGreaterThanOrEqual(20);
      expect(band.x + band.width - demo.x - demo.width).toBeGreaterThanOrEqual(20);
      expect(demo.y - band.y).toBeGreaterThanOrEqual(20);
      expect(band.y + band.height - demo.y - demo.height).toBeGreaterThanOrEqual(20);
    }
    for (const href of ["/kryteria", "/praktyka", "/sciezki", "/prawo", "/symulatory", "/slownik", "/wcag-3"]) {
      await expect(page.locator(`.category-grid a[href="${href}"]`)).toBeVisible();
    }
  });
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`mobile playground is accessible and navigates by keyboard (${colorScheme})`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(violations).toEqual([]);
    await page.locator(".hero-blocks a").first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/praktyka");
    await expect(page.getByRole("heading", { name: "Praktyka", level: 1 })).toBeFocused();
  });
}
