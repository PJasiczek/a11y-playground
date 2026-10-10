import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProvisionLink } from "~/components/legal";
import { DraftBadge } from "~/components/level-badge";
import { Quiz } from "~/components/quiz";
import { TermTips } from "~/components/term-tips";
import { getLessonPage } from "~/content/paths.functions";
import { type LessonKey, progressStore, useProgress } from "~/progress/store";
import { pageHead } from "~/lib/seo";
import { breadcrumbLd, lessonLd } from "~/lib/structured-data";

export const Route = createFileRoute("/sciezki/$path/$lesson")({
  loader: async ({ params }) => {
    const found = await getLessonPage({ data: { path: params.path, lesson: params.lesson } });
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData, match }) =>
    loaderData
      ? pageHead({
          title: `${loaderData.lesson.title} · ${loaderData.path.title}`,
          description: loaderData.lesson.summary,
          path: match.pathname,
          jsonLd: [
            lessonLd({
              title: loaderData.lesson.title,
              summary: loaderData.lesson.summary,
              path: match.pathname,
              course: { title: loaderData.path.title, path: `/sciezki/${loaderData.path.slug}` },
              quiz: loaderData.lesson.quiz,
            }),
            breadcrumbLd([
              { name: "Ścieżki", path: "/sciezki" },
              { name: loaderData.path.title, path: `/sciezki/${loaderData.path.slug}` },
              { name: loaderData.lesson.title, path: match.pathname },
            ]),
          ],
        })
      : {},
  component: LessonPage,
});

const chip = "inline-flex min-h-11 items-center rounded border border-control bg-surface px-3 hover:border-ink";

/** One lesson in one column: text, what to remember, material, quiz, done and next (variant 3A of the paths mocks). */
function LessonPage() {
  const { path, number, previous, next, lesson, terms, criteria, examples, law } = Route.useLoaderData();
  const key: LessonKey = `${path.slug}/${lesson.slug}`;
  const { progress } = useProgress();
  const done = progress.lessons[key] !== undefined;

  return (
    <article>
      <nav aria-label="Okruszki" className="pt-4 font-mono text-[0.8125rem] text-ink-2">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/sciezki" className="inline-flex min-h-11 items-center underline underline-offset-3">
              Ścieżki
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/sciezki/$path" params={{ path: path.slug }} className="inline-flex min-h-11 items-center underline underline-offset-3">
              {path.title}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">
              Lekcja {String(number)} z {String(path.lessonCount)}
            </span>
          </li>
        </ol>
      </nav>

      <header className="pt-3 pb-2">
        <h1 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[clamp(1.5rem,4vw,2rem)] leading-tight font-bold tracking-tight">
          {lesson.title}
          {lesson.status === "szkic" ? <DraftBadge /> : null}
        </h1>
        <p className="mt-2 max-w-[62ch] text-[1.0625rem] text-ink-2">{lesson.summary}</p>
      </header>

      <TermTips terms={terms}>
        <div className="prose mt-4 text-[1.0625rem]" dangerouslySetInnerHTML={{ __html: lesson.html }} />
      </TermTips>

      <section aria-labelledby="keep-title" className="my-6 max-w-[68ch] border border-l-4 border-rule border-l-marker bg-surface px-5 py-4">
        <h2 id="keep-title" className="font-bold">
          Zapamiętaj
        </h2>
        <ul className="mt-1 list-disc pl-5">
          {lesson.keep.map((line) => (
            <li key={line} className="py-0.5">
              {line}
            </li>
          ))}
        </ul>
      </section>

      {criteria.length + examples.length + law.length > 0 ? (
        <section aria-labelledby="material-title" className="mt-8 border-t-2 border-ink pt-4">
          <h2 id="material-title" className="text-lg font-bold">
            Materiały do lekcji
          </h2>
          <dl className="mt-3 grid gap-x-4 gap-y-3 sm:grid-cols-[9rem_1fr]">
            {criteria.length > 0 ? (
              <>
                <dt className="font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase sm:pt-3.5">Kryteria</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {criteria.map(({ id, name }) => (
                      <li key={id}>
                        <Link to="/kryteria/$criterionId" params={{ criterionId: id }} className={chip}>
                          <span className="font-mono text-sm font-semibold">{id}</span>
                          <span className="ml-2 text-sm">{name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            ) : null}
            {examples.length > 0 ? (
              <>
                <dt className="font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase sm:pt-3.5">Przykłady</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {examples.map((example) => (
                      <li key={example.slug}>
                        <Link to="/praktyka/$slug" params={{ slug: example.slug }} className={`${chip} font-semibold`}>
                          {example.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            ) : null}
            {law.length > 0 ? (
              <>
                <dt className="font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase sm:pt-3.5">Przepisy</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {law.map((unit) => (
                      <li key={unit.id}>
                        <ProvisionLink id={unit.id} className={chip}>
                          <span className="font-mono text-sm font-semibold">{unit.label}</span>
                          <span className="ml-2 text-sm">
                            {unit.title ? `${unit.title}, ` : ""}
                            {unit.act}
                          </span>
                        </ProvisionLink>
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            ) : null}
          </dl>
        </section>
      ) : null}

      <Quiz key={key} lessonKey={key} questions={lesson.quiz} />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-5">
        <button
          type="button"
          aria-pressed={done}
          onClick={() => {
            progressStore().setLessonDone(key, !done);
          }}
          className="inline-flex min-h-11 items-center gap-2.5 rounded border-2 border-ink bg-surface pr-4 pl-3 font-semibold"
        >
          <span
            aria-hidden="true"
            className={`inline-grid size-4.5 place-items-center border-2 border-ink text-xs leading-none ${done ? "bg-ink text-paper" : ""}`}
          >
            {done ? "✓" : ""}
          </span>
          Lekcja ukończona
        </button>
        <nav aria-label="Lekcje ścieżki" className="flex flex-wrap gap-2">
          {previous ? (
            <Link
              to="/sciezki/$path/$lesson"
              params={{ path: path.slug, lesson: previous.slug }}
              className="inline-flex min-h-13 flex-col justify-center rounded border border-control bg-surface px-4 py-1 hover:border-ink"
            >
              <span className="font-mono text-xs text-ink-2">← Poprzednia</span>
              <span className="font-semibold">{previous.title}</span>
            </Link>
          ) : null}
          {next ? (
            <Link
              to="/sciezki/$path/$lesson"
              params={{ path: path.slug, lesson: next.slug }}
              className="inline-flex min-h-13 flex-col justify-center rounded border border-ink bg-ink px-4 py-1 text-paper"
            >
              <span className="font-mono text-xs">Następna →</span>
              <span className="font-semibold">{next.title}</span>
            </Link>
          ) : (
            <Link
              to="/sciezki/$path"
              params={{ path: path.slug }}
              className="inline-flex min-h-13 flex-col justify-center rounded border border-ink bg-ink px-4 py-1 text-paper"
            >
              <span className="font-mono text-xs">Koniec ścieżki</span>
              <span className="font-semibold">Wróć do ścieżki</span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
