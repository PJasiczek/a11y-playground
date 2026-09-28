import { createFileRoute, Link } from "@tanstack/react-router";
import { DraftBadge } from "~/components/level-badge";
import { LegalFooter, Timeline } from "~/components/legal";
import { getLawIndex } from "~/content/legal.functions";

export const Route = createFileRoute("/prawo/")({
  loader: () => getLawIndex(),
  head: () => ({ meta: [{ title: "Prawo · a11y playground" }] }),
  component: LawPage,
});

/** The acts in the app, EN 301 549, and every deadline on one timeline. */
function LawPage() {
  const { acts, deadlines, asOf } = Route.useLoaderData();

  return (
    <>
      <h1 className="pt-8 text-[1.875rem] font-bold tracking-tight">Prawo</h1>
      <p className="mt-3 max-w-[62ch] text-ink-2">
        Kogo dotyczą polskie przepisy o dostępności, od kiedy i które kryteria WCAG z nich wynikają. Przy każdej ustawie
        najpierw nasze streszczenie, a obok dosłowne brzmienie.
      </p>
      <p className="mt-5">
        <Link
          to="/mapowanie"
          className="inline-flex min-h-11 items-center rounded border-2 border-ink bg-marker px-4 font-bold text-on-marker"
        >
          Sprawdź, co obowiązuje twój produkt
        </Link>
      </p>

      <section aria-labelledby="ustawy" className="mt-10">
        <h2 id="ustawy" className="border-t-2 border-ink pt-5 text-xl font-bold tracking-tight">
          Ustawy
        </h2>
        <ul className="mt-2">
          {acts.map((act) => (
            <li key={act.slug} className="border-b border-rule">
              <Link to="/prawo/$act" params={{ act: act.slug }} className="block px-1 py-4 hover:bg-surface">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-[1.0625rem] font-semibold">{act.short}</span>
                  <span className="font-mono text-[0.8125rem] text-ink-2">{act.address}</span>
                  {act.verification === null ? <DraftBadge /> : null}
                </span>
                <span className="mt-1 block max-w-[66ch] text-[0.9375rem] text-ink-2">{act.summary}</span>
                <span className="mt-1 block text-[0.9375rem]">
                  <span className="font-semibold">Kogo wiąże:</span> {act.binds}
                </span>
              </Link>
            </li>
          ))}
          <li className="border-b border-rule">
            <Link to="/prawo/en-301-549" className="block px-1 py-4 hover:bg-surface">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[1.0625rem] font-semibold">EN 301 549</span>
                <span className="font-mono text-[0.8125rem] text-ink-2">norma europejska</span>
              </span>
              <span className="mt-1 block max-w-[66ch] text-[0.9375rem] text-ink-2">
                Norma, która powtarza kryteria WCAG i łączy je z ustawami. Nie jest ustawą, ale kto ją spełnia, spełnia
                wymagania ustawy o dostępności cyfrowej.
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="terminy" className="mt-10">
        <h2 id="terminy" className="border-t-2 border-ink pt-5 text-xl font-bold tracking-tight">
          Terminy
        </h2>
        <Timeline entries={deadlines.map((d) => ({ ...d, mine: true }))} asOf={asOf} />
      </section>

      <LegalFooter
        verified={acts.every((a) => a.verification) ? (acts.map((a) => a.verification ?? "").toSorted()[0] ?? null) : null}
        retrieved={asOf}
      />
    </>
  );
}
