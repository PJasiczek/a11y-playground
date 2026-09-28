import { type } from "arktype";
import { type Fail, IsoDate, readVerification, splitFrontmatter, Status, type Verification } from "./markdown";
import { createRenderer } from "./render";
import { type CriterionId, isCriterionId } from "./wcag";

/**
 * Bad and good examples, one folder per example in content/praktyka/<slug>/ with index.md,
 * bad.html and good.html. Server-only, like the other content modules.
 */

/** How much work a fix takes, cheapest first. The catalogue and home page sort by this. */
export const efforts = ["1 linia", "1 token", "2 minuty", "15 minut", "refaktor"] as const;

const Variant = type({
  why: "string > 0",
  announces: "string > 0",
  "+": "reject",
});

// The broken variant also lists the axe rules it must trigger, when axe can see the fault.
const BadVariant = type({
  why: "string > 0",
  announces: "string > 0",
  "axe?": "string[]",
  "+": "reject",
});

const Frontmatter = type({
  title: "string > 0",
  summary: "0 < string <= 200",
  criteria: "string[] > 0",
  effort: type.enumerated(...efforts),
  gain: "string > 0",
  /** Static markup of the fault for the catalogue card. Decorative: rendered inert and hidden. */
  preview: "string > 0",
  "motion?": "boolean",
  status: Status,
  "lastVerified?": IsoDate,
  bad: BadVariant,
  good: Variant,
  "+": "reject",
});

export type ExampleVariant = {
  why: string;
  announces: string;
  /** The HTML fragment the demo renders and the code view shows. */
  source: string;
};

export type Example = Verification & {
  slug: string;
  title: string;
  summary: string;
  criteria: CriterionId[];
  effort: (typeof efforts)[number];
  gain: string;
  preview: string;
  /** Moving or self-updating demos load only after the reader asks. */
  motion: boolean;
  introHtml: string;
  terms: string[];
  bad: ExampleVariant & { axe: string[] };
  good: ExampleVariant;
};

/** Parses one example folder from its three files. Throws with the folder and the reason. */
export function parseExample(
  slug: string,
  files: { index: string; bad: string | undefined; good: string | undefined },
): Example {
  const fail: Fail = (reason) => new Error(`content/praktyka/${slug}: ${reason}`);
  const { data, body } = splitFrontmatter(files.index, fail);
  const meta = Frontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);

  const unknown = meta.criteria.filter((id) => !isCriterionId(id));
  if (unknown.length > 0) throw fail(`criteria lists unknown criteria: ${unknown.join(", ")}`);
  if (files.bad === undefined) throw fail("bad.html is missing");
  if (files.good === undefined) throw fail("good.html is missing");

  const { terms, render } = createRenderer(fail);
  return {
    ...readVerification(meta, fail),
    slug,
    title: meta.title,
    summary: meta.summary,
    criteria: meta.criteria.filter(isCriterionId),
    effort: meta.effort,
    gain: meta.gain,
    preview: meta.preview,
    motion: meta.motion ?? false,
    introHtml: render(body.trim()),
    terms,
    bad: { why: meta.bad.why, announces: meta.bad.announces, axe: meta.bad.axe ?? [], source: files.bad.trim() },
    good: { why: meta.good.why, announces: meta.good.announces, source: files.good.trim() },
  };
}

const indexFiles = import.meta.glob<string>("/content/praktyka/*/index.md", { query: "?raw", import: "default", eager: true });
const htmlFiles = import.meta.glob<string>("/content/praktyka/*/*.html", { query: "?raw", import: "default", eager: true });

/** Every example keyed by slug, cheapest fix first, then by title. */
export const examples: ReadonlyMap<string, Example> = new Map(
  Object.entries(indexFiles)
    .map(([path, index]) => {
      const folder = path.slice(0, path.lastIndexOf("/"));
      const slug = folder.slice(folder.lastIndexOf("/") + 1);
      return parseExample(slug, { index, bad: htmlFiles[`${folder}/bad.html`], good: htmlFiles[`${folder}/good.html`] });
    })
    .sort((a, b) => efforts.indexOf(a.effort) - efforts.indexOf(b.effort) || a.title.localeCompare(b.title, "pl"))
    .map((example) => [example.slug, example]),
);
