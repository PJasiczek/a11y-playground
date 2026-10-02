import type { CriterionId } from "./wcag";

/**
 * AAA criteria this app meets on purpose (docs/accessibility.md, README), with how we know.
 * Shown as "Ta aplikacja to spełnia" on the criterion page. Every entry needs a test behind it:
 * 1.4.6 and 2.5.5 in e2e/a11y.spec.ts (axe with wcag2aaa, the 44px check), 2.3.3 in
 * e2e/a11y.spec.ts (no running animations), 2.4.13 in e2e/keyboard.spec.ts (the focus outline).
 */
export const appMeets: Partial<Record<CriterionId, string>> = {
  "1.4.6": "Każda para kolorów tekstu ma co najmniej 7 do 1 w obu motywach. Sprawdza to axe z regułami AAA na każdej testowanej stronie.",
  "2.3.3":
    "Interfejs nie ma animacji ruchu. Przykłady z ruchem startują dopiero po kliknięciu, a ich naprawione wersje szanują systemowe ograniczenie ruchu.",
  "2.4.13": "Każdy element z fokusem dostaje ciągły obrys o grubości 3 pikseli z odstępem, a w trybie wymuszonych kolorów kolor systemowy.",
  "2.5.5": "Każdy element interaktywny poza łączami w tekście ma co najmniej 44 na 44 piksele. Test mierzy to na każdej testowanej stronie.",
};

