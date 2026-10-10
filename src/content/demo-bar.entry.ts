import type { View } from "./before-after-document";

/**
 * The demo bar above the KMW pages (src/content/before-after-document.ts), bundled into one
 * classic script by frameScriptPlugin and started with the page's view.
 */

/** Says something in the bar's status region, again even when the text repeats. */
function say(text: string) {
  const status = document.getElementById("demo-komunikat");
  if (!status) return;
  status.textContent = "";
  requestAnimationFrame(() => {
    status.textContent = text;
  });
}

export function start({ view }: { view: View }) {
  // The broken page moves only after the reader asks (2.3.3); its own script listens for this.
  const motion = document.getElementById("demo-ruch");
  motion?.addEventListener("click", () => {
    const on = motion.getAttribute("aria-pressed") !== "true";
    motion.setAttribute("aria-pressed", String(on));
    motion.textContent = on ? "Ruch włączony" : "Włącz ruch";
    document.dispatchEvent(new CustomEvent("kmw-ruch", { detail: { on } }));
  });

  // KMW has no subpages: its links say so instead of jumping to the top. Links the page handles
  // itself (the carousel arrows) prevent the default first, so they are left alone.
  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href="#"]') : null;
    if (!link || event.defaultPrevented) return;
    event.preventDefault();
    say(`„${link.textContent.trim() || "To łącze"}” prowadzi do podstrony, której w tej demonstracji nie ma.`);
  });

  document.documentElement.dataset.demo = view;
}
