import { type } from "arktype";

/**
 * Reading progress, quiz attempts and self-check notes, kept in localStorage until accounts exist (phase 5).
 * The shape copies the `progress` and `quizAttempts` tables planned for Convex, minus the user,
 * so phase 5 can import a stored object as is. Client-side; the server always sees no progress.
 * Free of React, so scripts outside the app can share it; components use `useProgress` from store.ts.
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

const Note = type({ id: "string > 0", text: "string > 0", createdAt: "string.date.iso" });

/** A self-check of a page: the reader's notes, and when they ended the check and saw the answers. */
const Review = type({ notes: Note.array(), "revealedAt?": "string.date.iso" });

const Progress = type({
  v: "1",
  lessons: { "[string]": { status: "'ukonczona'", updatedAt: "string.date.iso" } },
  quizzes: { "[string]": Attempt },
  // Optional, so objects stored before reviews existed still read as valid.
  "reviews?": { "[string]": Review },
});

export type Progress = typeof Progress.infer;
export type QuizAttempt = typeof Attempt.infer;
export type Note = typeof Note.infer;
export type Review = typeof Review.infer;

const noReview: Review = { notes: [] };

/** The review stored under `key`, or an empty one. */
export function reviewOf(progress: Progress, key: string): Review {
  return progress.reviews?.[key] ?? noReview;
}

/** What components read: the progress, and whether it will outlive this page. */
export type ProgressSnapshot = { progress: Progress; persisted: boolean };

const empty: Progress = { v: 1, lessons: {}, quizzes: {} };
export const serverSnapshot: ProgressSnapshot = { progress: empty, persisted: true };

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

  /** Writes the review under `key` as `change` returns it; null removes it. */
  function updateReview(key: string, change: (review: Review) => Review | null) {
    const { progress } = get();
    const reviews = Object.fromEntries(Object.entries(progress.reviews ?? {}).filter(([k]) => k !== key));
    const next = change(reviewOf(progress, key));
    if (next) reviews[key] = next;
    write({ ...progress, reviews });
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
    /** Adds a note at the end and returns it. Blank text adds nothing and returns null. */
    addNote(key: string, text: string): Note | null {
      const trimmed = text.trim();
      if (!trimmed) return null;
      const note = { id: crypto.randomUUID(), text: trimmed, createdAt: new Date().toISOString() };
      updateReview(key, (review) => ({ ...review, notes: [...review.notes, note] }));
      return note;
    },
    /** Replaces a note's text; blank text removes the note. */
    editNote(key: string, id: string, text: string) {
      const trimmed = text.trim();
      updateReview(key, (review) => ({
        ...review,
        notes: trimmed
          ? review.notes.map((note) => (note.id === id ? { ...note, text: trimmed } : note))
          : review.notes.filter((note) => note.id !== id),
      }));
    },
    removeNote(key: string, id: string) {
      updateReview(key, (review) => ({ ...review, notes: review.notes.filter((note) => note.id !== id) }));
    },
    /** Ends the check: the answers show from now on. The notes stay. */
    reveal(key: string) {
      updateReview(key, (review) => (review.revealedAt ? review : { ...review, revealedAt: new Date().toISOString() }));
    },
    /** Deletes the notes and hides the answers again. */
    restart(key: string) {
      updateReview(key, () => null);
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
