<div align="center">

# a11y playground

**Learn WCAG in plain Polish: what a criterion says, what it looks like in code, and which law requires it.**

[![CI](https://github.com/PJasiczek/a11y-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/PJasiczek/a11y-playground/actions/workflows/ci.yml)
![WCAG 2.2 AA+](https://img.shields.io/badge/target-WCAG%202.2%20AA%20%2B%20selected%20AAA-2c36a8)
![TanStack Start](https://img.shields.io/badge/TanStack-Start-14171a)

[Overview](#overview) • [Getting started](#getting-started) • [Writing content](#writing-content) • [Scripts](#scripts) • [Accessibility](#accessibility-of-the-app-itself) • [Roadmap](#roadmap)

</div>

## Overview

a11y playground is a learning app for people who build digital products in Poland. It connects three layers that today live in separate places: the WCAG standard, plain-language explanations with code examples, and the Polish and EU law that makes each criterion an obligation.

The interface is in Polish. This README is in English.

> [!NOTE]
> The project is in phase 8 (AAA criteria and WCAG 3.0 tracking). Every criterion of WCAG 2.2, A to AAA, has a plain-language explanation, and `/wcag-3` tracks the WCAG 3.0 Working Draft with our mapping to today's criteria. Eleven common faults have a broken and a fixed example, each viewable through five simulators. Three Polish acts are in the app with the statute text and our summaries, and five learning paths walk through them lesson by lesson. All content is marked as a draft until a person has checked it. Phase 5 (accounts) is postponed, so progress is kept in the browser.

### What works today

- **Home page** following screen 0 of design variant A: it opens with the six cheapest fixes as cards, then the remaining examples as a list.
- Main navigation that wraps onto its own row on narrow screens instead of hiding behind a menu button.
- Light and dark mode. It follows the operating system by default, and the header toggle stores an explicit choice.
- Skip link, a stable landmark structure, and focus moved to the new `h1` with the page title announced after every client-side route change.
- **Criteria list** (`/kryteria`) with filters for WCAG version, level, principle and role. The filters are native radio buttons and checkboxes, their state lives in the URL, and the result count is announced to screen readers.
- **Criterion pages** (`/kryteria/1.4.3`) with a fixed section order, a "nowe w 2.2" badge for the nine new criteria, and 4.1.1 marked as removed in 2.2. Every page is prerendered to static HTML.
- **Explanations** for all 86 criteria of WCAG 2.2, A, AA and AAA: who it affects, how to meet it by role, typical errors, how to test it, common confusions. 4.1.1 gets a short page on why 2.2 removed it and why the 2019 act still lists it. Drafts carry a visible "szkic, czeka na weryfikację" badge.
- **AAA criteria** say "Poziom AAA: cel, nie obowiązek" under the summary, and each one's "Jak to spełnić" says when it pays off. Thirteen of them tighten an AA criterion, and their page compares the two side by side with the difference in one line (`/kryteria/1.4.6` against 1.4.3); the AA page links to its stronger version. Where this app meets an AAA criterion (1.4.6, 2.3.3, 2.4.13, 2.5.5), the page says so and how a test checks it.
- **WCAG 3.0** (`/wcag-3`, in the main navigation): the status of the Working Draft of 10 September 2026 under a "wersja robocza W3C" badge, with the date we last compared it with w3.org, a table of how 3.0 differs from 2.2, and one table of all 46 guidelines in 12 groups with the 2.2 criteria that correspond to them today, or "Nowe w 3.0". The mapping is ours and the page says so. A filter (`?pokaz=nowe`) shows only what is new in 3.0, and every criterion page links to its guidelines.
- **Normative text** in Polish from the authorized W3C translation of WCAG 2.1, collapsed on each criterion page. The criteria new in 2.2 link to their sources until a licensed Polish text is available.
- **Glossary** (`/slownik`) of about 30 terms, alphabetical, each with a plain explanation and, where WCAG defines the term, its normative wording. The first use of a term in a criterion links to it, with a small button that opens a short definition.
- **Search** (`/szukaj`, also on the home page) over criteria, examples, provisions, lessons, WCAG 3.0 guidelines and the glossary. It finds criteria by number, name or symptom ("modal", "placeholder"), articles by topic ("deklaracja dostępności"), and ignores Polish diacritics.
- **Practice** (`/praktyka`): eleven examples as cards ordered by the cost of the fix, each with what the user gains. An example page (`/praktyka/ikona-jako-przycisk`) shows the broken and the fixed variant one above the other, each running in a sandboxed iframe, with its code and what a screen reader says. Examples that move start only when the reader asks. Criterion pages link to their examples.
- **Simulators** on every example page: a list beside the frames switches both variants to colour vision deficiency (four types), low vision, keyboard only, screen reader, 320 pixels wide or text at 200%. The choice lives in `?symulacja=`, and none is on by default. Each one puts text next to the frames, so no simulator is the only way to get the information: what the simulation shows and what it does not, the numbered focus steps and blocked mouse clicks, a table of what a screen reader reads in both variants (computed at build time), or whether the content fits in 320 pixels, measured in the frame.
- **Simulators page** (`/symulatory`): what each simulator shows, its limits, the criteria it teaches, and links into the examples with the simulation already picked.
- **Law** (`/prawo`): the 2019 digital accessibility act in full, the parts of the 2019 special needs act and the 2024 products and services act (the Polish EAA) that create digital obligations, and a page on EN 301 549. An article page (`/prawo/ustawa-2019-848/art-5`) shows each ustęp next to our summary. Every act says which consolidated text it comes from, when it was downloaded, and whether it was amended after that text.
- **What applies to me** (`/mapowanie`): pick a website or app of a public body, or a product or service of a company, and every deadline appears on one timeline, with the ones for your situation highlighted and the criteria behind them in a table.
- **Law on criterion pages:** the "Prawo" section says, for each situation, whether a provision requires the criterion, which one, and since when, or why nothing does (AAA, new in 2.2, excluded for apps).
- **Paths** (`/sciezki`): five ordered sets of lessons, for the developer, the designer, the content author, the tester, and the legal minimum for a public body. 29 lessons, each with a "Zapamiętaj" box, links to the criteria, examples and provisions it covers, and a quiz at the end. Paths are ungated: the quiz never blocks the next lesson. Criterion pages link to the lessons that teach them.
- **Quizzes** show one question at a time. "Sprawdź" explains every option, right or wrong, and announces the verdict to screen readers without moving focus; "Następne pytanie" moves focus to the next question. The score shows at the end.
- **Progress** (lessons marked done, the last quiz score) is stored in `localStorage` under one key, in the shape planned for the Convex tables, so accounts can import it later. `/sciezki` says so and offers "Wyczyść postęp". With storage blocked, progress lasts until the tab closes.

| Light | Dark | Mobile |
| --- | --- | --- |
| ![Home, light mode](docs/screenshots/home-light.png) | ![Home, dark mode](docs/screenshots/home-dark.png) | ![Home on a 390px wide screen](docs/screenshots/home-mobile.png) |

| Criteria list | Criterion page |
| --- | --- |
| ![Criteria list with version, level, principle and role filters](docs/screenshots/criteria-list.png) | ![Criterion page for 1.4.3 Kontrast (minimum) with a draft badge](docs/screenshots/criterion-page.png) |

| Practice | Example page |
| --- | --- |
| ![Practice catalogue with cards ordered by the cost of the fix](docs/screenshots/practice.png) | ![Example page with the simulator list beside the broken and the fixed variant](docs/screenshots/example-page.png) |

| Colour vision | Screen reader | Simulators |
| --- | --- | --- |
| ![The form example through deuteranopia after a wrong address: the broken field's red border turns olive, the fixed one still says Błąd](docs/screenshots/simulation-colour.png) | ![Table of what a screen reader reads in both variants, differing rows marked](docs/screenshots/simulation-reader.png) | ![The simulators page with a card per simulator](docs/screenshots/simulators.png) |

| Article page | What applies to me | Law on a criterion page |
| --- | --- | --- |
| ![Article 5 of the digital accessibility act, each ustęp next to its summary](docs/screenshots/law-article.png) | ![Deadlines on one timeline with the app of a public body picked](docs/screenshots/obligations.png) | ![The Prawo section of 1.4.3 as a table by situation](docs/screenshots/criterion-law.png) |

| Paths | Path page | Lesson quiz |
| --- | --- | --- |
| ![Five paths with progress on the developer and designer paths](docs/screenshots/paths.png) | ![Developer path syllabus with three lessons done and quiz scores](docs/screenshots/path.png) | ![A checked quiz question with an explanation under every option](docs/screenshots/lesson-quiz.png) |

| AAA criterion | WCAG 3.0 | New in WCAG 3.0 |
| --- | --- | --- |
| ![Criterion 1.4.6 compared with 1.4.3, with the AAA note and the difference in one line](docs/screenshots/criterion-aaa.png) | ![The WCAG 3.0 page with the working draft badge, the dates and the comparison with 2.2](docs/screenshots/wcag3.png) | ![The WCAG 3.0 mapping filtered to guidelines new in 3.0](docs/screenshots/wcag3-mapping.png) |

| Glossary preview | Glossary | Search |
| --- | --- | --- |
| ![Definition preview opened next to a term on a criterion page](docs/screenshots/glossary-preview.png) | ![Glossary page with the letter index](docs/screenshots/glossary.png) | ![Search results for kontrast](docs/screenshots/search.png) |

## Getting started

You need [Node.js](https://nodejs.org) 24 or newer and [pnpm](https://pnpm.io) 11.

```bash
pnpm install
pnpm dev
```

The dev server prints its local URL. To run the end-to-end tests locally, install the browser once:

```bash
pnpm exec playwright install chromium
```

## Writing content

Criterion names, levels, versions and normative text are generated. The explanations are written by hand in Markdown, one file per criterion in `content/kryteria/<id>.md`:

```markdown
---
status: szkic
summary: Tekst musi odcinać się od tła w stosunku co najmniej 4,5 do 1.
roles: [projektant, programista]
related: ["1.4.6", "1.4.11"]
keywords: [szary tekst, placeholder]
---

## Kogo to dotyczy

Osoby po czterdziestce, którym spada wrażliwość na kontrast. Kryterium mierzy [współczynnik kontrastu](slownik:wspolczynnik-kontrastu).

## Jak to spełnić

### Projektant

- Sprawdź kontrast na etapie palety, nie po wdrożeniu.
```

- **Frontmatter:**
  - `status`: `szkic` for a draft, `zweryfikowane` once a person has checked it against the sources.
  - `summary`: one sentence, up to 200 characters.
  - `roles`: any of `programista`, `projektant`, `autor treści`, `tester`.
  - `related`: other criterion numbers.
  - `keywords`: optional words people search with, not shown on the page.
  - `enhances` and `difference`: for an AAA criterion that tightens a lower-level one in the same guideline, its number and one line, up to 160 characters, on what changes. Always both or neither.
  - `lastVerified`: the date of that check. Required with `zweryfikowane`, not allowed with `szkic`.
- **Sections** must use these `##` titles, in this order: Kogo to dotyczy, Jak to spełnić, Typowe błędy, Jak sprawdzić, Częste pomyłki. Use `###` inside a section, for example to split it by role. Every criterion needs the first four, except 4.1.1, which WCAG 2.2 removed.
- **Glossary terms:** mark a term as `[nazwę](slownik:nazwa)`. The first use on a page becomes a link with a definition preview, later uses stay plain text. Terms are marked by hand because Polish inflection makes automatic matching unreliable.
- **Checks:** a file with a typo in a section title, an unknown key or glossary term, a summary that is too long, or a reference to a criterion that does not exist fails `pnpm test` and the build, with the file name and the reason. So does a missing explanation, an `enhances` that points at the same or a higher level or another guideline, and verified content older than 12 months.

To verify a draft, check it against the normative text and the W3C Understanding document, then change `status` to `zweryfikowane` and add `lastVerified`.

### Glossary entries

One file per term in `content/slownik/<slug>.md`. The slug is the anchor on `/slownik`.

```markdown
---
term: nazwa
also: [dostępna nazwa]
normative: nazwa
status: szkic
---
To, co czytnik ekranu powie o kontrolce, zanim powie, czym ona jest.
```

`also` lists everyday names, shown under the term and matched by search. `normative` names the term in the WCAG 2.1 glossary; its definition is imported, not typed.

> [!NOTE]
> Later the content will be edited in Notion. A sync script will write these same files, so this format stays the contract between editors and the app.

### Examples

One folder per example in `content/praktyka/<slug>/`:

```text
content/praktyka/ikona-jako-przycisk/
  index.md    frontmatter and introduction
  bad.html    the broken fragment
  good.html   the fixed fragment
```

```markdown
---
title: Ikona jako przycisk
summary: Znak × bez nazwy zamyka komunikat. Daj przyciskowi nazwę.
criteria: ["4.1.2", "2.1.1", "1.1.1"]
effort: 1 linia
gain: Czytnik mówi „Zamknij komunikat, przycisk” zamiast milczeć.
preview: <span class="p-x">×</span>
status: szkic
bad:
  why: Znak × w elemencie div z obsługą kliknięcia.
  announces: Nic sensownego.
  axe: []
good:
  why: Prawdziwy element button z nazwą w aria-label.
  announces: „Zamknij komunikat, przycisk”.
---
Komunikat „Zapisano zmiany” z przyciskiem zamykania w rogu.
```

- `effort` is one of `1 linia`, `1 token`, `2 minuty`, `15 minut`, `refaktor`. The catalogue and the home page sort by it.
- `preview` is a small static picture of the fault for the card, built from the `p-*` classes in `src/styles.css`. It is decorative and hidden from screen readers, so `summary` and `gain` must carry the meaning.
- `motion: true` makes both variants load only after "Uruchom przykład".
- `simulations` optionally maps a simulation id (`deuteranopia`, `klawiatura`, `320px`...) to a note on what it shows on this example. Without a note the page shows the simulator's general description.
- `bad.axe` lists the axe rules the broken fragment must trigger. Leave it empty when axe cannot see the fault. The tests fail if the fragment does not trigger them.
- The HTML files are fragments with optional `<style>` and `<script>`. The page shows them as the code, and `/demo/<slug>/bad` and `/demo/<slug>/good` serve them as documents for the sandboxed iframes.

A broken example is broken on purpose, but it runs inside our page. It must never:

- trap keyboard focus with no way out,
- play sound, move or flash before the reader starts it, or flash more than three times a second,
- load anything from the network or navigate away.

The tests check that every fixed fragment passes axe, that every page passes axe with the broken iframe excluded, and that nothing from a broken fragment reaches the page's own document.

### Simulators

The simulation ids are code, in `src/content/simulations.ts`. What each kind of simulator shows is content, one file per kind in `content/symulatory/<kind>.md` (`barwy`, `slabe-widzenie`, `klawiatura`, `czytnik`, `waski-ekran`):

```markdown
---
title: Widzenie barw
summary: Kiedy kolor jest jedyną informacją, część osób tej informacji nie dostaje.
criteria: ["1.4.1", "1.4.11"]
examples: [formularz-z-bledami, kontrast-stanow]
limits: Nie pokazuje słabszych odmian zaburzeń.
status: szkic
---
Opis ogólny, pokazywany przy przykładach bez własnej notatki.
```

- `examples` become the "Wypróbuj na" links on `/symulatory`.
- `limits` is shown as "Czego to nie pokazuje" next to every simulation of that kind.
- The screen reader list is computed by a Vite plugin (`src/content/reading-order.vite.ts`) with jsdom and `dom-accessibility-api`, for each fragment after its script has run. A role without a Polish name fails `pnpm test`.

### WCAG 3.0

The tracking page reads `content/wcag3/`: `index.md` for the draft and the comparison, and one file per guideline group.

```markdown
---
status: szkic
draft: 2026-09-10
draftUrl: https://www.w3.org/TR/2026/WD-wcag-3.0-20260910/
checked: 2026-10-01
compare:
  - topic: Poziomy
    wcag2: A, AA, AAA
    wcag3: Wymagania podstawowe (core) i uzupełniające (supplemental), bez liter
---
Status of the draft, in plain words.
```

```yaml
# content/wcag3/obrazy-i-multimedia.md (frontmatter only)
num: "2.1"
title: Obrazy i multimedia
en: Images and media
status: szkic
guidelines:
  - num: "2.1.1"
    en: Image alternatives
    title: Alternatywy dla obrazów
    criteria: ["1.1.1"]
  - num: "2.1.9"
    en: Accessible media player
    title: Dostępny odtwarzacz
    criteria: []
    note: Twierdzenie o wyborze dostępnego odtwarzacza, a nie wymaganie wobec samej treści.
```

- `draft` is the date of the Working Draft the content describes, `checked` the day we last compared the content with the draft current on w3.org. When `checked` is more than six months old, `pnpm test` fails: read the latest draft, update the files, and move the date.
- A guideline with empty `criteria` shows as "Nowe w 3.0"; `note` says in one line what it asks. Guideline numbers must sit inside their group, criteria must exist, and a group file has no text after the frontmatter.

> [!WARNING]
> The mapping is our judgement, not a W3C equivalence. Write "corresponds today", never "replaces".

### Acts

The statute text is generated; the summaries are written by hand, one file per act in `content/prawo/<act>.md`:

```markdown
---
status: szkic
short: Ustawa o dostępności cyfrowej
summary: Strony i aplikacje podmiotów publicznych muszą spełniać kryteria z załącznika.
binds: Podmioty publiczne, ich strony internetowe i aplikacje mobilne.
deadlines:
  - date: 2021-06-23
    what: Aplikacje mobilne muszą spełniać wymagania.
    unit: art-27
    situations: [aplikacja-publiczna]
    start: true
---
Wprowadzenie do ustawy.

## Art. 5. Wymagania

### ust. 1

Strona i aplikacja muszą spełniać **wymagania z załącznika**.
```

- `deadlines` feed the timeline. `unit` is the article the date comes from, `situations` are any of `strona-publiczna`, `aplikacja-publiczna`, `produkt-ue`, `start: true` marks the date shown as "od" on criterion pages, and `yearly: true` a date that repeats every year.
- Each `## Art. N. Title` section summarises one article; the title is ours and optional. `### ust. N` sections pair a summary with one ustęp in the parallel view. `## Załącznik` covers the annex.
- Bold in a summary gets the yellow marker: use it for the one phrase that matters to the reader.
- Link a provision as `[art. 5](prawo:ustawa-2019-848/art-5)`, optionally with `#ust-3`. Unknown acts, articles and ustępy fail the build.

Which provision requires which criterion lives in `src/content/legal-map.ts`, typed against both the criterion and the article ids. A test checks that no act requires an AAA criterion or one new in 2.2.

### Paths and quizzes

One folder per path in `content/sciezki/<path>/`:

```text
content/sciezki/programista/
  index.md                       the path: frontmatter and introduction
  klawiatura-i-fokus.md          a lesson
  klawiatura-i-fokus.quiz.yaml   its quiz
```

```markdown
---
title: Programista
role: programista
summary: Jak pisać kod, który działa z klawiaturą i czytnikiem ekranu.
lessons: [semantyka-najpierw, nazwy-dostepne, klawiatura-i-fokus]
status: szkic
---
Wstęp do ścieżki.
```

- `lessons` sets the reading order and must name every lesson file in the folder exactly once. `role` is one of the four roles and is left out on the legal minimum path.
- A lesson has `title`, `summary`, `keep` (two to four lines for the "Zapamiętaj" box), `status`, and optional `criteria`, `examples` and `law` (article ids such as `ustawa-2019-848/art-10`). The body is Markdown with `##` headings and the same `slownik:` and `prawo:` links as elsewhere.

```yaml
- id: div-jako-przycisk
  prompt: Które kryterium łamie ten kod?
  code: |
    <div class="btn" onclick="zapisz()">Zapisz</div>
  options:
    - criterion: "2.1.1"
      correct: true
      why: Div nie dostaje fokusu i nie reaguje na Enter ani spację.
    - text: Żadne, to tylko styl
      why: Bez myszy nie da się zapisać.
```

- A quiz has three to five questions. An option is either `text` or a `criterion`, whose number and Polish name come from the registry. Every option needs `why`, shown after checking.
- One correct option makes a single-choice question with radio buttons, more than one makes a "select all that apply" question with checkboxes. There is no type field to keep in sync.
- Quote option text that YAML would read as a number or contains `: `, for example `text: "42"`.

Unknown criteria, examples or articles, a lesson missing from `lessons`, a missing quiz, or a question without a correct answer fail `pnpm test` and the build.

### Where the statute text comes from

`pnpm import:legal` regenerates `src/content/legal.gen.ts` (acts and the article index) and `src/content/legal-text.gen.ts` (the text, server only) from the [Sejm ELI API](https://api.sejm.gov.pl/eli), the data behind ISAP. `scripts/import-legal.ts` pins the consolidated text each act is read from. When an act was amended after that text, the import warns and the act page says so. The annex to the 2019 act exists only as a PDF table, so it is transcribed by hand in `src/content/annex-2019-848.ts` and pinned by a test.

> [!CAUTION]
> The legal module is educational material, not legal advice. Every legal page says so and shows the date the text was downloaded.

### Where the criterion names come from

`pnpm import:wcag` regenerates `src/content/wcag.gen.ts` and `src/content/wcag-text.gen.ts`. It takes numbers, levels and versions from the W3C WCAG 2.2 data. Polish names come from two sources:

- the [authorized W3C translation of WCAG 2.1](https://www.w3.org/Translations/WCAG21-pl/),
- for the nine criteria new in 2.2, the [unofficial IRDPL translation](https://wcag.irdpl.pl/guidelines/22/), because there is no authorized Polish translation of 2.2 yet. Each criterion page says which source its name comes from.

The normative text of criteria and the glossary definitions come only from the authorized 2.1 translation. Text from IRDPL will be quoted once IRDPL confirms the licence.

Run the import by hand and review the diff of the generated files in a PR.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the Vite dev server. |
| `pnpm build` | Builds the production app into `.output/`. |
| `pnpm preview` | Serves the production build locally. |
| `pnpm lint` | Runs ESLint (with `jsx-a11y` in strict mode) and the TypeScript compiler. |
| `pnpm test` | Runs the Vitest content and data tests, then builds the app and runs the Playwright suite: axe in light and dark mode, 44px target checks, no running animations, and keyboard flows. |
| `pnpm import:wcag` | Regenerates the WCAG structure with Polish names. See [Where the criterion names come from](#where-the-criterion-names-come-from). |
| `pnpm import:legal` | Regenerates the statute text of the acts. See [Where the statute text comes from](#where-the-statute-text-comes-from). |

CI runs `lint`, `build` and `test` on every pull request and on pushes to `master`.

## Tech stack

- [TanStack Start](https://tanstack.com/start) with file-based routes, on Vite and pnpm.
- [Tailwind CSS](https://tailwindcss.com) v4. Colour tokens live in `src/styles.css` as CSS variables using `light-dark()`, so themes and forced colours mode are handled in one place.
- Inter, self-hosted through `@fontsource-variable/inter`. Criterion numbers, article numbers and dates use the system monospace font.
- [Nitro](https://nitro.build) for the server build. It picks the Vercel preset automatically when the build runs on Vercel.
- [ArkType](https://arktype.io) to validate content files and URL filters, [marked](https://marked.js.org) to render Markdown on the server.
- [MiniSearch](https://lucaong.github.io/minisearch/) for search. The index is built at prerender time into a static `/search-index.json`, loaded only on `/szukaj`.
- [Vitest](https://vitest.dev) for content tests, [Playwright](https://playwright.dev) with [axe-core](https://github.com/dequelabs/axe-core) for end-to-end accessibility tests.

## Accessibility of the app itself

The baseline is WCAG 2.2 Level AA, plus 2.3.3 and 2.5.5 at AAA. See [`docs/accessibility.md`](docs/accessibility.md). Because this is an app about accessibility, it also goes further in a few places, and the pages of these AAA criteria say so ("Ta aplikacja to spełnia", from `src/content/app-meets.ts`):

- **1.4.6 Contrast (Enhanced), AAA.** Every text colour pair reaches at least 7:1 in both themes, and axe runs with the AAA rule set.
- **2.3.3 Animation from Interactions, AAA.** The interface does not animate, and a test checks that no page runs an animation. Examples that move start only on request.
- **2.4.13 Focus Appearance, AAA.** A 3px solid outline on every focusable element, switched to the system `Highlight` colour in forced colours mode. A keyboard test checks the outline at every Tab stop of a criterion page.
- **2.5.5 Target Size (Enhanced), AAA.** Interactive elements are at least 44 by 44 pixels, and a test checks this on every route.
- Zoom is never blocked, and no information is carried by colour alone.

> [!IMPORTANT]
> Automated checks catch only part of the problems. Before a release, walk through the app with NVDA and Firefox and with VoiceOver and Safari.

## Project structure

```text
content/
  kryteria/      one Markdown file per criterion
  slownik/       one Markdown file per glossary term
  praktyka/      one folder per example: index.md, bad.html, good.html
  prawo/         one Markdown file per act: summaries and deadlines
  sciezki/       one folder per learning path: lessons and their quizzes
  symulatory/    one Markdown file per kind of simulator
  wcag3/         the WCAG 3.0 draft overview and one file per guideline group
scripts/
  import-wcag.ts   generates src/content/wcag.gen.ts and wcag-text.gen.ts
  import-legal.ts  generates src/content/legal.gen.ts and legal-text.gen.ts
src/
  content/       WCAG structure, the WCAG 3.0 mapping, acts and the legal mapping, Markdown parsing and validation, server functions
  search/        search options, index builder and relevance tests
  progress/      reading progress and quiz scores in localStorage
  routes/        file-based routes (__root.tsx holds the layout)
  components/    header, theme toggle, route announcer, badges, filter chips, the AAA comparison, glossary previews, example frames and cards, the simulator list, the quiz
  styles.css     Tailwind setup, colour tokens, styles for rendered Markdown
e2e/             Playwright tests: axe, target size, animations, keyboard, example isolation, simulators, a whole path from the keyboard, WCAG 3.0
docs/
  accessibility.md   the accessibility checklist
  design/            dated plans and mocks
  screenshots/       images used in this README
```

## Roadmap

The full plan, with content scope, architecture and risks, is in [`docs/design/2026-09-27-wcag-learning-app`](docs/design/2026-09-27-wcag-learning-app/wcag-learning-app.en.html) ([Polish version](docs/design/2026-09-27-wcag-learning-app/wcag-learning-app.pl.html)). Each phase ships on its own branch.

- [x] **0. Foundation.** App shell, navigation, themes, lint, tests, CI.
- [x] **1. Content skeleton.** WCAG structure with Polish names, Markdown content format, criteria list with filters, prerendered criterion pages.
- [x] **2. Explanations.** Plain-language drafts for every A and AA criterion, normative text, glossary, search, role filter. Detailed plan: [`docs/design/2026-09-27-phase-2-content`](docs/design/2026-09-27-phase-2-content/phase-2-content.en.html).
- [x] **3. Examples.** Ten bad and good examples in sandboxed iframes, the practice catalogue, and the home page built from it. Detailed plan: [`docs/design/2026-09-27-phase-3-examples`](docs/design/2026-09-27-phase-3-examples/phase-3-examples.en.html).
- [x] **4. Legal module.** Three Polish acts with the statute text and summaries, EN 301 549, the law-to-criterion mapping, the obligations timeline. Detailed plan: [`docs/design/2026-09-28-phase-4-legal`](docs/design/2026-09-28-phase-4-legal/phase-4-legal.en.html).
- [ ] **5. Accounts.** Optional progress, notes and bookmarks with Convex. Postponed; phase 6 went first with progress in the browser.
- [x] **6. Paths and quizzes.** Five learning paths, 29 lessons with quizzes, progress in `localStorage`. Detailed plan: [`docs/design/2026-09-29-phase-6-paths`](docs/design/2026-09-29-phase-6-paths/phase-6-paths.en.html).
- [x] **7. Impairment simulators.** Colour vision, low vision, keyboard only, screen reader and narrow screen on every example, each with a text alternative, and `/symulatory`. Detailed plan: [`docs/design/2026-09-29-phase-7-simulators`](docs/design/2026-09-29-phase-7-simulators/phase-7-simulators.en.html).
- [x] **8. AAA criteria and WCAG 3.0 tracking.** Explanations for the 31 AAA criteria and 4.1.1, the comparison with the AA criterion each one tightens, and `/wcag-3` with the guideline mapping. Detailed plan: [`docs/design/2026-10-01-phase-8-aaa-wcag3`](docs/design/2026-10-01-phase-8-aaa-wcag3/phase-8-aaa-wcag3.en.html).
