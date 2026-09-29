import { annex2019 } from "./annex-2019-848";
import type { LegalUnitId, SituationId } from "./legal";
import { type Criterion, criteria, type CriterionId, findCriterion, inVersion, isNewIn22, isObsolete } from "./wcag";

/**
 * Which provision requires which criterion, for whom. Kept in one place and read from both
 * sides: the criterion page, the article page and /mapowanie.
 *
 * - wprost: the provision names the criterion (the annex to the 2019 act).
 * - posrednio: the provision reaches it through a harmonised standard that gives a presumption
 *   of conformity.
 * - powiazane: context, not an obligation.
 */
export const strengths = ["wprost", "posrednio", "powiazane"] as const;
export type Strength = (typeof strengths)[number];

export const strengthLabels = { wprost: "wprost", posrednio: "pośrednio", powiazane: "powiązane" } as const satisfies Record<
  Strength,
  string
>;

export type MappingEdge = {
  legal: LegalUnitId;
  criterion: CriterionId;
  strength: Strength;
  applies: readonly SituationId[];
  note?: string;
};

const annexNote: Partial<Record<CriterionId, string>> = {
  "4.1.1": "Załącznik nadal wymienia 4.1.1, choć WCAG 2.2 je wycofało.",
};

// The 2024 act does not name WCAG. Art. 20 gives a presumption of conformity to harmonised
// standards, and none is cited under the EAA yet: EN 301 549 V4.1.1 (September 2026, WCAG 2.2)
// waits for its reference in the Official Journal. Until then these edges are context only.
const productNote =
  "Ustawa nie wymienia WCAG. EN 301 549 V4.1.1 (wrzesień 2026, oparta na WCAG 2.2) czeka na wskazanie w Dzienniku Urzędowym UE, więc na razie nie daje domniemania zgodności.";

export const edges: readonly MappingEdge[] = [
  ...annex2019.map(
    ({ id, mobile }): MappingEdge => ({
      legal: "ustawa-2019-848/zal",
      criterion: id,
      strength: "wprost",
      applies: mobile ? ["strona-publiczna", "aplikacja-publiczna"] : ["strona-publiczna"],
      ...(annexNote[id] ? { note: annexNote[id] } : {}),
    }),
  ),
  ...criteria
    .filter((c) => !isObsolete(c) && c.level !== "AAA")
    .map(
      (c): MappingEdge => ({
        legal: "ustawa-2024-731/art-20",
        criterion: c.id,
        strength: "powiazane",
        applies: ["produkt-ue"],
        note: productNote,
      }),
    ),
];

/** Edges of one criterion, for the "Prawo" section of its page. */
export function edgesFor(criterion: CriterionId) {
  return edges.filter((edge) => edge.criterion === criterion);
}

/** Edges that start at one provision, for the article page. */
export function edgesFrom(unit: LegalUnitId) {
  return edges.filter((edge) => edge.legal === unit);
}

/**
 * The EN 301 549 V3.2.1 clause that repeats a criterion. Clause 9 (web content) mirrors the
 * WCAG 2.1 A and AA criteria number for number: 9.1.4.3 is 1.4.3.
 */
export function enClause(criterion: Criterion) {
  return inVersion(criterion, "2.1") && criterion.level !== "AAA" ? `9.${criterion.id}` : null;
}

/** Why no provision requires a criterion in a situation, in one sentence for the criterion page. */
export function whyNotRequired(id: CriterionId, situation: SituationId) {
  const criterion = findCriterion(id);
  if (!criterion) return "";
  if (criterion.level === "AAA") return "Żadna ustawa nie wymaga kryteriów na poziomie AAA.";
  if (situation === "produkt-ue") return "Ustawa o produktach i usługach nie wymienia kryteriów WCAG.";
  if (isNewIn22(criterion)) return "Załącznik wymienia kryteria WCAG 2.1, a to kryterium doszło w 2.2.";
  if (id === "1.2.4") return "Załącznik pomija napisy na żywo. Zapis transmisji trzeba dostosować w 14 dni (art. 5a).";
  if (situation === "aplikacja-publiczna") return "Załącznik wyłącza to kryterium dla aplikacji mobilnych.";
  return "";
}
