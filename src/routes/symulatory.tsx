import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DraftBadge } from "~/components/level-badge";
import { TermTips } from "~/components/term-tips";
import { firstOfKind, type SimulationKind } from "~/content/simulations";
import { getSimulators } from "~/content/simulators.functions";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/symulatory")({
  loader: () => getSimulators(),
  head: ({ match }) =>
    pageHead({
      title: "Symulatory", description:
        "Daltonizm, słabe widzenie, sama klawiatura, czytnik ekranu, wąski ekran i powiększony tekst: co pokazuje każdy symulator, czego nie pokazuje i których kryteriów uczy.",
      path: match.pathname,
    }),
  component: SimulatorsPage,
});

/**
 * The simulators (variant 2B of the simulator mocks): a card per kind with a small static
 * sample of the effect, each card leading to its section below, which says what the kind shows,
 * what it does not, and where to try it.
 */
function SimulatorsPage() {
  const { simulators, terms } = Route.useLoaderData();

  return (
    <>
      <h1 className="pt-8 text-[1.875rem] font-bold tracking-tight">Symulatory</h1>
      <p className="mt-2 max-w-[62ch] text-[1.0625rem] text-ink-2">
        Zobacz przykłady z Praktyki oczami, rękami i uszami innych osób. Symulator wybierasz na stronie przykładu.
      </p>
      <p className="mt-5 mb-8 max-w-[68ch] border border-ink px-4 py-3">
        <strong>To przybliżenie, nie doświadczenie.</strong> Symulacja pokazuje, gdzie projekt zawodzi. Nie mówi, jak
        żyje się z niepełnosprawnością. Czytnik ekranu sprawdzaj w NVDA albo VoiceOverze.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {simulators.map((simulator) => (
          <li
            key={simulator.kind}
            className="relative flex flex-col border border-rule bg-surface has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
          >
            <div aria-hidden="true" inert className="grid h-28 place-items-center overflow-hidden border-b border-rule bg-paper-2">
              {samples[simulator.kind]}
            </div>
            <div className="flex flex-1 flex-col gap-1 px-4 pt-3 pb-4">
              <a href={`#${simulator.kind}`} className="text-[1.0625rem] font-bold focus-visible:outline-none after:absolute after:inset-0">
                {simulator.title}
              </a>
              <p className="text-[0.9375rem] text-ink-2">{simulator.summary}</p>
              <p className="mt-auto pt-1 font-mono text-[0.8125rem]">{simulator.criteria.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ul>

      {simulators.map((simulator) => (
        <section key={simulator.kind} id={simulator.kind} aria-labelledby={`${simulator.kind}-title`} className="mt-12 scroll-mt-4">
          <h2 id={`${simulator.kind}-title`} className="flex flex-wrap items-center gap-3 text-xl font-bold tracking-tight">
            {simulator.title}
            {simulator.status === "szkic" ? <DraftBadge /> : null}
          </h2>
          <TermTips terms={terms}>
            <div className="prose mt-2" dangerouslySetInnerHTML={{ __html: simulator.html }} />
          </TermTips>
          <p className="mt-3 max-w-[68ch] text-ink-2">
            <strong className="text-ink">Czego to nie pokazuje:</strong> {simulator.limits}
          </p>
          <ul aria-label="Kryteria WCAG" className="mt-4 flex flex-wrap gap-2">
            {simulator.criteria.map((id) => (
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
          {simulator.examples.length > 0 ? (
            <>
              <h3 className="mt-5 font-mono text-xs font-semibold tracking-widest text-ink-2 uppercase">Wypróbuj na</h3>
              <ul className="mt-1">
                {simulator.examples.map((example) => (
                  <li key={example.slug}>
                    <Link
                      to="/praktyka/$slug"
                      params={{ slug: example.slug }}
                      search={{ symulacja: firstOfKind[simulator.kind] }}
                      className="inline-flex min-h-11 items-center text-accent underline underline-offset-3"
                    >
                      {example.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ))}
    </>
  );
}

// Static, decorative samples of each effect for the cards. The text on the cards carries the meaning.
const strip = ["#dd3333", "#2e8b57", "#2c36a8", "#f4e75b"];

const samples: Record<SimulationKind, ReactNode> = {
  barwy: (
    <div>
      <svg width="0" height="0" className="absolute">
        <filter id="sample-deuteranopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0 0.280 0.673 0.047 0 0 -0.012 0.043 0.969 0 0 0 0 0 1 0" />
        </filter>
      </svg>
      {[undefined, "url(#sample-deuteranopia)"].map((filter) => (
        <div key={filter ?? "none"} className="flex" style={{ filter }}>
          {strip.map((colour) => (
            <span key={colour} className="block size-9" style={{ background: colour }} />
          ))}
        </div>
      ))}
    </div>
  ),
  "slabe-widzenie": (
    <div className="grid gap-2 text-center text-[0.9375rem]" style={{ filter: "blur(1.5px) contrast(0.6)" }}>
      <span className="text-[#a3a39e]">Hasło musi mieć 8 znaków</span>
      <span className="text-[#14171a]">Hasło musi mieć 8 znaków</span>
    </div>
  ),
  klawiatura: (
    <div className="flex items-center gap-2 font-mono text-sm font-semibold">
      <span className="rounded-xs border-2 border-ink bg-surface px-2 py-0.5">Tab</span>
      {[1, 2, 3].map((n) => (
        <span key={n} className="grid size-6 place-items-center rounded-full bg-[#2c36a8] text-xs text-white">
          {n}
        </span>
      ))}
    </div>
  ),
  czytnik: <span className="border border-rule bg-surface px-3 py-1.5 font-mono text-[0.8125rem]">Zamknij komunikat, przycisk</span>,
  "waski-ekran": (
    <div className="relative grid size-20 place-items-center border-2 border-ink bg-surface font-mono text-xs">
      320
      <span className="absolute top-5 left-4 h-8 w-28 border-2 border-dashed border-bad" />
    </div>
  ),
  struktura: (
    <div className="relative h-20 w-40 border-2 border-[light-dark(#0a6363,#6fd3d3)] bg-surface">
      <span className="absolute top-0 right-0 border-b-2 border-l-2 border-[light-dark(#0a6363,#6fd3d3)] bg-surface px-1.5 font-mono text-xs font-bold text-[light-dark(#0a6363,#6fd3d3)]">
        nawigacja
      </span>
      <span className="absolute bottom-2.5 left-2.5 rounded-xs bg-ink px-1.5 font-mono text-xs font-bold text-paper">H2</span>
    </div>
  ),
};
