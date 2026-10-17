// Build-time environment variables (Vite exposes only the VITE_ ones to the client).

interface ImportMetaEnv {
  /** Google Analytics 4 measurement ID, set only for the production deploy. See src/lib/consent.ts. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface Window {
  /** The gtag.js command queue. */
  dataLayer?: unknown[];
}
