import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { problemsForPattern } from "./before-after";
import { examples } from "./examples";
import { glossary } from "./glossary";
import { patterns } from "./patterns";

// Server functions for /praktyka/wzorce. They keep the Markdown parser and the content files out
// of the client bundle, as long as this file exports nothing but server functions.

/**
 * One pattern, or null for an unknown slug, with the short definitions of the glossary terms
 * its sections mark, the practice examples that show the same thing broken, and the problems of
 * the whole-page demo it fixes.
 */
export const getPattern = createServerFn({ method: "GET" })
  .validator(type("string"))
  .handler(({ data }) => {
    const pattern = patterns.get(data);
    if (!pattern) return null;
    const terms: Record<string, { term: string; html: string }> = {};
    for (const slug of pattern.terms) {
      const entry = glossary.get(slug);
      if (entry) terms[slug] = { term: entry.term, html: entry.html };
    }
    const related = pattern.examples.flatMap((slug) => {
      const example = examples.get(slug);
      return example ? [{ slug, title: example.title, summary: example.summary }] : [];
    });
    return { pattern, terms, examples: related, beforeAfter: problemsForPattern(data) };
  });

/** Every pattern as a catalogue card, in batch order. */
export const getPatternCards = createServerFn({ method: "GET" }).handler(() =>
  [...patterns.values()].map(({ slug, title, en, batch, native, summary, criteria, preview, status }) => ({
    slug,
    title,
    en,
    batch,
    native,
    summary,
    criteria,
    preview,
    status,
  })),
);
