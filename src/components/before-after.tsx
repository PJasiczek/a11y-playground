import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { reviewKey } from "~/content/before-after-labels";
import { countOf } from "~/lib/plural";
import { progressStore, reviewOf, useProgress } from "~/progress/store";

// Pieces of the whole-page demo on /praktyka/przed-i-po (phase 11).

const noteForms = ["notatka", "notatki", "notatek"] as const;

export const primaryButton =
  "inline-flex min-h-11 items-center rounded-xs border border-ink bg-ink px-4 font-semibold text-paper";
export const secondaryButton =
  "inline-flex min-h-11 items-center rounded-xs border border-control bg-surface px-4 font-semibold text-ink hover:border-ink";

/**
 * The reader's self-check of the KMW page: their notes, whether they ended the check, and whether
 * storage keeps it. The server and the first render see a check that has not ended.
 */
export function useReview() {
  const { progress, persisted } = useProgress();
  return { ...reviewOf(progress, reviewKey), persisted };
}

/** Moves focus to the page's h1 once React has rendered the next stage. */
export function focusTitle() {
  requestAnimationFrame(() => {
    document.getElementById("tytul")?.focus();
  });
}

/**
 * Shown instead of answers while the reader is still checking (the gate under mock section 3).
 * The URL is public, so this is a reminder, not a lock: "mimo to" ends the check.
 */
export function CheckGate({ subject, revealLabel }: { subject: string; revealLabel: string }) {
  const { notes } = useReview();
  return (
    <>
      <h1 id="tytul" tabIndex={-1} className="pt-8 pb-2 text-[1.875rem] font-bold tracking-tight outline-none">
        Najpierw sprawdź stronę sam
      </h1>
      <p className="max-w-[60ch] text-ink-2">
        {subject} zdradza odpowiedzi.{" "}
        {notes.length > 0 ? `Masz ${countOf(notes.length, noteForms)}.` : "Nie masz jeszcze notatek."} Wróć do
        sprawdzania albo zakończ je teraz.
      </p>
      <p className="mt-5 flex flex-wrap gap-3">
        <a href="/demo/przed-i-po/przed" className={primaryButton}>
          Wróć do sprawdzania
        </a>
        <button
          type="button"
          className={secondaryButton}
          onClick={() => {
            progressStore().reveal(reviewKey);
            focusTitle();
          }}
        >
          {revealLabel}
        </button>
      </p>
    </>
  );
}

/**
 * The reader's notes above the list of problems (mock 3A): unchanged, foldable, with a button that
 * copies them as plain text for a trainer collecting results.
 */
export function NotesBox() {
  const { notes } = useReview();
  const [copied, setCopied] = useState("");
  const copy = () => {
    const text = notes.map((note, index) => `${String(index + 1)}. ${note.text}`).join("\n");
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(`Skopiowano: ${countOf(notes.length, noteForms)}.`);
      },
      () => {
        setCopied("Nie udało się skopiować. Zaznacz notatki i skopiuj je ręcznie.");
      },
    );
  };
  return (
    <details open className="disclosure mt-6 rounded border-2 border-ink bg-surface">
      <summary className="flex min-h-11 cursor-pointer items-center px-4 font-bold">
        Twoje notatki ({notes.length})
      </summary>
      <div className="px-4 pb-4">
        {notes.length > 0 ? (
          <>
            <ol className="list-decimal space-y-1 pl-6">
              {notes.map((note) => (
                <li key={note.id}>{note.text}</li>
              ))}
            </ol>
            <p className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" className={secondaryButton} onClick={copy}>
                Kopiuj notatki
              </button>
              <span role="status" className="text-[0.9375rem] text-ink-2">
                {copied}
              </span>
            </p>
          </>
        ) : (
          <p className="text-ink-2">Brak notatek. Porównaj listę z tym, co zauważyłeś na stronie.</p>
        )}
      </div>
    </details>
  );
}

/**
 * Links from a criterion, example or pattern page to the problems of the whole-page demo that
 * show the same thing. Renders nothing when there are none.
 */
export function ProblemLinks({ problems }: { problems: { number: number; title: string }[] }) {
  if (problems.length === 0) return null;
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 text-[0.9375rem]">
      <span className="text-ink-2">Na stronie przed i po:</span>
      {problems.map(({ number, title }) => (
        <Link
          key={number}
          to="/praktyka/przed-i-po/$problem"
          params={{ problem: String(number) }}
          className="inline-flex min-h-11 items-center text-accent underline underline-offset-3"
        >
          problem {number}, {title}
        </Link>
      ))}
    </p>
  );
}
