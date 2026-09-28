import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { type CriterionContent, criterionContent } from "./criterion-content";
import { examples } from "./examples";
import { glossary } from "./glossary";
import { criteria, type CriterionId } from "./wcag";
import { criterionTexts } from "./wcag-text.gen";

// Server functions over content/. They keep the Markdown parser and the raw files out of the
// client bundle.

const CriterionIdInput = type.enumerated(...criteria.map((c) => c.id));

/**
 * Everything the criterion page shows beyond the structure: the editorial content (null until
 * written), the normative Polish text (null where no authorized translation exists), and the
 * short definitions of the glossary terms the content marks, for the preview bubbles.
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
    return { content, normative: criterionTexts[data] ?? null, terms };
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

/** One example with both fragments, or null for an unknown slug. */
export const getExample = createServerFn({ method: "GET" })
  .validator(type("string"))
  .handler(({ data }) => {
    const example = examples.get(data);
    if (!example) return null;
    const terms: Record<string, { term: string; html: string }> = {};
    for (const slug of example.terms) {
      const entry = glossary.get(slug);
      if (entry) terms[slug] = { term: entry.term, html: entry.html };
    }
    return { example, terms };
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
