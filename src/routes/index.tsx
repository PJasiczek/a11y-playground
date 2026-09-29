import { createFileRoute, Link } from "@tanstack/react-router";
import { FixCard, FixCards } from "~/components/fix-card";
import { getExampleCards } from "~/content/content.functions";

// How many of the cheapest examples open the page as cards; the rest follow as a list.
const featured = 6;

export const Route = createFileRoute("/")({
  loader: () => getExampleCards(),
  component: HomePage,
});

/**
 * The home page from screen 0 of variant A: instead of explaining the product, it opens with
 * the faults you will actually meet, ordered by payoff. Criteria, law and practice stay in the
 * main navigation.
 */
function HomePage() {
  const cards = Route.useLoaderData();
  const rest = cards.slice(featured);

  return (
    <>
      <div className="pt-14 pb-9">
        <p className="mb-4 font-mono text-[0.8125rem] tracking-widest text-ink-2 uppercase">
          WCAG 2.1 · WCAG 2.2 · prawo polskie
        </p>
        <h1 className="max-w-[22ch] text-[clamp(2rem,5.2vw,3.125rem)] leading-[1.05] font-bold tracking-tight">
          Zacznij od tego, co psuje najwięcej.
        </h1>
        <p className="mt-4 max-w-[56ch] text-[1.0625rem] text-ink-2">
          Wzorce, które spotkasz w prawie każdym projekcie. Przy każdym: co poprawić, ile to zajmie i co konkretnie
          zyskuje użytkownik.
        </p>
        {/* A plain GET form: it reaches /szukaj?q= even before the page is interactive. */}
        <form role="search" action="/szukaj" method="get" className="mt-7 max-w-136">
          <label htmlFor="home-q" className="mb-1.5 block font-semibold">
            Szukaj w kryteriach, przykładach, przepisach, lekcjach i słowniku
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

      <section aria-labelledby="fix-first">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t-2 border-ink pt-4 pb-3">
          <h2 id="fix-first" className="text-2xl font-bold tracking-tight">
            Napraw to najpierw
          </h2>
          <p className="font-mono text-sm text-ink-2">{featured} wzorców o największym zysku</p>
        </div>
        <p className="mb-5 max-w-[62ch] text-[0.9375rem] text-ink-2">
          Żółta krawędź mówi, co zyskuje użytkownik. Nakład obok to szacunek na jedno miejsce w kodzie, nie na cały
          projekt.
        </p>
        <FixCards>
          {cards.slice(0, featured).map((card) => (
            <FixCard key={card.slug} card={card} headingLevel="h3" />
          ))}
        </FixCards>
      </section>

      {rest.length > 0 ? (
        <section aria-labelledby="more" className="pt-8">
          <h2 id="more" className="text-xl font-bold tracking-tight">
            Dalsze wzorce
          </h2>
          <ul className="mt-3 border-t border-rule">
            {rest.map((card) => (
              <li key={card.slug} className="border-b border-rule">
                <Link
                  to="/praktyka/$slug"
                  params={{ slug: card.slug }}
                  className="grid gap-x-4 gap-y-1 px-1 py-3.5 hover:bg-surface sm:grid-cols-[1fr_auto]"
                >
                  <span className="font-semibold">
                    {card.title}
                    <span className="mt-0.5 block text-[0.9375rem] font-normal text-ink-2">{card.gain}</span>
                  </span>
                  <span className="self-center font-mono text-xs text-ink-2 sm:text-right">
                    <span className="block font-bold text-accent">{card.criteria.join(" · ")}</span>
                    {card.effort}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-6">
        <Link to="/praktyka" className="font-semibold text-accent underline underline-offset-3">
          Wszystkie przykłady w dziale Praktyka
        </Link>
      </p>
    </>
  );
}
