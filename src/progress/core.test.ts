import { describe, expect, test } from "vitest";
import { createProgressStore, reviewOf } from "./core";

/** An in-memory stand-in for localStorage. */
function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

const key = "a11y-playground/postep";

describe("progress store", () => {
  test("round-trips lessons and quiz attempts through storage", () => {
    const storage = memoryStorage();
    const store = createProgressStore(storage);
    store.setLessonDone("programista/a", true);
    store.saveAttempt("programista/a", { answers: { q: ["0"] }, score: 1, total: 3 });

    const reread = createProgressStore(storage).get();
    expect(reread.persisted).toBe(true);
    expect(reread.progress.lessons["programista/a"]?.status).toBe("ukonczona");
    expect(reread.progress.quizzes["programista/a"]).toMatchObject({ score: 1, total: 3, answers: { q: ["0"] } });
  });

  test("unmarks a lesson and clears everything", () => {
    const store = createProgressStore(memoryStorage());
    store.setLessonDone("programista/a", true);
    store.setLessonDone("programista/a", false);
    expect(store.get().progress.lessons).toEqual({});
    store.setLessonDone("programista/b", true);
    store.clear();
    expect(store.get().progress).toEqual({ v: 1, lessons: {}, quizzes: {} });
  });

  test.each([
    ["not JSON", "{"],
    ["another version", JSON.stringify({ v: 2, lessons: {}, quizzes: {} })],
    ["a bad lesson state", JSON.stringify({ v: 1, lessons: { "a/b": { status: "x", updatedAt: "2026-01-01" } }, quizzes: {} })],
  ])("reads %s as no progress without throwing", (_, raw) => {
    const store = createProgressStore(memoryStorage({ [key]: raw }));
    expect(store.get().progress).toEqual({ v: 1, lessons: {}, quizzes: {} });
  });

  test("keeps progress in memory when storage throws, and says it is not persisted", () => {
    const store = createProgressStore({
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => undefined,
    });
    store.setLessonDone("programista/a", true);
    expect(store.get().persisted).toBe(false);
    expect(store.get().progress.lessons["programista/a"]?.status).toBe("ukonczona");
  });

  test("notifies subscribers and hands out a new snapshot on change", () => {
    const store = createProgressStore(memoryStorage());
    const before = store.get();
    let calls = 0;
    store.subscribe(() => calls++);
    store.setLessonDone("programista/a", true);
    expect(calls).toBe(1);
    expect(store.get()).not.toBe(before);
  });
});

describe("self-check reviews", () => {
  const notesOf = (store: ReturnType<typeof createProgressStore>) => reviewOf(store.get().progress, "przed-i-po").notes;

  test("adds, edits and removes notes in order, and skips blank ones", () => {
    const storage = memoryStorage();
    const store = createProgressStore(storage);
    const first = store.addNote("przed-i-po", "  Tab nie otwiera podmenu ");
    store.addNote("przed-i-po", "Nie widać fokusu");
    expect(store.addNote("przed-i-po", "   ")).toBeNull();
    expect(notesOf(store).map((note) => note.text)).toEqual(["Tab nie otwiera podmenu", "Nie widać fokusu"]);

    store.editNote("przed-i-po", first?.id ?? "", "Podmenu tylko pod myszą");
    expect(notesOf(createProgressStore(storage)).map((note) => note.text)).toEqual(["Podmenu tylko pod myszą", "Nie widać fokusu"]);

    store.editNote("przed-i-po", first?.id ?? "", " ");
    expect(notesOf(store)).toHaveLength(1);
    store.removeNote("przed-i-po", notesOf(store)[0]?.id ?? "");
    expect(notesOf(store)).toEqual([]);
  });

  test("reveals once, keeps the notes, and starts over without either", () => {
    const store = createProgressStore(memoryStorage());
    store.addNote("przed-i-po", "Kropki tylko kolorem");
    store.reveal("przed-i-po");
    const revealedAt = reviewOf(store.get().progress, "przed-i-po").revealedAt;
    expect(revealedAt).toBeDefined();
    store.reveal("przed-i-po");
    expect(reviewOf(store.get().progress, "przed-i-po")).toMatchObject({ revealedAt, notes: [{ text: "Kropki tylko kolorem" }] });

    store.restart("przed-i-po");
    expect(reviewOf(store.get().progress, "przed-i-po")).toEqual({ notes: [] });
  });

  test("reads progress stored before reviews existed", () => {
    const stored = JSON.stringify({ v: 1, lessons: { "a/b": { status: "ukonczona", updatedAt: "2026-01-01T10:00:00.000Z" } }, quizzes: {} });
    const store = createProgressStore(memoryStorage({ [key]: stored }));
    expect(store.get().progress.lessons["a/b"]?.status).toBe("ukonczona");
    expect(reviewOf(store.get().progress, "przed-i-po")).toEqual({ notes: [] });
  });
});
