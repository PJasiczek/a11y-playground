import { createFileRoute, Link } from "@tanstack/react-router";
import { lessonNumber, pathProgress, ProgressNote } from "~/components/paths";
import { getPathList } from "~/content/paths.functions";
import { countOf } from "~/lib/plural";
import { useProgress } from "~/progress/store";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/sciezki/")({
  loader: () => getPathList(),
  head: ({ match }) =>
    pageHead({
      title: "Ścieżki", description:
        "Lekcje dostępności ułożone po kolei dla programisty, projektanta, autora treści, testera i podmiotu publicznego, z quizem na końcu każdej lekcji.",
      path: match.pathname,
    }),
  component: PathsPage,
});

const lessonForms = ["lekcja", "lekcje", "lekcji"] as const;

/** The five paths, one row each, with progress where there is some (variant 1A of the paths mocks). */
function PathsPage() {
  const paths = Route.useLoaderData();
  const snapshot = useProgress();

  return (
    <>
      <h1 className="pt-8 text-[1.875rem] font-bold tracking-tight">Ścieżki</h1>
      <p className="mt-2 mb-6 max-w-[62ch] text-[1.0625rem] text-ink-2">
        Lekcje ułożone po kolei dla jednej roli. Czytasz w dowolnej kolejności, a quiz nie blokuje kolejnej lekcji.
      </p>
      <ul className="border-t-2 border-ink">
        {paths.map((path) => {
          const { done, next } = pathProgress(snapshot, { path: path.slug, lessons: path.lessons });
          const total = path.lessons.length;
          return (
            <li
              key={path.slug}
              className="grid gap-x-8 gap-y-2 border-b border-rule py-5 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  <Link to="/sciezki/$path" params={{ path: path.slug }} className="inline-flex min-h-11 items-center hover:underline">
                    {path.title}
                  </Link>
                </h2>
                <p className="max-w-[62ch] text-ink-2">{path.summary}</p>
              </div>
              <div className="grid justify-items-start gap-1 sm:justify-items-end sm:text-right">
                <span className="font-mono text-[0.8125rem] text-ink-2">
                  {done === 0 ? countOf(total, lessonForms) : `ukończono ${String(done)} z ${String(total)}`}
                </span>
                {done > 0 ? (
                  <span aria-hidden="true" className="block h-1.5 w-36 border border-control bg-paper-2">
                    <span className="block h-full bg-ink" style={{ width: `${String((done / total) * 100)}%` }} />
                  </span>
                ) : null}
                {done > 0 && next ? (
                  <Link
                    to="/sciezki/$path/$lesson"
                    params={{ path: path.slug, lesson: next.slug }}
                    className="inline-flex min-h-11 items-center text-accent underline underline-offset-3"
                  >
                    Dalej: {lessonNumber(next.number)} {next.title}
                  </Link>
                ) : null}
                {next === null ? (
                  <span className="font-mono text-[0.8125rem] font-semibold">
                    <span aria-hidden="true">✓ </span>ukończona
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      <ProgressNote snapshot={snapshot} />
    </>
  );
}
