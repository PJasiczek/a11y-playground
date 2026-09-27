import { createFileRoute, Link } from "@tanstack/react-router";

const doors = [
  {
    to: "/kryteria",
    meta: "WCAG 2.1 · WCAG 2.2",
    title: "Kryteria WCAG",
    body: "Każde kryterium w jednym zdaniu, jak je spełnić, typowe błędy i jak to sprawdzić.",
  },
  {
    to: "/prawo",
    meta: "3 ustawy · EAA · EN 301 549",
    title: "Prawo",
    body: "Kogo dotyczy, od kiedy, i które kryteria wynikają z którego przepisu.",
  },
  {
    to: "/praktyka",
    meta: "przykłady · symulatory · quizy",
    title: "Praktyka",
    body: "Wersja zepsuta i poprawna obok siebie, z kodem i z tym, co usłyszy czytnik ekranu.",
  },
] as const;

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <div className="pt-14 pb-9">
        <p className="mb-4 font-mono text-[0.8125rem] tracking-widest text-ink-2 uppercase">
          WCAG 2.1 · WCAG 2.2 · prawo polskie
        </p>
        <h1 className="max-w-[22ch] text-[clamp(2rem,5.2vw,3.125rem)] leading-[1.05] font-bold tracking-tight">
          Wiesz, co trzeba poprawić. Tu znajdziesz, czym to jest i kto tego wymaga.
        </h1>
        <p className="mt-4 max-w-[56ch] text-[1.0625rem] text-ink-2">
          Kryteria WCAG wyjaśnione prostym językiem, z przykładami w kodzie i z odesłaniem do przepisu, który je
          nakłada.
        </p>
        {/* A plain GET form: it reaches /szukaj?q= even before the page is interactive. */}
        <form role="search" action="/szukaj" method="get" className="mt-7 max-w-136">
          <label htmlFor="home-q" className="mb-1.5 block font-semibold">
            Szukaj w kryteriach i słowniku
          </label>
          <div className="flex rounded border-2 border-ink bg-surface">
            <input
              id="home-q"
              name="q"
              type="search"
              className="min-h-12 min-w-0 flex-1 bg-transparent px-3.5 text-base text-ink outline-offset-0"
            />
            <button type="submit" className="min-h-12 border-l-2 border-ink bg-marker px-4 font-bold text-on-marker">
              Szukaj
            </button>
          </div>
        </form>
      </div>

      <ul className="grid gap-px border-y border-rule bg-rule md:grid-cols-3">
        {doors.map(({ to, meta, title, body }) => (
          // The link is stretched over the whole card with ::after, so the card is one large target
          // while the accessible name stays just the heading text.
          <li key={to} className="relative bg-paper px-5 pt-6 pb-7 focus-within:bg-surface hover:bg-surface">
            <p className="mb-3 font-mono text-[0.8125rem] text-ink-2">{meta}</p>
            <h2 className="mb-1.5 text-[1.1875rem] font-bold tracking-tight">
              <Link to={to} className="after:absolute after:inset-0">
                {title}
              </Link>
            </h2>
            <p className="text-[0.9375rem] text-ink-2">{body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
