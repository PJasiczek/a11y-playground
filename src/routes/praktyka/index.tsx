import { createFileRoute, Link } from "@tanstack/react-router";
import { FixCard, FixCards } from "~/components/fix-card";
import { PracticeTabs } from "~/components/patterns";
import { getExampleCards } from "~/content/content.functions";
import { countOf } from "~/lib/plural";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/praktyka/")({
  loader: () => getExampleCards(),
  head: ({ match }) =>
    pageHead({
      title: "Praktyka", description:
        "Ten sam fragment interfejsu dwa razy: zepsuty i poprawny, z kodem i z tym, co usłyszy czytnik ekranu. Przykłady ułożone od najtańszej poprawki.",
      path: match.pathname,
    }),
  component: PracticePage,
});

/**
 * The catalogue of examples as cards ordered by payoff (variant B of the practice mocks), the first
 * half of Praktyka; the patterns are the second (mock 4B of phase 9).
 */
function PracticePage() {
  const cards = Route.useLoaderData();
  return (
    <>
      <h1 className="pt-8 pb-2 text-[1.875rem] font-bold tracking-tight">Praktyka</h1>
      <PracticeTabs />
      <p className="mb-2 font-mono text-sm text-ink-2">{countOf(cards.length, ["przykład", "przykłady", "przykładów"])}, od najtańszej poprawki</p>
      <p className="mb-6 max-w-[60ch] text-ink-2">
        Ten sam fragment interfejsu dwa razy: zepsuty i poprawny, z kodem i z tym, co usłyszy czytnik ekranu. Żółta
        krawędź mówi, co zyskuje użytkownik. Nakład to szacunek na jedno miejsce w kodzie.
      </p>
      <p className="mb-6 max-w-[60ch] text-ink-2">
        Każdy przykład obejrzysz też bez kolorów, bez myszy, przez czytnik ekranu albo na wąskim ekranie.{" "}
        <Link to="/symulatory" className="text-accent underline underline-offset-3">
          Jak działają symulatory
        </Link>
      </p>
      <FixCards>
        {cards.map((card) => (
          <FixCard key={card.slug} card={card} headingLevel="h2" />
        ))}
      </FixCards>
    </>
  );
}
