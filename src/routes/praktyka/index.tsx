import { createFileRoute, Link } from "@tanstack/react-router";
import { FixCard, FixCards } from "~/components/fix-card";
import { getExampleCards } from "~/content/content.functions";
import { countOf } from "~/lib/plural";

export const Route = createFileRoute("/praktyka/")({
  loader: () => getExampleCards(),
  head: () => ({ meta: [{ title: "Praktyka · a11y playground" }] }),
  component: PracticePage,
});

/** The catalogue of examples as cards ordered by payoff (variant B of the practice mocks). */
function PracticePage() {
  const cards = Route.useLoaderData();
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 pt-8 pb-2">
        <h1 className="text-[1.875rem] font-bold tracking-tight">Praktyka</h1>
        <p className="font-mono text-sm text-ink-2">{countOf(cards.length, ["przykład", "przykłady", "przykładów"])}, od najtańszej poprawki</p>
      </div>
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
