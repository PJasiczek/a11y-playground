import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalFooter, ProvisionLink } from "~/components/legal";
import { pageHead } from "~/lib/seo";
import { breadcrumbLd } from "~/lib/structured-data";

export const Route = createFileRoute("/prawo/en-301-549")({
  head: ({ match }) =>
    pageHead({
      title: "EN 301 549 · Prawo", description:
        "EN 301 549, europejska norma wymagań dostępności dla produktów i usług ICT: rozdziały opisane naszymi słowami i numery punktów, które odpowiadają kryteriom WCAG.",
      path: match.pathname,
      jsonLd: [
        breadcrumbLd([
          { name: "Prawo", path: "/prawo" },
          { name: "EN 301 549", path: match.pathname },
        ]),
      ],
    }),
  component: StandardPage,
});

// Chapters of EN 301 549 in our own words. The text of the standard is not ours to copy; the
// numbers and topics are enough to find your way in it.
const chapters = [
  ["4", "Wymagania funkcjonalne: czego potrzebują użytkownicy bez wzroku, słuchu, mowy, sprawnych rąk"],
  ["5", "Wymagania ogólne dla każdego produktu, na przykład zamknięta funkcjonalność i biometria"],
  ["6", "Komunikacja głosowa z tekstem w czasie rzeczywistym"],
  ["7", "Wideo: napisy i audiodeskrypcja w odtwarzaczach"],
  ["8", "Sprzęt: klawisze, gniazda, zasięg rąk"],
  ["9", "Strony internetowe: kryteria WCAG na poziomach A i AA, numer w numer"],
  ["10", "Dokumenty, które nie są stronami, na przykład PDF i pliki biurowe"],
  ["11", "Oprogramowanie, w tym aplikacje mobilne"],
  ["12", "Dokumentacja i wsparcie techniczne"],
  ["13", "Usługi przekaźnikowe i dostęp do numerów alarmowych"],
] as const;

/** EN 301 549 as the link between the acts and WCAG, without the text of the standard. */
function StandardPage() {
  return (
    <article>
      <nav aria-label="Okruszki" className="pt-4 font-mono text-[0.8125rem] text-ink-2">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/prawo" className="inline-flex min-h-11 min-w-11 items-center underline underline-offset-3">
              Prawo
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">EN 301 549</span>
          </li>
        </ol>
      </nav>

      <h1 className="pt-3 text-[clamp(1.5rem,4vw,2.125rem)] leading-tight font-bold tracking-tight">EN 301 549</h1>
      <div className="prose mt-4">
        <p>
          Europejska norma wymagań dostępności dla produktów i usług ICT, przygotowana przez ETSI, CEN i CENELEC. Obejmuje
          strony, dokumenty, oprogramowanie i sprzęt. Dla stron internetowych powtarza kryteria WCAG na poziomach A i AA.
        </p>
        <p>
          Norma sama nie jest prawem. Staje się ważna przez ustawy: kto ją spełnia, ten korzysta z domniemania, że spełnia
          ustawę.
        </p>
      </div>

      <section aria-labelledby="wersje" className="mt-9">
        <h2 id="wersje" className="border-t-2 border-ink pt-5 text-xl font-bold tracking-tight">
          Która wersja i do czego
        </h2>
        <dl className="mt-3">
          <div className="grid gap-x-6 border-b border-rule py-3 sm:grid-cols-[9rem_1fr]">
            <dt className="font-mono font-semibold">V3.2.1 (2021)</dt>
            <dd>
              <p>
                Oparta na WCAG 2.1. Wskazuje ją{" "}
                <ProvisionLink id="ustawa-2019-848/art-5">art. 5 ust. 3 ustawy o dostępności cyfrowej</ProvisionLink>: punkty 9,
                10 i 11 dają podmiotom publicznym domniemanie zgodności z załącznikiem.
              </p>
            </dd>
          </div>
          <div className="grid gap-x-6 border-b border-rule py-3 sm:grid-cols-[9rem_1fr]">
            <dt className="font-mono font-semibold">V4.1.1 (2026)</dt>
            <dd>
              <p>
                Oparta na WCAG 2.2, pierwsza przygotowana z myślą o Europejskim Akcie o Dostępności. Opublikowana we wrześniu
                2026 r., czeka na wskazanie w Dzienniku Urzędowym UE. Dopiero wtedy da firmom domniemanie zgodności z{" "}
                <ProvisionLink id="ustawa-2024-731/art-20">art. 20 ustawy o produktach i usługach</ProvisionLink>.
              </p>
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="rozdzialy" className="mt-9">
        <h2 id="rozdzialy" className="border-t-2 border-ink pt-5 text-xl font-bold tracking-tight">
          Co jest w rozdziałach
        </h2>
        <p className="mt-2 max-w-[66ch] text-[0.9375rem] text-ink-2">
          Nasz opis, nie tytuły z normy. Punkt 9.1.4.3 to kryterium 1.4.3, więc na stronie każdego kryterium A i AA z WCAG 2.1
          podajemy jego numer w normie.
        </p>
        <ul className="mt-2">
          {chapters.map(([number, topic]) => (
            <li key={number} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-rule py-2.5">
              <span className="font-mono font-bold">{number}</span>
              <span>{topic}</span>
            </li>
          ))}
        </ul>
      </section>

      <LegalFooter verified={null} />
    </article>
  );
}
