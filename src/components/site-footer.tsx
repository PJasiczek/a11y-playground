import { Link } from "@tanstack/react-router";
import { ConsentSettingsButton } from "./consent";

/** Bottom bar with the privacy policy and the cookie settings. */
export function SiteFooter() {
  return (
    // The bottom padding keeps the links clear of "Struktura strony", which is fixed to the corner.
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-245 flex-wrap items-center gap-x-5 px-4 pt-2 pb-20 text-[0.9375rem] sm:px-7">
        <span className="mr-auto text-ink-2">
          <span className="font-mono">a11y</span>&nbsp;playground
        </span>
        <Link to="/prywatnosc" className="inline-flex min-h-11 items-center text-accent underline underline-offset-3">
          Polityka prywatności
        </Link>
        <ConsentSettingsButton />
      </div>
    </footer>
  );
}
