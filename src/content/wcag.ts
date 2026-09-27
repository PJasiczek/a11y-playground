import { criteria, guidelines, principles } from "./wcag.gen";

/** Types and lookups over the generated WCAG structure. Import from here, not from wcag.gen. */
export { criteria, guidelines, principles };

export type Criterion = (typeof criteria)[number];
export type CriterionId = Criterion["id"];
export type Level = Criterion["level"];
export type Principle = (typeof principles)[number];
export type PrincipleNum = Principle["num"];
export type Guideline = (typeof guidelines)[number];

export const levels = ["A", "AA", "AAA"] as const satisfies readonly Level[];
export const versions = ["2.2", "2.1", "2.0"] as const;
export type Version = (typeof versions)[number];

const byId = new Map<string, Criterion>(criteria.map((c) => [c.id, c]));

/** Resolves a criterion number from a URL or a content file; undefined when it does not exist. */
export function findCriterion(id: string) {
  return byId.get(id);
}

export function isCriterionId(id: string): id is CriterionId {
  return byId.has(id);
}

export function inVersion(criterion: Criterion, version: Version) {
  return criterion.versions.some((v) => v === version);
}

/** Added in WCAG 2.2, shown with a "nowe w 2.2" badge. */
export function isNewIn22(criterion: Criterion) {
  return criterion.versions.length === 1 && inVersion(criterion, "2.2");
}

/** Removed in WCAG 2.2. Today that is only 4.1.1 Parsing. */
export function isObsolete(criterion: Criterion) {
  return !inVersion(criterion, "2.2");
}

export function principleOf(criterion: Criterion) {
  const principle = principles.find((p) => p.num === criterion.principle);
  if (!principle) throw new Error(`No principle ${criterion.principle}`);
  return principle;
}

export function guidelineOf(criterion: Criterion) {
  const guideline = guidelines.find((g) => g.num === criterion.guideline);
  if (!guideline) throw new Error(`No guideline ${criterion.guideline}`);
  return guideline;
}
