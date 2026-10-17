import { Link, useRouterState } from "@tanstack/react-router";
import { useRef } from "react";
import { ThemeToggle } from "./theme-toggle";

/**
 * The main navigation, shared by both layouts. `phone` says where an item goes below 640px:
 * one of the tabs in the bottom bar, the "Więcej" sheet, or nowhere because the wordmark leads there.
 */
const navItems = [
  { to: "/", label: "Start", phone: "wordmark" },
  { to: "/kryteria", label: "Kryteria", phone: "tab", icon: <path d="M4 5h12M4 10h12M4 15h8" /> },
  { to: "/wcag-3", label: "WCAG 3.0", phone: "more" },
  { to: "/prawo", label: "Prawo", phone: "more" },
  {
    to: "/praktyka",
    label: "Praktyka",
    phone: "tab",
    icon: (
      <>
        <rect x="3" y="4" width="14" height="12" rx="2" />
        <path d="M7 8l-2 2 2 2M13 8l2 2-2 2" />
      </>
    ),
  },
  { to: "/symulatory", label: "Symulatory", phone: "more" },
  {
    to: "/sciezki",
    label: "Ścieżki",
    phone: "tab",
    icon: (
      <>
        <path d="M4 16c3-8 9-4 12-12" />
        <circle cx="4" cy="16" r="1.5" />
        <circle cx="16" cy="4" r="1.5" />
      </>
    ),
  },
  { to: "/slownik", label: "Słownik", phone: "more" },
] as const;

const tabs = navItems.filter((item) => item.phone === "tab");
const moreItems = navItems.filter((item) => item.phone === "more");

/** Top bar with the skip link, the wordmark, main navigation and the theme toggle. */
export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded focus:border-2 focus:border-on-marker focus:bg-marker focus:px-4 focus:font-bold focus:text-on-marker"
      >
        Przejdź do treści
      </a>
      <div className="mx-auto flex max-w-245 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 sm:px-7">
        <Link to="/" className="mr-auto inline-flex min-h-11 items-center text-[1.0625rem] font-bold tracking-tight">
          <span className="font-mono">a11y</span>&nbsp;playground
        </Link>
        <nav aria-label="Główna" className="max-sm:hidden">
          <ul className="flex flex-wrap gap-1">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: to === "/" }}
                  className="inline-flex min-h-11 items-center border-b-2 border-transparent px-2 text-[0.9375rem] text-ink-2 hover:bg-paper-2 hover:text-ink aria-[current=page]:border-ink aria-[current=page]:font-semibold aria-[current=page]:text-ink"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="max-sm:hidden">
          <ThemeToggle />
        </div>
        <PhoneNav />
      </div>
    </header>
  );
}

/**
 * The navigation below 640px, variant C of the mobile menu mocks: three tabs and "Więcej" in a
 * bar docked to the bottom edge, in reach of the thumb. "Więcej" opens a modal sheet with the
 * remaining links and the theme toggle. On screens too short to spare the height (landscape,
 * 400% zoom) the `docked` variant doesn't apply and the bar stays a row in the header.
 */
function PhoneNav() {
  const sheet = useRef<HTMLDialogElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // "Więcej" looks current when the page is one of its links, so no page leaves the bar blank.
  const inMore = moreItems.some(({ to }) => pathname === to || pathname.startsWith(`${to}/`));

  const close = () => {
    sheet.current?.close();
  };

  const tab =
    "flex min-h-14 flex-col items-center justify-center gap-0.5 border-t-3 border-transparent px-1 text-[0.8125rem] text-ink-2 hover:bg-paper-2 hover:text-ink";

  return (
    <nav
      aria-label="Główna"
      className="order-last -mx-4 w-[calc(100%+2rem)] border-t border-rule bg-surface sm:hidden docked:fixed docked:inset-x-0 docked:bottom-0 docked:z-30 docked:mx-0 docked:w-auto"
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, icon }) => (
          <li key={to}>
            <Link to={to} className={`${tab} aria-[current=page]:border-ink aria-[current=page]:font-bold aria-[current=page]:text-ink`}>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]">
                {icon}
              </svg>
              {label}
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            aria-haspopup="dialog"
            data-current={inMore || undefined}
            onClick={() => {
              sheet.current?.showModal();
            }}
            className={`w-full ${tab} data-current:border-ink data-current:font-bold data-current:text-ink`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-current">
              <circle cx="5" cy="10" r="1.4" />
              <circle cx="10" cy="10" r="1.4" />
              <circle cx="15" cy="10" r="1.4" />
            </svg>
            Więcej
          </button>
        </li>
      </ul>

      {/* closedby="any" adds a tap on the backdrop to Escape and "Zamknij". The browser returns focus to "Więcej". */}
      <dialog
        ref={sheet}
        closedby="any"
        aria-labelledby="wiecej-tytul"
        className="mx-0 mt-auto mb-0 max-h-dvh p-0 w-full max-w-none overflow-y-auto rounded-t-xl border-t-2 border-ink bg-surface text-ink backdrop:bg-black/45"
      >
        <div className="flex items-center justify-between border-b border-rule py-2 pr-2 pl-4">
          <h2 id="wiecej-tytul" className="text-[1.0625rem] font-bold tracking-tight">
            Więcej
          </h2>
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-11 items-center gap-2 rounded border border-control bg-surface px-3 font-semibold hover:border-ink"
          >
            <span aria-hidden="true">✕</span>
            Zamknij
          </button>
        </div>
        <ul>
          {moreItems.map(({ to, label }) => (
            <li key={to} className="border-b border-rule">
              <Link
                to={to}
                onClick={close}
                className="group flex min-h-12 items-center border-l-4 border-transparent px-4 hover:bg-paper-2 aria-[current=page]:border-ink aria-[current=page]:bg-paper-2 aria-[current=page]:font-bold"
              >
                {label}
                {/* aria-current already says it to screen readers. */}
                <span aria-hidden="true" className="ml-auto hidden font-mono text-xs font-normal tracking-wider text-ink-2 uppercase group-aria-[current=page]:inline">
                  tu jesteś
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-4 py-3">
          <ThemeToggle />
        </div>
      </dialog>
    </nav>
  );
}
