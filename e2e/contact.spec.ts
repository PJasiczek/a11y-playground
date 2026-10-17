import { expect, test } from "@playwright/test";

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

test("the footer leads to the contact page, and its address copies", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Kontakt" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Kontakt" })).toBeVisible();

  // The address is edited in Notion, so the test reads it from the link.
  const link = page.getByRole("link", { name: /@/ });
  const email = (await link.textContent()) ?? "";
  await expect(link).toHaveAttribute("href", `mailto:${email}`);

  const button = page.getByRole("button", { name: "Kopiuj adres" });
  await button.click();
  await expect(page.getByRole("status").filter({ hasText: "Skopiowano adres" })).toBeVisible();
  await expect(button).toBeFocused();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
});
