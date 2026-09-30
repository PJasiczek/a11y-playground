import type { Example } from "./examples";

export const variants = ["bad", "good"] as const;
export type VariantName = (typeof variants)[number];

export const variantLabels = { bad: "zepsuty", good: "poprawny" } as const satisfies Record<VariantName, string>;

// Neutral styles every demo starts from: system fonts, the app's paper and ink, visible focus.
// Fragments add their own <style> on top. The text size is 1rem, not 16px, so "tekst-200" can
// scale it from the root. The rest applies the simulation the page picked, see simulationScript.
const baseStyles = `
  *, *::before, *::after { box-sizing: border-box; }
  html { color-scheme: light; }
  body { margin: 0; padding: 1rem; background: #f1efe8; color: #14171a; font: 1rem/1.5 "Segoe UI", system-ui, sans-serif; }
  :focus-visible { outline: 3px solid #2c36a8; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
  html[data-symulacja="deuteranopia"] { filter: url(#a11y-deuteranopia); }
  html[data-symulacja="protanopia"] { filter: url(#a11y-protanopia); }
  html[data-symulacja="tritanopia"] { filter: url(#a11y-tritanopia); }
  html[data-symulacja="achromatopsja"] { filter: grayscale(1); }
  html[data-symulacja="slabe-widzenie"] { filter: blur(1.5px) contrast(0.6); }
  html[data-symulacja="tekst-200"] { font-size: 200%; }
  .a11y-sim-badge { position: absolute; z-index: 2147483647; min-width: 1.5rem; height: 1.5rem; padding: 0 0.3rem; border-radius: 0.75rem; background: #2c36a8; color: #fff; font: 700 0.8125rem/1.5rem ui-monospace, Consolas, monospace; text-align: center; box-shadow: 0 0 0 2px #fff; pointer-events: none; }
  .a11y-sim-notice { position: fixed; z-index: 2147483647; left: 0.5rem; right: 0.5rem; bottom: 0.5rem; margin: 0; padding: 0.5rem 0.75rem; border: 2px solid #14171a; background: #f4e75b; color: #14171a; font-weight: 600; }
`;

// Colour vision matrices from Machado, Oliveira and Fernandes (2009) at full severity. They sit
// in the demo itself, so nothing depends on how a browser filters an iframe from outside.
const colourFilters = `<svg aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute">
<filter id="a11y-deuteranopia" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="0.367 0.861 -0.228 0 0 0.280 0.673 0.047 0 0 -0.012 0.043 0.969 0 0 0 0 0 1 0"/></filter>
<filter id="a11y-protanopia" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="0.152 1.053 -0.205 0 0 0.115 0.786 0.099 0 0 -0.004 -0.048 1.052 0 0 0 0 0 1 0"/></filter>
<filter id="a11y-tritanopia" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="1.256 -0.077 -0.179 0 0 -0.078 0.931 0.148 0 0 0.005 0.691 0.304 0 0 0 0 0 1 0"/></filter>
</svg>`;

// Reports the content size to the page, which resizes the iframe so zoom and reflow never cut
// the demo off, and compares the width with the viewport for the 320-pixel verdict. The page
// matches messages to its iframe by event.source, and can ask for a fresh report when it
// hydrates after the frame has already loaded.
//
// { a11ySimulation } from the page sets data-symulacja on <html>, which switches the filters
// above. In "klawiatura" the frame blocks pointer clicks (a click with detail 0 comes from Enter
// or Space, so it passes), and numbers every element that takes focus, telling the page each step.
const frameScript = `
  const root = document.documentElement;
  const report = () => {
    // A horizontal scrollbar takes height from the viewport, so it is added back.
    const bar = root.scrollWidth > root.clientWidth ? innerHeight - root.clientHeight : 0;
    parent.postMessage({ a11yExampleHeight: root.scrollHeight + bar, a11yExampleWidth: root.scrollWidth, a11yExampleViewport: root.clientWidth }, "*");
  };
  new ResizeObserver(report).observe(document.body);

  let simulation = null;
  let steps = 0;
  const notice = document.createElement("p");
  notice.className = "a11y-sim-notice";
  notice.setAttribute("aria-hidden", "true");
  notice.textContent = "Kliknięcie zablokowane. W tym trybie działa tylko klawiatura.";
  const simulate = (next) => {
    if (next === simulation) return;
    simulation = next;
    if (next) root.dataset.symulacja = next;
    else delete root.dataset.symulacja;
    steps = 0;
    for (const badge of document.querySelectorAll(".a11y-sim-badge")) badge.remove();
    notice.remove();
    report();
  };

  addEventListener("message", (event) => {
    const { data } = event;
    if (data === "a11y-example-measure") report();
    else if (typeof data === "object" && data !== null && "a11ySimulation" in data) {
      simulate(typeof data.a11ySimulation === "string" ? data.a11ySimulation : null);
    }
  });

  const keyboardOnly = () => simulation === "klawiatura";
  const block = (event) => {
    if (!keyboardOnly()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  for (const type of ["pointerdown", "pointerup", "mousedown", "mouseup", "dblclick"]) addEventListener(type, block, true);
  addEventListener("click", (event) => {
    if (!keyboardOnly() || event.detail === 0) return;
    block(event);
    document.body.append(notice);
    parent.postMessage({ a11yBlockedClick: true }, "*");
  }, true);

  const roles = { A: "łącze", BUTTON: "przycisk", INPUT: "pole", SELECT: "lista", TEXTAREA: "pole", SUMMARY: "rozwijanie" };
  // A short approximation of the accessible name, enough to tell the steps apart.
  const nameOf = (el) => {
    const ids = el.getAttribute("aria-labelledby");
    const byIds = ids ? ids.split(/\\s+/).map((id) => document.getElementById(id)?.textContent ?? "").join(" ") : "";
    const text = el.getAttribute("aria-label") || byIds || el.labels?.[0]?.textContent || el.textContent || el.getAttribute("placeholder") || "";
    return text.replace(/\\s+/g, " ").trim() || "bez nazwy";
  };
  addEventListener("focusin", (event) => {
    const el = event.target;
    if (!keyboardOnly() || !(el instanceof Element)) return;
    steps += 1;
    const box = el.getBoundingClientRect();
    const badge = document.createElement("span");
    badge.className = "a11y-sim-badge";
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = String(steps);
    badge.style.left = Math.max(0, box.left + scrollX - 10) + "px";
    badge.style.top = Math.max(0, box.top + scrollY - 10) + "px";
    document.body.append(badge);
    parent.postMessage({ a11yFocusStep: { n: steps, name: nameOf(el), role: el.getAttribute("role") || roles[el.tagName] || "element" } }, "*");
  });

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
${colourFilters}
<script>${frameScript}</script>
</body>
</html>`;
}
