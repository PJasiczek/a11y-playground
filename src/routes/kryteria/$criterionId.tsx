import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DraftBadge, LevelBadge, NewBadge } from "~/components/level-badge";
import { getCriterionPage } from "~/content/content.functions";
import type { SectionKey } from "~/content/sections";
import { findCriterion, guidelineOf, isNewIn22, isObsolete, principleOf } from "~/content/wcag";

export const Route = createFileRoute("/kryteria/$criterionId")({
  loader: async ({ params }) => {
    const criterion = findCriterion(params.criterionId);
    if (!criterion) throw notFound();
    const { content, normative } = await getCriterionPage({ data: criterion.id });
    return { criterion, content, normative };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.criterion.id} ${loaderData.criterion.name} · a11y playground` : "a11y playground" }],
  }),
  component: CriterionPage,
});

/**
 * Fixed order, so the page can be read by habit. Sections with a `content` key come from the
 * Markdown file; the rest are filled by later phases (normative text, examples, law).
 */
const pageSections = [
  { id: "kogo-dotyczy", title: "Kogo to dotyczy", content: "kogo-dotyczy" },
  { id: "tresc-normy", title: "Treść normy" },
  { id: "jak-spelnic", title: "Jak to spełnić", content: "jak-spelnic" },
  { id: "typowe-bledy", title: "Typowe błędy", content: "typowe-bledy" },
  { id: "przyklad", title: "Przykład", pending: "Wersja zepsuta i poprawna pojawią się razem z działem Praktyka." },
  { id: "jak-sprawdzic", title: "Jak sprawdzić", content: "jak-sprawdzic" },
  { id: "prawo", title: "Prawo", pending: "Przepisy, które wymagają tego kryterium, pojawią się razem z działem Prawo." },
  { id: "powiazane", title: "Powiązane" },
] as const satisfies readonly { id: string; title: string; content?: SectionKey; pending?: string }[];

const emptyNote = <p className="text-ink-2">Ta sekcja nie ma jeszcze treści.</p>;

function CriterionPage() {
  const { criterion, content, normative } = Route.useLoaderData();
  const principle = principleOf(criterion);
  const guideline = guidelineOf(criterion);

  // Markdown in content/ is written by us and rendered at build time, so injecting it is safe.
  const html = (key: SectionKey) => {
    const section = content?.sections[key];
    return section ? <div className="prose" data-section={key} dangerouslySetInnerHTML={{ __html: section }} /> : null;
  };

  const body: Record<(typeof pageSections)[number]["id"], ReactNode> = {
    "kogo-dotyczy": html("kogo-dotyczy") ?? emptyNote,
    // Normative text comes from the authorized W3C translation, imported and sanitized at build time.
    "tresc-normy": normative ? (
      <details className="rounded border border-control bg-surface">
        <summary className="flex min-h-11 cursor-pointer items-center px-4 font-semibold">
          Rozwiń dosłowne brzmienie kryterium {criterion.id}
        </summary>
        <div className="px-4 pb-4">
          <div className="normative" dangerouslySetInnerHTML={{ __html: normative }} />
          <p className="mt-3 font-mono text-[0.8125rem] text-ink-2">
            <a href="https://www.w3.org/Translations/WCAG21-pl/" className="underline underline-offset-3">
              Autoryzowane tłumaczenie WCAG 2.1 (W3C)
            </a>
          </p>
        </div>
      </details>
    ) : (
      <p className="text-ink-2">
        To kryterium doszło w WCAG 2.2, które nie ma jeszcze autoryzowanego polskiego tłumaczenia. Brzmienie znajdziesz w{" "}
        <a href="https://wcag.irdpl.pl/guidelines/22/" className="text-accent underline underline-offset-3">
          nieoficjalnym tłumaczeniu IRDPL
        </a>{" "}
        i w{" "}
        <a href={`https://www.w3.org/TR/WCAG22/#${criterion.w3cId}`} hrefLang="en" className="text-accent underline underline-offset-3">
          specyfikacji WCAG 2.2 (po angielsku)
        </a>
        .
      </p>
    ),
    "jak-spelnic": html("jak-spelnic") ?? emptyNote,
    "typowe-bledy": html("typowe-bledy") ?? emptyNote,
    przyklad: null,
    "jak-sprawdzic": html("jak-sprawdzic") ?? emptyNote,
    prawo: null,
    powiazane: (
      <>
        {content && content.related.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {content.related.map((id) => {
              const related = findCriterion(id);
              return related ? (
                <li key={id}>
                  <Link
                    to="/kryteria/$criterionId"
                    params={{ criterionId: id }}
                    className="inline-flex min-h-11 items-center gap-2 rounded border border-control bg-surface px-3 text-[0.9375rem] hover:border-ink"
                  >
                    <b className="font-mono">{id}</b> {related.name} <LevelBadge level={related.level} />
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        ) : null}
        {content?.sections["czeste-pomylki"] ? <div className="mt-4">{html("czeste-pomylki")}</div> : null}
        {!content?.related.length && !content?.sections["czeste-pomylki"] ? emptyNote : null}
      </>
    ),
  };

  return (
    <article>
      <nav aria-label="Okruszki" className="pt-4 font-mono text-[0.8125rem] text-ink-2">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/kryteria" className="inline-flex min-h-11 items-center underline underline-offset-3">
              Kryteria
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">{criterion.id}</span>
          </li>
        </ol>
      </nav>

      <header className="border-b border-rule pt-4 pb-8">
        <h1 className="text-[clamp(1.5rem,4vw,2.125rem)] leading-tight font-bold tracking-tight">
          <span className="mb-2 block font-mono text-[clamp(2.5rem,8vw,4rem)] leading-[0.9] tracking-tighter">
            {criterion.id}
          </span>{" "}
          {criterion.name}
        </h1>
        <p className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[0.8125rem] text-ink-2">
          <LevelBadge level={criterion.level} />
          {isNewIn22(criterion) ? <NewBadge /> : null}
          {content?.status === "szkic" ? <DraftBadge long /> : null}
          {isObsolete(criterion) ? <span>wycofane w WCAG 2.2</span> : <span>od WCAG {criterion.versions[0]}</span>}
          <span aria-hidden="true">·</span>
          <span>
            {principle.num}. {principle.name}, {guideline.num} {guideline.name}
          </span>
          {content && content.roles.length > 0 ? (
            <>
              <span aria-hidden="true">·</span>
              <span>dotyczy: {content.roles.join(", ")}</span>
            </>
          ) : null}
        </p>
        {content ? <p className="mt-7 max-w-[56ch] text-xl leading-normal">{content.summary}</p> : null}
      </header>

      <div className="grid gap-10 pt-8 lg:grid-cols-[1fr_13rem] lg:gap-12">
        <nav aria-labelledby="toc-title" className="self-start lg:order-2">
          <h2 id="toc-title" className="mb-2 font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">
            Na tej stronie
          </h2>
          <ol>
            {pageSections.map(({ id, title }) => (
              <li key={id} className="border-t border-rule">
                <a href={`#${id}`} className="flex min-h-11 items-center text-sm text-ink-2 hover:text-ink">
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div>
          {pageSections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="pb-9">
              <h2 id={`${section.id}-title`} className="mb-3 border-t-2 border-ink pt-5 text-xl font-bold tracking-tight">
                {section.title}
              </h2>
              {"pending" in section ? <p className="text-ink-2">{section.pending}</p> : body[section.id]}
            </section>
          ))}

          <footer className="font-mono text-[0.8125rem] text-ink-2">
            <p>
              Nazwa kryterium:{" "}
              {criterion.nameSource === "w3c" ? (
                <a href="https://www.w3.org/Translations/WCAG21-pl/" className="underline underline-offset-3">
                  autoryzowane tłumaczenie WCAG 2.1 (W3C)
                </a>
              ) : (
                <a href="https://wcag.irdpl.pl/guidelines/22/" className="underline underline-offset-3">
                  nieoficjalne tłumaczenie WCAG 2.2 (IRDPL)
                </a>
              )}
              . Źródło:{" "}
              <a href={`https://www.w3.org/TR/WCAG22/#${criterion.w3cId}`} hrefLang="en" className="underline underline-offset-3">
                specyfikacja WCAG 2.2 (po angielsku)
              </a>
              .
            </p>
            {content?.status === "zweryfikowane" ? <p className="mt-1">Treść zweryfikowana: {content.lastVerified}</p> : null}
            {content?.status === "szkic" ? <p className="mt-1">Treść jest szkicem i czeka na weryfikację.</p> : null}
          </footer>
        </div>
      </div>
    </article>
  );
}
