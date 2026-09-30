import { existsSync, readdirSync, readFileSync } from "node:fs";
import type { Plugin } from "vite";
import { readingOrder, type VariantReading } from "./reading-order.ts";

const id = "virtual:reading-order";

/**
 * Computes what a screen reader reads in every example variant while Vite builds, in Node, and
 * serves the result as `virtual:reading-order`. jsdom never enters the server bundle, which it
 * cannot run from: it reads its own files next to its code.
 */
export function readingOrderPlugin(): Plugin {
  return {
    name: "a11y-reading-order",
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    load(resolved) {
      if (resolved !== `\0${id}`) return;
      const orders: Record<string, Partial<Record<"bad" | "good", VariantReading>>> = {};
      for (const slug of readdirSync("content/praktyka")) {
        for (const variant of ["bad", "good"] as const) {
          const file = `content/praktyka/${slug}/${variant}.html`;
          // A missing file is reported by the example parser, with a better message.
          if (!existsSync(file)) continue;
          this.addWatchFile(file);
          const { reading, tab } = readingOrder(readFileSync(file, "utf8").trim());
          orders[slug] = { ...orders[slug], [variant]: { reading, tab } };
        }
      }
      return `export default ${JSON.stringify(orders)};`;
    },
  };
}
