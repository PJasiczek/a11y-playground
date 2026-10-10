import type {
  BreadcrumbList,
  Course,
  DefinedTermSet,
  LearningResource,
  Legislation,
  Question,
  WebSite,
  WithContext,
} from "schema-dts";
import { absoluteUrl } from "./seo";
import { siteName, siteUrl } from "./site";

// JSON-LD for the pages that have something to describe. Each builder returns one block; pass it
// to pageHead as `jsonLd`, which puts it in the head as <script type="application/ld+json">.

const context = "https://schema.org";
const site = { "@type": "Organization", name: siteName, url: `${siteUrl}/` } as const;

/** Text of rendered Markdown, for descriptions. Our own content, so only the entities marked emits. */
export function plainText(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** The site itself, on the home page. Search engines take the site name in results from it. */
export function websiteLd(): WithContext<WebSite> {
  return { "@context": context, "@type": "WebSite", name: siteName, url: `${siteUrl}/`, inLanguage: "pl" };
}

/** The trail the page shows in its "Okruszki" navigation, ending with the page itself. */
export function breadcrumbLd(crumbs: ReadonlyArray<{ name: string; path: string }>): WithContext<BreadcrumbList> {
  return {
    "@context": context,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

/** The glossary as a set of defined terms, each with its plain-language explanation. */
export function glossaryLd(entries: ReadonlyArray<{ slug: string; term: string; html: string }>): WithContext<DefinedTermSet> {
  const url = absoluteUrl("/slownik");
  return {
    "@context": context,
    "@type": "DefinedTermSet",
    name: `Słownik · ${siteName}`,
    url,
    inLanguage: "pl",
    hasDefinedTerm: entries.map((entry) => ({
      "@type": "DefinedTerm",
      name: entry.term,
      description: plainText(entry.html),
      url: `${url}#${entry.slug}`,
    })),
  };
}

type PathSummary = { title: string; summary: string; path: string; lessons: ReadonlyArray<{ title: string; path: string }> };

/** A learning path as a free course made of its lessons. */
export function courseLd({ title, summary, path, lessons }: PathSummary): WithContext<Course> {
  return {
    "@context": context,
    "@type": "Course",
    name: title,
    description: summary,
    url: absoluteUrl(path),
    inLanguage: "pl",
    isAccessibleForFree: true,
    provider: site,
    hasPart: lessons.map((lesson) => ({ "@type": "LearningResource", name: lesson.title, url: absoluteUrl(lesson.path) })),
  };
}

type LessonSummary = {
  title: string;
  summary: string;
  path: string;
  course: { title: string; path: string };
  quiz: ReadonlyArray<{ prompt: string; options: ReadonlyArray<{ label: string; correct: boolean }> }>;
};

/** A lesson with its quiz. The answers are already in the page's loader data, so this gives nothing new away. */
export function lessonLd({ title, summary, path, course, quiz }: LessonSummary): WithContext<LearningResource> {
  const questions: Question[] = quiz.map(({ prompt, options }) => ({
    "@type": "Question",
    name: prompt,
    eduQuestionType: "Multiple choice",
    acceptedAnswer: options.filter((o) => o.correct).map((o) => ({ "@type": "Answer", text: o.label })),
    suggestedAnswer: options.filter((o) => !o.correct).map((o) => ({ "@type": "Answer", text: o.label })),
  }));
  return {
    "@context": context,
    "@type": "LearningResource",
    name: title,
    description: summary,
    url: absoluteUrl(path),
    inLanguage: "pl",
    learningResourceType: "lesson",
    isAccessibleForFree: true,
    isPartOf: { "@type": "Course", name: course.title, url: absoluteUrl(course.path) },
    hasPart: { "@type": "Quiz", name: `Quiz: ${title}`, hasPart: questions },
  };
}

type ActSummary = { title: string; address: string; isap: string; consolidated?: { date: string } | null };

/** An act, dated by the consolidated text the app quotes when there is one. */
function act({ title, address, isap, consolidated }: ActSummary): Legislation {
  return {
    "@type": "Legislation",
    name: title,
    legislationIdentifier: address,
    legislationJurisdiction: "PL",
    legislationType: "ustawa",
    ...(consolidated ? { legislationDateVersion: consolidated.date } : {}),
    sameAs: isap,
    inLanguage: "pl",
  };
}

/** An act page: the act as legislation, pointing at its record in ISAP. */
export function actLd(summary: ActSummary, path: string): WithContext<Legislation> {
  return { "@context": context, ...act(summary), url: absoluteUrl(path) };
}

/** An article page: the article as legislation that is part of its act. */
export function articleLd(label: string, summary: ActSummary, path: string): WithContext<Legislation> {
  return {
    "@context": context,
    "@type": "Legislation",
    name: `${label}, ${summary.title}`,
    url: absoluteUrl(path),
    inLanguage: "pl",
    isPartOf: act(summary),
  };
}
