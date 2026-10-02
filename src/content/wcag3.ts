import { type } from "arktype";
import { type Fail, IsoDate, readVerification, splitFrontmatter, Status, type Verification } from "./markdown";
import { createRenderer } from "./render";
import { type CriterionId, isCriterionId } from "./wcag";

/**
 * The WCAG 3.0 tracking module, written in content/wcag3/: index.md describes one dated W3C
 * Working Draft, and one file per guideline group maps its guidelines to WCAG 2.2 criteria.
 * The mapping is ours, not W3C's. Server-only, like the other content modules.
 */

/** How old `checked` in index.md may get before the content tests ask for a fresh look at the draft. */
export const maxCheckedAgeMonths = 6;

const IndexFrontmatter = type({
  status: Status,
  /** Date of the W3C Working Draft the module describes. */
  draft: IsoDate,
  draftUrl: /^https:\/\/www\.w3\.org\/TR\//,
  /** The day we last compared the content with the current draft on w3.org. */
  checked: IsoDate,
  compare: type({ topic: "string > 0", wcag2: "string > 0", wcag3: "string > 0", "+": "reject" }).array().atLeastLength(1),
  "lastVerified?": IsoDate,
  "+": "reject",
});

const GuidelineFrontmatter = type({
  num: /^2\.\d+\.\d+$/,
  en: "string > 0",
  title: "string > 0",
  criteria: "string[]",
  "note?": "0 < string <= 160",
  "+": "reject",
});

const GroupFrontmatter = type({
  num: /^2\.\d+$/,
  title: "string > 0",
  en: "string > 0",
  status: Status,
  "lastVerified?": IsoDate,
  guidelines: GuidelineFrontmatter.array().atLeastLength(1),
  "+": "reject",
});

export type Wcag3Guideline = {
  num: string;
  /** Name in the draft, shown in English with lang="en". */
  en: string;
  /** Our Polish name. */
  title: string;
  /** WCAG 2.2 criteria that correspond to the guideline today. Empty means "Nowe w 3.0". */
  criteria: CriterionId[];
  note: string | null;
  /** Element id on /wcag-3; dots are not valid in a CSS selector without escaping. */
  anchor: string;
};

export type Wcag3Group = Verification & {
  num: string;
  title: string;
  en: string;
  guidelines: Wcag3Guideline[];
};

export type Wcag3Overview = Verification & {
  draft: string;
  draftUrl: string;
  checked: string;
  compare: { topic: string; wcag2: string; wcag3: string }[];
  html: string;
};

/** Splits "2.10.1" into numbers, so 2.10 sorts after 2.9. */
const numKey = (num: string) => num.split(".").map(Number);
const byNum = (a: { num: string }, b: { num: string }) => {
  const [x, y] = [numKey(a.num), numKey(b.num)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const diff = (x[i] ?? 0) - (y[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

/** Parses content/wcag3/index.md. Throws with the file and the reason. */
export function parseWcag3Index(file: string, source: string): Wcag3Overview {
  const fail: Fail = (reason) => new Error(`${file}: ${reason}`);
  const { data, body } = splitFrontmatter(source, fail);
  const meta = IndexFrontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);
  if (meta.checked < meta.draft) throw fail("checked is earlier than the draft it describes");
  return {
    ...readVerification(meta, fail),
    draft: meta.draft,
    draftUrl: meta.draftUrl,
    checked: meta.checked,
    compare: meta.compare,
    html: createRenderer(fail).render(body.trim()),
  };
}

/** Parses one group file. Throws with the file and the reason. */
export function parseWcag3Group(file: string, source: string): Wcag3Group {
  const fail: Fail = (reason) => new Error(`${file}: ${reason}`);
  const { data, body } = splitFrontmatter(source, fail);
  const meta = GroupFrontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);
  if (body.trim() !== "") throw fail("a group file has no text after the frontmatter");

  const seen = new Set<string>();
  const guidelines = meta.guidelines.map((g): Wcag3Guideline => {
    if (!g.num.startsWith(`${meta.num}.`)) throw fail(`guideline ${g.num} is not in group ${meta.num}`);
    if (seen.has(g.num)) throw fail(`guideline ${g.num} is listed twice`);
    seen.add(g.num);
    const unknown = g.criteria.filter((id) => !isCriterionId(id));
    if (unknown.length > 0) throw fail(`${g.num} lists unknown criteria: ${unknown.join(", ")}`);
    return {
      num: g.num,
      en: g.en,
      title: g.title,
      criteria: g.criteria.filter(isCriterionId),
      note: g.note ?? null,
      anchor: `w3-${g.num.replaceAll(".", "-")}`,
    };
  });

  return {
    ...readVerification(meta, fail),
    num: meta.num,
    title: meta.title,
    en: meta.en,
    guidelines: guidelines.toSorted(byNum),
  };
}

const files = import.meta.glob<string>("/content/wcag3/*.md", { query: "?raw", import: "default", eager: true });

const indexPath = "/content/wcag3/index.md";
const indexSource = files[indexPath];
if (indexSource === undefined) throw new Error(`${indexPath} is missing`);

export const wcag3Overview: Wcag3Overview = parseWcag3Index(indexPath, indexSource);

/** Every guideline group in draft order. Two files with the same group number fail here. */
export const wcag3Groups: readonly Wcag3Group[] = Object.entries(files)
  .filter(([path]) => path !== indexPath)
  .map(([path, source]) => parseWcag3Group(path, source))
  .toSorted(byNum)
  .map((group, i, all) => {
    if (all[i - 1]?.num === group.num) throw new Error(`content/wcag3: group ${group.num} is in two files`);
    return group;
  });

/** The 3.0 guidelines a WCAG 2.2 criterion corresponds to, for its criterion page and search. */
export function wcag3GuidelinesFor(id: CriterionId): Pick<Wcag3Guideline, "num" | "title" | "anchor">[] {
  return wcag3Groups.flatMap((group) =>
    group.guidelines.filter((g) => g.criteria.includes(id)).map(({ num, title, anchor }) => ({ num, title, anchor })),
  );
}
