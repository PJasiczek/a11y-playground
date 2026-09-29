import { type } from "arktype";
import { parse as parseYaml } from "yaml";
import { examples } from "./examples";
import { isLegalUnitId, type LegalUnitId } from "./legal";
import { type Fail, IsoDate, readVerification, splitFrontmatter, Status, type Verification } from "./markdown";
import { createRenderer } from "./render";
import { type Role, roles } from "./sections";
import { type CriterionId, findCriterion, isCriterionId } from "./wcag";

/**
 * Learning paths, one folder per path in content/sciezki/<path>/: index.md for the path,
 * <lesson>.md for each lesson and <lesson>.quiz.yaml for its quiz. Server-only, like the other
 * content modules.
 */

const PathFrontmatter = type({
  title: "string > 0",
  /** The role the path is for. The legal minimum path is for an organisation, so it has none. */
  "role?": type.enumerated(...roles),
  summary: "0 < string <= 200",
  lessons: "string[] > 0",
  status: Status,
  "lastVerified?": IsoDate,
  "+": "reject",
});

const LessonFrontmatter = type({
  title: "string > 0",
  summary: "0 < string <= 200",
  "criteria?": "string[]",
  "examples?": "string[]",
  "law?": "string[]",
  keep: "2 <= string[] <= 4",
  status: Status,
  "lastVerified?": IsoDate,
  "+": "reject",
});

// An option is either our own text or a criterion, whose number and name come from the registry.
const QuizOption = type({
  "text?": "string > 0",
  "criterion?": "string",
  "correct?": "boolean",
  why: "string > 0",
  "+": "reject",
});

const QuizFile = type({
  id: /^[a-z0-9-]+$/,
  prompt: "string > 0",
  "code?": "string > 0",
  options: QuizOption.array().atLeastLength(2),
  "+": "reject",
}).array();

/** Every quiz has this many questions, so a lesson stays a lesson and not an exam. */
export const quizLength = { min: 3, max: 5 } as const;

export type QuizOption = {
  label: string;
  /** Set when the option names a criterion, so the page can link it after checking. */
  criterion: CriterionId | null;
  correct: boolean;
  why: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  /** A snippet the question is about, shown as code. */
  code: string | null;
  /** More than one correct option makes it a "select all that apply" question with checkboxes. */
  multiple: boolean;
  options: QuizOption[];
};

export type Lesson = Verification & {
  slug: string;
  title: string;
  summary: string;
  criteria: CriterionId[];
  examples: string[];
  law: LegalUnitId[];
  /** The "Zapamiętaj" box. */
  keep: string[];
  html: string;
  terms: string[];
  quiz: QuizQuestion[];
};

export type LearningPath = Verification & {
  slug: string;
  title: string;
  role: Role | null;
  summary: string;
  introHtml: string;
  terms: string[];
  /** In reading order. */
  lessons: Lesson[];
};

/** Parses a quiz file. Throws through `fail` on a question that cannot be scored or rendered. */
export function parseQuiz(source: string, fail: Fail): QuizQuestion[] {
  const questions = QuizFile(parseYaml(source));
  if (questions instanceof type.errors) throw fail(questions.summary);
  if (questions.length < quizLength.min || questions.length > quizLength.max) {
    throw fail(`a quiz has ${String(quizLength.min)} to ${String(quizLength.max)} questions, found ${String(questions.length)}`);
  }
  const ids = new Set<string>();
  return questions.map((question) => {
    if (ids.has(question.id)) throw fail(`question id "${question.id}" is repeated`);
    ids.add(question.id);
    const options = question.options.map((option): QuizOption => {
      if ((option.text === undefined) === (option.criterion === undefined)) {
        throw fail(`question "${question.id}": an option has either text or criterion`);
      }
      const criterion = option.criterion === undefined ? undefined : findCriterion(option.criterion);
      if (option.criterion !== undefined && !criterion) {
        throw fail(`question "${question.id}": unknown criterion ${option.criterion}`);
      }
      return {
        label: criterion ? `${criterion.id} ${criterion.name}` : (option.text ?? ""),
        criterion: criterion?.id ?? null,
        correct: option.correct ?? false,
        why: option.why,
      };
    });
    const correct = options.filter((option) => option.correct).length;
    if (correct === 0) throw fail(`question "${question.id}" has no correct option`);
    return { id: question.id, prompt: question.prompt, code: question.code ?? null, multiple: correct > 1, options };
  });
}

/** Parses one lesson from its Markdown and quiz files. */
export function parseLesson(file: string, slug: string, source: string, quiz: string | undefined): Lesson {
  const fail: Fail = (reason) => new Error(`${file}: ${reason}`);
  const { data, body } = splitFrontmatter(source, fail);
  const meta = LessonFrontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);

  const criteria = meta.criteria ?? [];
  const unknownCriteria = criteria.filter((id) => !isCriterionId(id));
  if (unknownCriteria.length > 0) throw fail(`criteria lists unknown criteria: ${unknownCriteria.join(", ")}`);
  const unknownExamples = (meta.examples ?? []).filter((example) => !examples.has(example));
  if (unknownExamples.length > 0) throw fail(`examples lists unknown examples: ${unknownExamples.join(", ")}`);
  const law = meta.law ?? [];
  const unknownLaw = law.filter((id) => !isLegalUnitId(id));
  if (unknownLaw.length > 0) throw fail(`law lists unknown provisions: ${unknownLaw.join(", ")}`);
  if (body.trim() === "") throw fail("the lesson is empty");
  if (quiz === undefined) throw fail(`${slug}.quiz.yaml is missing`);

  const { terms, render } = createRenderer(fail);
  return {
    ...readVerification(meta, fail),
    slug,
    title: meta.title,
    summary: meta.summary,
    criteria: criteria.filter(isCriterionId),
    examples: meta.examples ?? [],
    law: law.filter(isLegalUnitId),
    keep: meta.keep,
    html: render(body.trim()),
    terms,
    quiz: parseQuiz(quiz, (reason) => fail(`quiz: ${reason}`)),
  };
}

/**
 * Parses one path folder. `lessons` holds every lesson file in the folder keyed by slug; the
 * path's `lessons` list must name each of them exactly once, which sets the reading order.
 */
export function parsePath(
  slug: string,
  files: { index: string; lessons: ReadonlyMap<string, { source: string; quiz: string | undefined }> },
): LearningPath {
  const folder = `content/sciezki/${slug}`;
  const fail: Fail = (reason) => new Error(`${folder}: ${reason}`);
  const { data, body } = splitFrontmatter(files.index, fail);
  const meta = PathFrontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);

  const listed = new Set(meta.lessons);
  if (listed.size !== meta.lessons.length) throw fail("lessons lists a lesson twice");
  const missing = meta.lessons.filter((lesson) => !files.lessons.has(lesson));
  if (missing.length > 0) throw fail(`lessons lists missing files: ${missing.join(", ")}`);
  const unlisted = [...files.lessons.keys()].filter((lesson) => !listed.has(lesson));
  if (unlisted.length > 0) throw fail(`lesson files not in lessons: ${unlisted.join(", ")}`);

  const { terms, render } = createRenderer(fail);
  return {
    ...readVerification(meta, fail),
    slug,
    title: meta.title,
    role: meta.role ?? null,
    summary: meta.summary,
    introHtml: render(body.trim()),
    terms,
    lessons: meta.lessons.map((lesson) => {
      const file = files.lessons.get(lesson);
      if (!file) throw fail(`${lesson}.md is missing`);
      return parseLesson(`${folder}/${lesson}.md`, lesson, file.source, file.quiz);
    }),
  };
}

/** Lessons that list a criterion, in path order, for the "W ścieżkach" line on criterion pages. */
export function lessonsCovering(id: CriterionId) {
  return [...learningPaths.values()].flatMap((path) =>
    path.lessons
      .filter((lesson) => lesson.criteria.includes(id))
      .map((lesson) => ({ path: path.slug, pathTitle: path.title, lesson: lesson.slug, title: lesson.title })),
  );
}

const markdownFiles = import.meta.glob<string>("/content/sciezki/*/*.md", { query: "?raw", import: "default", eager: true });
const quizFiles = import.meta.glob<string>("/content/sciezki/*/*.quiz.yaml", { query: "?raw", import: "default", eager: true });

/** Path folders in the order /sciezki lists them: the four roles, then the legal minimum. */
const pathOrder = ["programista", "projektant", "autor-tresci", "tester", "minimum-prawne"];

/** Every path keyed by slug, in the order of `pathOrder`, unknown folders last. */
export const learningPaths: ReadonlyMap<string, LearningPath> = (() => {
  type Folder = { index?: string; lessons: Map<string, { source: string; quiz: string | undefined }> };
  const folders = new Map<string, Folder>();
  for (const [path, source] of Object.entries(markdownFiles)) {
    const [folder = "", name = ""] = path.slice("/content/sciezki/".length).split("/");
    const entry: Folder = folders.get(folder) ?? { lessons: new Map() };
    folders.set(folder, entry);
    const lesson = name.slice(0, -".md".length);
    if (lesson === "index") entry.index = source;
    else entry.lessons.set(lesson, { source, quiz: quizFiles[`/content/sciezki/${folder}/${lesson}.quiz.yaml`] });
  }
  for (const path of Object.keys(quizFiles)) {
    if (!(path.replace(/\.quiz\.yaml$/, ".md") in markdownFiles)) throw new Error(`${path.slice(1)}: no lesson with this name`);
  }
  const rank = (slug: string) => (pathOrder.includes(slug) ? pathOrder.indexOf(slug) : pathOrder.length);
  return new Map(
    [...folders]
      .toSorted(([a], [b]) => rank(a) - rank(b))
      .map(([slug, { index, lessons }]) => {
        if (index === undefined) throw new Error(`content/sciezki/${slug}: index.md is missing`);
        return [slug, parsePath(slug, { index, lessons })];
      }),
  );
})();
