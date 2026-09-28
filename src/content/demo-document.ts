import type { Example } from "./examples";

export const variants = ["bad", "good"] as const;
export type VariantName = (typeof variants)[number];

export const variantLabels = { bad: "zepsuty", good: "poprawny" } as const satisfies Record<VariantName, string>;

// Neutral styles every demo starts from: system fonts, the app's paper and ink, visible focus.
// Fragments add their own <style> on top.
const baseStyles = `
  *, *::before, *::after { box-sizing: border-box; }
  html { color-scheme: light; }
  body { margin: 0; padding: 1rem; background: #f1efe8; color: #14171a; font: 16px/1.5 "Segoe UI", system-ui, sans-serif; }
  :focus-visible { outline: 3px solid #2c36a8; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
`;

// Reports the content height to the page, which resizes the iframe so zoom and reflow never
// cut the demo off. The page matches the message to its iframe by event.source, and can ask for
// a fresh report when it hydrates after the frame has already loaded.
const resizeScript = `
  const report = () => parent.postMessage({ a11yExampleHeight: document.documentElement.scrollHeight }, "*");
  new ResizeObserver(report).observe(document.body);
  addEventListener("message", (event) => { if (event.data === "a11y-example-measure") report(); });
  report();
`;

/**
 * The full HTML document one variant of an example renders in. Served by /demo/$slug/$variant
 * and loaded in a sandboxed iframe, so nothing in it reaches the page around it. The
 * data-example-root marker lets the isolation test prove that.
 */
export function demoDocument(example: Example, variant: VariantName) {
  const title = `Przykład ${variantLabels[variant]}: ${example.title}`;
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${baseStyles}</style>
</head>
<body>
<div data-example-root="${variant}">
${example[variant].source}
</div>
<script>${resizeScript}</script>
</body>
</html>`;
}
