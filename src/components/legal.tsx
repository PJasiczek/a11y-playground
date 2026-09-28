import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { formatDate, type LegalUnitId } from "~/content/legal";
import { type Strength, strengthLabels } from "~/content/legal-map";

// Pieces shared by the law pages, /mapowanie and the "Prawo" section of criterion pages.

const strengthGlyphs = { wprost: "■", posrednio: "◧", powiazane: "□" } as const satisfies Record<Strength, string>;

/**
 * How strongly a provision requires a criterion, always as a word. The shape repeats the word
 * for scanning and is hidden from screen readers, so nothing rests on the glyph (1.4.1).
 */
export function StrengthLabel({ strength }: { strength: Strength | null }) {
  return (
    <span className="font-mono text-xs font-semibold tracking-wide whitespace-nowrap uppercase">
      <span aria-hidden="true">{strength ? strengthGlyphs[strength] : "·"} </span>
      {strength ? strengthLabels[strength] : "nie wymaga"}
    </span>
  );
}

/** Link to an article page, or to the annex. `hash` points at an ustęp ("ust-3"). */
export function ProvisionLink({ id, children, className }: { id: LegalUnitId; children: ReactNode; className?: string }) {
  const [act = "", unit = ""] = id.split("/");
  return (
    <Link to="/prawo/$act/$unit" params={{ act, unit }} className={className ?? "text-accent underline underline-offset-3"}>
      {children}
    </Link>
  );
}

/**
 * The line at the end of every legal page: this is not legal advice, and when the content was
 * last checked by a person. Drafts say they are drafts instead of showing a date.
 */
export function LegalFooter({ verified, retrieved }: { verified: string | null; retrieved?: string }) {
  return (
    <footer className="mt-10 flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-rule pt-4 text-sm text-ink-2">
      <p>Materiał edukacyjny, nie porada prawna. Wiążące jest brzmienie z Dziennika Ustaw.</p>
      <p className="font-mono text-[0.8125rem]">
        {retrieved ? <>Tekst pobrano {formatDate(retrieved)} · </> : null}
        {verified ? <>Zweryfikowano: {formatDate(verified)}</> : "Streszczenia są szkicem i czekają na weryfikację."}
      </p>
    </footer>
  );
}

export type TimelineEntry = {
  act: string;
  actShort: string;
  date: string;
  what: string;
  unit: LegalUnitId;
  unitLabel: string;
  yearly: boolean;
  /** False for deadlines of other situations: shown lighter and labelled, not hidden. */
  mine: boolean;
};

/** "za 3 lata i 9 miesięcy" between two ISO dates, in whole months. */
function until(from: string, to: string) {
  const [fy = 0, fm = 0] = from.split("-").map(Number);
  const [ty = 0, tm = 0] = to.split("-").map(Number);
  const months = (ty - fy) * 12 + (tm - fm);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = years === 0 ? "" : years === 1 ? "rok" : years < 5 ? `${String(years)} lata` : `${String(years)} lat`;
  const m = rest === 0 ? "" : rest === 1 ? "miesiąc" : rest < 5 ? `${String(rest)} miesiące` : `${String(rest)} miesięcy`;
  return `za ${[y, m].filter(Boolean).join(" i ") || "niecały miesiąc"}`;
}

/**
 * Every deadline on one line with the date the law was read on marked (variant A of the
 * /mapowanie mocks). The marker is "stan prawny na", not "dziś": pages are prerendered, so the
 * honest reference point is the date of the text, not the reader's clock.
 */
export function Timeline({ entries, asOf }: { entries: TimelineEntry[]; asOf: string }) {
  const past = entries.filter((e) => e.date <= asOf);
  const future = entries.filter((e) => e.date > asOf);
  const item = (entry: TimelineEntry, isPast: boolean) => (
    <li
      key={`${entry.act}-${entry.date}-${entry.unit}`}
      className="relative grid gap-x-5 gap-y-1 py-3.5 pl-5 sm:grid-cols-[9.5rem_1fr]"
    >
      <span
        aria-hidden="true"
        className={`absolute top-5 -left-[7px] size-3 rounded-full border-2 border-ink ${isPast ? "bg-ink" : "bg-paper"}`}
      />
      <span className="font-mono font-semibold">
        {entry.yearly ? `co rok, ${formatDate(entry.date).slice(0, 5)}` : formatDate(entry.date)}
        {!isPast ? <span className="mt-0.5 block text-xs font-normal text-ink-2">{until(asOf, entry.date)}</span> : null}
      </span>
      <div>
        <span className={entry.mine ? "text-[1.0625rem] font-semibold" : "text-ink-2"}>
          {entry.what}
          {!entry.mine ? (
            <span className="ml-2 rounded-xs border border-dashed border-control px-1 font-mono text-[0.6875rem] whitespace-nowrap text-ink-2">
              inna sytuacja
            </span>
          ) : null}
        </span>
        <p className="mt-0.5 text-sm text-ink-2">
          <ProvisionLink id={entry.unit}>{entry.unitLabel}</ProvisionLink> · {entry.actShort}
          {entry.yearly ? `, pierwszy raz ${formatDate(entry.date)}` : null}
        </p>
      </div>
    </li>
  );
  return (
    <ol className="mt-6 border-l-2 border-ink">
      {past.map((e) => item(e, true))}
      <li className="relative py-2 pl-5">
        <span aria-hidden="true" className="absolute top-[1.05rem] -left-[9px] h-0.5 w-4 bg-ink" />
        <span className="font-mono font-bold">stan prawny na {formatDate(asOf)}</span>
      </li>
      {future.map((e) => item(e, false))}
    </ol>
  );
}
