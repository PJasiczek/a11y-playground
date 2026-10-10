import type { Marker, View } from "./before-after-document";

/**
 * The demo bar above the KMW pages (src/content/before-after-document.ts), bundled into one
 * classic script by frameScriptPlugin and started with the page's view and, on the marked page,
 * its markers.
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

function isFixed(element: Element) {
  for (let el: Element | null = element; el; el = el.parentElement) {
    if (getComputedStyle(el).position === "fixed") return true;
  }
  return false;
}

/**
 * Puts a numbered link on every element a problem points at, in page order, linking to the
 * problem's page. Problems of the whole page sit on <body> and are listed in the bar instead.
 * Positions follow the page as it scrolls, resizes or changes.
 */
function drawMarkers(markers: readonly Marker[]) {
  const layer = document.createElement("div");
  layer.id = "demo-znaczniki";
  layer.lang = "pl";
  const placed = markers.flatMap(({ marker, number, title }) => {
    const target = [...document.querySelectorAll("[data-problem]")].find(
      (el) => el !== document.body && (el.getAttribute("data-problem") ?? "").split(/\s+/).includes(marker),
    );
    if (!target) return [];
    const link = document.createElement("a");
    link.href = `/praktyka/przed-i-po/${String(number)}`;
    link.textContent = String(number);
    link.setAttribute("aria-label", `Problem ${String(number)}: ${title}`);
    layer.append(link);
    return [{ link, target }];
  });
  document.body.append(layer);

  // Markers 48px apart at least, so two on the same corner sit side by side, both full size.
  const step = 52;
  const place = () => {
    const taken: { left: number; top: number; fixed: boolean }[] = [];
    for (const { link, target } of placed) {
      const box = target.getBoundingClientRect();
      const fixed = isFixed(target);
      const top = Math.max(0, box.top - 14 + (fixed ? 0 : scrollY));
      let left = Math.max(0, box.left - 14 + (fixed ? 0 : scrollX));
      while (taken.some((t) => t.fixed === fixed && Math.abs(t.top - top) < step && Math.abs(t.left - left) < step)) left += step;
      taken.push({ left, top, fixed });
      link.style.position = fixed ? "fixed" : "absolute";
      link.style.left = `${String(left)}px`;
      link.style.top = `${String(top)}px`;
      link.hidden = box.width === 0 && box.height === 0;
    }
  };
  place();
  addEventListener("resize", place);
  // The page opens and closes its window and slides by switching classes; the markers' own
  // style changes are left out, or placing them would trigger itself.
  new MutationObserver((records) => {
    if (records.some(({ target }) => !layer.contains(target))) place();
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style"] });
}

export function start({ view, markers }: { view: View; markers: readonly Marker[] }) {
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

  if (markers.length > 0) drawMarkers(markers);
  document.documentElement.dataset.demo = view;
}
