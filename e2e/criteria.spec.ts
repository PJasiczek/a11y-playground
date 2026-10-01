import { expect, test } from "@playwright/test";

// Phase 8: an AAA criterion shows the AA one it tightens, and the AA one links to it.
test("an AAA criterion is compared with the AA one it tightens", async ({ page }) => {
  await page.goto("/kryteria/1.4.6");
  await expect(page.getByText("Poziom AAA: cel, nie obowiązek.")).toBeVisible();
  const comparison = page.getByRole("group", { name: "Porównanie z kryterium 1.4.3" });
  await expect(comparison).toContainText("7 do 1 zamiast 4,5 do 1");
  await comparison.getByRole("link", { name: /1\.4\.3 Kontrast \(minimum\)/ }).click();
  await expect(page).toHaveURL("/kryteria/1.4.3");
  const related = page.getByRole("region", { name: "Powiązane" });
  await expect(related.getByRole("term").filter({ hasText: "Wersja wzmocniona" })).toBeVisible();
  // Listed once, as the stronger version, even though 1.4.3 also names it in `related`.
  await expect(related.getByRole("link", { name: /^1\.4\.6 Kontrast \(wzmocniony\)/ })).toHaveCount(1);
});
