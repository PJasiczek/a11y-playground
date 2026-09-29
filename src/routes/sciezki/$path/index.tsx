import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DraftBadge } from "~/components/level-badge";
import { lessonNumber, pathProgress, ProgressNote } from "~/components/paths";
import { TermTips } from "~/components/term-tips";
import { getPathPage } from "~/content/paths.functions";
import { countOf } from "~/lib/plural";
import { type LessonKey, useProgress } from "~/progress/store";

export const Route = createFileRoute("/sciezki/$path/")({
  loader: async ({ params }) => {
    const path = await getPathPage({ data: params.path });
    if (!path) throw notFound();
    return path;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.title} · Ścieżki · a11y playground` : "a11y playground" }],
  }),
  component: PathPage,
});

/** One path as a syllabus: lessons in order with their criteria and status (variant 2A of the paths mocks). */
function PathPage() {
  const path = Route.useLoaderData();
  const snapshot = useProgress();
  const { done, isDone, next } = pathProgress(snapshot, { path: path.slug, lessons: path.lessons });
  const total = path.lessons.length;

  return (
    <>
      <nav aria-label="Okruszki" className="pt-4 font-mono text-[0.8125rem] text-ink-2">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/sciezki" className="inline-flex min-h-11 items-center underline underline-offset-3">
              Ścieżki
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">{path.title}</span>
          </li>
        </ol>
      </nav>

      <header className="pt-3 pb-2">
        <h1 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[clamp(1.5rem,4vw,2rem)] leading-tight font-bold tracking-tight">
          {path.title}
          {path.status === "szkic" ? <DraftBadge /> : null}
        </h1>
        <p className="mt-2 max-w-[62ch] text-[1.0625rem] text-ink-2">
          {path.summary} {countOf(total, ["lekcja", "lekcje", "lekcji"])}.
        </p>
        <TermTips terms={path.terms}>
          <div className="prose mt-3" dangerouslySetInnerHTML={{ __html: path.introHtml }} />
        </TermTips>
      </header>

      <div className="my-6 flex min-h-[4.25rem] flex-wrap items-center gap-x-5 gap-y-2 border border-rule bg-surface px-4 py-3">
        {next ? (
          <>
            {done > 0 ? <span>{`Ukończono ${String(done)} z ${String(total)} lekcji.`}</span> : null}
            <Link
              to="/sciezki/$path/$lesson"
              params={{ path: path.slug, lesson: next.slug }}
              className="inline-flex min-h-11 items-center rounded border border-ink bg-ink px-4 font-semibold text-paper"
            >
              {done > 0 ? "Dalej" : "Zacznij"}: {lessonNumber(next.number)} {next.title}
            </Link>
          </>
        ) : (
          <span className="font-semibold">
            <span aria-hidden="true">✓ </span>Ścieżka ukończona: wszystkie {String(total)} lekcji.
          </span>
        )}
      </div>

      <ol className="border-t-2 border-ink">
        {path.lessons.map((lesson, i) => {
          const key: LessonKey = `${path.slug}/${lesson.slug}`;
          const attempt = snapshot.progress.quizzes[key];
          const isNext = next?.slug === lesson.slug && done > 0;
          return (
            <li
              key={lesson.slug}
              className={`grid grid-cols-[2.5rem_1fr] gap-x-5 gap-y-1 border-b border-rule py-4 sm:grid-cols-[3rem_1fr_auto] ${isNext ? "bg-surface shadow-[inset_3px_0_0_var(--ink)]" : ""}`}
            >
              <span aria-hidden="true" className={`pt-0.5 font-mono text-lg font-bold ${isNext ? "pl-2" : ""}`}>
                {lessonNumber(i + 1)}
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  <Link
                    to="/sciezki/$path/$lesson"
                    params={{ path: path.slug, lesson: lesson.slug }}
                    className="inline-flex min-h-11 items-center text-accent underline underline-offset-3"
                  >
                    {lesson.title}
                  </Link>
                </h2>
                <p className="max-w-[62ch] text-ink-2">{lesson.summary}</p>
                {lesson.criteria.length > 0 || lesson.law.length > 0 ? (
                  <p className="mt-2 flex flex-wrap gap-1.5 font-mono text-xs text-ink-2">
                    <span className="sr-only">
                      {lesson.law.length === 0 ? "Kryteria:" : lesson.criteria.length === 0 ? "Przepisy:" : "Kryteria i przepisy:"}
                    </span>
                    {[...lesson.criteria, ...lesson.law].map((code) => (
                      <span key={code} className="border border-rule px-1.5 py-0.5">
                        {code}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
              <p className="col-start-2 flex min-h-5 flex-wrap gap-x-4 font-mono text-[0.8125rem] sm:col-start-3 sm:grid sm:content-start sm:justify-items-end sm:text-right">
                {isDone(lesson.slug) ? (
                  <span className="font-semibold">
                    <span aria-hidden="true">✓ </span>ukończona
                  </span>
                ) : isNext ? (
                  <span className="font-semibold">
                    <span aria-hidden="true">→ </span>następna
                  </span>
                ) : null}
                {attempt ? (
                  <span className="text-ink-2">
                    quiz {String(attempt.score)} z {String(attempt.total)}
                  </span>
                ) : null}
              </p>
            </li>
          );
        })}
      </ol>
      <ProgressNote snapshot={snapshot} />
    </>
  );
}
