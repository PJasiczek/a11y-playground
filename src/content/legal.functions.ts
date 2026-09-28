import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { glossary } from "./glossary";
import { acts, type ActSlug, findAct, findUnit, unitsOf } from "./legal";
import { type ActContent, actContent, deadlines, isStub } from "./legal-content";
import { edgesFrom } from "./legal-map";
import { type LegalLine, legalTexts } from "./legal-text.gen";
import { findCriterion } from "./wcag";

// Server functions for /prawo and /mapowanie. They keep the statute text and the Markdown parser
// out of the client bundle, as long as this file exports nothing but server functions and types.

type Terms = Record<string, { term: string; html: string }>;

function termsOf(content: ActContent): Terms {
  const terms: Terms = {};
  for (const slug of content.terms) {
    const entry = glossary.get(slug);
    if (entry) terms[slug] = { term: entry.term, html: entry.html };
  }
  return terms;
}

function contentOf(slug: ActSlug) {
  const content = actContent.get(slug);
  if (!content) throw new Error(`content/prawo/${slug}.md is missing`);
  return content;
}

/** The date the law was read on, shown as "stan prawny na" next to deadlines. */
const asOf = acts.map((a) => a.retrieved).toSorted().at(-1) ?? "";

/** What every legal page says about its act: names, source text and verification state. */
function actHeader(slug: ActSlug) {
  const act = findAct(slug);
  if (!act) throw new Error(`No act ${slug}`);
  const content = contentOf(slug);
  return {
    ...act,
    short: content.short,
    summary: content.summary,
    binds: content.binds,
    verification: content.status === "szkic" ? null : content.lastVerified,
  };
}

/** The acts with their deadlines, for /prawo and /mapowanie. */
export const getLawIndex = createServerFn({ method: "GET" }).handler(() => ({
  acts: acts.map((act) => actHeader(act.slug)),
  deadlines: deadlines.map((d) => ({ ...d, unitLabel: findUnit(d.unit)?.label ?? "", actShort: contentOf(d.act).short })),
  asOf,
}));

/** One act: its introduction and a table of contents by chapter, with our article titles. */
export const getAct = createServerFn({ method: "GET" })
  .validator(type("string"))
  .handler(({ data }) => {
    const act = findAct(data);
    if (!act) return null;
    const content = contentOf(act.slug);
    const entries = unitsOf(act.slug).map((unit) => {
      return {
        slug: unit.slug,
        label: unit.label,
        chapter: unit.chapter,
        title: content.articles[unit.id]?.title ?? "",
        stub: isStub(legalTexts[unit.id] ?? []),
      };
    });
    const chapters = act.chapters.length > 0 ? act.chapters : [{ number: 0, title: "" }];
    return {
      act: actHeader(act.slug),
      introHtml: content.introHtml,
      deadlines: content.deadlines.map((d) => ({ ...d, unitLabel: findUnit(d.unit)?.label ?? "" })),
      toc: chapters.map((chapter) => ({
        ...chapter,
        entries: entries.filter((e) => (act.chapters.length > 0 ? e.chapter === chapter.number : true)),
      })),
      terms: termsOf(content),
      draft: content.status === "szkic",
    };
  });

export type ArticleRow = { ust: string | null; summaryHtml: string; lines: LegalLine[] };

/**
 * One article for the parallel view (variant A of the legal mocks): rows of our summary next
 * to the statute text. With ustęp summaries each ustęp is a row; otherwise the whole article
 * is one row next to the article summary.
 */
export const getArticle = createServerFn({ method: "GET" })
  .validator(type({ act: "string", unit: "string" }))
  .handler(({ data }) => {
    const unit = findUnit(`${data.act}/${data.unit}`);
    if (!unit) return null;
    const content = contentOf(unit.act);
    const summary = content.articles[unit.id];
    const lines = [...(legalTexts[unit.id] ?? [])];

    const groups: ArticleRow[] = [];
    for (const line of lines) {
      const last = groups.at(-1);
      if (last && last.ust === line.ust) last.lines.push(line);
      else groups.push({ ust: line.ust, summaryHtml: "", lines: [line] });
    }
    const byUst = summary && Object.keys(summary.ust).length > 0;
    const rows: ArticleRow[] = byUst
      ? groups.map((group) => ({ ...group, summaryHtml: group.ust ? (summary.ust[group.ust] ?? "") : "" }))
      : [{ ust: null, summaryHtml: summary?.html ?? "", lines }];

    const siblings = unitsOf(unit.act);
    const index = siblings.findIndex((u) => u.id === unit.id);
    const neighbour = (offset: number) => {
      const other = siblings[index + offset];
      return other ? { slug: other.slug, label: other.label, title: content.articles[other.id]?.title ?? "" } : null;
    };

    const criteria = edgesFrom(unit.id).flatMap((edge) => {
      const criterion = findCriterion(edge.criterion);
      return criterion ? [{ ...edge, name: criterion.name, level: criterion.level, principle: criterion.principle }] : [];
    });

    return {
      act: actHeader(unit.act),
      unit: { id: unit.id, slug: unit.slug, label: unit.label },
      title: summary?.title ?? "",
      // The annex has no statute lines here (its table is in the PDF), so its summary leads the page.
      leadHtml: byUst || lines.length === 0 ? (summary?.html ?? "") : "",
      rows,
      criteria,
      prev: neighbour(-1),
      next: neighbour(1),
      terms: termsOf(content),
      draft: content.status === "szkic",
    };
  });
