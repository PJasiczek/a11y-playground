import type { Watch } from "./announce";
import { startLog } from "./pattern-log";

/**
 * The script pattern-log.vite.ts bundles into every pattern frame, exposed as the global
 * `a11yPatternLog`. patternDocument calls `a11yPatternLog.start(rows)` with the rows its ARIA
 * table watches; every line goes to the page around the frame over postMessage.
 */
export function start(watch: readonly Watch[]) {
  startLog(window, (message) => {
    parent.postMessage(message, "*");
  }, watch);
}
