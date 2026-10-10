import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DraftBadge, LevelBadge } from "~/components/level-badge";
import { LegalFooter, StrengthLabel } from "~/components/legal";
import { TermTips } from "~/components/term-tips";
import { formatDate } from "~/content/legal";
import { strengthLabels } from "~/content/legal-map";
import { getArticle } from "~/content/legal.functions";
import { principles } from "~/content/wcag";
import { countOf } from "~/lib/plural";
import { pageHead } from "~/lib/seo";
import { articleLd, breadcrumbLd } from "~/lib/structured-data";

export const Route = createFileRoute("/prawo/$act/$unit")({
  loader: async ({ params }) => {
    const found = await getArticle({ data: { act: params.act, unit: params.unit } });
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData, match }) => {
    if (!loaderData) return {};
    const { act, unit, title } = loaderData;
    const source = `${unit.label}, ${act.short}, ${act.address}`;
    return pageHead({
      title: `${unit.label} · ${act.short}`,
      description: `${title ? `${title}. ${source}` : source}: brzmienie przepisu obok naszego streszczenia.`,
      path: match.pathname,
      jsonLd: [
        articleLd(unit.label, act, match.pathname),
        breadcrumbLd([
          { name: "Prawo", path: "/prawo" },
          { name: act.short, path: `/prawo/${act.slug}` },
          { name: unit.label, path: match.pathname },
        ]),
      ],
    });
  },
  component: ArticlePage,
});

/**
 * One article as parallel text (variant A of the legal mocks): each ustęp is a row with our
 * summary on the left and the statute on the right, so a summary never drifts from the sentence
 * it stands for. On narrow screens the statute drops under its summary, with a visible label.
 * Rows carry `id="ust-3"` anchors for links from summaries and the mapping.
 */
function ArticlePage() {
  const { act, unit, title, leadHtml, rows, criteria, prev, next, terms, draft } = Route.useLoaderData();
  const isAnnex = unit.slug === "zal";
  const notes = [...new Set(criteria.flatMap((c) => (c.note && criteria.every((o) => o.note === c.note) ? [c.note] : [])))];
  const strengths = [...new Set(criteria.map((c) => c.strength))];

  return (
    <article>
      <nav aria-label="Okruszki" className="pt-4 font-mono text-[0.8125rem] text-ink-2">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/prawo" className="inline-flex min-h-11 min-w-11 items-center underline underline-offset-3">
              Prawo
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/prawo/$act" params={{ act: act.slug }} className="inline-flex min-h-11 items-center underline underline-offset-3">
              {act.short}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">{unit.label}</span>
          </li>
        </ol>
      </nav>

      <header className="pt-3 pb-6">
        <h1 className="text-[clamp(1.5rem,4vw,2rem)] leading-tight font-bold tracking-tight">
          <span className="font-mono">{unit.label}.</span> {title}
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-2">
          <span>{act.title}</span>
          {draft ? <DraftBadge /> : null}
        </p>
      </header>

      <TermTips terms={terms}>
        {leadHtml ? <div className="prose legal-summary mb-5 text-[1.0625rem]" dangerouslySetInnerHTML={{ __html: leadHtml }} /> : null}

        {rows.length > 0 && !isAnnex ? (
          <div className="border-t-2 border-ink">
            <div aria-hidden="true" className="hidden grid-cols-[3.2rem_1fr_1fr] gap-x-6 border-b border-rule py-2.5 font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase md:grid">
              <span>Ust.</span>
              <span>Nasze streszczenie</span>
              <span>Brzmienie ustawy</span>
            </div>
            {rows.map((row, index) => (
              <section
                key={row.ust ?? `wstep-${String(index)}`}
                id={row.ust ? `ust-${row.ust}` : undefined}
                aria-label={row.ust ? `Ustęp ${row.ust}` : unit.label}
                className="grid scroll-mt-4 grid-cols-[2.4rem_1fr] gap-x-6 gap-y-3 border-b border-rule py-5 md:grid-cols-[3.2rem_1fr_1fr]"
              >
                <span className="font-mono font-bold" aria-hidden="true">
                  {row.ust ?? ""}
                </span>
                <div>
                  <h2 className="mb-1 font-mono text-[0.6875rem] font-semibold tracking-widest text-ink-2 uppercase md:sr-only">
                    Nasze streszczenie
                  </h2>
                  {row.summaryHtml ? (
                    <div className="prose legal-summary text-[1.0625rem]" dangerouslySetInnerHTML={{ __html: row.summaryHtml }} />
                  ) : (
                    <p className="text-ink-2">Ten fragment nie ma jeszcze streszczenia.</p>
                  )}
                </div>
                <div className="col-start-2 border-l-3 border-rule pl-4 md:col-start-auto md:border-l-0 md:pl-0">
                  <h2 className="mb-1 font-mono text-[0.6875rem] font-semibold tracking-widest text-ink-2 uppercase md:sr-only">
                    Brzmienie ustawy
                  </h2>
                  {row.lines.map((line, i) => (
                    <p
                      key={i}
                      className="max-w-[68ch] py-0.5 text-[0.9375rem] leading-relaxed text-ink-2"
                      style={{ paddingLeft: `${String(line.depth * 1.25)}rem` }}
                    >
                      {line.label ? <span className="mr-1.5 font-mono text-ink">{line.label}</span> : null}
                      {line.text}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </TermTips>

      <p className="mt-3 font-mono text-[0.8125rem] text-ink-2">
        {isAnnex ? "Źródło: tabela z tekstu jednolitego (PDF), " : "Tekst: "}
        {act.consolidated ? `tekst jednolity ${act.consolidated.address}` : act.address} · pobrano {formatDate(act.retrieved)} ·{" "}
        <a href={act.isap} className="underline underline-offset-3">
          ISAP
        </a>
      </p>

      {criteria.length > 0 ? (
        <section aria-labelledby="kryteria" className="mt-9">
          <h2 id="kryteria" className="border-t-2 border-ink pt-5 text-xl font-bold tracking-tight">
            {strengths.every((s) => s === "powiazane") ? "Powiązane kryteria" : "Wymaga tych kryteriów"}
          </h2>
          <p className="mt-2 max-w-[66ch] text-[0.9375rem]">
            {countOf(criteria.length, ["kryterium", "kryteria", "kryteriów"])} · powiązanie: {strengths.map((s) => strengthLabels[s]).join(", ")}
            {criteria.some((c) => !c.applies.includes("aplikacja-publiczna")) && criteria.some((c) => c.applies.includes("aplikacja-publiczna"))
              ? ". Kryteria oznaczone „tylko strony” nie dotyczą aplikacji mobilnych."
              : "."}
          </p>
          {notes.map((note) => (
            <p key={note} className="mt-2 max-w-[66ch] border-l-4 border-ink bg-surface px-4 py-3 text-[0.9375rem]">
              {note}
            </p>
          ))}
          {principles.map((principle) => {
            const group = criteria.filter((c) => c.principle === principle.num);
            return group.length > 0 ? (
              <div key={principle.num} className="mt-5">
                <h3 className="font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">
                  {principle.num}. {principle.name} · {group.length}
                </h3>
                <ul className="mt-1">
                  {group.map((c) => (
                    <li key={c.criterion} className="border-b border-rule">
                      <Link
                        to="/kryteria/$criterionId"
                        params={{ criterionId: c.criterion }}
                        className="grid min-h-11 grid-cols-[4.5rem_1fr_auto] items-center gap-x-3 px-1 py-2 hover:bg-surface"
                      >
                        <span className="font-mono font-bold">{c.criterion}</span>
                        <span>
                          {c.name}
                          {!c.applies.includes("aplikacja-publiczna") && c.applies.includes("strona-publiczna") ? (
                            <span className="ml-2 rounded-xs border border-dashed border-control px-1 font-mono text-[0.6875rem] whitespace-nowrap text-ink-2">
                              tylko strony
                            </span>
                          ) : null}
                          {c.note && notes.length === 0 ? <span className="mt-0.5 block text-sm text-ink-2">{c.note}</span> : null}
                        </span>
                        <span className="flex items-center gap-2">
                          <StrengthLabel strength={c.strength} />
                          <LevelBadge level={c.level} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null;
          })}
        </section>
      ) : null}

      <nav aria-label="Sąsiednie przepisy" className="mt-9 flex flex-wrap justify-between gap-3">
        {prev ? (
          <Link
            to="/prawo/$act/$unit"
            params={{ act: act.slug, unit: prev.slug }}
            className="inline-flex min-h-11 items-center rounded border border-control bg-surface px-4 font-semibold hover:border-ink"
          >
            <span aria-hidden="true">←&nbsp;</span>
            {prev.label}
            {prev.title ? `. ${prev.title}` : ""}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/prawo/$act/$unit"
            params={{ act: act.slug, unit: next.slug }}
            className="inline-flex min-h-11 items-center rounded border border-control bg-surface px-4 font-semibold hover:border-ink"
          >
            {next.label}
            {next.title ? `. ${next.title}` : ""}
            <span aria-hidden="true">&nbsp;→</span>
          </Link>
        ) : null}
      </nav>

      <LegalFooter verified={act.verification} retrieved={act.retrieved} />
    </article>
  );
}
