import { acts, legalUnits } from "./legal.gen.ts";
import { criteria } from "./wcag.gen.ts";

/**
 * The content folders the page list depends on. vite.config.ts reads them from disk, because
 * the config cannot use import.meta.glob; code inside the app passes the loaded content.
 */
export type SiteContent = {
  /** Example folders under content/praktyka; each has a page and two demo documents for its iframes. */
  examples: readonly string[];
  /** Pattern folders under content/wzorce; each has a page and a demo document with the live log. */
  patterns: readonly string[];
  /** Problems of the whole-page demo, numbered from 1. */
  problemCount: number;
};

/**
 * Pages the prerender has to be told about. Crawling finds the linked pages; criterion and law
 * pages are listed because some (4.1.1, repealed articles) are only linked from filtered views
 * or not at all.
 */
export function sitePages({ examples, patterns, problemCount }: SiteContent): string[] {
  return [
    ...criteria.map((c) => `/kryteria/${c.id}`),
    ...acts.map((act) => `/prawo/${act.slug}`),
    ...legalUnits.map((unit) => `/prawo/${unit.id}`),
    ...examples.flatMap((slug) => [`/praktyka/${slug}`, `/demo/${slug}/bad`, `/demo/${slug}/good`]),
    ...patterns.flatMap((slug) => [`/praktyka/wzorce/${slug}`, `/demo/wzorce/${slug}`]),
    // The whole-page demo: its pages in the app, and the broken, marked and fixed documents.
    "/praktyka/przed-i-po",
    "/praktyka/przed-i-po/lista",
    ...Array.from({ length: problemCount }, (_, i) => `/praktyka/przed-i-po/${String(i + 1)}`),
    "/demo/przed-i-po/przed",
    "/demo/przed-i-po/przed-znaczniki",
    "/demo/przed-i-po/po",
  ];
}
