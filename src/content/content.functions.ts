import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import readingOrders from "virtual:reading-order";
import { problemsFor, problemsForExample } from "./before-after";
import { type CriterionContent, criterionContent, strongerVersionsOf } from "./criterion-content";
import { examples } from "./examples";
import { glossary } from "./glossary";
import { lawRowsFor } from "./legal-content";
import { lessonsCovering } from "./paths";
import { patternsFor, patternsForExample } from "./patterns";
import { simulators } from "./simulators";
import { criteria, type CriterionId } from "./wcag";
import { criterionTexts } from "./wcag-text.gen";
import { wcag3GuidelinesFor } from "./wcag3";

// Server functions over content/. They keep the Markdown parser and the raw files out of the
// client bundle.

const CriterionIdInput = type.enumerated(...criteria.map((c) => c.id));

/**
 * Everything the criterion page shows beyond the structure: the editorial content (null until
 * written), the normative Polish text (null where no authorized translation exists), the short
 * definitions of the glossary terms the content marks, for the preview bubbles, the examples
 * that show the criterion, the lessons that teach it, which provisions require it, and the
 * stronger AAA criteria that tighten it, the WCAG 3.0 guidelines it corresponds to, the ARIA
 * patterns that show it, and the problems of the whole-page demo that break it.
 */
export const getCriterionPage = createServerFn({ method: "GET" })
  .validator(CriterionIdInput)
  .handler(({ data }) => {
    const content = criterionContent.get(data) ?? null;
    const terms: Record<string, { term: string; html: string }> = {};
    for (const slug of content?.terms ?? []) {
      const entry = glossary.get(slug);
      if (entry) terms[slug] = { term: entry.term, html: entry.html };
    }
    const relatedExamples = [...examples.values()]
      .filter((example) => example.criteria.includes(data))
      .map(({ slug, title, summary }) => ({ slug, title, summary }));
    return {
      content,
      normative: criterionTexts[data] ?? null,
      terms,
      examples: relatedExamples,
      lessons: lessonsCovering(data),
      law: lawRowsFor(data),
      stronger: strongerVersionsOf(data),
      wcag3: wcag3GuidelinesFor(data),
      patterns: patternsFor(data),
      beforeAfter: problemsFor(data),
    };
  });

/** The whole glossary for /slownik, in Polish alphabetical order, with the criteria that use each term. */
export const getGlossary = createServerFn({ method: "GET" }).handler(() => {
  const usedIn = new Map<string, CriterionId[]>();
  for (const [id, content] of criterionContent) {
    for (const slug of content.terms) usedIn.set(slug, [...(usedIn.get(slug) ?? []), id]);
  }
  const order = (id: CriterionId) => criteria.findIndex((c) => c.id === id);
  return [...glossary.values()].map((entry) => ({
    ...entry,
    criteria: (usedIn.get(entry.slug) ?? []).toSorted((a, b) => order(a) - order(b)),
  }));
});

/** What the criteria list shows per criterion, keyed by id. Criteria without content are absent. */
export const getCriteriaOverview = createServerFn({ method: "GET" }).handler(() => {
  const overview: Partial<Record<CriterionId, Pick<CriterionContent, "summary" | "status" | "roles">>> = {};
  for (const [id, { summary, status, roles }] of criterionContent) overview[id] = { summary, status, roles };
  return overview;
});

/**
 * One example with both fragments, or null for an unknown slug. Also the general description and
 * limits of every simulator kind, for the rail, the glossary terms both kinds of text mark, and
 * what a screen reader reads in each variant, for the "Czytnik ekranu" simulator, and the ARIA
 * patterns that show the fixed version, and the problems of the whole-page demo it shows alone.
 */
export const getExample = createServerFn({ method: "GET" })
  .validator(type("string"))
  .handler(({ data }) => {
    const example = examples.get(data);
    if (!example) return null;
    const kinds = [...simulators.values()];
    const terms: Record<string, { term: string; html: string }> = {};
    for (const slug of [...example.terms, ...kinds.flatMap((kind) => kind.terms)]) {
      const entry = glossary.get(slug);
      if (entry) terms[slug] = { term: entry.term, html: entry.html };
    }
    const descriptions = kinds.map(({ kind, html, limits }) => ({ kind, html, limits }));
    const none = { reading: [], tab: [] };
    const bad = readingOrders[data]?.bad ?? none;
    const good = readingOrders[data]?.good ?? none;
    return {
      example,
      terms,
      simulators: descriptions,
      reading: { bad: bad.reading, good: good.reading },
      tab: { bad: bad.tab, good: good.tab },
      patterns: patternsForExample(data),
      beforeAfter: problemsForExample(data),
    };
  });

/** Every example as a catalogue card, cheapest fix first. */
export const getExampleCards = createServerFn({ method: "GET" }).handler(() =>
  [...examples.values()].map(({ slug, title, summary, criteria, effort, gain, preview, status }) => ({
    slug,
    title,
    summary,
    criteria,
    effort,
    gain,
    preview,
    status,
  })),
);
