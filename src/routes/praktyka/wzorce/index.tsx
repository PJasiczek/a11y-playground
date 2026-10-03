import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chip, FilterGroup } from "~/components/filters";
import { PatternCard, PracticeTabs } from "~/components/patterns";
import { isNativeVerdict, type NativeVerdict, nativeVerdictIds, nativeVerdicts, patternBatches, patternBatchIds } from "~/content/pattern-labels";
import { getPatternCards } from "~/content/patterns.functions";

/** `?natywnie=` narrows the catalogue to one verdict. Anything else is dropped, as on /kryteria. */
function validateSearch(search: Record<string, unknown>): { natywnie?: NativeVerdict } {
  return isNativeVerdict(search.natywnie) ? { natywnie: search.natywnie } : {};
}

export const Route = createFileRoute("/praktyka/wzorce/")({
  validateSearch,
  loader: () => getPatternCards(),
  head: () => ({ meta: [{ title: "Wzorce komponentów · Praktyka · a11y playground" }] }),
  component: PatternsPage,
});

/**
 * The pattern catalogue (variant 2C of the phase 9 mocks, inside Praktyka as in 4B): cards with a
 * still of each pattern, grouped by batch, filtered by whether HTML has the element for the job.
 */
function PatternsPage() {
  const cards = Route.useLoaderData();
  const { natywnie } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const shown = cards.filter((card) => !natywnie || card.native === natywnie);
  const filters = [undefined, ...nativeVerdictIds];

  return (
    <>
      <h1 className="pt-8 pb-2 text-[1.875rem] font-bold tracking-tight">Praktyka</h1>
      <PracticeTabs />
      <p className="mb-6 max-w-[60ch] text-ink-2">
        Działające kontrolki do obsłużenia klawiaturą, a obok to, co powiedziałby czytnik ekranu. Kod jest nasz, napisany
        według <span lang="en">WAI-ARIA Authoring Practices</span>, a lista pochodzi z{" "}
        <span lang="en">Deque University ARIA Examples</span>.
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-rule pb-4">
        <FilterGroup legend="Pokaż">
          {filters.map((verdict) => (
            <Chip
              key={verdict ?? "wszystkie"}
              type="radio"
              name="natywnie"
              checked={natywnie === verdict}
              onChange={() => {
                void navigate({ search: verdict ? { natywnie: verdict } : {}, replace: true, resetScroll: false });
              }}
            >
              {verdict ? (
                <>
                  <span aria-hidden="true" className="mr-1">
                    {nativeVerdicts[verdict].glyph}
                  </span>
                  {nativeVerdicts[verdict].label}
                </>
              ) : (
                "Wszystkie"
              )}
            </Chip>
          ))}
        </FilterGroup>
        <p role="status" className="font-mono text-sm text-ink-2">
          Pokazuję {shown.length} z {cards.length} wzorców
        </p>
      </div>

      {patternBatchIds.map((batch) => {
        const inBatch = shown.filter((card) => card.batch === batch);
        if (inBatch.length === 0) return null;
        return (
          <section key={batch} aria-labelledby={`partia-${batch}`} className="mt-8">
            <h2 id={`partia-${batch}`} className="text-xl font-bold tracking-tight">
              {patternBatches[batch].title}
            </h2>
            <p className="mt-1 mb-4 max-w-[60ch] text-ink-2">{patternBatches[batch].lead}</p>
            <ul className="grid border-t border-l border-rule sm:grid-cols-2 lg:grid-cols-3">
              {inBatch.map((card) => (
                <PatternCard key={card.slug} card={card} />
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
