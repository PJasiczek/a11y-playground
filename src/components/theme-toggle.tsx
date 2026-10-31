import { useState, useSyncExternalStore } from "react";
import { SwitchTrack } from "./switch-track";

type Theme = "light" | "dark";

const storageKey = "theme";
const darkQuery = "(prefers-color-scheme: dark)";

/**
 * Inline script for <head>. Applies the stored theme before first paint, so a
 * reader who picked dark mode never sees a light flash.
 */
export const themeInitScript = `try{const t=localStorage.getItem("${storageKey}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch{}`;

function subscribe(onChange: () => void) {
  const media = window.matchMedia(darkQuery);
  const observer = new MutationObserver(onChange);
  media.addEventListener("change", onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

// The explicit choice wins; without one we follow the operating system.
function getTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

/** Toggle button in the header. Pressed means dark mode is on. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");
  const isDark = theme === "dark";
  const [moved, setMoved] = useState(false);

  function toggle() {
    setMoved(true);
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Storage can be blocked; the choice then lasts until reload.
    }
  }

  return (
    <button
      type="button"
      aria-pressed={isDark}
      onClick={toggle}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-control bg-surface pr-3 pl-3.5 text-[0.9375rem] font-bold text-ink hover:border-ink"
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5 shrink-0 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]">
        <path d="M16 12.2A6.5 6.5 0 0 1 7.8 4a6.5 6.5 0 1 0 8.2 8.2z" />
      </svg>
      Tryb ciemny
      <SwitchTrack on={isDark} moved={moved} />
    </button>
  );
}
