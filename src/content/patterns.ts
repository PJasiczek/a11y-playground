import { type } from "arktype";
import { keyNames, reportedAttributes } from "./announce";
import { examples } from "./examples";
import { type Fail, IsoDate, readVerification, splitFrontmatter, Status, type Verification } from "./markdown";
import {
  nativeVerdictIds,
  patternBatchIds,
  patternSections,
  type NativeVerdict,
  type PatternBatch,
  type PatternSectionKey,
} from "./pattern-labels";
import { createRenderer, renderSections } from "./render";
import { type CriterionId, isCriterionId } from "./wcag";

/**
 * ARIA widget patterns, one folder per pattern in content/wzorce/<slug>/ with index.md and
 * wzorzec.html. Server-only, like the other content modules.
 */

const Step = type({
  /** What to do, as an instruction. The page puts the keys in front of it. */
  do: "string > 0",
  keys: type.enumerated(...keyNames).array().atLeastLength(1),
  /** The log line that ticks the step off: the text the frame logs for one of `keys`. */
  hear: "string > 0",
  "+": "reject",
});

const AriaRow = type({
  attr: type.enumerated(...reportedAttributes),
  /** The element in words, for the table. */
  on: "string > 0",
  /** The element in CSS, for the frame, which reports the live value. */
  selector: "string > 0",
  meaning: "string > 0",
  "+": "reject",
});

const Frontmatter = type({
  title: "string > 0",
  /** Deque's English name, shown with lang="en". */
  en: "string > 0",
  batch: type.enumerated(...patternBatchIds),
  native: type.enumerated(...nativeVerdictIds),
  summary: "0 < string <= 200",
  criteria: "string[] > 0",
  /** Practice examples that show the same thing broken. */
  "examples?": "string[]",
  /** Static markup for the catalogue card. Decorative: rendered inert and hidden. */
  preview: "string > 0",
  steps: Step.array(),
  aria: AriaRow.array(),
  sources: { "apg?": "string.url", deque: "string.url", "+": "reject" },
  status: Status,
  "lastVerified?": IsoDate,
  "+": "reject",
});

export type PatternStep = typeof Step.infer;
export type AriaRow = typeof AriaRow.infer;

export type Pattern = Verification & {
  slug: string;
  title: string;
  en: string;
  batch: PatternBatch;
  native: NativeVerdict;
  summary: string;
  criteria: CriterionId[];
  examples: string[];
  preview: string;
  steps: PatternStep[];
  aria: AriaRow[];
  sources: { apg?: string; deque: string };
  sections: Partial<Record<PatternSectionKey, string>>;
  terms: string[];
  /** The HTML fragment the demo renders and the code view shows. */
  source: string;
};

/** Parses one pattern folder from its two files. Throws with the folder and the reason. */
export function parsePattern(slug: string, files: { index: string; source: string | undefined }): Pattern {
  const fail: Fail = (reason) => new Error(`content/wzorce/${slug}: ${reason}`);
  const { data, body } = splitFrontmatter(files.index, fail);
  const meta = Frontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);

  const unknown = meta.criteria.filter((id) => !isCriterionId(id));
  if (unknown.length > 0) throw fail(`criteria lists unknown criteria: ${unknown.join(", ")}`);
  const missing = (meta.examples ?? []).filter((example) => !examples.has(example));
  if (missing.length > 0) throw fail(`examples lists unknown examples: ${missing.join(", ")}`);
  if (files.source === undefined) throw fail("wzorzec.html is missing");
  // The reader enters the frame from the page with Tab, so that is how an exercise starts.
  const [first] = meta.steps;
  if (first && !first.keys.includes("Tab")) throw fail("the first step must start with Tab, which enters the frame");

  const { terms, render } = createRenderer(fail);
  const sections = renderSections(body, patternSections, fail, render);
  for (const { key, title } of patternSections.slice(0, 2)) {
    if (!sections[key]) throw fail(`section "${title}" is missing`);
  }

  return {
    ...readVerification(meta, fail),
    slug,
    title: meta.title,
    en: meta.en,
    batch: meta.batch,
    native: meta.native,
    summary: meta.summary,
    criteria: meta.criteria.filter(isCriterionId),
    examples: meta.examples ?? [],
    preview: meta.preview,
    steps: meta.steps,
    aria: meta.aria,
    sources: meta.sources,
    sections,
    terms,
    source: files.source.trim(),
  };
}

const indexFiles = import.meta.glob<string>("/content/wzorce/*/index.md", { query: "?raw", import: "default", eager: true });
const sourceFiles = import.meta.glob<string>("/content/wzorce/*/wzorzec.html", { query: "?raw", import: "default", eager: true });

/** Every pattern keyed by slug, in batch order, then by title. */
export const patterns: ReadonlyMap<string, Pattern> = new Map(
  Object.entries(indexFiles)
    .map(([path, index]) => {
      const folder = path.slice(0, path.lastIndexOf("/"));
      const slug = folder.slice(folder.lastIndexOf("/") + 1);
      return parsePattern(slug, { index, source: sourceFiles[`${folder}/wzorzec.html`] });
    })
    .sort((a, b) => patternBatchIds.indexOf(a.batch) - patternBatchIds.indexOf(b.batch) || a.title.localeCompare(b.title, "pl"))
    .map((pattern) => [pattern.slug, pattern]),
);

/** Patterns that show a criterion, for its page. */
export function patternsFor(id: CriterionId) {
  return [...patterns.values()].filter((pattern) => pattern.criteria.includes(id)).map(({ slug, title }) => ({ slug, title }));
}

/** Patterns that show the fixed version of a practice example, for its page. */
export function patternsForExample(slug: string) {
  return [...patterns.values()].filter((pattern) => pattern.examples.includes(slug)).map(({ slug, title }) => ({ slug, title }));
}
