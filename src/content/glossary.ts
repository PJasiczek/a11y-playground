import { type } from "arktype";
import { marked } from "marked";
import { type Fail, IsoDate, readVerification, splitFrontmatter, Status, type Verification } from "./markdown";
import { wcagGlossary } from "./wcag-text.gen";

/**
 * Glossary entries, one file per term in content/slownik/<slug>.md. The slug is the file name
 * and the anchor on /slownik. Server-only, like criterion-content.ts.
 */

const Frontmatter = type({
  term: "string > 0",
  "also?": "string[]",
  "normative?": "string",
  status: Status,
  "lastVerified?": IsoDate,
  "+": "reject",
});

export type GlossaryEntry = Verification & {
  slug: string;
  term: string;
  /** Everyday names ("dostępna nazwa"), shown under the term and matched by search. */
  also: string[];
  /** Our plain explanation, rendered HTML. */
  html: string;
  /** The definition from the authorized WCAG 2.1 translation, when the term is defined there. */
  normativeHtml: string | null;
};

export function parseGlossaryMarkdown(file: string, slug: string, source: string): GlossaryEntry {
  const fail: Fail = (reason) => new Error(`${file}: ${reason}`);
  const { data, body } = splitFrontmatter(source, fail);
  const meta = Frontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);

  const normativeHtml = meta.normative === undefined ? null : wcagGlossary[meta.normative];
  if (normativeHtml === undefined) throw fail(`normative "${String(meta.normative)}" is not a term in the WCAG 2.1 glossary`);
  if (body.trim() === "") throw fail("the explanation is empty");

  return {
    ...readVerification(meta, fail),
    slug,
    term: meta.term,
    also: meta.also ?? [],
    html: marked.parse(body.trim(), { async: false }),
    normativeHtml,
  };
}

const files = import.meta.glob<string>("/content/slownik/*.md", { query: "?raw", import: "default", eager: true });

/** Every glossary entry keyed by slug, sorted by term in Polish alphabetical order. */
export const glossary: ReadonlyMap<string, GlossaryEntry> = new Map(
  Object.entries(files)
    .map(([path, source]) => {
      const slug = path.slice(path.lastIndexOf("/") + 1, -".md".length);
      return parseGlossaryMarkdown(path, slug, source);
    })
    .sort((a, b) => a.term.localeCompare(b.term, "pl"))
    .map((entry) => [entry.slug, entry]),
);
