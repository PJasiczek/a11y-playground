import { type } from "arktype";
import { marked } from "marked";
import { parse as parseYaml } from "yaml";
import { contentSections, type SectionKey } from "./sections";
import { type CriterionId, isCriterionId } from "./wcag";

/**
 * Editorial content of a criterion, written in content/kryteria/<id>.md.
 * Server-only: this module pulls in the Markdown parser and every content file,
 * so the app reaches it through server functions, never from a component.
 */

export const roles = ["programista", "projektant", "autor treści", "tester"] as const;

/** A verified file older than this fails the content tests and needs a fresh check. */
export const maxVerifiedAgeMonths = 12;

const Frontmatter = type({
  status: "'szkic' | 'zweryfikowane'",
  summary: "0 < string <= 200",
  roles: type.enumerated(...roles).array(),
  "related?": "string[]",
  "keywords?": "string[]",
  "lastVerified?": /^\d{4}-\d{2}-\d{2}$/,
  "+": "reject",
});

/**
 * A draft never carries a verification date, so the app cannot claim a check that did not
 * happen. Verified content always does.
 */
export type Verification = { status: "szkic" } | { status: "zweryfikowane"; lastVerified: string };

export type CriterionContent = Verification & {
  summary: string;
  roles: (typeof roles)[number][];
  related: CriterionId[];
  /** Extra words people search with ("modal", "placeholder"); feeds search, not shown. */
  keywords: string[];
  /** Rendered HTML per section. Sections the author has not written yet are absent. */
  sections: Partial<Record<SectionKey, string>>;
};

/**
 * Parses one content file. Throws with the file name and the reason, so a bad file fails
 * the build and the tests instead of rendering half a page.
 */
export function parseCriterionMarkdown(file: string, source: string): CriterionContent {
  const fail = (reason: string) => new Error(`${file}: ${reason}`);
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) throw fail("missing frontmatter between --- lines");
  const [, yaml = "", body = ""] = match;

  const meta = Frontmatter(parseYaml(yaml));
  if (meta instanceof type.errors) throw fail(meta.summary);

  const { status, lastVerified } = meta;
  let verification: Verification;
  if (status === "szkic") {
    if (lastVerified) throw fail("a draft (status: szkic) cannot have lastVerified");
    verification = { status };
  } else {
    if (!lastVerified) throw fail("status: zweryfikowane needs lastVerified");
    verification = { status, lastVerified };
  }

  const related = meta.related ?? [];
  const unknown = related.filter((id) => !isCriterionId(id));
  if (unknown.length > 0) throw fail(`related lists unknown criteria: ${unknown.join(", ")}`);

  const [preamble = "", ...chunks] = body.split(/^## /m);
  if (preamble.trim() !== "") throw fail("text before the first ## section");

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
    if (markdown !== "") sections[section.key] = marked.parse(markdown, { async: false });
  }

  return {
    ...verification,
    summary: meta.summary,
    roles: meta.roles,
    related: related.filter(isCriterionId),
    keywords: meta.keywords ?? [],
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
