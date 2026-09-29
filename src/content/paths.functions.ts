import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { examples } from "./examples";
import { glossary } from "./glossary";
import { findUnit } from "./legal";
import { actContent } from "./legal-content";
import { learningPaths } from "./paths";
import { findCriterion } from "./wcag";

// Server functions for /sciezki. They keep the Markdown parser and the content files out of the
// client bundle, as long as this file exports nothing but server functions.

/** Short definitions of the glossary terms a text marks, for the preview bubbles. */
function termsOf(slugs: string[]) {
  const terms: Record<string, { term: string; html: string }> = {};
  for (const slug of slugs) {
    const entry = glossary.get(slug);
    if (entry) terms[slug] = { term: entry.term, html: entry.html };
  }
  return terms;
}

/** Every path with its lesson titles, for /sciezki. */
export const getPathList = createServerFn({ method: "GET" }).handler(() =>
  [...learningPaths.values()].map(({ slug, title, summary, lessons }) => ({
    slug,
    title,
    summary,
    lessons: lessons.map((lesson) => ({ slug: lesson.slug, title: lesson.title })),
  })),
);

/** One path with its lessons in order, or null for an unknown slug. */
export const getPathPage = createServerFn({ method: "GET" })
  .validator(type("string"))
  .handler(({ data }) => {
    const path = learningPaths.get(data);
    if (!path) return null;
    return {
      slug: path.slug,
      title: path.title,
      summary: path.summary,
      introHtml: path.introHtml,
      status: path.status,
      terms: termsOf(path.terms),
      lessons: path.lessons.map(({ slug, title, summary, criteria, law, quiz }) => ({
        slug,
        title,
        summary,
        criteria,
        law: law.map((id) => findUnit(id)?.label ?? id),
        questions: quiz.length,
      })),
    };
  });

/**
 * One lesson with what it points at resolved to names, its place in the path and its
 * neighbours, or null when the path or the lesson does not exist.
 */
export const getLessonPage = createServerFn({ method: "GET" })
  .validator(type({ path: "string", lesson: "string" }))
  .handler(({ data }) => {
    const path = learningPaths.get(data.path);
    const index = path?.lessons.findIndex((lesson) => lesson.slug === data.lesson) ?? -1;
    const lesson = path?.lessons[index];
    if (!path || !lesson) return null;
    const neighbour = (i: number) => {
      const other = path.lessons[i];
      return other ? { slug: other.slug, title: other.title } : null;
    };
    return {
      path: { slug: path.slug, title: path.title, lessonCount: path.lessons.length },
      number: index + 1,
      previous: neighbour(index - 1),
      next: neighbour(index + 1),
      lesson,
      terms: termsOf(lesson.terms),
      criteria: lesson.criteria.map((id) => ({ id, name: findCriterion(id)?.name ?? "" })),
      examples: lesson.examples.map((slug) => ({ slug, title: examples.get(slug)?.title ?? slug })),
      law: lesson.law.map((id) => {
        const unit = findUnit(id);
        const content = unit ? actContent.get(unit.act) : undefined;
        return { id, label: unit?.label ?? id, title: content?.articles[id]?.title ?? "", act: content?.short ?? "" };
      }),
    };
  });
