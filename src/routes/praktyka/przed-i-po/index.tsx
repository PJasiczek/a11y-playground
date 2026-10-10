import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { primaryButton, secondaryButton, useReview } from "~/components/before-after";
import { PracticeTabs } from "~/components/patterns";
import { reviewKey } from "~/content/before-after-labels";
import { getProblemRows } from "~/content/before-after.functions";
import { countOf } from "~/lib/plural";
import { progressStore } from "~/progress/store";

const problemForms = ["problem", "problemy", "problemów"] as const;

export const Route = createFileRoute("/praktyka/przed-i-po/")({
  loader: async () => (await getProblemRows()).length,
  head: () => ({ meta: [{ title: "Strona przed i po · Praktyka · a11y playground" }] }),
  component: BeforeAfterPage,
});

/** One step of the three, numbered by the list around it. A locked step says so in words. */
function Step({ number, title, locked = false, children }: { number: number; title: string; locked?: boolean; children: ReactNode }) {
  return (
    <li className="border-rule py-4 sm:px-4 sm:first:pl-0 sm:last:pr-0 sm:[&+li]:border-l max-sm:[&+li]:border-t">
      <span aria-hidden="true" className="block font-mono text-[2.5rem] leading-none font-bold">
        {number}
      </span>
      <h3 className="mt-2 text-lg font-bold">{title}</h3>
      {children}
      {locked ? (
        <p className="mt-3 font-mono text-sm font-semibold">
          <span aria-hidden="true">🔒 </span>Zablokowane do końca sprawdzania
        </p>
      ) : null}
    </li>
  );
}

/**
 * The entry to the whole-page demo (mock 1A of phase 11): the KMW page, the order AU suggests,
 * and the warning before the link to the broken page. Steps 2 and 3 give the answers away, so
 * they open only once the reader ends the check; the prerendered page always shows them locked.
 */
function BeforeAfterPage() {
  const count = Route.useLoaderData();
  const { notes, revealedAt } = useReview();
  const checking = !revealedAt;
  const navigate = Route.useNavigate();

  return (
    <>
      <h1 className="pt-8 pb-2 text-[1.875rem] font-bold tracking-tight">Praktyka</h1>
      <PracticeTabs />
      <h2 className="text-xl font-bold tracking-tight">Komunikacja Miejska Wrzosów: znajdź {countOf(count, problemForms)}</h2>
      <p className="mt-2 max-w-[60ch] text-ink-2">
        Strona główna fikcyjnego przewoźnika. Ma {countOf(count, problemForms)} z dostępnością. Poszukaj ich sam, zapisując
        notatki, a potem porównaj je z listą.
      </p>
      <ol className="mt-6 grid border-t-2 border-ink sm:grid-cols-3">
        <Step number={1} title="Sprawdź sam">
          <p className="mt-1 text-[0.9375rem] text-ink-2">
            Przejdź stronę klawiaturą, czytnikiem ekranu albo w powiększeniu. Co nie działa, zapisz w notatkach: przycisk
            „Notatki” jest w pasku nad stroną.
          </p>
          <p className="mt-3 border-2 border-on-marker bg-marker px-3 py-2 text-[0.9375rem] font-semibold text-on-marker">
            <span aria-hidden="true">⚠ </span>
            Ta strona celowo łamie zasady dostępności. Część rzeczy nie zadziała z klawiatury ani z czytnikiem ekranu.
          </p>
          {checking ? (
            <>
              {notes.length > 0 ? (
                <p className="mt-3 font-mono text-sm">Sprawdzasz · {countOf(notes.length, ["notatka", "notatki", "notatek"])}</p>
              ) : null}
              <p className="mt-3 flex flex-wrap gap-2">
                <a href="/demo/przed-i-po/przed" className={primaryButton}>
                  {notes.length > 0 ? "Wróć do sprawdzania" : "Zacznij sprawdzanie"}
                </a>
                {notes.length > 0 ? (
                  <button
                    type="button"
                    className={secondaryButton}
                    onClick={() => {
                      progressStore().reveal(reviewKey);
                      void navigate({ to: "/praktyka/przed-i-po/lista" });
                    }}
                  >
                    Kończę sprawdzanie
                  </button>
                ) : null}
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 font-mono text-sm">Sprawdzanie zakończone</p>
              <p className="mt-3">
                <a href="/demo/przed-i-po/przed-znaczniki" className={secondaryButton}>
                  Strona zepsuta ze znacznikami
                </a>
              </p>
            </>
          )}
        </Step>
        <Step number={2} title="Porównaj z listą" locked={checking}>
          <p className="mt-1 text-[0.9375rem] text-ink-2">
            {countOf(count, problemForms)} z poprawkami, kodem i kryteriami, a obok Twoje notatki. axe znajduje tylko część
            z nich.
          </p>
          {checking ? null : (
            <p className="mt-3">
              <Link to="/praktyka/przed-i-po/lista" className={primaryButton}>
                Lista problemów
              </Link>
            </p>
          )}
        </Step>
        <Step number={3} title="Zobacz efekt końcowy" locked={checking}>
          <p className="mt-1 text-[0.9375rem] text-ink-2">Ta sama strona bez tych problemów. Tak powinna wyglądać.</p>
          {checking ? null : (
            <p className="mt-3">
              <a href="/demo/przed-i-po/po" className={secondaryButton}>
                Otwórz wersję poprawioną
              </a>
            </p>
          )}
        </Step>
      </ol>
    </>
  );
}
