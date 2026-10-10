import { useSyncExternalStore } from "react";
import { type ProgressSnapshot, progressStore, serverSnapshot } from "./core";

export { progressStore, type LessonKey, type Progress, type ProgressSnapshot, type QuizAttempt } from "./core";

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
