import { useSyncExternalStore } from "react";

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

  function toggle() {
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
      className="inline-flex min-h-11 items-center gap-2 rounded border border-control bg-surface px-3 text-[0.9375rem] font-semibold text-ink hover:border-ink"
    >
      <span aria-hidden="true" className="font-mono">
        {isDark ? "●" : "○"}
      </span>
      Tryb ciemny
    </button>
  );
}
