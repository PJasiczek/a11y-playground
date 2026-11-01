import { Link, useRouterState } from "@tanstack/react-router";
import { useRef } from "react";
import { CalmToggle } from "./calm-toggle";
import { type Kind, KindIcon, kinds, Wordmark } from "./kinds";
import { ThemeToggle } from "./theme-toggle";

/**
 * The main navigation, shared by both layouts. `phone` says where an item goes below 640px:
 * one of the tabs in the bottom bar, the "Więcej" sheet, or nowhere because the wordmark leads
 * there. Every item but Start is a kind of content and carries its colour and icon.
 */
const navItems = [
  { to: "/", label: "Start", phone: "wordmark", kind: null },
  { to: "/kryteria", label: "Kryteria", phone: "tab", kind: "kryteria" },
  { to: "/praktyka", label: "Praktyka", phone: "tab", kind: "praktyka" },
  { to: "/sciezki", label: "Ścieżki", phone: "tab", kind: "sciezki" },
  { to: "/prawo", label: "Prawo", phone: "more", kind: "prawo" },
  { to: "/symulatory", label: "Symulatory", phone: "more", kind: "symulatory" },
  { to: "/wcag-3", label: "WCAG 3.0", phone: "more", kind: "wcag3" },
  { to: "/slownik", label: "Słownik", phone: "more", kind: "slownik" },
] as const satisfies readonly { to: string; label: string; phone: "wordmark" | "tab" | "more"; kind: Kind | null }[];

const tabs = navItems.filter((item) => item.phone === "tab");
const moreItems = navItems.filter((item) => item.phone === "more");

/**
 * Top bar: the skip link, the logo, Spokój and the theme toggle in the first row, the
 * main navigation as text links in the second, the current one underlined in its kind's colour.
 * Below 640px the navigation docks to the bottom edge.
 */
export function SiteHeader() {
  return (
    <header className="site-header">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded focus:border-2 focus:border-on-marker focus:bg-marker focus:px-4 focus:font-bold focus:text-on-marker"
      >
        Przejdź do treści
      </a>
      <div className="mx-auto flex max-w-280 flex-wrap items-center gap-x-4 gap-y-2 px-4 pt-2 sm:px-7 sm:pt-3">
        <Link to="/" preload="viewport" className="site-brand group mr-auto inline-flex min-h-11 items-center gap-2.5 text-[1.0625rem] font-extrabold tracking-tight">
          <Wordmark />
        </Link>
        <div className="header-controls flex gap-2 max-sm:hidden">
          <CalmToggle />
          <ThemeToggle />
        </div>
        <nav aria-label="Główna" className="desktop-nav w-full max-sm:hidden">
          {/* The bar under the current link is 4px thick; aria-current says it to screen readers. */}
          <ul className="-mx-3 flex flex-wrap pb-2">
            {navItems.map(({ to, label, kind }) => (
              <li key={to}>
                <Link
                  to={to}
                  preload="viewport"
                  activeOptions={{ exact: to === "/" }}
                  className={`header-nav-link ${kind ? kinds[kind].className : ""} relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-semibold after:absolute after:inset-x-3 after:bottom-1 after:h-1 after:rounded-full hover:after:bg-control aria-[current=page]:font-extrabold aria-[current=page]:after:bg-kind-d`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <PhoneNav />
      </div>
    </header>
  );
}

/**
 * The navigation below 640px, variant C of the mobile menu mocks: three tabs and "Więcej" in a
 * bar docked to the bottom edge, in reach of the thumb. "Więcej" opens a modal sheet with the
 * remaining links, Spokój and the theme toggle. On screens too short to spare the height (landscape,
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
    "flex min-h-14 flex-col items-center justify-center gap-0.5 border-t-3 border-transparent px-1 text-[0.8125rem] font-semibold hover:bg-paper-2";

  return (
    <nav
      aria-label="Główna"
      className="order-last -mx-4 w-[calc(100%+2rem)] border-t border-rule bg-surface sm:hidden docked:fixed docked:inset-x-0 docked:bottom-0 docked:z-30 docked:mx-0 docked:w-auto"
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, kind }) => (
          <li key={to}>
            <Link
              to={to}
              preload="viewport"
              className={`${kinds[kind].className} ${tab} aria-[current=page]:border-kind-d aria-[current=page]:bg-kind aria-[current=page]:font-extrabold`}
            >
              <KindIcon kind={kind} className="size-5 text-kind-d" />
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
            className={`w-full ${tab} data-current:border-ink data-current:font-extrabold`}
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
          {moreItems.map(({ to, label, kind }) => (
            <li key={to} className="border-b border-rule">
              <Link
                to={to}
                preload="viewport"
                onClick={close}
                className={`${kinds[kind].className} group flex min-h-12 items-center gap-3 border-l-4 border-transparent px-4 font-semibold hover:bg-paper-2 aria-[current=page]:border-kind-d aria-[current=page]:bg-kind aria-[current=page]:font-extrabold`}
              >
                <KindIcon kind={kind} className="size-5 text-kind-d" />
                {label}
                {/* aria-current already says it to screen readers. */}
                <span aria-hidden="true" className="ml-auto hidden text-xs font-normal tracking-wider text-ink-2 uppercase group-aria-[current=page]:inline">
                  tu jesteś
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 px-4 py-3">
          <CalmToggle />
          <ThemeToggle />
        </div>
      </dialog>
    </nav>
  );
}
