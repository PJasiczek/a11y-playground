import { Link } from "@tanstack/react-router";
import { type Announcement, announceKinds } from "~/content/announce";
import { type NativeVerdict, nativeVerdicts } from "~/content/pattern-labels";
import { DraftBadge } from "./level-badge";

// Pieces of /praktyka/wzorce and the pattern pages (variants 1C, 2C and 4B of the phase 9 mocks).

/** Whether HTML has the element for the job. The glyph's shape and the words carry it, not colour. */
export function NativeVerdictBadge({ verdict }: { verdict: NativeVerdict }) {
  const { glyph, label } = nativeVerdicts[verdict];
  return (
    <span className="inline-flex min-h-11 items-center gap-2 rounded-xs border-2 border-ink bg-surface px-3 text-[0.9375rem] font-bold">
      <span aria-hidden="true" className="text-lg leading-none">
        {glyph}
      </span>
      {label}
    </span>
  );
}

/**
 * The parts of Praktyka (mock 4B of phase 9, 1A of phase 11): broken and fixed examples, the
 * patterns, and the whole page before and after. Links to URLs, not ARIA tabs, so no arrow keys
 * are expected.
 */
export function PracticeTabs() {
  const link =
    "inline-flex min-h-11 items-center border-b-3 border-transparent px-3 font-semibold text-ink-2 hover:text-ink aria-[current=page]:border-ink aria-[current=page]:text-ink";
  return (
    <nav aria-label="Praktyka" className="mb-6">
      <ul className="flex flex-wrap gap-2 border-b border-rule">
        <li className="-mb-px">
          <Link to="/praktyka" activeOptions={{ exact: true }} className={link}>
            Błędy i poprawki
          </Link>
        </li>
        <li className="-mb-px">
          <Link to="/praktyka/wzorce" className={link}>
            Wzorce komponentów
          </Link>
        </li>
        <li className="-mb-px">
          <Link to="/praktyka/przed-i-po" className={link}>
            Strona przed i po
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export type PatternCardData = {
  slug: string;
  title: string;
  en: string;
  native: NativeVerdict;
  criteria: string[];
  preview: string;
  status: "szkic" | "zweryfikowane";
};

/**
 * One pattern as a card with a still of it (mock 2C). The still is decorative and inert, so the
 * text carries everything; the title link is stretched over the card.
 */
export function PatternCard({ card }: { card: PatternCardData }) {
  const { glyph, label } = nativeVerdicts[card.native];
  return (
    <li className="relative flex flex-col border-r border-b border-rule bg-paper focus-within:bg-surface hover:bg-surface">
      <div
        aria-hidden="true"
        inert
        className="preview flex min-h-28 items-center justify-center border-b border-rule bg-paper-2 p-3"
        dangerouslySetInnerHTML={{ __html: card.preview }}
      />
      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <h3 className="text-[1.0625rem] font-bold tracking-tight">
          <Link to="/praktyka/wzorce/$slug" params={{ slug: card.slug }} className="after:absolute after:inset-0">
            {card.title}
          </Link>
        </h3>
        <p lang="en" className="mt-0.5 font-mono text-[0.8125rem] text-ink-2">
          {card.en}
        </p>
        <p className="mt-2 text-[0.9375rem]">
          <span aria-hidden="true">{glyph} </span>
          {label}
        </p>
        <p className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
          <span className="sr-only">Kryteria: </span>
          {card.criteria.map((id) => (
            <span key={id} className="rounded-xs border border-control bg-surface px-1.5 py-1 font-mono text-xs font-semibold">
              {id}
            </span>
          ))}
          {card.status === "szkic" ? <DraftBadge /> : null}
        </p>
      </div>
    </li>
  );
}

// Each kind of line has its own border, so the tag is told apart without colour.
const kindBorder = { focus: "border-solid", state: "border-double border-3", live: "border-dashed" } as const;
const politenessWords = { polite: "grzecznie", assertive: "natychmiast" } as const;

/**
 * What a screen reader would say, line by line, as the frame reports it. Not a live region: it
 * would talk over the reader's own screen reader. The limits sit above the list, not under it.
 */
export function PatternLog({ lines, onClear }: { lines: Announcement[]; onClear: () => void }) {
  return (
    <section aria-labelledby="log-title" className="rounded-xs bg-ink px-4 pt-3 pb-4 text-paper">
      <div className="flex items-center justify-between gap-3">
        <h2 id="log-title" className="font-mono text-[0.8125rem] font-bold tracking-wider uppercase">
          Co słyszy czytnik
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-11 items-center rounded-xs border border-paper px-3 font-mono text-xs font-semibold focus-visible:outline-paper"
        >
          Wyczyść
        </button>
      </div>
      <p className="mt-1 mb-3 text-[0.8125rem]">
        Przybliżenie z kodu wzorca. NVDA, JAWS i VoiceOver mówią własnymi słowami, w swojej kolejności, a część zmian w
        regionach na żywo ogłaszają później albo wcale.
      </p>
      {lines.length > 0 ? (
        <ol className="font-mono text-sm leading-snug">
          {lines.map((line, index) => (
            <li key={index} className="grid grid-cols-[2rem_6.5rem_minmax(0,1fr)] gap-2 border-t border-paper/30 py-2">
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className={`self-start justify-self-start rounded-xs border border-paper px-1.5 text-[0.6875rem] font-bold uppercase ${kindBorder[line.kind]}`}>
                {announceKinds[line.kind]}
                {line.politeness ? `, ${politenessWords[line.politeness]}` : ""}
              </span>
              <span className="min-w-0 break-words">
                {line.text}
                {line.key ? <span className="block text-xs">po: {line.key}</span> : null}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="border-t border-paper/30 pt-2 text-sm">Przejdź do ramki klawiszem Tab. Każdy komunikat pojawi się tutaj.</p>
      )}
    </section>
  );
}

export type AriaRowData = { attr: string; on: string; meaning: string };

/**
 * The attributes the pattern uses, with their current values as the frame reports them. A row
 * that changed on the last report says "zmienione" in words, not only by its shading.
 */
export function AriaTable({ rows, values, changed }: { rows: AriaRowData[]; values: (string | null)[]; changed: boolean[] }) {
  return (
    <section aria-labelledby="aria-title">
      <h2 id="aria-title" className="text-lg font-bold">
        ARIA w tym wzorcu
      </h2>
      {rows.length > 0 ? (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse bg-surface text-[0.9375rem]">
            <caption className="sr-only">Atrybuty i ich bieżące wartości</caption>
            <thead>
              <tr className="bg-paper-2 text-left text-[0.8125rem]">
                <th scope="col" className="border border-rule px-2.5 py-2">
                  Atrybut
                </th>
                <th scope="col" className="border border-rule px-2.5 py-2">
                  Co znaczy
                </th>
                <th scope="col" className="border border-rule px-2.5 py-2">
                  Teraz
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const value = values[index];
                return (
                  <tr key={`${row.attr}-${String(index)}`} className={`align-top ${changed[index] ? "bg-paper-2" : ""}`}>
                    <th scope="row" className="border border-rule px-2.5 py-2 text-left font-normal">
                      <code className="font-mono text-sm font-semibold">{row.attr}</code>
                      <span className="block text-sm text-ink-2">{row.on}</span>
                    </th>
                    <td className="border border-rule px-2.5 py-2">{row.meaning}</td>
                    <td className="border border-rule px-2.5 py-2 font-mono text-sm font-bold">
                      {value ?? (
                        <>
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">brak</span>
                        </>
                      )}
                      {changed[index] ? (
                        <span className="block text-xs font-semibold">
                          <span aria-hidden="true">↺ </span>zmienione
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-2 text-ink-2">Ten wzorzec nie potrzebuje atrybutów ARIA. Wszystko daje element HTML.</p>
      )}
    </section>
  );
}

export type StepData = { do: string; keys: readonly string[]; hear: string };

const stepStatus = {
  done: { glyph: "✓", words: "zrobione" },
  now: { glyph: "→", words: "teraz" },
  todo: { glyph: "○", words: "do zrobienia" },
} as const;

/**
 * The exercise (mock 1C): the keyboard steps as a checklist, each with what the reader should
 * hear. The page ticks a step when the log reports its text after one of its keys. Ticking is
 * silent; the count in the heading says how far the reader got.
 */
export function Exercise({ steps, done, onRestart }: { steps: readonly StepData[]; done: number; onRestart: () => void }) {
  if (steps.length === 0) return null;
  return (
    <section aria-labelledby="exercise-title" className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="exercise-title" className="text-lg font-bold">
          Sprawdź sam: {Math.min(done, steps.length)} z {steps.length}
        </h2>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-11 items-center rounded border border-control bg-surface px-3 font-semibold hover:border-ink"
        >
          Od nowa
        </button>
      </div>
      {done >= steps.length ? (
        <p className="mt-2 border-l-4 border-good py-1 pl-3 font-semibold">
          <span aria-hidden="true">✓ </span>Wszystkie kroki zrobione.
        </p>
      ) : null}
      <ol className="mt-3 border border-rule bg-surface">
        {steps.map((step, index) => {
          const status = index < done ? "done" : index === done ? "now" : "todo";
          return (
            <li
              key={index}
              className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 gap-y-2 border-t border-rule px-4 py-3 first:border-t-0 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)] ${status === "now" ? "outline-2 -outline-offset-2 outline-ink" : ""}`}
            >
              <span className={`font-mono font-bold ${status === "todo" ? "text-ink-2" : ""}`}>
                <span aria-hidden="true">{stepStatus[status].glyph}</span>
                <span className="sr-only">{stepStatus[status].words}</span>
              </span>
              <span>
                {step.keys.map((key, k) => (
                  <span key={key}>
                    {k > 0 ? " albo " : null}
                    <kbd className="rounded-[3px] border border-b-2 border-control bg-paper px-1.5 font-mono text-[0.8125rem] font-semibold whitespace-nowrap">
                      {key}
                    </kbd>
                  </span>
                ))}{" "}
                {step.do}
              </span>
              <span
                className={`col-start-2 border-l-3 bg-paper-2 px-2 py-1 font-mono text-sm sm:col-start-3 ${status === "todo" ? "border-dashed border-control" : "border-ink"}`}
              >
                <span className="sr-only">Usłyszysz: </span>
                {step.hear}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
