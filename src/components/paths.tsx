import { type LessonKey, progressStore, type ProgressSnapshot } from "~/progress/store";

// Pieces shared by the three /sciezki pages.

/** The lessons of a path, as far as progress is concerned. */
type PathLessons = { path: string; lessons: readonly { slug: string; title: string }[] };

/**
 * How far the reader got in one path: how many lessons are done and the first one that is not,
 * which is where "Dalej" leads. Lesson order is the path's, not the order they were done in.
 */
export function pathProgress({ progress }: ProgressSnapshot, { path, lessons }: PathLessons) {
  const isDone = (slug: string) => progress.lessons[`${path}/${slug}` satisfies LessonKey] !== undefined;
  const done = lessons.filter((lesson) => isDone(lesson.slug)).length;
  const nextIndex = lessons.findIndex((lesson) => !isDone(lesson.slug));
  const next = lessons[nextIndex];
  return { done, isDone, next: next ? { ...next, number: nextIndex + 1 } : null };
}

/** Lesson numbers as codes: 01, 02… */
export function lessonNumber(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Where progress is kept, said plainly, with a way to clear it. When the browser refuses to
 * store it, the note says it lasts only until the tab closes.
 */
export function ProgressNote({ snapshot }: { snapshot: ProgressSnapshot }) {
  const { progress, persisted } = snapshot;
  const hasProgress = Object.keys(progress.lessons).length > 0 || Object.keys(progress.quizzes).length > 0;

  function clear() {
    if (window.confirm("Wyczyścić postęp we wszystkich ścieżkach?")) progressStore().clear();
  }

  return (
    <p className="mt-6 flex flex-wrap items-center gap-x-3 text-sm text-ink-2">
      {persisted
        ? "Postęp zapisuje się tylko w tej przeglądarce."
        : "Ta przeglądarka nie pozwala zapisać postępu. Zniknie po zamknięciu karty."}
      {hasProgress ? (
        <button
          type="button"
          onClick={clear}
          className="inline-flex min-h-11 items-center text-accent underline underline-offset-3"
        >
          Wyczyść postęp
        </button>
      ) : null}
    </p>
  );
}
