import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DraftBadge } from "~/components/level-badge";
import { LegalFooter, ProvisionLink } from "~/components/legal";
import { TermTips } from "~/components/term-tips";
import { formatDate } from "~/content/legal";
import { getAct } from "~/content/legal.functions";
import { pageHead } from "~/lib/seo";
import { actLd, breadcrumbLd } from "~/lib/structured-data";

export const Route = createFileRoute("/prawo/$act/")({
  loader: async ({ params }) => {
    const found = await getAct({ data: params.act });
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData, match }) =>
    loaderData
      ? pageHead({
          title: `${loaderData.act.short} · Prawo`,
          description: loaderData.act.summary,
          path: match.pathname,
          jsonLd: [
            actLd(loaderData.act, match.pathname),
            breadcrumbLd([
              { name: "Prawo", path: "/prawo" },
              { name: loaderData.act.short, path: match.pathname },
            ]),
          ],
        })
      : {},
  component: ActPage,
});

/** One act: our introduction, the source text it comes from, deadlines, and its articles by chapter. */
function ActPage() {
  const { act, introHtml, deadlines, toc, terms, draft } = Route.useLoaderData();

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
            <span aria-current="page">{act.short}</span>
          </li>
        </ol>
      </nav>

      <header className="border-b border-rule pt-3 pb-7">
        <h1 className="text-[clamp(1.5rem,4vw,2.125rem)] leading-tight font-bold tracking-tight">{act.short}</h1>
        <p className="mt-2 max-w-[70ch] text-ink-2">{act.title}</p>
        <p className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[0.8125rem] text-ink-2">
          {draft ? <DraftBadge long /> : null}
          <span>{act.address}</span>
          <span aria-hidden="true">·</span>
          <span>
            {act.consolidated ? `tekst jednolity: ${act.consolidated.address}` : "tekst pierwotny"}, pobrano {formatDate(act.retrieved)}
          </span>
          <span aria-hidden="true">·</span>
          <a href={act.isap} className="inline-flex min-h-11 items-center underline underline-offset-3">
            ISAP
          </a>
        </p>
        {act.amendedAfter.map((change) => (
          <p key={change.eli} className="mt-4 max-w-[70ch] border-l-4 border-ink bg-surface px-4 py-3 text-[0.9375rem]">
            <strong>Tekst nie uwzględnia późniejszej zmiany.</strong> Ustawę zmieniono ({change.label}) od {formatDate(change.from)},
            już po ogłoszeniu tekstu jednolitego. Brzmienie niektórych przepisów w Dzienniku Ustaw może być inne niż tutaj.
          </p>
        ))}
      </header>

      <TermTips terms={terms}>
        <div className="prose mt-7" dangerouslySetInnerHTML={{ __html: introHtml }} />
      </TermTips>
      <p className="mt-4 text-[0.9375rem]">
        <span className="font-semibold">Kogo wiąże:</span> {act.binds}
      </p>

      {deadlines.length > 0 ? (
        <section aria-labelledby="terminy" className="mt-8">
          <h2 id="terminy" className="border-t-2 border-ink pt-5 text-xl font-bold tracking-tight">
            Terminy
          </h2>
          <ul className="mt-3">
            {deadlines.map((d) => (
              <li key={`${d.date}-${d.unit}`} className="grid gap-x-5 border-b border-rule py-3 sm:grid-cols-[9.5rem_1fr]">
                <span className="font-mono font-semibold">{d.yearly ? `co rok, ${formatDate(d.date).slice(0, 5)}` : formatDate(d.date)}</span>
                <p>
                  {d.what} <span className="text-ink-2">(</span>
                  <ProvisionLink id={d.unit}>{d.unitLabel.toLowerCase()}</ProvisionLink>
                  <span className="text-ink-2">)</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="spis" className="mt-8">
        <h2 id="spis" className="border-t-2 border-ink pt-5 text-xl font-bold tracking-tight">
          Spis przepisów
        </h2>
        {act.complete ? null : (
          <p className="mt-2 max-w-[66ch] text-[0.9375rem] text-ink-2">
            Pokazujemy przepisy, z których wynikają obowiązki cyfrowe. Pełny tekst jest w ISAP.
          </p>
        )}
        {toc.map((chapter) => (
          <div key={chapter.number} className="mt-4">
            {chapter.title ? (
              <h3 className="font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">
                Rozdział {chapter.number}. {chapter.title}
              </h3>
            ) : null}
            <ul className="mt-1">
              {chapter.entries.map((entry) => (
                <li key={entry.slug} className="border-b border-rule">
                  {entry.stub ? (
                    <span className="flex min-h-11 items-center gap-4 px-1 text-ink-2">
                      <span className="w-20 shrink-0 font-mono text-sm">{entry.label}</span>
                      <span className="text-[0.9375rem]">uchylony lub pominięty</span>
                    </span>
                  ) : (
                    <Link
                      to="/prawo/$act/$unit"
                      params={{ act: act.slug, unit: entry.slug }}
                      className="flex min-h-11 items-center gap-4 px-1 py-2 hover:bg-surface"
                    >
                      <span className="w-20 shrink-0 font-mono text-sm font-semibold">{entry.label}</span>
                      <span>{entry.title || <span className="text-ink-2">bez streszczenia</span>}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <LegalFooter verified={act.verification} retrieved={act.retrieved} />
    </article>
  );
}
