import { describe, expect, test } from "vitest";
import { createProgressStore } from "./store";

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
