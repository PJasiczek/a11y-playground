import { createFileRoute, Link, linkOptions } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ContrastSwing } from "~/components/contrast-swing";
import { type Kind, KindIcon, kinds } from "~/components/kinds";
import { lessonNumber, pathProgress } from "~/components/paths";
import { getHomePage } from "~/content/home.functions";
import { simulationIds } from "~/content/simulations";
import { countOf } from "~/lib/plural";
import { pageHead } from "~/lib/seo";
import { websiteLd } from "~/lib/structured-data";
import { useProgress } from "~/progress/store";

export const Route = createFileRoute("/")({
  loader: () => getHomePage(),
  head: ({ match }) =>
    pageHead({
      description:
        "WCAG 2.2 po polsku: kryteria z przykładami kodu przed i po poprawce, wzorce ARIA, symulatory, ścieżki nauki i polskie prawo o dostępności cyfrowej.",
      path: match.pathname,
      jsonLd: [websiteLd()],
    }),
  component: HomePage,
});

type HomeData = Awaited<ReturnType<typeof getHomePage>>;

// What people look for most, as ready searches.
const tries = ["1.4.3", "modal", "placeholder"];

/**
 * The home page (DESIGN.md, "Hub"): search and the seven sections first, then four places to
 * start, the contrast toy, the paths, the law and the rules the app keeps itself. Every count comes from the content.
 */
function HomePage() {
  const data = Route.useLoaderData();
  return (
    <div className="home-reference">
      <Hero data={data} />
      <Starters data={data} />
      <ToyBand />
      <div className="home-discovery">
        <Categories data={data} />
        <div className="learning-and-law"><Paths data={data} /><Law /></div>
        <Recent />
      </div>
    </div>
  );
}

/** What each section holds, counted from the content, for the keys in the hero. */
function sectionCounts(data: HomeData): Record<Kind, string> {
  const lessons = data.paths.reduce((sum, path) => sum + path.lessons.length, 0);
  return {
    kryteria: countOf(data.criteria, ["kryterium", "kryteria", "kryteriów"]),
    praktyka: `${countOf(data.examples.length, ["przykład", "przykłady", "przykładów"])}, ${countOf(data.patterns, ["wzorzec", "wzorce", "wzorców"])}`,
    sciezki: countOf(lessons, ["lekcja", "lekcje", "lekcji"]),
    prawo: `${countOf(data.acts, ["ustawa", "ustawy", "ustaw"])} i norma`,
    symulatory: countOf(simulationIds.length, ["symulacja", "symulacje", "symulacji"]),
    slownik: countOf(data.glossary.count, ["termin", "terminy", "terminów"]),
    wcag3: countOf(data.wcag3Guidelines, ["wytyczna", "wytyczne", "wytycznych"]),
  };
}

/** The arrow at the end of every card and bar. Decorative: the link's name says where it goes. */
function Arrow({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={`${className} shrink-0 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]`}>
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" />
    </svg>
  );
}

/** The kind's icon on a round tile in its deep shade, as the cards and the bars open. */
function IconDot({ kind, className = "size-11" }: { kind: Kind; className?: string }) {
  return (
    <span aria-hidden="true" className={`${className} glossy disc`}>
      <KindIcon kind={kind} className="size-[56%] stroke-[2.2]" />
    </span>
  );
}

/**
 * Three strokes of sunshine, drawn around headings and bands as in the home page graphic.
 * Decorative. `tone` picks the stroke colour; sun by default.
 */
function Spark({ className, tone = "stroke-spark" }: { className: string; tone?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={`${className} ${tone} pointer-events-none fill-none stroke-[4] [stroke-linecap:round]`}>
      <path d="M6 24 2 26.5M8.5 14 3.5 10.5M19 8.5l1.2-5.5" />
    </svg>
  );
}

/** Real links form the playground; decoration never contains interface text. */
function Hero({ data }: { data: HomeData }) {
  const counts = sectionCounts(data);
  const heroKinds: Kind[] = ["praktyka", "sciezki", "prawo", "symulatory", "slownik", "wcag3"];
  return (
    <section className="playground-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <h1 id="home-title">Dostępność<br />to nie obowiązek.<br /><span className="possibility"><span>To możliwość.</span></span><Spark className="title-spark" /></h1>
        <p className="hero-lede">Poznaj zasady WCAG, sprawdź przykłady<br className="max-sm:hidden" /> i ucz się projektować cyfrowo dla wszystkich. Wszystko w jednym miejscu – prosto, przystępnie, bez zbędnych formalności.</p>
        <form role="search" aria-label="Szukaj na stronie głównej" action="/szukaj" method="get" className="hero-search">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0 fill-none stroke-current stroke-2"><circle cx="8" cy="8" r="5.5" /><path d="m12 12 5 5" /></svg>
          <label htmlFor="home-q" className="sr-only">Szukaj w kryteriach, przykładach, przepisach, lekcjach i słowniku</label>
          <input id="home-q" name="q" type="search" placeholder="Czego szukasz? Wpisz kryterium, temat lub problem…" />
          <button type="submit" className="btn">Szukaj</button>
        </form>
        <p className="hero-suggestions">Popularne sugestie: {tries.map(q => <Link key={q} to="/szukaj" search={{ q }}>{q}</Link>)}</p>
      </div>
      <div className="playground-scene illustrated-scene">
        <picture className="playground-art-frame">
          <source media="(max-width: 550px)" srcSet="/images/playground-mobile.png" />
          <img src="/images/playground-hero.png" width="1448" height="1086" alt="" fetchPriority="high" className="playground-art" />
        </picture>
        <div className="mobile-playground-intro">
          <p className="mobile-playground-eyebrow">Twój plac zabaw</p>
          <h2>Od czego zaczynamy?</h2>
          <p>Wybierz swój pierwszy krok.</p>
        </div>
        <ul aria-label="Działy" className="hero-blocks">
          {heroKinds.map(kind => <li key={kind} className={kinds[kind].className}>
            <Link to={kinds[kind].to} className="hero-block">
              <span className="hero-icon"><KindIcon kind={kind} className="size-8" /></span>
              <span><strong>{kinds[kind].label}</strong><small>{counts[kind]}</small></span>
              <span className="block-arrow"><Arrow /></span>
              {kind === "praktyka" ? <span className="hero-mobile-cta" aria-hidden="true">Zobacz przykłady</span> : null}
            </Link>
          </li>)}
        </ul>
      </div>
    </section>
  );
}

function Categories({ data }: { data: HomeData }) {
  const counts = sectionCounts(data);
  return <section aria-labelledby="kategorie" className="pb-12">
    <SectionHead id="kategorie" title="Najczęściej wybierane kategorie" more={<Link to="/kryteria" className={moreLink}>Zobacz wszystkie <Arrow /></Link>} />
    <ul className="category-grid">{(Object.keys(kinds) as Kind[]).map(kind => <li key={kind} className={kinds[kind].className}>
      <Link to={kinds[kind].to} className="category-tile"><span className="hero-icon"><KindIcon kind={kind} /></span><span><strong>{kinds[kind].label}</strong><small>{kind === "praktyka" ? countOf(data.examples.length, ["przykład", "przykłady", "przykładów"]) : counts[kind]}</small></span><Arrow /></Link>
    </li>)}<li className="playground-quote"><span aria-hidden="true">“</span> Dostępność to nie luksus. To standard.</li></ul>
  </section>;
}

/** A section heading with an optional line under it and a link to everything on the right. */
function SectionHead({ id, title, lede, more }: { id: string; title: string; lede?: string; more?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
      <div className="section-heading-copy">
        <span aria-hidden="true" className={`section-medallion ${id === "na-poczatek" ? "medallion-sun" : ""}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m4 7 4 4 4-7 4 7 4-4-2 12H6zM8 16h8" /></svg></span>
        <h2 id={id} className="text-[1.6rem] font-extrabold tracking-[-0.025em]">
          {title}
        </h2>
        {lede ? <p className="mt-1 text-[0.9375rem] text-ink-2">{lede}</p> : null}
      </div>
      {more}
    </div>
  );
}

const moreLink = "inline-flex min-h-11 items-center gap-1.5 font-bold text-accent underline underline-offset-3";

/** A row of small white tags at the bottom of a card: the kind, then the criteria. */
function Tags({ kind, ids }: { kind: Kind; ids: readonly string[] }) {
  return (
    <p className="mt-auto flex flex-wrap items-center gap-1.5 pt-4 pr-12 text-xs font-bold">
      <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1">
        <KindIcon kind={kind} className="size-3.5 text-kind-d" />
        {kinds[kind].label}
      </span>
      {ids.length > 0 ? <span className="sr-only">, kryteria:</span> : null}
      {ids.map((id) => (
        <span key={id} className="rounded-full bg-surface px-2.5 py-1 font-semibold">
          {id}
        </span>
      ))}
    </p>
  );
}

/** The round arrow in the bottom corner of a card. The card's title link covers the whole card. */
function CornerArrow() {
  return (
    <span aria-hidden="true" className="absolute right-4 bottom-4 grid size-9 place-items-center rounded-full bg-surface text-ink shadow-[0_2px_0_0_var(--kind-d)] transition-transform duration-200 ease-(--ease-spring) group-hover:translate-x-1">
      <Arrow className="size-4" />
    </span>
  );
}

/**
 * A tinted card: its kind's icon, a title link (stretched over the card), text and tags. On
 * phones the icon moves to the left of the text, as in the mobile graphic.
 */
function TintCard({ kind, link, ids, children }: { kind: Kind; link: ReactNode; ids: readonly string[]; children: ReactNode }) {
  return (
    <li
      className={`${kinds[kind].className} group relative grid grid-cols-[auto_1fr] content-start gap-x-4 rounded-xl border-2 border-kind-line bg-kind-soft p-5 transition-transform duration-200 ease-(--ease-out) hover:-translate-y-1 sm:flex sm:flex-col`}
    >
      <IconDot kind={kind} className="row-span-3 size-11 sm:size-13" />
      <h3 className="text-[1.0625rem] leading-snug font-extrabold tracking-tight sm:mt-4">{link}</h3>
      <p className="mt-2 text-[0.9375rem] text-ink-2">{children}</p>
      <Tags kind={kind} ids={ids} />
      <CornerArrow />
    </li>
  );
}

const stretched = "after:absolute after:inset-0 after:rounded-xl";

function Starters({ data }: { data: HomeData }) {
  const bySlug = (slug: string) => data.examples.find((example) => example.slug === slug);
  const target = bySlug("cel-24-na-24");
  const states = bySlug("kontrast-stanow");
  const cards = [
    {
      kind: "kryteria",
      title: `Kryterium 1.4.3 ${data.contrast}`,
      link: linkOptions({ to: "/kryteria/$criterionId", params: { criterionId: "1.4.3" } }),
      text: "Zadbaj o odpowiedni kontrast tekstów i elementów interfejsu. To podstawa czytelności.",
      ids: ["1.4.3"],
    },
    ...[target, states].flatMap((example) =>
      example
        ? [
            {
              kind: "praktyka" as const,
              title: example.title,
              link: linkOptions({ to: "/praktyka/$slug", params: { slug: example.slug } }),
              text: example.slug === "cel-24-na-24" ? "Elementy klikalne powinny mieć co najmniej 24×24 px obszaru dostępnego do interakcji." : "Zapewnij odpowiednią czytelność tekstu pomocniczego i sprawdź kontrast każdego stanu.",
              ids: example.criteria.slice(0, 1),
            },
          ]
        : [],
    ),
    {
      kind: "symulatory",
      title: "Symulacja: tylko klawiatura",
      link: linkOptions({ to: "/symulatory", hash: "klawiatura" }),
      text: "Sprawdź, czy cała funkcjonalność jest dostępna bez użycia myszy.",
      ids: ["2.1.1"],
    },
  ] as const;

  return (
    <section aria-labelledby="na-poczatek" className="pb-14">
      <SectionHead
        id="na-poczatek"
        title="Najpopularniejsze"
        lede="Zajrzyj do wybranych materiałów i zacznij od tego, co interesuje Cię najbardziej."
        more={
          <Link to="/praktyka" className={moreLink}>
            Wszystkie przykłady <Arrow />
          </Link>
        }
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <TintCard
            key={card.title}
            kind={card.kind}
            ids={card.ids}
            link={
              <Link {...card.link} className={stretched}>
                {card.title}
              </Link>
            }
          >
            {card.text}
          </TintCard>
        ))}
      </ul>
    </section>
  );
}

function ToyBand() {
  return (
    <section aria-labelledby="w-dzialaniu" className="practice-band relative mb-14 grid items-center gap-10 rounded-xl bg-sun p-6 sm:p-9 md:grid-cols-[1fr_1.1fr]">
      <Spark tone="stroke-grass-d" className="absolute top-1/2 left-[46%] size-11 -translate-y-1/2 max-md:hidden" />
      <Spark tone="stroke-sea-d" className="absolute top-3 right-3 size-9 -scale-x-100" />
      <div>
        <p className="band-eyebrow"><KindIcon kind="praktyka" /> Zacznij od praktyki</p>
        <h2 id="w-dzialaniu" className="text-[1.75rem] leading-tight font-extrabold tracking-[-0.025em]">
          Poznaj praktykę
          <br />w działaniu
        </h2>
        <p className="mt-3 max-w-[42ch]">
          Skorzystaj z gotowych przykładów, wzorców i gotowych rozwiązań. Ucz się na konkretnych przypadkach, a nie tylko na teorii.
        </p>
        <p className="mt-6">
          <Link to="/praktyka" className="btn">
            Zobacz wszystkie przykłady <Arrow />
          </Link>
        </p>
      </div>
      <div className="practice-demo rounded-xl bg-surface p-5 shadow-[0_14px_30px_-18px_rgb(0_0_0/0.35)]">
        <ContrastSwing />
      </div>
    </section>
  );
}

// An icon per path, drawn like the kind icons; a path without one gets the paths icon.
const pathIcons: Record<string, ReactNode> = {
  programista: <path d="M7 6 3 10l4 4M13 6l4 4-4 4M11 4l-2 12" />,
  projektant: <path d="M4 16l1-4 8-8 3 3-8 8-4 1zM11 6l3 3" />,
  "autor-tresci": <path d="M5 3h7l3 3v11H5zM8 9h4M8 12h4M8 15h2" />,
  tester: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="m6.8 10.3 2.2 2.2 4.2-4.6" />
    </>
  ),
  "minimum-prawne": <path d="M3 8 10 4l7 4M5 8v7M8.5 8v7M11.5 8v7M15 8v7M3 17h14" />,
};

const lessonForms = ["lekcja", "lekcje", "lekcji"] as const;

function Paths({ data }: { data: HomeData }) {
  const snapshot = useProgress();
  return (
    <section aria-labelledby="sciezki" className="pb-14">
      <SectionHead
        id="sciezki"
        title="Ucz się po kolei"
        lede="Wybierz ścieżkę i rozwijaj kompetencje krok po kroku."
        more={
          <Link to="/sciezki" className={moreLink}>
            Wszystkie ścieżki <Arrow />
          </Link>
        }
      />
      <ul className="kind-sciezki grid grid-cols-2 gap-3 lg:grid-cols-5">
        {data.paths.map((path, index) => {
          const { done, next } = pathProgress(snapshot, { path: path.slug, lessons: path.lessons });
          const total = path.lessons.length;
          return (
            <li key={path.slug} className="group relative flex flex-col rounded-xl bg-kind p-4 pb-15 shadow-[0_3px_0_0_var(--kind-d)]">
              <span aria-hidden="true" className="path-number glossy disc size-10">{index + 1}</span>
              <span aria-hidden="true" className="path-symbol glossy disc size-10">
                {pathIcons[path.slug] ? (
                  <svg viewBox="0 0 20 20" className="size-5 fill-none stroke-current stroke-[2.1] [stroke-linecap:round] [stroke-linejoin:round]">
                    {pathIcons[path.slug]}
                  </svg>
                ) : (
                  <KindIcon kind="sciezki" className="size-5 stroke-[2.1]" />
                )}
              </span>
              <h3 className="mt-3 text-[1.0625rem] leading-snug font-extrabold">
                <Link to="/sciezki/$path" params={{ path: path.slug }} className={stretched}>
                  {path.slug === "minimum-prawne" ? "Minimum prawne" : path.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm font-semibold">
                {done === 0 ? countOf(total, lessonForms) : `ukończono ${String(done)} z ${String(total)}`}
              </p>
              {done > 0 ? (
                <span aria-hidden="true" className="mt-2.5 block h-2 overflow-hidden rounded-full bg-surface">
                  <span className="block h-full rounded-full bg-kind-d" style={{ width: `${String((done / total) * 100)}%` }} />
                </span>
              ) : null}
              {done > 0 && next ? (
                <p className="mt-2 text-sm">
                  Dalej: {lessonNumber(next.number)} {next.title}
                </p>
              ) : null}
              <Arrow className="absolute right-4 bottom-4 size-6 text-kind-d transition-transform duration-200 ease-(--ease-out) group-hover:translate-x-1" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Law() {
  return (
    <section aria-labelledby="prawo" className="kind-prawo relative mb-14 flex items-center gap-6 overflow-hidden rounded-xl bg-kind p-6 sm:p-8">
      {/* A graduation cap: the law, taught. Decorative. */}
      <span aria-hidden="true" className="law-cap glossy disc size-20 max-sm:hidden">
        <svg viewBox="0 0 20 20" className="size-10 fill-none stroke-current stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]">
          <path d="M1.8 8 10 4l8.2 4L10 12zM5.3 9.8v3.7c1.3 1.2 2.9 1.8 4.7 1.8s3.4-.6 4.7-1.8V9.8M18.2 8v4.6" />
        </svg>
      </span>
      <div className="law-copy min-w-0 flex-1">
        <p className="band-eyebrow"><KindIcon kind="prawo" /> Prawo w praktyce</p>
        <h2 id="prawo" className="text-[1.6rem] font-extrabold tracking-[-0.025em]">
          Prawo bez czytania ustaw
        </h2>
        <p className="mt-2 max-w-[60ch]">
          Wybierz, czy chcesz skupić się na dostępie, czy na konkretnych zapisach prawnych. Nasze materiały tłumaczą, co to oznacza w praktyce.
        </p>
        <p className="mt-5">
          <Link to="/mapowanie" className="btn">
            Sprawdź, co cię dotyczy <Arrow />
          </Link>
        </p>
      </div>
      {/* Pages of a statute with a section sign, and a few strokes, as in the graphic. Decorative. */}
      <img src="/images/law-books.png" width="1536" height="1024" alt="" className="law-books" loading="lazy" />
      <svg viewBox="0 0 170 140" aria-hidden="true" className="law-drawing w-40 shrink-0 fill-none stroke-kind-d stroke-[3] [stroke-linecap:round] [stroke-linejoin:round] max-md:hidden">
        <path d="M8 62h12M14 46l9 6M14 80l9-5" className="opacity-70" />
        <path d="M58 16h58l18 18v94H58z" transform="rotate(8 96 70)" className="fill-kind-soft" />
        <path d="M50 12h58l18 18v94H50z" className="fill-surface" />
        <path d="M108 12v18h18" />
        <text x="88" y="96" textAnchor="middle" className="fill-kind-d stroke-none text-[58px] font-extrabold">
          §
        </text>
        <path d="M146 40l-14 84M158 52l-10 60" className="opacity-60" />
      </svg>
    </section>
  );
}

// Actual feature dates from the repository history, never the mock's sample dates.
const recentMaterials = [
  { title: "Lista problemów z dostępnością", link: linkOptions({ to: "/praktyka/przed-i-po/lista" }), kind: "praktyka", date: "2026-10-10" },
  { title: "Strona przed i po poprawkach", link: linkOptions({ to: "/praktyka/przed-i-po" }), kind: "praktyka", date: "2026-10-10" },
  { title: "Lekcja: Punkty orientacyjne", link: linkOptions({ to: "/sciezki/$path/$lesson", params: { path: "programista", lesson: "punkty-orientacyjne" } }), kind: "sciezki", date: "2026-10-04" },
  { title: "Punkty orientacyjne i nagłówki", link: linkOptions({ to: "/praktyka/$slug", params: { slug: "punkty-orientacyjne-i-naglowki" } }), kind: "praktyka", date: "2026-10-04" },
] as const;

function Recent() {
  return <section className="recent-section" aria-labelledby="ostatnio">
    <div><h2 id="ostatnio">Ostatnio dodane</h2>
      <ul className="recent-grid">{recentMaterials.map(item => <li key={item.title} className={kinds[item.kind].className}>
        <Link {...item.link}>
          <span className="recent-icon"><KindIcon kind={item.kind} /></span>
          <span className="recent-content"><strong>{item.title}</strong><span className="recent-meta"><span className="recent-kind">{kinds[item.kind].label}</span><time dateTime={item.date}>{item.date.split("-").reverse().join(".")}</time></span></span>
          <Arrow />
        </Link>
      </li>)}</ul>
    </div>
    <div aria-hidden="true" className="little-steps"><p>Małe kroki<br />tworzą dużą<br />zmianę! <span>↗</span></p><svg viewBox="0 0 120 100"><g fill="none" stroke="var(--sun)" strokeWidth="4" strokeLinecap="round"><circle cx="65" cy="35" r="15" /><path d="M65 9V2m0 66v-7M91 35h9m-65 0h-9m57-18 6-6m-48 48 6-6m36 0 6 6m-48-48 6 6" /></g><path d="M45 90a18 18 0 0 1 5-35 23 23 0 0 1 43 3 15 15 0 0 1 7 29z" fill="var(--sky)" /></svg></div>
  </section>;
}
