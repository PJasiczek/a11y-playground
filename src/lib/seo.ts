import type { AnyRouteMatch } from "@tanstack/react-router";
import type { Thing, WithContext } from "schema-dts";
import { siteName, siteUrl } from "./site";

type Head = {
  meta: NonNullable<AnyRouteMatch["meta"]>;
  links: NonNullable<AnyRouteMatch["links"]>;
  /** JSON-LD only, so the children are always a string. */
  scripts: Array<{ type: "application/ld+json"; children: string }>;
};

/** What one page says about itself to search engines and link previews. */
export type PageMeta = {
  /** Without the site name, which pageHead appends. Omitted on the home page, which is only the name. */
  title?: string;
  description: string;
  /** The route's `match.pathname`. */
  path: string;
  /** Kept out of search results. Such a page gets no canonical link, which would say the opposite. */
  noindex?: boolean;
  /** JSON-LD blocks from structured-data.ts. */
  jsonLd?: ReadonlyArray<WithContext<Thing>>;
};

/** Search engines cut longer descriptions themselves, mid-word. */
const maxDescription = 160;

/** Shortens text to `maxDescription` characters at a word boundary, ending with an ellipsis. */
export function clip(text: string) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= maxDescription) return flat;
  const cut = flat.slice(0, maxDescription - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:]+$/, "")}…`;
}

/** The absolute address of a path, without a trailing slash, so /kryteria/ and /kryteria are one page. */
export function absoluteUrl(path: string) {
  return siteUrl + (path === "/" ? "/" : path.replace(/\/+$/, ""));
}

/**
 * The `head` of a page: title, description, canonical link, the Open Graph tags and JSON-LD.
 * The root route sets what every page shares (site name, locale); tags here replace the root's
 * by name.
 *
 *     head: ({ loaderData, match }) =>
 *       loaderData ? pageHead({ title: loaderData.title, description: loaderData.summary, path: match.pathname }) : {},
 */
export function pageHead({ title, description, path, noindex = false, jsonLd = [] }: PageMeta): Head {
  const fullTitle = title ? `${title} · ${siteName}` : siteName;
  const text = clip(description);
  const url = absoluteUrl(path);
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: text },
      { property: "og:title", content: title ?? siteName },
      { property: "og:description", content: text },
      { property: "og:url", content: url },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: noindex ? [] : [{ rel: "canonical", href: url }],
    // `<` escaped, so no string in the data can close the script element.
    scripts: jsonLd.map((block) => ({ type: "application/ld+json", children: JSON.stringify(block).replace(/</g, "\\u003c") })),
  };
}
