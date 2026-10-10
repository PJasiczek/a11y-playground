import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Chip, FilterGroup } from "~/components/filters";
import { DraftBadge, WorkingDraftBadge } from "~/components/level-badge";
import { formatDate } from "~/content/legal";
import { findCriterion } from "~/content/wcag";
import { getWcag3 } from "~/content/wcag3.functions";
import { pageHead } from "~/lib/seo";

const filters = [
  { value: undefined, label: "Wszystkie" },
  { value: "z-odpowiednikiem", label: "Z odpowiednikiem w 2.2" },
  { value: "nowe", label: "Tylko nowe w 3.0" },
] as const;

type Filter = Exclude<(typeof filters)[number]["value"], undefined>;

/** `?pokaz=` narrows the mapping. Anything else is dropped, as on /kryteria. */
function validateSearch(search: Record<string, unknown>): { pokaz?: Filter } {
  const picked = filters.find((f) => f.value !== undefined && f.value === search.pokaz)?.value;
  return picked ? { pokaz: picked } : {};
}

export const Route = createFileRoute("/wcag-3")({
  validateSearch,
  loader: () => getWcag3(),
  head: ({ match }) =>
    pageHead({
      title: "WCAG 3.0", description:
        "Stan wersji roboczej WCAG 3.0: czym różni się od WCAG 2.x i której wytycznej 3.0 odpowiada każde kryterium WCAG 2.2.",
      path: match.pathname,
    }),
  component: Wcag3Page,
});

/**
 * The WCAG 3.0 tracking page, variant 2C of the phase 8 mocks: the status of one dated Working
 * Draft, how it differs from 2.x, and one table mapping every guideline to WCAG 2.2 criteria,
 * with a filter for guidelines new in 3.0. Criterion pages link to the rows by their anchors.
 */
function Wcag3Page() {
  const { overview, groups } = Route.useLoaderData();
  const { pokaz } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const shownGroups = groups
    .map((group) => ({
      ...group,
      guidelines: group.guidelines.filter((g) =>
        pokaz === "nowe" ? g.criteria.length === 0 : pokaz === "z-odpowiednikiem" ? g.criteria.length > 0 : true,
      ),
    }))
    .filter((group) => group.guidelines.length > 0);
  const total = groups.reduce((sum, group) => sum + group.guidelines.length, 0);
  const shown = shownGroups.reduce((sum, group) => sum + group.guidelines.length, 0);

  return (
    <>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-8 font-mono text-[0.8125rem] text-ink-2">
        <WorkingDraftBadge />
        <span>
          z{" "}
          <a href={overview.draftUrl} hrefLang="en" className="inline-flex min-h-11 items-center underline underline-offset-3">
            {formatDate(overview.draft)}
          </a>
        </span>
        <span aria-hidden="true">·</span>
        <span>sprawdzone przez nas {formatDate(overview.checked)}</span>
        {overview.status === "szkic" ? <DraftBadge /> : null}
      </p>
      <h1 className="mt-2 text-[1.875rem] font-bold tracking-tight">WCAG 3.0</h1>
      {/* Markdown in content/ is written by us and rendered at build time, so injecting it is safe. */}
      <div className="prose mt-3 max-w-[68ch]" dangerouslySetInnerHTML={{ __html: overview.html }} />

      <section aria-labelledby="zmiany" className="mt-10">
        <h2 id="zmiany" className="border-t-2 border-ink pt-4 text-xl font-bold tracking-tight">
          Co się zmienia
        </h2>
        {/* Focusable, so the sideways scroll on narrow screens works from the keyboard (2.1.1). */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div role="region" aria-labelledby="zmiany-caption" tabIndex={0} className="mt-3 overflow-x-auto">
          <table className="w-full min-w-xl border-collapse text-[0.9375rem]">
            <caption id="zmiany-caption" className="pb-2 text-left text-ink-2">
              WCAG 2.2 i wersja robocza 3.0
            </caption>
            <thead>
              <tr className="border-b-2 border-ink text-left font-mono text-xs tracking-wide text-ink-2 uppercase">
                <td className="py-2 pr-3" />
                <th scope="col" className="py-2 pr-3 font-semibold">
                  WCAG 2.2
                </th>
                <th scope="col" className="py-2 font-semibold">
                  WCAG 3.0, wersja robocza
                </th>
              </tr>
            </thead>
            <tbody>
              {overview.compare.map((row) => (
                <tr key={row.topic} className="border-b border-rule align-top">
                  <th scope="row" className="w-1/5 py-3 pr-3 text-left font-semibold">
                    {row.topic}
                  </th>
                  <td className="py-3 pr-3">{row.wcag2}</td>
                  <td className="py-3">{row.wcag3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="mapowanie" className="mt-10">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t-2 border-ink pt-4">
          <h2 id="mapowanie" className="text-xl font-bold tracking-tight">
            Co odpowiada czemu
          </h2>
          <p role="status" className="font-mono text-sm text-ink-2">
            Pokazuję {shown} z {total} wytycznych
          </p>
        </div>
        <p className="mt-2 max-w-[68ch] text-ink-2">
          Przypisania do WCAG 2.2 są nasze, nie W3C. Wersja robocza nie publikuje tabeli przejścia, a każde przypisanie
          mówi, co odpowiada wytycznej dziś, a nie co ją zastąpi.
        </p>

        <div className="mt-4 border-b border-rule pb-4">
          <FilterGroup legend="Pokaż">
            {filters.map((f) => (
              <Chip
                key={f.label}
                type="radio"
                name="pokaz"
                checked={pokaz === f.value}
                onChange={() => {
                  void navigate({ search: f.value ? { pokaz: f.value } : {}, replace: true, resetScroll: false });
                }}
              >
                {f.label}
              </Chip>
            ))}
          </FilterGroup>
        </div>

        {/* Focusable, so the sideways scroll on narrow screens works from the keyboard (2.1.1). */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div role="region" aria-labelledby="mapowanie-caption" tabIndex={0} className="mt-3 overflow-x-auto">
          <table className="w-full min-w-2xl border-collapse text-[0.9375rem]">
            <caption id="mapowanie-caption" className="sr-only">
              Wytyczne WCAG 3.0 i odpowiadające im kryteria WCAG 2.2
            </caption>
            <thead>
              <tr className="border-b-2 border-ink text-left font-mono text-xs tracking-wide text-ink-2 uppercase">
                <th scope="col" className="py-2 pr-3 pl-2 font-semibold">
                  Nr
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Wytyczna
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  W wersji roboczej
                </th>
                <th scope="col" className="py-2 font-semibold">
                  WCAG 2.2
                </th>
              </tr>
            </thead>
            {shownGroups.map((group) => (
              <tbody key={group.num}>
                <tr className="border-b border-rule bg-paper-2">
                  <th scope="rowgroup" colSpan={4} className="px-2 py-2.5 text-left font-bold">
                    <span className="font-mono">{group.num}</span> {group.title}{" "}
                    <span lang="en" className="font-mono text-[0.8125rem] font-normal text-ink-2">
                      {group.en}
                    </span>
                  </th>
                </tr>
                {group.guidelines.map((g) => (
                  <tr key={g.num} id={g.anchor} className="scroll-mt-4 border-b border-rule align-top target:bg-surface target:outline-3 target:outline-accent">
                    <td className="py-3 pr-3 pl-2 font-mono font-semibold whitespace-nowrap">{g.num}</td>
                    <th scope="row" className="py-3 pr-3 text-left font-semibold">
                      {g.title}
                    </th>
                    <td lang="en" className="py-3 pr-3 text-ink-2">
                      {g.en}
                    </td>
                    <td className="py-1.5">
                      {g.criteria.length > 0 ? (
                        <ul className="flex flex-wrap gap-x-1">
                          {g.criteria.map((id) => (
                            <li key={id}>
                              <Link
                                to="/kryteria/$criterionId"
                                params={{ criterionId: id }}
                                className="inline-flex min-h-11 min-w-11 items-center justify-center font-mono text-accent underline underline-offset-3"
                              >
                                {id}
                                <span className="sr-only"> {findCriterion(id)?.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="py-1.5">
                          <span className="rounded-xs border-2 border-ink bg-paper-2 px-1.5 py-1 font-mono text-xs leading-none font-bold">
                            Nowe w 3.0
                          </span>
                        </p>
                      )}
                      {g.note ? <p className="pb-1.5 text-[0.875rem] text-ink-2">{g.note}</p> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>
    </>
  );
}
