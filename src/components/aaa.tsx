import { Link } from "@tanstack/react-router";
import { type Criterion, type CriterionId, findCriterion } from "~/content/wcag";
import { LevelBadge } from "./level-badge";

/** One sentence under the summary of every AAA criterion. The level stays in text, never colour. */
export function AaaNote() {
  return (
    <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem]">
      <span className="rounded-xs border-2 border-ink px-1.5 py-1 font-mono text-xs leading-none font-bold">AAA</span>
      <span>Poziom AAA: cel, nie obowiązek. Żadna ustawa go nie wymaga.</span>
      <a href="#prawo" className="inline-flex min-h-11 items-center text-accent underline underline-offset-3">
        Prawo
      </a>
    </p>
  );
}

/**
 * Variant 1A of the phase 8 mocks: the AA criterion this one tightens and this one side by side,
 * with the one-line difference under both. Stacks on narrow screens.
 */
export function EnhancesStrip({ criterion, enhances }: { criterion: Criterion; enhances: { id: CriterionId; difference: string } }) {
  const weaker = findCriterion(enhances.id);
  if (!weaker) return null;
  return (
    <div
      role="group"
      aria-label={`Porównanie z kryterium ${weaker.id}`}
      className="mt-7 grid max-w-176 border-2 border-ink bg-surface sm:grid-cols-2"
    >
      <div className="px-4 pt-3 pb-4">
        <p className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wide text-ink-2 uppercase">
          <LevelBadge level={weaker.level} /> zaostrza
        </p>
        <Link
          to="/kryteria/$criterionId"
          params={{ criterionId: weaker.id }}
          className="mt-1 inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline underline-offset-3"
        >
          <b className="font-mono">{weaker.id}</b> {weaker.name}
        </Link>
      </div>
      <div className="border-t-2 border-ink bg-paper-2 px-4 pt-3 pb-4 sm:border-t-0 sm:border-l-2">
        <p className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wide text-ink-2 uppercase">
          <LevelBadge level={criterion.level} /> ta strona
        </p>
        <p className="mt-1 flex min-h-11 items-center gap-2 font-semibold">
          <b className="font-mono">{criterion.id}</b> {criterion.name}
        </p>
      </div>
      <p className="border-t border-rule px-4 py-3 text-[1.0625rem] sm:col-span-2">
        <span className="font-semibold">Różnica: </span>
        {enhances.difference}
      </p>
    </div>
  );
}

/** "Ta aplikacja to spełnia" with how we know, for the AAA criteria listed in content/app-meets.ts. */
export function AppMeets({ note }: { note: string }) {
  return (
    <p className="mt-4 flex max-w-176 flex-wrap items-start gap-x-3 gap-y-1 text-[0.9375rem]">
      <span className="rounded-xs border-2 border-good px-1.5 py-1 font-mono text-xs leading-none font-bold whitespace-nowrap text-good">
        <span aria-hidden="true">✓ </span>
        Ta aplikacja to spełnia
      </span>
      <span className="min-w-0 flex-1 basis-80">{note}</span>
    </p>
  );
}
