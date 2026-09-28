import { expect, test } from "@playwright/test";

// Phase 4 promise: from a criterion to the provision that requires it, and back.
test("a criterion links to the annex, and the annex links back", async ({ page }) => {
  await page.goto("/kryteria/1.4.3");
  const law = page.getByRole("region", { name: "Prawo" });
  await expect(law.getByRole("row", { name: /Strona podmiotu publicznego/ })).toContainText("wprost");
  await law.getByRole("link", { name: "Załącznik do ustawy" }).first().click();
  await expect(page).toHaveURL("/prawo/ustawa-2019-848/zal");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Załącznik");
  await page.getByRole("link", { name: /^1\.4\.3 Kontrast \(minimum\)/ }).click();
  await expect(page).toHaveURL("/kryteria/1.4.3");
});

test("a criterion new in 2.2 says no act requires it", async ({ page }) => {
  await page.goto("/kryteria/2.4.11");
  const row = page.getByRole("region", { name: "Prawo" }).getByRole("row", { name: /Strona podmiotu publicznego/ });
  await expect(row).toContainText("nie wymaga");
  await expect(row).toContainText("doszło w 2.2");
});

test("an article shows each ustęp next to its summary, with an anchor", async ({ page }) => {
  await page.goto("/prawo/ustawa-2019-848/art-5#ust-3");
  const row = page.getByRole("region", { name: "Ustęp 3" });
  await expect(row).toContainText("EN 301 549 V3.2.1:2021");
  await expect(row).toContainText("ten spełnia załącznik");
});
