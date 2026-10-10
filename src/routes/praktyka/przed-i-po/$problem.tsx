import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DraftBadge } from "~/components/level-badge";
import { harmedLabels } from "~/content/before-after-labels";
import { getProblem } from "~/content/before-after.functions";

export const Route = createFileRoute("/praktyka/przed-i-po/$problem")({
  loader: async ({ params }) => {
    const number = Number(params.problem);
    const found = Number.isInteger(number) ? await getProblem({ data: number }) : null;
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.problem.title} · Strona przed i po · a11y playground` : "a11y playground" }],
  }),
  component: ProblemPage,
});

const chip =
  "inline-flex min-h-11 items-center rounded border border-control bg-surface px-3 font-mono text-sm font-semibold hover:border-ink";
const link = "inline-flex min-h-11 items-center text-accent underline underline-offset-3";

/**
 * One problem of the broken KMW page (the body of mock 4A, phase 11): what is wrong, who it hurts,
 * how to fix it, the code before and after, and where the same thing is shown on its own.
 */
function ProblemPage() {
  const { problem, previous, next, count } = Route.useLoaderData();
  return (
    <article>
      <nav aria-label="Okruszki" className="pt-4 font-mono text-[0.8125rem] text-ink-2">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/praktyka/przed-i-po" className="inline-flex min-h-11 items-center underline underline-offset-3">
              Strona przed i po
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/praktyka/przed-i-po/lista" className="inline-flex min-h-11 items-center underline underline-offset-3">
              Lista problemów
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">Problem {problem.number}</span>
          </li>
        </ol>
      </nav>

      <header className="pt-3">
        <p className="font-mono text-sm text-ink-2">
          Problem {problem.number} z {count}
        </p>
        <h1 className="mt-1 text-[clamp(1.5rem,4vw,2rem)] leading-tight font-bold tracking-tight">{problem.title}</h1>
        <ul aria-label="Kryteria WCAG" className="mt-4 flex flex-wrap items-center gap-2">
          {problem.criteria.map((id) => (
            <li key={id}>
              <Link to="/kryteria/$criterionId" params={{ criterionId: id }} className={chip}>
                {id}
              </Link>
            </li>
          ))}
          {problem.status === "szkic" ? (
            <li>
              <DraftBadge />
            </li>
          ) : null}
        </ul>
        <dl className="mt-4 grid gap-x-4 gap-y-1 text-[0.9375rem] sm:grid-cols-[9rem_1fr]">
          <dt className="font-semibold">Komu szkodzi</dt>
          <dd>{problem.who.map((who) => harmedLabels[who]).join(", ")}</dd>
          <dt className="font-semibold">axe</dt>
          <dd>{problem.axe.length > 0 ? `zgłasza: ${problem.axe.join(", ")}` : "nie widzi tego problemu"}</dd>
        </dl>
      </header>

      <section aria-labelledby="problem-tytul" className="mt-8">
        <h2 id="problem-tytul" className="text-xl font-bold tracking-tight">
          Problem
        </h2>
        <div className="prose mt-2" dangerouslySetInnerHTML={{ __html: problem.problemHtml }} />
      </section>
      <section aria-labelledby="rozwiazanie-tytul" className="mt-8">
        <h2 id="rozwiazanie-tytul" className="text-xl font-bold tracking-tight">
          Rozwiązanie
        </h2>
        <div className="prose mt-2" dangerouslySetInnerHTML={{ __html: problem.solutionHtml }} />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(
            [
              ["przed", "Przed", "border-t-bad"],
              ["po", "Po", "border-t-good"],
            ] as const
          ).map(([key, label, tone]) => (
            <figure key={key} className="m-0 min-w-0">
              <figcaption className="font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">{label}</figcaption>
              {/* Wrapped, not scrolled: a scrolling block would need to take focus (2.1.1). */}
              <pre className={`mt-1 rounded border-t-4 ${tone} bg-[#101314] px-4 py-3 break-words whitespace-pre-wrap text-[#e8e6e1]`}>
                <code className="font-mono text-[0.8125rem] leading-relaxed">{problem.code[key]}</code>
              </pre>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="zobacz-tytul" className="mt-8">
        <h2 id="zobacz-tytul" className="text-xl font-bold tracking-tight">
          Zobacz też
        </h2>
        <ul className="mt-2 flex flex-wrap gap-x-6">
          <li>
            <a href="/demo/przed-i-po/przed-znaczniki" className={link}>
              Problem {problem.number} na stronie zepsutej
            </a>
          </li>
          {problem.example ? (
            <li>
              <Link to="/praktyka/$slug" params={{ slug: problem.example.slug }} className={link}>
                Przykład: {problem.example.title}
              </Link>
            </li>
          ) : null}
          {problem.pattern ? (
            <li>
              <Link to="/praktyka/wzorce/$slug" params={{ slug: problem.pattern.slug }} className={link}>
                Wzorzec: {problem.pattern.title}
              </Link>
            </li>
          ) : null}
        </ul>
      </section>

      <nav aria-label="Sąsiednie problemy" className="mt-10 flex flex-wrap justify-between gap-4 border-t border-rule pt-4">
        {previous ? (
          <Link to="/praktyka/przed-i-po/$problem" params={{ problem: String(previous.number) }} className={`${link} gap-1.5`}>
            <span aria-hidden="true">←</span>
            {previous.number}. {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to="/praktyka/przed-i-po/$problem" params={{ problem: String(next.number) }} className={`${link} gap-1.5`}>
            {next.number}. {next.title}
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
