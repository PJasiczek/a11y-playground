import { type } from "arktype";
import { useSyncExternalStore } from "react";

/**
 * Reading progress and quiz attempts, kept in localStorage until accounts exist (phase 5).
 * The shape copies the `progress` and `quizAttempts` tables planned for Convex, minus the user,
 * so phase 5 can import a stored object as is. Client-side; the server always sees no progress.
 */

/** A lesson inside a path, as "programista/klawiatura-i-fokus". */
export type LessonKey = `${string}/${string}`;

const storageKey = "a11y-playground/postep";

const Attempt = type({
  /** Selected option indexes per question id. */
  answers: { "[string]": "string[]" },
  score: "number.integer >= 0",
  total: "number.integer > 0",
  completedAt: "string.date.iso",
});

const Progress = type({
  v: "1",
  lessons: { "[string]": { status: "'ukonczona'", updatedAt: "string.date.iso" } },
  quizzes: { "[string]": Attempt },
});

export type Progress = typeof Progress.infer;
export type QuizAttempt = typeof Attempt.infer;

/** What components read: the progress, and whether it will outlive this page. */
export type ProgressSnapshot = { progress: Progress; persisted: boolean };

const empty: Progress = { v: 1, lessons: {}, quizzes: {} };
const serverSnapshot: ProgressSnapshot = { progress: empty, persisted: true };

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/**
 * A store over one storage key. Anything unreadable in storage (another version, a hand edit)
 * counts as no progress. When storage is missing or throws, progress lives in memory and
 * `persisted` turns false, so the page can say so. Exported for tests; the app uses `useProgress`.
 */
export function createProgressStore(storage: StorageLike | null) {
  const listeners = new Set<() => void>();
  let snapshot: ProgressSnapshot | null = null;
  let persisted = storage !== null;

  function read(): Progress {
    try {
      const raw = storage?.getItem(storageKey);
      if (raw == null) return empty;
      const parsed = Progress(JSON.parse(raw));
      return parsed instanceof type.errors ? empty : parsed;
    } catch {
      persisted = false;
      return empty;
    }
  }

  function get(): ProgressSnapshot {
    snapshot ??= { progress: read(), persisted };
    return snapshot;
  }

  function write(progress: Progress) {
    try {
      if (!storage) throw new Error("no storage");
      storage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      persisted = false;
    }
    snapshot = { progress, persisted };
    for (const listener of listeners) listener();
  }

  return {
    get,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    /** Drops the cached value, for when another tab wrote the key. */
    reload() {
      snapshot = null;
      for (const listener of listeners) listener();
    },
    setLessonDone(key: LessonKey, done: boolean) {
      const { progress } = get();
      const lessons = Object.fromEntries(Object.entries(progress.lessons).filter(([k]) => k !== key));
      if (done) lessons[key] = { status: "ukonczona", updatedAt: new Date().toISOString() };
      write({ ...progress, lessons });
    },
    saveAttempt(key: LessonKey, attempt: Omit<QuizAttempt, "completedAt">) {
      const { progress } = get();
      write({ ...progress, quizzes: { ...progress.quizzes, [key]: { ...attempt, completedAt: new Date().toISOString() } } });
    },
    clear() {
      try {
        storage?.removeItem(storageKey);
      } catch {
        // Nothing to do: the in-memory value is cleared below either way.
      }
      write(empty);
    },
  };
}

type ProgressStore = ReturnType<typeof createProgressStore>;

let browserStore: ProgressStore | null = null;

/** The one store for this tab, created on first use in the browser. */
export function progressStore(): ProgressStore {
  if (browserStore) return browserStore;
  let storage: Storage | null = null;
  try {
    storage = window.localStorage;
  } catch {
    // Some browsers throw on access when storage is disabled.
  }
  const store = createProgressStore(storage);
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) store.reload();
  });
  browserStore = store;
  return store;
}

/**
 * Progress for rendering. The server and the first client render see no progress, so
 * prerendered pages never claim any and hydration matches; stored progress arrives right after.
 */
export function useProgress(): ProgressSnapshot {
  return useSyncExternalStore(
    (listener) => progressStore().subscribe(listener),
    () => progressStore().get(),
    () => serverSnapshot,
  );
}
