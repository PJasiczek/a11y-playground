import { acts, legalUnits } from "./legal.gen";

/**
 * Types and lookups over the generated act index. Import from here, not from legal.gen.
 * Client-safe: the statute text itself lives in legal-text.gen.ts, which only the server reads.
 */
export { acts, legalUnits };

export type Act = (typeof acts)[number];
export type ActSlug = Act["slug"];
export type LegalUnit = (typeof legalUnits)[number];
export type LegalUnitId = LegalUnit["id"];

/**
 * The situations /mapowanie asks the reader to pick from, in picker order. Every mapping edge
 * and every deadline says which of them it applies to.
 */
export const situations = [
  { id: "strona-publiczna", label: "Strona podmiotu publicznego" },
  { id: "aplikacja-publiczna", label: "Aplikacja podmiotu publicznego" },
  { id: "produkt-ue", label: "Produkt lub usługa firmy w UE" },
] as const;

export type SituationId = (typeof situations)[number]["id"];
export const situationIds = situations.map((s) => s.id);

const unitsById = new Map<string, LegalUnit>(legalUnits.map((u) => [u.id, u]));
const actsBySlug = new Map<string, Act>(acts.map((a) => [a.slug, a]));

export function findAct(slug: string) {
  return actsBySlug.get(slug);
}

/** Resolves "ustawa-2019-848/art-5" from a URL or a content file; undefined when it does not exist. */
export function findUnit(id: string) {
  return unitsById.get(id);
}

export function isLegalUnitId(id: string): id is LegalUnitId {
  return unitsById.has(id);
}

/** The units of one act in statute order, for tables of contents and previous/next links. */
export function unitsOf(act: ActSlug) {
  return legalUnits.filter((u) => u.act === act);
}

/** "23.06.2021" from an ISO date. Dates in this module are codes, shown in the monospace face. */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${String(day)}.${String(month)}.${String(year)}`;
}
