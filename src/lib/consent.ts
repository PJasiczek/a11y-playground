/**
 * Consent to visit statistics and the Google Analytics that depends on it. gtag.js is not even
 * downloaded until the reader agrees; withdrawing consent switches it off and deletes its cookies.
 * The choice lives in localStorage, read once on the client.
 *
 * Without VITE_GA_MEASUREMENT_ID (local dev, preview deploys) there is nothing to consent to:
 * no banner, no settings button, no script.
 */

export const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export type Consent = "granted" | "denied";

/** `open` says whether the banner shows: before the first choice, or when reopened from the footer. */
export type ConsentState = { consent: Consent | null; open: boolean };

const storageKey = "a11y-statystyki";

/** On the server and during hydration nothing shows, so both render the same. */
export const serverConsent: ConsentState = { consent: null, open: false };

let current: ConsentState | undefined;
const listeners = new Set<() => void>();

export function readConsent(): ConsentState {
  if (current) return current;
  let consent: Consent | null = null;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "granted" || stored === "denied") consent = stored;
  } catch {
    // Storage blocked: the banner asks on every page load.
  }
  current = { consent, open: measurementId !== undefined && consent === null };
  return current;
}

function setConsentState(next: ConsentState) {
  current = next;
  for (const listener of listeners) listener();
}

export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Records the reader's choice and closes the banner. */
export function choose(consent: Consent) {
  try {
    localStorage.setItem(storageKey, consent);
  } catch {
    // Storage blocked: the choice lasts until the page reloads.
  }
  setConsentState({ consent, open: false });
}

/** Shows the banner again, from "Ustawienia cookies". */
export function reopenConsent() {
  setConsentState({ ...readConsent(), open: true });
}

// gtag.js reads the Arguments object of each call, not an array, so this cannot use rest parameters.
function gtag(..._command: unknown[]): void;
function gtag() {
  // eslint-disable-next-line prefer-rest-params
  (window.dataLayer ??= []).push(arguments);
}

let loaded = false;

/**
 * Turns Google Analytics on or off to match `consent`. Page views of client-side navigation come
 * from GA4's enhanced measurement (history changes), so nothing here follows the router.
 */
export function applyConsent(id: string, consent: Consent) {
  if (consent === "granted") {
    // Consent first, so the first page view already goes out with cookies. Ads stay off for good.
    if (!loaded) gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    gtag("consent", "update", { analytics_storage: "granted" });
    if (loaded) return;
    loaded = true;
    gtag("js", new Date());
    gtag("config", id);
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);
    return;
  }
  if (loaded) gtag("consent", "update", { analytics_storage: "denied" });
  // _ga and _ga_<container>, set on this host by GA's automatic cookie domain.
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.slice(0, cookie.indexOf("="));
    if (!name.startsWith("_ga")) continue;
    document.cookie = `${name}=; max-age=0; path=/`;
    document.cookie = `${name}=; max-age=0; path=/; domain=${location.hostname}`;
  }
}
