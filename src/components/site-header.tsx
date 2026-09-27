import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { to: "/", label: "Start" },
  { to: "/kryteria", label: "Kryteria" },
  { to: "/prawo", label: "Prawo" },
  { to: "/praktyka", label: "Praktyka" },
  { to: "/sciezki", label: "Ścieżki" },
] as const;

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
      <div className="mx-auto flex max-w-245 flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2 sm:px-7">
        <Link to="/" className="inline-flex min-h-11 items-center text-[1.0625rem] font-bold tracking-tight">
          <span className="font-mono">a11y</span>&nbsp;playground
        </Link>
        {/* On narrow screens the list wraps onto its own row instead of hiding behind a menu button. */}
        <nav aria-label="Główna" className="order-last w-full sm:order-none sm:ml-auto sm:w-auto">
          <ul className="flex flex-wrap gap-1">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: to === "/" }}
                  className="inline-flex min-h-11 items-center border-b-2 border-transparent px-3 text-[0.9375rem] text-ink-2 hover:bg-paper-2 hover:text-ink aria-[current=page]:border-ink aria-[current=page]:font-semibold aria-[current=page]:text-ink"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
