import { problems } from "./before-after";
import { examples } from "./examples";
import { learningPaths } from "./paths";
import { patterns } from "./patterns";
import { type SitePage, sitePages } from "./site-pages";

/** Every page of the app from the loaded content. Server-only, for the sitemap. */
export const allPages: readonly SitePage[] = sitePages({
  examples: [...examples.keys()],
  patterns: [...patterns.keys()],
  problemCount: problems.length,
  paths: [...learningPaths.values()].map((path) => ({ slug: path.slug, lessons: path.lessons.map((lesson) => lesson.slug) })),
});
