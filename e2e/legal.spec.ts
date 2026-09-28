import { expect, test } from "@playwright/test";

test("an article shows each ustęp next to its summary, with an anchor", async ({ page }) => {
  await page.goto("/prawo/ustawa-2019-848/art-5#ust-3");
  const row = page.getByRole("region", { name: "Ustęp 3" });
  await expect(row).toContainText("EN 301 549 V3.2.1:2021");
  await expect(row).toContainText("ten spełnia załącznik");
});
