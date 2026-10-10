import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckGate, focusTitle, NotesBox, useReview } from "~/components/before-after";
import { Chip, FilterGroup } from "~/components/filters";
import { DraftBadge } from "~/components/level-badge";
import { type Harmed, harmedIds, harmedLabels, isHarmed, reviewKey } from "~/content/before-after-labels";
import { getProblemRows } from "~/content/before-after.functions";
import { countOf } from "~/lib/plural";
import { progressStore } from "~/progress/store";

/** `?komu=` narrows the list to the problems that hurt one group. Anything else is dropped. */
function validateSearch(search: Record<string, unknown>): { komu?: Harmed } {
  return isHarmed(search.komu) ? { komu: search.komu } : {};
}

export const Route = createFileRoute("/praktyka/przed-i-po/lista")({
  validateSearch,
  loader: () => getProblemRows(),
  head: () => ({ meta: [{ title: "Lista problemów · Strona przed i po · a11y playground" }] }),
  component: ProblemListPage,
});

const chip = "inline-flex min-h-11 items-center gap-2 rounded-xs border border-control bg-surface px-3 hover:border-ink";

/**
 * The problems of the broken KMW page as a table filtered by who they hurt (mock 4B of phase 11),
 * under the reader's notes (mock 3A). Each title opens the problem's own page. While the reader
 * is still checking, a reminder stands in for all of it.
 */
function ProblemListPage() {
  const rows = Route.useLoaderData();
  const { komu } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const shown = rows.filter((row) => !komu || row.who.includes(komu));
  const status = komu
    ? `${countOf(shown.length, ["problem szkodzi", "problemy szkodzą", "problemów szkodzi"])} z ${String(rows.length)}: ${harmedLabels[komu]}`
    : countOf(rows.length, ["problem", "problemy", "problemów"]);
  const { revealedAt, notes } = useReview();

  if (!revealedAt) return <CheckGate subject="Lista problemów" revealLabel="Pokaż listę mimo to" />;

  const restart = () => {
    const question =
      notes.length > 0
        ? `Usunąć ${countOf(notes.length, ["notatkę", "notatki", "notatek"])} i schować odpowiedzi?`
        : "Schować odpowiedzi i zacząć sprawdzanie od nowa?";
    if (!confirm(question)) return;
    progressStore().restart(reviewKey);
    focusTitle();
  };

  return (
    <>
      <nav aria-label="Okruszki" className="pt-4 font-mono text-[0.8125rem] text-ink-2">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/praktyka/przed-i-po" className="inline-flex min-h-11 items-center underline underline-offset-3">
              Strona przed i po
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">Lista problemów</span>
          </li>
        </ol>
      </nav>
      <h1 id="tytul" tabIndex={-1} className="pt-3 pb-2 text-[1.875rem] font-bold tracking-tight outline-none">
        Lista problemów
      </h1>
      <p className="max-w-[60ch] text-ink-2">
        Twoje notatki, a pod nimi problemy strony Komunikacji Miejskiej Wrzosów, w kolejności od góry strony. Numery są te
        same co na znacznikach w wersji zepsutej.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href="/demo/przed-i-po/przed-znaczniki" className={chip}>
          Strona zepsuta ze znacznikami
        </a>
        <a href="/demo/przed-i-po/po" className={chip}>
          Wersja poprawiona
        </a>
        <button type="button" className={chip} onClick={restart}>
          Zacznij od nowa
        </button>
      </div>
      <NotesBox />

      <div className="mt-6 border-b border-rule pb-4">
        <FilterGroup legend="Komu szkodzi">
          {[undefined, ...harmedIds].map((who) => (
            <Chip
              key={who ?? "wszyscy"}
              type="radio"
              name="komu"
              checked={komu === who}
              onChange={() => {
                void navigate({ search: who ? { komu: who } : {}, replace: true, resetScroll: false });
              }}
            >
              {who ? harmedLabels[who] : "Wszystkim"}
            </Chip>
          ))}
        </FilterGroup>
      </div>
      <p role="status" className="mt-3 font-mono text-sm text-ink-2">
        {status}
      </p>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-[0.9375rem]">
          <thead>
            <tr className="border-b-2 border-ink text-left">
              <th scope="col" className="py-2 pr-3 font-mono text-xs">
                Nr
              </th>
              <th scope="col" className="py-2 pr-3">
                Problem
              </th>
              <th scope="col" className="py-2 pr-3">
                Kryteria
              </th>
              <th scope="col" className="py-2 pr-3">
                axe
              </th>
              <th scope="col" className="py-2">
                {komu ? "Szkodzi też" : "Komu szkodzi"}
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => {
              const others = row.who.filter((who) => who !== komu);
              return (
                <tr key={row.number} className="border-b border-rule align-top">
                  <td className="py-1 pr-3 font-mono font-bold">
                    <span className="inline-flex min-h-11 items-center">{row.number}</span>
                  </td>
                  <td className="py-1 pr-3">
                    <Link
                      to="/praktyka/przed-i-po/$problem"
                      params={{ problem: String(row.number) }}
                      className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-3"
                    >
                      {row.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-3 font-mono text-sm whitespace-nowrap">{row.criteria.join(" · ")}</td>
                  <td className="py-3 pr-3 whitespace-nowrap">{row.axe.length > 0 ? "zgłasza" : "nie widzi"}</td>
                  <td className="py-3 text-ink-2">{others.length > 0 ? others.map((who) => harmedLabels[who]).join(", ") : "nikomu więcej"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.some((row) => row.status === "szkic") ? (
        <p className="mt-4 flex flex-wrap items-center gap-2 text-[0.9375rem] text-ink-2">
          <DraftBadge /> Opisy czekają na weryfikację.
        </p>
      ) : null}
    </>
  );
}
