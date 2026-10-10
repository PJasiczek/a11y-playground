// Modules that Vite plugins generate at build time.

declare module "virtual:reading-order" {
  import type { VariantReading } from "~/content/reading-order";

  /** What a screen reader reads in each example variant, by slug. See reading-order.vite.ts. */
  const orders: Record<string, Partial<Record<"bad" | "good", VariantReading>> | undefined>;
  export default orders;
}

declare module "virtual:pattern-log" {
  /** The live log of pattern frames as one classic script. See frame-script.vite.ts. */
  const script: string;
  export default script;
}

declare module "virtual:demo-bar" {
  /** The demo bar of the KMW pages as one classic script. See frame-script.vite.ts. */
  const script: string;
  export default script;
}

declare module "virtual:structure" {
  /** The landmarks and headings simulations of example frames as one classic script. See frame-script.vite.ts. */
  const script: string;
  export default script;
}
