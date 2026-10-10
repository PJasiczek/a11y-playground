import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PracticeTabs } from "~/components/patterns";
import { getProblemRows } from "~/content/before-after.functions";
import { countOf } from "~/lib/plural";

const problemForms = ["problem", "problemy", "problemów"] as const;

export const Route = createFileRoute("/praktyka/przed-i-po/")({
  loader: async () => (await getProblemRows()).length,
  head: () => ({ meta: [{ title: "Strona przed i po · Praktyka · a11y playground" }] }),
  component: BeforeAfterPage,
});

const button =
  "inline-flex min-h-11 items-center rounded-xs border border-control bg-surface px-4 font-semibold text-ink hover:border-ink";
const primary = "inline-flex min-h-11 items-center rounded-xs border border-ink bg-ink px-4 font-semibold text-paper";

/** One step of the three, numbered by the list around it. */
function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <li className="border-rule py-4 sm:px-4 sm:first:pl-0 sm:last:pr-0 sm:[&+li]:border-l max-sm:[&+li]:border-t">
      <span aria-hidden="true" className="block font-mono text-[2.5rem] leading-none font-bold">
        {number}
      </span>
      <h3 className="mt-2 text-lg font-bold">{title}</h3>
      {children}
    </li>
  );
}

/**
 * The entry to the whole-page demo (mock 1A of phase 11): the KMW page, the order AU suggests,
 * and the warning before the link to the broken page.
 */
function BeforeAfterPage() {
  const count = Route.useLoaderData();
  return (
    <>
      <h1 className="pt-8 pb-2 text-[1.875rem] font-bold tracking-tight">Praktyka</h1>
      <PracticeTabs />
      <h2 className="text-xl font-bold tracking-tight">Komunikacja Miejska Wrzosów: znajdź {countOf(count, problemForms)}</h2>
      <p className="mt-2 max-w-[60ch] text-ink-2">
        Strona główna fikcyjnego przewoźnika. Ma {countOf(count, problemForms)} z dostępnością. Poszukaj ich sam, a potem porównaj z listą.
      </p>
      <ol className="mt-6 grid border-t-2 border-ink sm:grid-cols-3">
        <Step number={1} title="Sprawdź sam">
          <p className="mt-1 text-[0.9375rem] text-ink-2">
            Przejdź stronę klawiaturą, czytnikiem ekranu albo w powiększeniu. Zapisz, co nie działa.
          </p>
          <p className="mt-3 border-2 border-on-marker bg-marker px-3 py-2 text-[0.9375rem] font-semibold text-on-marker">
            <span aria-hidden="true">⚠ </span>
            Ta strona celowo łamie zasady dostępności. Część rzeczy nie zadziała z klawiatury ani z czytnikiem ekranu.
          </p>
          <p className="mt-3">
            <a href="/demo/przed-i-po/przed" className={primary}>
              Otwórz wersję zepsutą
            </a>
          </p>
        </Step>
        <Step number={2} title="Porównaj z listą">
          <p className="mt-1 text-[0.9375rem] text-ink-2">
            {countOf(count, problemForms)} z poprawkami, kodem i kryteriami. axe znajduje tylko część z nich.
          </p>
          <p className="mt-3">
            <Link to="/praktyka/przed-i-po/lista" className={button}>
              Lista problemów
            </Link>
          </p>
        </Step>
        <Step number={3} title="Zobacz efekt końcowy">
          <p className="mt-1 text-[0.9375rem] text-ink-2">Ta sama strona bez tych problemów. Tak powinna wyglądać.</p>
          <p className="mt-3">
            <a href="/demo/przed-i-po/po" className={button}>
              Otwórz wersję poprawioną
            </a>
          </p>
        </Step>
      </ol>
    </>
  );
}
