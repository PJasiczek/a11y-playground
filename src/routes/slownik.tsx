import { createFileRoute, Link } from "@tanstack/react-router";
import { DraftBadge } from "~/components/level-badge";
import { getGlossary } from "~/content/content.functions";
import { countOf } from "~/lib/plural";
import { pageHead } from "~/lib/seo";
import { glossaryLd } from "~/lib/structured-data";

// Letters shown in the index. Letters with no term stay as plain text, not dead links.
const alphabet = "A Ą B C Ć D E Ę F G H I J K L Ł M N Ń O Ó P R S Ś T U W Y Z Ź Ż".split(" ");

export const Route = createFileRoute("/slownik")({
  loader: () => getGlossary(),
  head: ({ loaderData, match }) =>
    pageHead({
      title: "Słownik", description:
        "Pojęcia, na których najczęściej potyka się ktoś, kto czyta WCAG pierwszy raz. Najpierw wyjaśnienie prostym językiem, potem brzmienie z normy.",
      path: match.pathname,
      jsonLd: loaderData ? [glossaryLd(loaderData)] : [],
    }),
  component: GlossaryPage,
});

/** The glossary as one alphabetical page (variant D of the glossary mocks). */
function GlossaryPage() {
  const entries = Route.useLoaderData();
  const groups = alphabet
    .map((letter) => ({
      letter,
      entries: entries.filter((e) => e.term.charAt(0).toLocaleUpperCase("pl") === letter),
    }))
    .filter((group) => group.entries.length > 0);
  const present = new Set(groups.map((g) => g.letter));

  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 pt-8 pb-4">
        <h1 className="text-[1.875rem] font-bold tracking-tight">Słownik</h1>
        <p className="font-mono text-sm text-ink-2">{countOf(entries.length, ["pojęcie", "pojęcia", "pojęć"])}</p>
      </div>
      <p className="max-w-[60ch] text-ink-2">
        Pojęcia, na których najczęściej potyka się ktoś, kto czyta WCAG pierwszy raz. Przy każdym najpierw wyjaśnienie
        prostym językiem, potem brzmienie z normy, jeśli WCAG je definiuje.
      </p>

      <nav aria-label="Litery" className="mt-5 border-b border-rule pb-4">
        <ul className="flex flex-wrap gap-1">
          {alphabet.map((letter) => (
            <li key={letter}>
              {present.has(letter) ? (
                <a
                  href={`#litera-${letter}`}
                  className="inline-flex size-11 items-center justify-center rounded border border-control bg-surface font-mono font-bold hover:border-ink"
                >
                  {letter}
                </a>
              ) : (
                <span className="inline-flex size-11 items-center justify-center font-mono text-ink-2">{letter}</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {groups.map((group) => (
        <section key={group.letter} aria-labelledby={`litera-${group.letter}`}>
          <h2 id={`litera-${group.letter}`} className="mt-8 mb-1 font-mono text-4xl font-bold tracking-tighter">
            {group.letter}
          </h2>
          {group.entries.map((entry) => (
            <article
              key={entry.slug}
              id={entry.slug}
              aria-labelledby={`${entry.slug}-title`}
              className="grid scroll-mt-4 gap-x-8 gap-y-2 border-t border-rule py-5 md:grid-cols-[13rem_minmax(0,1fr)]"
            >
              <div>
                <h3 id={`${entry.slug}-title`} className="text-xl font-bold tracking-tight">
                  {entry.term}
                </h3>
                {entry.also.length > 0 ? (
                  <p className="mt-1 font-mono text-[0.8125rem] text-ink-2">potocznie: {entry.also.join(", ")}</p>
                ) : null}
                {entry.status === "szkic" ? (
                  <p className="mt-2">
                    <DraftBadge />
                  </p>
                ) : null}
              </div>
              <div>
                <div className="prose" dangerouslySetInnerHTML={{ __html: entry.html }} />
                {entry.normativeHtml ? (
                  <div className="mt-4">
                    <p className="font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">W normie</p>
                    <div
                      className="normative mt-1 border-l-3 border-rule pl-3 text-[0.9375rem]"
                      dangerouslySetInnerHTML={{ __html: entry.normativeHtml }}
                    />
                  </div>
                ) : null}
                {entry.criteria.length > 0 ? (
                  <ul aria-label={`Kryteria, w których pojawia się pojęcie ${entry.term}`} className="mt-4 flex flex-wrap gap-2">
                    {entry.criteria.map((id) => (
                      <li key={id}>
                        <Link
                          to="/kryteria/$criterionId"
                          params={{ criterionId: id }}
                          className="inline-flex min-h-11 items-center rounded border border-control bg-surface px-3 font-mono text-sm font-semibold hover:border-ink"
                        >
                          {id}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      ))}
    </>
  );
}
