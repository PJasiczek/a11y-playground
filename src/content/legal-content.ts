import { type } from "arktype";
import { type ActSlug, findAct, findUnit, type LegalUnitId, type SituationId, situationIds } from "./legal";
import { legalTexts } from "./legal-text.gen";
import { type Fail, IsoDate, readVerification, splitFrontmatter, Status, type Verification } from "./markdown";
import { createRenderer } from "./render";

/**
 * Our summaries of the acts, one file per act in content/prawo/<act>.md. Server-only, like
 * criterion-content.ts. The statute text comes from legal-text.gen.ts; this file only adds what
 * we write about it.
 *
 * Body shape: an introduction, then one `## Art. 5. Title` section per article (the title is
 * ours and optional), each with an optional `### ust. 3` section per ustęp for the parallel
 * view. `## Załącznik. Title` covers the annex.
 */

const Deadline = type({
  date: IsoDate,
  what: "string > 0",
  /** The article the date comes from, as its slug in this act ("art-27"). */
  unit: "string > 0",
  situations: type.enumerated(...situationIds).array(),
  /** The date a situation's obligations begin; the criterion page shows it as "od". */
  "start?": "boolean",
  /** Repeats every year on the same day, first on `date`. */
  "yearly?": "boolean",
  "+": "reject",
});

const Frontmatter = type({
  status: Status,
  /** How the act is called in running text and headings: "Ustawa o dostępności cyfrowej". */
  short: "string > 0",
  summary: "0 < string <= 200",
  /** Who the act binds, one line. */
  binds: "string > 0",
  "deadlines?": Deadline.array(),
  "lastVerified?": IsoDate,
  "+": "reject",
});

export type Deadline = {
  act: ActSlug;
  date: string;
  what: string;
  unit: LegalUnitId;
  situations: SituationId[];
  start: boolean;
  yearly: boolean;
};

export type ArticleSummary = {
  /** Our short title, "Wymagania". Empty when the author gave none. */
  title: string;
  /** Rendered HTML of the article summary, "" when only ustępy are summarised. */
  html: string;
  /** Rendered HTML per ustęp number, for the rows of the parallel view. */
  ust: Record<string, string>;
};

export type ActContent = Verification & {
  short: string;
  summary: string;
  binds: string;
  introHtml: string;
  deadlines: Deadline[];
  articles: Partial<Record<LegalUnitId, ArticleSummary>>;
  terms: string[];
};

const headingPattern = /^(Art\. \d+[a-z]*|Załącznik)\.?(?:\s+(.*))?$/;

/** Parses one act file. Throws with the file name and the reason, like the other content parsers. */
export function parseActMarkdown(file: string, act: ActSlug, source: string): ActContent {
  const fail: Fail = (reason) => new Error(`${file}: ${reason}`);
  const { data, body } = splitFrontmatter(source, fail);
  const meta = Frontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);

  const unitId = (slug: string) => {
    const id = `${act}/${slug}`;
    const unit = findUnit(id);
    if (!unit) throw fail(`no article "${slug}" in ${act}`);
    return unit.id;
  };

  // Each article is its own page, so each gets its own renderer: a glossary term becomes a
  // link at its first use on that page, not only at its first use in the file.
  const terms = new Set<string>();
  const renderer = () => {
    const created = createRenderer(fail);
    return (markdown: string) => {
      const html = created.render(markdown);
      for (const term of created.terms) terms.add(term);
      return html;
    };
  };
  const [intro = "", ...chunks] = body.split(/^## /m);
  const introHtml = intro.trim() ? renderer()(intro.trim()) : "";
  const articles: ActContent["articles"] = {};
  for (const chunk of chunks) {
    const newline = chunk.indexOf("\n");
    const heading = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    const match = headingPattern.exec(heading);
    if (!match) throw fail(`section "${heading}" is not an article: use "## Art. 5. Tytuł" or "## Załącznik"`);
    const [, label = "", title = ""] = match;
    const id = unitId(label === "Załącznik" ? "zal" : label.toLowerCase().replace(" ", "-").replace(".", ""));
    if (articles[id]) throw fail(`${label} is summarised twice`);

    const render = renderer();
    const [lead = "", ...ustChunks] = (newline === -1 ? "" : chunk.slice(newline + 1)).split(/^### /m);
    const lines = legalTexts[id] ?? [];
    const ust: Record<string, string> = {};
    for (const ustChunk of ustChunks) {
      const ustNewline = ustChunk.indexOf("\n");
      const ustHeading = (ustNewline === -1 ? ustChunk : ustChunk.slice(0, ustNewline)).trim();
      const number = /^ust\. (\d+[a-z]*)$/.exec(ustHeading)?.[1];
      if (!number) throw fail(`${label}: "### ${ustHeading}" should be "### ust. 1"`);
      if (!lines.some((line) => line.ust === number)) throw fail(`${label} has no ust. ${number}`);
      ust[number] = render(ustChunk.slice(ustNewline + 1).trim());
    }
    articles[id] = { title: title.trim(), html: lead.trim() ? render(lead.trim()) : "", ust };
  }

  const deadlines = (meta.deadlines ?? []).map(
    (deadline): Deadline => ({
      act,
      date: deadline.date,
      what: deadline.what,
      unit: unitId(deadline.unit),
      situations: deadline.situations,
      start: deadline.start ?? false,
      yearly: deadline.yearly ?? false,
    }),
  );

  return {
    ...readVerification(meta, fail),
    short: meta.short,
    summary: meta.summary,
    binds: meta.binds,
    introHtml,
    deadlines,
    articles,
    terms: [...terms],
  };
}

const files = import.meta.glob<string>("/content/prawo/*.md", { query: "?raw", import: "default", eager: true });

/** Every act file keyed by act slug. An act in legal.gen.ts without a file fails here. */
export const actContent: ReadonlyMap<ActSlug, ActContent> = new Map(
  Object.entries(files).map(([path, source]) => {
    const slug = path.slice(path.lastIndexOf("/") + 1, -".md".length);
    const act = findAct(slug);
    if (!act) throw new Error(`${path}: no act ${slug} in legal.gen.ts`);
    return [act.slug, parseActMarkdown(path, act.slug, source)];
  }),
);

/** Every deadline of every act, oldest first. */
export const deadlines: readonly Deadline[] = [...actContent.values()]
  .flatMap((content) => content.deadlines)
  .toSorted((a, b) => a.date.localeCompare(b.date));
