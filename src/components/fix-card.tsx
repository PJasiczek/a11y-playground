import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DraftBadge } from "./level-badge";

export type FixCardData = {
  slug: string;
  title: string;
  summary: string;
  criteria: string[];
  effort: string;
  gain: string;
  preview: string;
  status: "szkic" | "zweryfikowane";
};

/** The card grid shared by /praktyka and the home page. */
export function FixCards({ children }: { children: ReactNode }) {
  return (
    <ul className="grid border-t border-l border-rule sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
  );
}

/**
 * One example as a card (variant B of the practice mocks): a picture of the fault, the fix,
 * and on a yellow edge what the user gains. The picture is decorative and inert, so the text
 * carries everything. The title link is stretched over the card, which makes the whole card one
 * large target while the link's name stays the title.
 */
export function FixCard({ card, headingLevel }: { card: FixCardData; headingLevel: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <li className="relative flex flex-col border-r border-b border-rule bg-paper px-5 pt-5 pb-6 focus-within:bg-surface hover:bg-surface">
      <div
        aria-hidden="true"
        inert
        className="preview mb-4 flex min-h-20 items-center justify-center rounded-xs border border-dashed border-control bg-paper-2 p-3"
        dangerouslySetInnerHTML={{ __html: card.preview }}
      />
      <Heading className="mb-1.5 text-[1.0625rem] font-bold tracking-tight">
        <Link to="/praktyka/$slug" params={{ slug: card.slug }} className="after:absolute after:inset-0">
          {card.title}
        </Link>
      </Heading>
      <p className="mb-3.5 text-[0.9375rem] text-ink-2">{card.summary}</p>
      <p className="mb-4 border-l-4 border-marker py-0.5 pl-3 text-[0.9375rem]">
        <b className="font-semibold">Zysk:</b> {card.gain}
      </p>
      <p className="mt-auto flex flex-wrap items-center gap-1.5">
        <span className="sr-only">Kryteria: </span>
        {card.criteria.map((id) => (
          <span key={id} className="rounded-xs border border-control bg-surface px-1.5 py-1 font-mono text-xs font-semibold">
            {id}
          </span>
        ))}
        {card.status === "szkic" ? <DraftBadge /> : null}
        <span className="ml-auto font-mono text-xs text-ink-2">
          <span className="sr-only">Nakład pracy: </span>
          {card.effort}
        </span>
      </p>
    </li>
  );
}
