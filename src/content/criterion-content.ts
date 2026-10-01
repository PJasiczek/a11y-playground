import { type } from "arktype";
import { type Fail, IsoDate, readVerification, splitFrontmatter, Status, type Verification } from "./markdown";
import { createRenderer } from "./render";
import { contentSections, type Role, roles, type SectionKey } from "./sections";
import { type CriterionId, isCriterionId } from "./wcag";

/**
 * Editorial content of a criterion, written in content/kryteria/<id>.md.
 * Server-only: this module pulls in the Markdown parser and every content file,
 * so the app reaches it through server functions, never from a component.
 */

const Frontmatter = type({
  status: Status,
  summary: "0 < string <= 200",
  roles: type.enumerated(...roles).array(),
  "related?": "string[]",
  "keywords?": "string[]",
  "enhances?": "string",
  "difference?": "0 < string <= 160",
  "lastVerified?": IsoDate,
  "+": "reject",
});

export type CriterionContent = Verification & {
  summary: string;
  roles: Role[];
  related: CriterionId[];
  /** Extra words people search with ("modal", "placeholder"); feeds search, not shown. */
  keywords: string[];
  /**
   * The lower-level criterion this one tightens (1.4.6 tightens 1.4.3), with one line on how.
   * Null for every criterion that does not tighten another.
   */
  enhances: { id: CriterionId; difference: string } | null;
  /** Glossary slugs marked in the text, in order of first use. */
  terms: string[];
  /** Rendered HTML per section. Sections the author has not written yet are absent. */
  sections: Partial<Record<SectionKey, string>>;
};

/**
 * Parses one content file. Throws with the file name and the reason, so a bad file fails
 * the build and the tests instead of rendering half a page.
 */
export function parseCriterionMarkdown(file: string, source: string): CriterionContent {
  const fail: Fail = (reason) => new Error(`${file}: ${reason}`);
  const { data, body } = splitFrontmatter(source, fail);
  const meta = Frontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);

  const related = meta.related ?? [];
  const unknown = related.filter((id) => !isCriterionId(id));
  if (unknown.length > 0) throw fail(`related lists unknown criteria: ${unknown.join(", ")}`);

  if ((meta.enhances === undefined) !== (meta.difference === undefined)) {
    throw fail("enhances and difference go together");
  }
  if (meta.enhances !== undefined && !isCriterionId(meta.enhances)) {
    throw fail(`enhances an unknown criterion: ${meta.enhances}`);
  }

  const [preamble = "", ...chunks] = body.split(/^## /m);
  if (preamble.trim() !== "") throw fail("text before the first ## section");

  const { terms, render } = createRenderer(fail);
  const sections: CriterionContent["sections"] = {};
  let lastIndex = -1;
  for (const chunk of chunks) {
    const newline = chunk.indexOf("\n");
    const title = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    const index = contentSections.findIndex((section) => section.title === title);
    const section = contentSections[index];
    if (!section) throw fail(`unknown section "${title}", allowed: ${contentSections.map((s) => s.title).join(", ")}`);
    if (index <= lastIndex) throw fail(`section "${title}" is out of order or repeated`);
    lastIndex = index;
    const markdown = newline === -1 ? "" : chunk.slice(newline + 1).trim();
    if (markdown !== "") sections[section.key] = render(markdown);
  }

  return {
    ...readVerification(meta, fail),
    summary: meta.summary,
    roles: meta.roles,
    related: related.filter(isCriterionId),
    keywords: meta.keywords ?? [],
    enhances:
      meta.enhances !== undefined && meta.difference !== undefined && isCriterionId(meta.enhances)
        ? { id: meta.enhances, difference: meta.difference }
        : null,
    terms,
    sections,
  };
}

const files = import.meta.glob<string>("/content/kryteria/*.md", { query: "?raw", import: "default", eager: true });

/** Every content file keyed by criterion id. Built once per server process. */
export const criterionContent: ReadonlyMap<CriterionId, CriterionContent> = new Map(
  Object.entries(files).map(([path, source]) => {
    const id = path.slice(path.lastIndexOf("/") + 1, -".md".length);
    if (!isCriterionId(id)) throw new Error(`${path}: no WCAG criterion ${id}`);
    return [id, parseCriterionMarkdown(path, source)];
  }),
);

/** Criteria whose content says they tighten the given one, read from their `enhances` field. */
export function strongerVersionsOf(id: CriterionId): CriterionId[] {
  return [...criterionContent].flatMap(([other, content]) => (content.enhances?.id === id ? [other] : []));
}
