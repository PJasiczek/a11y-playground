import { type } from "arktype";
import { pages } from "./before-after-document";
import { harmedIds, type Harmed } from "./before-after-labels";
import { examples } from "./examples";
import { type Fail, IsoDate, readVerification, splitFrontmatter, Status, type Verification } from "./markdown";
import { patterns } from "./patterns";
import { createRenderer, renderSections } from "./render";
import { type CriterionId, isCriterionId } from "./wcag";

/**
 * The problems of the broken KMW page, one file each in content/przed-i-po/problemy/NN-slug.md,
 * numbered in page order. Server-only, like the other content modules.
 */

const Frontmatter = type({
  title: "string > 0",
  criteria: "string[] > 0",
  /** The token in a data-problem attribute of przed.html that the marker sits on. */
  marker: /^[a-z]+$/,
  who: type.enumerated(...harmedIds).array().atLeastLength(1),
  /** axe-core rules that report this problem on the broken page; the e2e test holds us to it. */
  axe: "string[]",
  /** The practice example and the ARIA pattern that show the same thing on its own. */
  "example?": "string",
  "pattern?": "string",
  status: Status,
  "lastVerified?": IsoDate,
  "+": "reject",
});

const sections = [
  { key: "problem", title: "Problem" },
  { key: "rozwiazanie", title: "Rozwiązanie" },
] as const;

type Link = { slug: string; title: string };

export type Problem = Verification & {
  number: number;
  title: string;
  criteria: CriterionId[];
  marker: string;
  who: Harmed[];
  axe: string[];
  example: Link | null;
  pattern: Link | null;
  /** Rendered HTML of the two sections. */
  problemHtml: string;
  solutionHtml: string;
  /** The code before and after, from the ```przed and ```po blocks. Plain text. */
  code: { przed: string; po: string };
};

const codeBlock = /^```(przed|po)\r?\n([\s\S]*?)\r?\n```[ \t]*$/gm;

/** Parses one problem file. Throws with the file and the reason. */
export function parseProblem(file: string, source: string): Problem {
  const fail: Fail = (reason) => new Error(`content/przed-i-po/problemy/${file}: ${reason}`);
  const number = /^(\d{2})-[a-z0-9-]+\.md$/.exec(file)?.[1];
  if (number === undefined) throw fail("the file name must be NN-slug.md");
  const { data, body } = splitFrontmatter(source, fail);
  const meta = Frontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);

  const unknown = meta.criteria.filter((id) => !isCriterionId(id));
  if (unknown.length > 0) throw fail(`criteria lists unknown criteria: ${unknown.join(", ")}`);
  const example = meta.example === undefined ? null : examples.get(meta.example);
  if (example === undefined) throw fail(`unknown example "${String(meta.example)}"`);
  const pattern = meta.pattern === undefined ? null : patterns.get(meta.pattern);
  if (pattern === undefined) throw fail(`unknown pattern "${String(meta.pattern)}"`);

  const code: Partial<Record<"przed" | "po", string>> = {};
  for (const [, which = "", text = ""] of body.matchAll(codeBlock)) {
    if (which !== "przed" && which !== "po") continue;
    if (code[which] !== undefined) throw fail(`two \`\`\`${which} blocks`);
    code[which] = text;
  }
  if (code.przed === undefined || code.po === undefined) throw fail("needs one ```przed and one ```po block");

  const { render } = createRenderer(fail);
  const rendered = renderSections(body.replace(codeBlock, ""), sections, fail, render);
  if (!rendered.problem || !rendered.rozwiazanie) throw fail("both ## Problem and ## Rozwiązanie are required");

  return {
    ...readVerification(meta, fail),
    number: Number(number),
    title: meta.title,
    criteria: meta.criteria.filter(isCriterionId),
    marker: meta.marker,
    who: meta.who,
    axe: meta.axe,
    example: example && { slug: example.slug, title: example.title },
    pattern: pattern && { slug: pattern.slug, title: pattern.title },
    problemHtml: rendered.problem,
    solutionHtml: rendered.rozwiazanie,
    code: { przed: code.przed, po: code.po },
  };
}

/** The data-problem tokens of a page, in document order. */
export function markersIn(page: string) {
  return [...page.matchAll(/data-problem="([^"]*)"/g)].flatMap(([, tokens = ""]) => tokens.split(/\s+/).filter(Boolean));
}

/**
 * Numbers run from 1 without gaps, and every marker sits in the broken page exactly once,
 * with no data-problem left over. Throws with every mismatch.
 */
export function checkProblems(list: readonly Pick<Problem, "number" | "marker">[], page: string) {
  const errors: string[] = [];
  list.forEach((problem, index) => {
    if (problem.number !== index + 1) errors.push(`expected problem ${String(index + 1)}, found ${String(problem.number)}`);
  });
  const tokens = markersIn(page);
  for (const { number, marker } of list) {
    const count = tokens.filter((token) => token === marker).length;
    if (count !== 1) errors.push(`problem ${String(number)}: marker "${marker}" appears ${String(count)} times in przed.html`);
  }
  for (const token of new Set(tokens)) {
    if (!list.some((problem) => problem.marker === token)) errors.push(`data-problem "${token}" in przed.html has no problem`);
  }
  if (errors.length > 0) throw new Error(`content/przed-i-po: ${errors.join("; ")}`);
}

const files = import.meta.glob<string>("/content/przed-i-po/problemy/*.md", { query: "?raw", import: "default", eager: true });

/** Every problem in page order. */
export const problems: readonly Problem[] = Object.entries(files)
  .map(([path, source]) => parseProblem(path.slice(path.lastIndexOf("/") + 1), source))
  .sort((a, b) => a.number - b.number);

checkProblems(problems, pages.przed);

const titled = ({ number, title }: Problem) => ({ number, title });

/** Problems that break a criterion, for its page. */
export function problemsFor(id: CriterionId) {
  return problems.filter((problem) => problem.criteria.includes(id)).map(titled);
}

/** Problems a practice example shows on its own, for its page. */
export function problemsForExample(slug: string) {
  return problems.filter((problem) => problem.example?.slug === slug).map(titled);
}

/** Problems an ARIA pattern fixes, for its page. */
export function problemsForPattern(slug: string) {
  return problems.filter((problem) => problem.pattern?.slug === slug).map(titled);
}
