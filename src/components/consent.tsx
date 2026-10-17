import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { applyConsent, choose, type Consent, measurementId, readConsent, reopenConsent, serverConsent, subscribeConsent } from "~/lib/consent";

const settingsId = "ustawienia-cookies";

function useConsent() {
  return useSyncExternalStore(subscribeConsent, readConsent, () => serverConsent);
}

/**
 * The consent banner, variant B of the cookie consent mocks: a card in the bottom left corner,
 * opposite "Struktura strony". Not a modal, so it never traps focus. While it shows, the root
 * gets data-consent="open" and --consent-height, which keep focused elements clear of it (2.4.11)
 * and, on narrow screens, hide "Struktura strony" underneath. Also switches GA on and off as the
 * choice changes. Render once, in the root layout, after <main>.
 */
export function ConsentBanner() {
  const { consent, open } = useConsent();
  const region = useRef<HTMLElement>(null);

  useEffect(() => {
    if (measurementId !== undefined && consent !== null) applyConsent(measurementId, consent);
  }, [consent]);

  useEffect(() => {
    const element = region.current;
    if (!open || !element) return;
    const root = document.documentElement;
    root.dataset.consent = "open";
    const observer = new ResizeObserver(() => {
      root.style.setProperty("--consent-height", `${String(element.offsetHeight)}px`);
    });
    observer.observe(element);
    // Reopened from the footer: take the reader to the choice. On first show, leave focus alone.
    if (readConsent().consent !== null) element.focus();
    return () => {
      observer.disconnect();
      delete root.dataset.consent;
      root.style.removeProperty("--consent-height");
    };
  }, [open]);

  if (!open) return null;

  const pick = (next: Consent) => {
    const reopened = consent !== null;
    choose(next);
    // Back to the footer button when it was the way in, otherwise to the page itself.
    document.getElementById(reopened ? settingsId : "main")?.focus();
  };

  const button =
    "inline-flex min-h-11 flex-1 items-center justify-center rounded border-2 border-ink bg-paper px-4 font-semibold text-ink hover:bg-paper-2 sm:flex-none";

  return (
    <section
      ref={region}
      aria-labelledby="zgoda-tytul"
      tabIndex={-1}
      className="fixed right-4 bottom-4 left-4 z-40 rounded border-2 border-ink bg-surface p-4 text-ink shadow-[0_6px_24px_rgb(0_0_0/0.18)] sm:right-auto sm:w-[22rem]"
    >
      <h2 id="zgoda-tytul" className="text-[1.0625rem] font-bold tracking-tight">
        Statystyki odwiedzin
      </h2>
      <p className="mt-1 text-[0.9375rem] text-ink-2">
        Za Twoją zgodą liczymy odwiedziny przez Google Analytics, żeby wiedzieć, które strony są przydatne.{" "}
        <Link to="/prywatnosc" className="text-accent underline underline-offset-3">
          Polityka prywatności
        </Link>
      </p>
      {/* Same look for both answers: refusing is as easy as agreeing. */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            pick("denied");
          }}
          className={button}
        >
          Odrzuć
        </button>
        <button
          type="button"
          onClick={() => {
            pick("granted");
          }}
          className={button}
        >
          Zgadzam się
        </button>
      </div>
    </section>
  );
}

const choiceLabels: Record<Consent, string> = { granted: "zgoda", denied: "odrzucone" };

/** "Ustawienia cookies" in the footer: shows the banner again, so consent is as easy to withdraw as to give. */
export function ConsentSettingsButton() {
  const { consent } = useConsent();
  if (measurementId === undefined) return null;
  return (
    <button
      id={settingsId}
      type="button"
      onClick={reopenConsent}
      className="inline-flex min-h-11 items-center text-accent underline underline-offset-3"
    >
      Ustawienia cookies{consent ? ` (${choiceLabels[consent]})` : ""}
    </button>
  );
}
