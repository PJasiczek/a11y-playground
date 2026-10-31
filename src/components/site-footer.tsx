import { Link } from "@tanstack/react-router";
import { ConsentSettingsButton } from "./consent";
import { type Kind, kinds, Wordmark } from "./kinds";

const link = "inline-flex min-h-11 items-center font-semibold underline-offset-3 hover:underline";

// The year the page was built; every page is prerendered, so this is the year of the last release.
const year = new Date().getFullYear();

/**
 * The footer: the logo and the seven sections in one row, then the line about the project with
 * contact, privacy and the cookie settings. A reader who scrolled to the end can go anywhere
 * without scrolling back.
 */
export function SiteFooter() {
  return (
    // The bottom padding keeps the links clear of "Struktura strony", which is fixed to the corner.
    <footer className="border-t border-rule bg-paper-2 text-[0.9375rem]">
      <div className="mx-auto flex max-w-280 flex-wrap items-center gap-x-8 gap-y-3 px-4 pt-6 sm:px-7">
        <Link to="/" className="group inline-flex min-h-11 items-center gap-2.5 font-extrabold tracking-tight">
          <Wordmark />
        </Link>
        <nav aria-label="Działy w stopce">
          <ul className="flex flex-wrap gap-x-5">
            {(Object.keys(kinds) as Kind[]).map((kind) => (
              <li key={kind}>
                <Link to={kinds[kind].to} className={link}>
                  {kinds[kind].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-4 flex max-w-280 flex-wrap items-center gap-x-6 gap-y-1 border-t border-rule px-4 pt-3 pb-20 text-ink-2 sm:px-7">
        <p className="mr-auto py-2.5">© {year} a11y playground. Wspólnie tworzymy dostępny internet.</p>
        <ul className="flex flex-wrap gap-x-5 text-ink">
          <li>
            <Link to="/prywatnosc" className={link}>
              Polityka prywatności
            </Link>
          </li>
          <li>
            <Link to="/kontakt" className={link}>
              Kontakt
            </Link>
          </li>
          <li>
            <ConsentSettingsButton />
          </li>
        </ul>
      </div>
    </footer>
  );
}
