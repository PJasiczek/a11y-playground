import type { FileRoutesByTo } from "../routeTree.gen.ts";
import { acts, legalUnits } from "./legal.gen.ts";
import { criteria } from "./wcag.gen.ts";

/**
 * The content folders the page list depends on. vite.config.ts and the e2e tests read them from
 * disk (site-pages.node.ts), because they cannot use import.meta.glob; the app passes the loaded
 * content (site-content.ts).
 */
export type SiteContent = {
  /** Example folders under content/praktyka; each has a page and two demo documents for its iframes. */
  examples: readonly string[];
  /** Pattern folders under content/wzorce; each has a page and a demo document with the live log. */
  patterns: readonly string[];
  /** Problems of the whole-page demo, numbered from 1. */
  problemCount: number;
  /** Learning paths under content/sciezki with their lesson slugs. */
  paths: ReadonlyArray<{ slug: string; lessons: readonly string[] }>;
};

/** One page of the app. `index` says whether search engines should list it (and so the sitemap). */
export type SitePage = { path: string; index: boolean };

/** Routes without parameters. Files like /search-index.json are not pages. */
type StaticPath = Exclude<keyof FileRoutesByTo, `${string}$${string}` | `${string}.${string}`>;

/**
 * Every route without parameters and whether it is indexed. A new route fails `tsc` until it is
 * listed here, so the sitemap cannot miss it.
 */
const staticPages = {
  "/": true,
  "/kryteria": true,
  "/praktyka": true,
  "/praktyka/wzorce": true,
  "/praktyka/przed-i-po": true,
  // Until the reader finishes checking, the list holds only "Najpierw sprawdź stronę sam".
  "/praktyka/przed-i-po/lista": false,
  "/prawo": true,
  "/prawo/en-301-549": true,
  "/mapowanie": true,
  "/sciezki": true,
  "/slownik": true,
  "/symulatory": true,
  "/wcag-3": true,
  // A results page; search engines ask sites not to list those.
  "/szukaj": false,
} satisfies Record<StaticPath, boolean>;

const indexed = (path: string): SitePage => ({ path, index: true });
const hidden = (path: string): SitePage => ({ path, index: false });

/**
 * Every page of the app: what the prerender renders and what the sitemap lists. Crawling would
 * find most of them, but some (4.1.1, repealed articles) are only linked from filtered views or
 * not at all.
 */
export function sitePages({ examples, patterns, problemCount, paths }: SiteContent): SitePage[] {
  return [
    ...Object.entries(staticPages).map(([path, index]) => ({ path, index })),
    ...criteria.map((c) => indexed(`/kryteria/${c.id}`)),
    ...acts.map((act) => indexed(`/prawo/${act.slug}`)),
    ...legalUnits.map((unit) => indexed(`/prawo/${unit.id}`)),
    ...paths.flatMap(({ slug, lessons }) => [
      indexed(`/sciezki/${slug}`),
      ...lessons.map((lesson) => indexed(`/sciezki/${slug}/${lesson}`)),
    ]),
    ...examples.flatMap((slug) => [indexed(`/praktyka/${slug}`), hidden(`/demo/${slug}/bad`), hidden(`/demo/${slug}/good`)]),
    ...patterns.flatMap((slug) => [indexed(`/praktyka/wzorce/${slug}`), hidden(`/demo/wzorce/${slug}`)]),
    // The problems give the answers away, like the list; the documents are the broken, marked and fixed page.
    ...Array.from({ length: problemCount }, (_, i) => hidden(`/praktyka/przed-i-po/${String(i + 1)}`)),
    hidden("/demo/przed-i-po/przed"),
    hidden("/demo/przed-i-po/przed-znaczniki"),
    hidden("/demo/przed-i-po/po"),
  ];
}
