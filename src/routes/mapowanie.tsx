import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type } from "arktype";
import { LevelBadge } from "~/components/level-badge";
import { LegalFooter, ProvisionLink, StrengthLabel, Timeline } from "~/components/legal";
import { findUnit, type SituationId, situationIds, situations } from "~/content/legal";
import { edges } from "~/content/legal-map";
import { getLawIndex } from "~/content/legal.functions";
import { findCriterion } from "~/content/wcag";
import { countOf } from "~/lib/plural";
import { pageHead } from "~/lib/seo";

const SituationParam = type.enumerated(...situationIds);

export const Route = createFileRoute("/mapowanie")({
  // The picked situation lives in the URL, so an answer can be shared as a link.
  validateSearch: (search: Record<string, unknown>) =>
    SituationParam.allows(search.sytuacja) ? { sytuacja: search.sytuacja } : {},
  loader: () => getLawIndex(),
  head: ({ match }) =>
    pageHead({
      title: "Co mnie obowiązuje", description:
        "Wybierz, czym jest twój produkt: strona lub aplikacja podmiotu publicznego albo produkt czy usługa firmy. Zobaczysz terminy z ustaw i kryteria WCAG, które z nich wynikają.",
      path: match.pathname,
    }),
  component: ObligationsPage,
});

const defaultSituation: SituationId = "strona-publiczna";

/**
 * "What applies to me" (variant A of the legal mocks, the timetable). The reader picks a
 * situation; every deadline stays on the line, the ones for other situations lighter and
 * labelled. The criteria behind the deadlines are one disclosure away.
 */
function ObligationsPage() {
  const { deadlines, asOf } = Route.useLoaderData();
  const { sytuacja = defaultSituation } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const picked = situations.find((s) => s.id === sytuacja) ?? situations[0];
  const mine = deadlines.filter((d) => d.situations.includes(sytuacja));
  const rows = edges.filter((edge) => edge.applies.includes(sytuacja));
  const binding = rows.filter((edge) => edge.strength !== "powiazane");

  return (
    <>
      <h1 className="pt-8 text-[1.875rem] font-bold tracking-tight">Co mnie obowiązuje</h1>
      <p className="mt-3 max-w-[62ch] text-ink-2">
        Wybierz, czym jest twój produkt. Terminy twojej sytuacji są wyróżnione, pozostałe zostają na osi, żeby było widać, że
        niczego nie pominęliśmy.
      </p>

      <fieldset className="mt-6">
        <legend className="mb-2.5 text-[1.0625rem] font-bold">Czym jest twój produkt?</legend>
        <div className="flex flex-wrap gap-2">
          {situations.map((s) => (
            <label
              key={s.id}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded border border-control bg-surface px-3.5 text-[0.9375rem] has-checked:border-2 has-checked:border-ink has-checked:font-bold has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
            >
              <input
                type="radio"
                name="sytuacja"
                checked={sytuacja === s.id}
                onChange={() => {
                  void navigate({ search: s.id === defaultSituation ? {} : { sytuacja: s.id }, replace: true, resetScroll: false });
                }}
                className="size-5 accent-ink"
              />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      <p role="status" className="mt-4 text-[0.9375rem] text-ink-2">
        {countOf(mine.length, ["termin dotyczy", "terminy dotyczą", "terminów dotyczy"])} sytuacji: {picked.label.toLowerCase()}.{" "}
        {binding.length > 0
          ? `Prawo wymaga wprost ${countOf(binding.length, ["kryterium", "kryteriów", "kryteriów"])} WCAG.`
          : "Prawo nie wymaga wprost żadnego kryterium WCAG."}
      </p>

      <Timeline entries={deadlines.map((d) => ({ ...d, mine: d.situations.includes(sytuacja) }))} asOf={asOf} />

      <details className="disclosure mt-8 rounded border border-control">
        <summary className="flex min-h-11 cursor-pointer items-center px-4 font-semibold">
          Pełna tabela: przepis i kryterium ({rows.length})
        </summary>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full border-collapse text-[0.9375rem]">
            <caption className="py-2 text-left text-ink-2">Kryteria WCAG w sytuacji: {picked.label.toLowerCase()}</caption>
            <thead>
              <tr className="border-b border-ink text-left font-mono text-xs tracking-wide text-ink-2 uppercase">
                <th scope="col" className="py-2 pr-3">
                  Kryterium
                </th>
                <th scope="col" className="py-2 pr-3">
                  Powiązanie
                </th>
                <th scope="col" className="py-2">
                  Przepis
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((edge) => {
                const criterion = findCriterion(edge.criterion);
                return (
                  <tr key={`${edge.legal}-${edge.criterion}`} className="border-b border-rule">
                    <th scope="row" className="py-2 pr-3 text-left font-normal">
                      <Link
                        to="/kryteria/$criterionId"
                        params={{ criterionId: edge.criterion }}
                        className="inline-flex min-h-11 items-center gap-1.5 underline underline-offset-3"
                      >
                        <b className="font-mono">{edge.criterion}</b> {criterion?.name}
                      </Link>{" "}
                      {criterion ? <LevelBadge level={criterion.level} /> : null}
                    </th>
                    <td className="py-2 pr-3">
                      <StrengthLabel strength={edge.strength} />
                    </td>
                    <td className="py-2">
                      <ProvisionLink id={edge.legal} className="inline-flex min-h-11 min-w-11 items-center text-accent underline underline-offset-3">
                        {findUnit(edge.legal)?.label}
                      </ProvisionLink>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows[0]?.note && rows.every((edge) => edge.note === rows[0]?.note) ? <p className="mt-3 text-ink-2">{rows[0].note}</p> : null}
        </div>
      </details>

      <LegalFooter verified={null} retrieved={asOf} />
    </>
  );
}
