import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { QuizQuestion } from "~/content/paths";
import { countOf } from "~/lib/plural";
import { isRight, type OptionOutcome, optionOutcomes } from "~/lib/quiz";
import { type LessonKey, progressStore, useProgress } from "~/progress/store";

type Phase = "answering" | "checked" | "summary";

const feedback = {
  trafiona: { glyph: "✓", word: "Poprawna.", tone: "text-good", border: "border-2 border-good" },
  bledna: { glyph: "✗", word: "Niepoprawna.", tone: "text-bad", border: "border-2 border-dashed border-bad" },
  pominieta: { glyph: "!", word: "Pominięta, a poprawna.", tone: "text-good", border: "border-control" },
  "slusznie-pominieta": { glyph: "", word: "Niepoprawna.", tone: "text-ink-2", border: "border-control" },
} as const satisfies Record<OptionOutcome, { glyph: string; word: string; tone: string; border: string }>;

const noop = () => () => undefined;

/**
 * The quiz at the end of a lesson, one question at a time (variant 4C of the paths mocks).
 * "Sprawdź" shows an explanation under every option and turns into "Następne pytanie"; the
 * verdict goes to a polite live region while focus stays on the button. Focus moves only when
 * the question under it is replaced: to the next question's legend, then to the summary. The
 * attempt is stored when the summary appears. Without JavaScript the first question shows
 * without its button.
 */
export function Quiz({ lessonKey, questions }: { lessonKey: LessonKey; questions: readonly QuizQuestion[] }) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const lastAttempt = useProgress().progress.quizzes[lessonKey];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [picked, setPicked] = useState<Set<number>[]>(() => questions.map(() => new Set()));
  const [message, setMessage] = useState("");
  const focusTarget = useRef<HTMLElement | null>(null);
  const moved = useRef(false);

  // Runs after the new question or the summary is on screen, never on the first render.
  useEffect(() => {
    if (moved.current) focusTarget.current?.focus();
    moved.current = false;
  }, [step, phase]);

  const question = questions[step];
  const results = questions.map((q, i) => isRight(q.options, picked[i] ?? new Set()));
  const score = results.filter(Boolean).length;
  const total = questions.length;

  function toggle(index: number) {
    setPicked((all) =>
      all.map((set, i) => {
        if (i !== step) return set;
        if (!question?.multiple) return new Set([index]);
        const next = new Set(set);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      }),
    );
  }

  function onButton() {
    if (!question) return;
    if (phase === "answering") {
      if ((picked[step]?.size ?? 0) === 0) {
        setMessage(question.multiple ? "Zaznacz co najmniej jedną odpowiedź." : "Zaznacz odpowiedź.");
        return;
      }
      setPhase("checked");
      setMessage(
        `Pytanie ${String(step + 1)}: ${results[step] ? "dobrze." : "nie tym razem. Wyjaśnienia są przy odpowiedziach."}`,
      );
      return;
    }
    moved.current = true;
    if (step + 1 < total) {
      setStep(step + 1);
      setPhase("answering");
      setMessage("");
      return;
    }
    progressStore().saveAttempt(lessonKey, {
      answers: Object.fromEntries(questions.map((q, i) => [q.id, [...(picked[i] ?? [])].map(String)])),
      score,
      total,
    });
    setPhase("summary");
    setMessage(`Wynik: ${String(score)} z ${String(total)}.`);
  }

  function restart() {
    moved.current = true;
    setPicked(questions.map(() => new Set()));
    setStep(0);
    setPhase("answering");
    setMessage("");
  }

  return (
    <section aria-labelledby="quiz-title" className="mt-10 border-t-2 border-ink pt-4">
      <h2 id="quiz-title" className="text-xl font-bold tracking-tight">
        Sprawdź się
      </h2>
      <p className="mt-1 text-ink-2">
        {`${countOf(total, ["pytanie", "pytania", "pytań"])}, jedno po drugim. Wynik zapisuje się w tej przeglądarce.`}
        {lastAttempt && phase !== "summary" ? ` Ostatni wynik: ${String(lastAttempt.score)} z ${String(lastAttempt.total)}.` : ""}
      </p>

      {phase === "summary" ? (
        <div className="mt-4 border border-t-4 border-rule border-t-ink bg-surface px-5 py-4">
          <h3
            ref={(el) => {
              focusTarget.current = el;
            }}
            tabIndex={-1}
            className="font-mono text-3xl font-bold tracking-tight"
          >
            <span className="sr-only">Wynik: </span>
            {String(score)} z {String(total)}
          </h3>
          <ol className="mt-3 grid gap-1">
            {questions.map((q, i) => (
              <li key={q.id}>
                <span className={`font-mono text-sm font-semibold ${results[i] ? "text-good" : "text-bad"}`}>
                  <span aria-hidden="true">{results[i] ? "✓ " : "✗ "}</span>
                  {results[i] ? "dobrze" : "źle"}
                </span>{" "}
                {q.prompt}
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={restart}
            className="mt-4 inline-flex min-h-11 items-center rounded border border-control bg-paper px-4 font-semibold hover:border-ink"
          >
            Rozwiąż jeszcze raz
          </button>
        </div>
      ) : question ? (
        <>
          <ol aria-hidden="true" className="mt-4 flex gap-1.5">
            {questions.map((q, i) => (
              <li
                key={q.id}
                className={`h-1.5 flex-1 border ${i < step ? "border-ink bg-ink" : i === step ? "border-2 border-ink bg-surface" : "border-control bg-paper-2"}`}
              />
            ))}
          </ol>
          <fieldset key={question.id} className="mt-4">
            <legend
              ref={(el) => {
                focusTarget.current = el;
              }}
              tabIndex={-1}
              className="max-w-[66ch] text-[1.0625rem] font-bold"
            >
              <span className="block font-mono text-[0.8125rem] font-semibold text-ink-2">
                Pytanie {String(step + 1)} z {String(total)} · {question.multiple ? "kilka odpowiedzi" : "jedna odpowiedź"}
              </span>
              {question.prompt}
            </legend>
            {question.multiple ? <p className="mt-1 text-sm text-ink-2">Zaznacz wszystkie poprawne.</p> : null}
            {phase === "checked" ? (
              <p className={`mt-2 font-bold ${results[step] ? "text-good" : "text-bad"}`}>
                <span aria-hidden="true">{results[step] ? "✓ " : "✗ "}</span>
                {results[step] ? "Dobrze." : "Nie tym razem."}
              </p>
            ) : null}
            {question.code ? (
              // Focusable so a long line can be scrolled from the keyboard.
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              <pre tabIndex={0} aria-label={`Kod do pytania ${String(step + 1)}`} className="mt-3 overflow-x-auto border border-l-4 border-rule border-l-control bg-paper-2 px-4 py-3">
                <code className="font-mono text-sm">{question.code}</code>
              </pre>
            ) : null}
            <ul className="mt-3 grid gap-2">
              {question.options.map((option, i) => {
                const outcome = phase === "checked" ? optionOutcomes(question.options, picked[step] ?? new Set())[i] : undefined;
                const look = outcome ? feedback[outcome] : undefined;
                const inputId = `${question.id}-${String(i)}`;
                return (
                  <li key={option.label}>
                    <label
                      htmlFor={inputId}
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded border bg-surface px-3 py-2 ${look ? look.border : "border-control has-checked:border-2 has-checked:border-ink"}`}
                    >
                      <input
                        id={inputId}
                        type={question.multiple ? "checkbox" : "radio"}
                        name={question.id}
                        checked={picked[step]?.has(i) ?? false}
                        disabled={phase === "checked"}
                        onChange={() => {
                          toggle(i);
                        }}
                        className="size-5 shrink-0 accent-ink"
                      />
                      <span>
                        {option.criterion ? (
                          <>
                            <span className="font-mono font-semibold">{option.criterion}</span>
                            {option.label.slice(option.criterion.length)}
                          </>
                        ) : (
                          option.label
                        )}
                      </span>
                    </label>
                    {look ? (
                      <p className="mt-1 mb-1 ml-10 max-w-[62ch] text-[0.9375rem]">
                        <span className={`mr-1.5 font-mono text-[0.8125rem] font-bold ${look.tone}`}>
                          {look.glyph ? <span aria-hidden="true">{look.glyph} </span> : null}
                          {look.word}
                        </span>
                        {option.why}
                        {option.criterion ? (
                          <>
                            {" "}
                            <Link
                              to="/kryteria/$criterionId"
                              params={{ criterionId: option.criterion }}
                              className="text-accent underline underline-offset-3"
                            >
                              Kryterium {option.criterion}
                            </Link>
                          </>
                        ) : null}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </fieldset>
          {hydrated ? (
            <button
              type="button"
              onClick={onButton}
              className="mt-4 inline-flex min-h-11 items-center rounded border border-ink bg-ink px-5 font-semibold text-paper"
            >
              {phase === "answering" ? "Sprawdź" : step + 1 < total ? "Następne pytanie" : "Zobacz wynik"}
            </button>
          ) : null}
        </>
      ) : null}

      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </p>
    </section>
  );
}
