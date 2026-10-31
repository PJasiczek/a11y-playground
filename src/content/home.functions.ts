import { createServerFn } from "@tanstack/react-start";
import { problems } from "./before-after";
import { examples } from "./examples";
import { glossary } from "./glossary";
import { acts } from "./legal";
import { learningPaths } from "./paths";
import { patterns } from "./patterns";
import { simulators } from "./simulators";
import { criteria, findCriterion, inVersion } from "./wcag";
import { wcag3Groups } from "./wcag3";

// Server functions for the home page. They keep the content files out of the client bundle, as
// long as this file exports nothing but server functions.

/**
 * Everything the home page shows about the rest of the app, counted from the content itself so
 * no number on the page can go stale: the example cards cheapest first, how many criteria,
 * patterns, problems and acts there are, the paths with their lessons (for progress), the
 * WCAG 3.0 guideline count, a few glossary terms to open with, and the names and summaries the
 * "Na dobry początek" cards quote.
 */
export const getHomePage = createServerFn({ method: "GET" }).handler(() => {
  const terms = [...glossary.values()];
  return {
    examples: [...examples.values()].map(({ slug, title, summary, criteria, effort, gain, preview }) => ({
      slug,
      title,
      summary,
      criteria,
      effort,
      gain,
      preview,
    })),
    criteria: criteria.filter((criterion) => inVersion(criterion, "2.2")).length,
    patterns: patterns.size,
    problems: problems.length,
    paths: [...learningPaths.values()].map(({ slug, title, summary, lessons }) => ({
      slug,
      title,
      summary,
      lessons: lessons.map((lesson) => ({ slug: lesson.slug, title: lesson.title })),
    })),
    acts: acts.length,
    wcag3Guidelines: wcag3Groups.reduce((sum, group) => sum + group.guidelines.length, 0),
    glossary: { count: terms.length, sample: terms.slice(0, 5).map(({ slug, term }) => ({ slug, term })) },
    contrast: findCriterion("1.4.3")?.name ?? "",
    keyboard: simulators.get("klawiatura")?.summary ?? "",
  };
});
