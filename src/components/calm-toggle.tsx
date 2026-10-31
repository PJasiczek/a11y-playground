import { useState, useSyncExternalStore } from "react";
import { SwitchTrack } from "./switch-track";

const storageKey = "spokoj";
const reduceQuery = "(prefers-reduced-motion: reduce)";

/**
 * Inline script for <head>, next to the theme's. Applies a stored "Spokój" choice before first
 * paint, so a reader who turned motion off never sees a card move.
 */
export const calmInitScript = `try{const c=localStorage.getItem("${storageKey}");if(c==="on"||c==="off")document.documentElement.dataset.calm=c}catch{}`;

function subscribe(onChange: () => void) {
  const media = window.matchMedia(reduceQuery);
  const observer = new MutationObserver(onChange);
  media.addEventListener("change", onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-calm"] });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

// The explicit choice wins; without one, calm follows the system's reduced motion setting.
function getCalm() {
  const chosen = document.documentElement.dataset.calm;
  if (chosen === "on" || chosen === "off") return chosen === "on";
  return window.matchMedia(reduceQuery).matches;
}

/**
 * "Spokój": turns off every animation and transition and flattens the kind colours (2.3.3).
 * Pressed means calm is on. The CSS behind it is in src/styles.css.
 */
export function CalmToggle() {
  const calm = useSyncExternalStore(subscribe, getCalm, () => false);
  const [moved, setMoved] = useState(false);

  function toggle() {
    setMoved(true);
    const next = calm ? "off" : "on";
    document.documentElement.dataset.calm = next;
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Storage can be blocked; the choice then lasts until reload.
    }
  }

  return (
    <button
      type="button"
      aria-pressed={calm}
      onClick={toggle}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-control bg-surface pr-3 pl-3.5 text-[0.9375rem] font-bold text-ink hover:border-ink"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5 shrink-0 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]">
        <path d="M5.5 16h9a3.5 3.5 0 0 0 .6-6.95A5.2 5.2 0 0 0 5 7.4 4.3 4.3 0 0 0 5.5 16zM6.2 9.2A3.3 3.3 0 0 1 10 5.8" />
      </svg>
      Spokój
      <SwitchTrack on={calm} moved={moved} />
    </button>
  );
}
