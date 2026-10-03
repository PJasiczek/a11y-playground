import MiniSearch from "minisearch";
import { criterionContent } from "~/content/criterion-content";
import { examples } from "~/content/examples";
import { glossary } from "~/content/glossary";
import { legalUnits } from "~/content/legal";
import { actContent, isStub } from "~/content/legal-content";
import { legalTexts } from "~/content/legal-text.gen";
import { learningPaths } from "~/content/paths";
import { patterns } from "~/content/patterns";
import { criteria } from "~/content/wcag";
import { wcag3Groups } from "~/content/wcag3";
import { type SearchDoc, searchOptions } from "./options";

// Server-only: reads every content file. The browser gets the serialized index from
// /search-index.json, which is prerendered as a static file.

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** Every criterion, glossary term, example, pattern, article, lesson and WCAG 3.0 guideline, as search documents. */
export function buildSearchDocs(): SearchDoc[] {
  const criterionDocs = criteria.map((c): SearchDoc => {
    const content = criterionContent.get(c.id);
    return {
      id: `kryterium:${c.id}`,
      kind: "kryterium",
      ref: c.id,
      title: c.name,
      summary: content?.summary ?? "",
      keywords: content?.keywords.join(" ") ?? "",
      body: content ? text(Object.values(content.sections).join(" ")) : "",
    };
  });
  const termDocs = [...glossary.values()].map(
    (entry): SearchDoc => ({
      id: `pojecie:${entry.slug}`,
      kind: "pojecie",
      ref: entry.slug,
      title: entry.term,
      summary: text(entry.html).split(". ")[0] ?? "",
      keywords: entry.also.join(" "),
      body: text(entry.html),
    }),
  );
  const exampleDocs = [...examples.values()].map(
    (example): SearchDoc => ({
      id: `przyklad:${example.slug}`,
      kind: "przyklad",
      ref: example.slug,
      title: example.title,
      summary: example.summary,
      keywords: example.criteria.join(" "),
      body: [text(example.introHtml), example.bad.why, example.good.why].join(" "),
    }),
  );
  // Patterns by our Polish name and Deque's English one, and by the attributes they use, so
  // "accordion", "akordeon" and "aria-expanded" all find them.
  const patternDocs = [...patterns.values()].map(
    (pattern): SearchDoc => ({
      id: `wzorzec:${pattern.slug}`,
      kind: "wzorzec",
      ref: pattern.slug,
      title: pattern.title,
      summary: pattern.summary,
      keywords: [pattern.en, ...pattern.aria.map((row) => row.attr), ...pattern.criteria].join(" "),
      body: text(Object.values(pattern.sections).join(" ")),
    }),
  );
  // Articles: our title and summary first, the statute text as the body, so "deklaracja
  // dostępności" finds art. 10 by its summary before any article that merely mentions it.
  const provisionDocs = legalUnits.flatMap((unit): SearchDoc[] => {
    const content = actContent.get(unit.act);
    const summary = content?.articles[unit.id];
    const lines = legalTexts[unit.id] ?? [];
    if (!content || (!summary && isStub(lines))) return [];
    return [
      {
        id: `przepis:${unit.id}`,
        kind: "przepis",
        ref: unit.id,
        title: `${unit.label}${summary?.title ? `. ${summary.title}` : ""}`,
        summary: content.short,
        keywords: summary?.title ?? "",
        body: [text(summary?.html ?? ""), ...Object.values(summary?.ust ?? {}).map(text), ...lines.map((line) => line.text)].join(" "),
      },
    ];
  });
  const lessonDocs = [...learningPaths.values()].flatMap((path) =>
    path.lessons.map(
      (lesson): SearchDoc => ({
        id: `lekcja:${path.slug}/${lesson.slug}`,
        kind: "lekcja",
        ref: `${path.slug}/${lesson.slug}`,
        title: lesson.title,
        summary: `${path.title}: ${lesson.summary}`,
        keywords: lesson.criteria.join(" "),
        body: [text(lesson.html), ...lesson.keep].join(" "),
      }),
    ),
  );
  // WCAG 3.0 guidelines by our Polish name and the draft's English one, so both find them.
  const wcag3Docs = wcag3Groups.flatMap((group) =>
    group.guidelines.map(
      (g): SearchDoc => ({
        id: `wcag3:${g.num}`,
        kind: "wcag3",
        ref: g.anchor,
        title: `${g.num} ${g.title}`,
        summary: g.criteria.length > 0 ? `Odpowiada dziś: ${g.criteria.join(", ")}` : "Nowe w 3.0",
        keywords: [g.en, group.title, ...g.criteria].join(" "),
        body: g.note ?? "",
      }),
    ),
  );
  return [...criterionDocs, ...termDocs, ...exampleDocs, ...patternDocs, ...provisionDocs, ...lessonDocs, ...wcag3Docs];
}

export function buildSearchIndex() {
  const index = new MiniSearch<SearchDoc>(searchOptions);
  index.addAll(buildSearchDocs());
  return index;
}
