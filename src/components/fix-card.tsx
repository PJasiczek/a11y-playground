import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type FixCardData = {
  slug: string;
  title: string;
  summary: string;
  criteria: string[];
  effort: string;
  gain: string;
  preview: string;
};

/** The card grid shared by /praktyka and the home page. */
export function FixCards({ children }: { children: ReactNode }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
  );
}

/**
 * One example as a card (variant B of the practice mocks): a picture of the fault, the fix,
 * and under a dotted rule, next to a grass tick, what the user gains. The picture is decorative and inert, so the text
 * carries everything. The title link is stretched over the card, which makes the whole card one
 * large target while the link's name stays the title.
 */
export function FixCard({ card, headingLevel }: { card: FixCardData; headingLevel: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <li className="kind-praktyka relative flex flex-col rounded-lg bg-surface px-5 pt-5 pb-5 shadow-[0_1px_0_var(--rule),0_14px_28px_-24px_rgb(0_0_0/0.25)] transition-transform duration-200 ease-(--ease-out) hover:-translate-y-0.75">
      <div
        aria-hidden="true"
        inert
        className="preview mb-4 flex min-h-20 items-center justify-center rounded-md bg-paper-2 p-3"
        dangerouslySetInnerHTML={{ __html: card.preview }}
      />
      <Heading className="mb-1.5 text-[1.0625rem] font-extrabold tracking-tight">
        <Link to="/praktyka/$slug" params={{ slug: card.slug }} className="after:absolute after:inset-0">
          {card.title}
        </Link>
      </Heading>
      <p className="mb-3.5 text-[0.9375rem] text-ink-2">{card.summary}</p>
      <p className="mb-4 flex gap-2 border-t-2 border-dotted border-rule pt-2.5 text-[0.9375rem]">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 fill-none stroke-good stroke-[2.4] [stroke-linecap:round] [stroke-linejoin:round]">
          <path d="m4 10.5 4 4 8-9" />
        </svg>
        <span>
          <b className="font-bold">Zysk:</b> {card.gain}
        </span>
      </p>
      <p className="mt-auto flex flex-wrap items-center gap-1.5">
        <span className="sr-only">Kryteria: </span>
        {card.criteria.map((id) => (
          <span key={id} className="rounded-xs bg-kind px-1.5 py-1 text-xs font-semibold">
            {id}
          </span>
        ))}
        <span className="ml-auto text-xs text-ink-2">
          <span className="sr-only">Nakład pracy: </span>
          {card.effort}
        </span>
      </p>
    </li>
  );
}
