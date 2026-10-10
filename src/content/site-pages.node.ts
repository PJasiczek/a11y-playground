import { readdirSync } from "node:fs";
import type { SiteContent } from "./site-pages.ts";

/** The content site-pages.ts needs, read from the content/ folders. For vite.config.ts and the e2e tests. */
export function siteContentFromDisk(): SiteContent {
  return {
    examples: readdirSync("content/praktyka"),
    patterns: readdirSync("content/wzorce"),
    // One file per problem, numbered from 01.
    problemCount: readdirSync("content/przed-i-po/problemy").length,
    paths: readdirSync("content/sciezki").map((slug) => ({
      slug,
      lessons: readdirSync(`content/sciezki/${slug}`)
        .filter((file) => file.endsWith(".md") && file !== "index.md")
        .map((file) => file.slice(0, -".md".length)),
    })),
  };
}
