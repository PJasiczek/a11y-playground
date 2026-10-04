import type { SimulationId } from "./simulations";
import { clearStructure, markStructure, scanStructure, type StructureView, summarize } from "./structure";

/** Which outlines each structure simulation draws. */
const views = {
  "punkty-orientacyjne": { landmarks: true, headings: false },
  naglowki: { landmarks: false, headings: true },
} as const satisfies Partial<Record<SimulationId, StructureView>>;

/**
 * The script frame-script.vite.ts bundles into every example frame, exposed as the global
 * `a11yStructure`. The frame script calls `a11yStructure.show(simulation)` on every simulation
 * change: a structure simulation outlines the fragment and posts the scan to the page as text,
 * any other takes the outlines off.
 */
export function show(simulation: string | null) {
  clearStructure(document);
  const view = Object.entries(views).find(([id]) => id === simulation)?.[1];
  if (!view) return;
  const structure = scanStructure(document.querySelector("[data-example-root]") ?? document.body);
  markStructure(structure, view, document);
  parent.postMessage({ a11yStructure: summarize(structure, view) }, "*");
}
