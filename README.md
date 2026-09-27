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
> The project is in phase 2 (explanations). Every A and AA criterion of WCAG 2.2 has a plain-language explanation, marked as a draft until a person has checked it. AAA criteria get their content in phase 8. Prawo, Praktyka and Ścieżki are placeholders until later phases.

### What works today

- Home screen following design variant A ("Trzy drzwi"), with entry points to criteria, law and practice.
- Main navigation that wraps onto its own row on narrow screens instead of hiding behind a menu button.
- Light and dark mode. It follows the operating system by default, and the header toggle stores an explicit choice.
- Skip link, a stable landmark structure, and focus moved to the new `h1` with the page title announced after every client-side route change.
- **Criteria list** (`/kryteria`) with filters for WCAG version, level, principle and role. The filters are native radio buttons and checkboxes, their state lives in the URL, and the result count is announced to screen readers.
- **Criterion pages** (`/kryteria/1.4.3`) with a fixed section order, a "nowe w 2.2" badge for the nine new criteria, and 4.1.1 marked as removed in 2.2. Every page is prerendered to static HTML.
- **Explanations** for all 55 A and AA criteria: who it affects, how to meet it by role, typical errors, how to test it, common confusions. Drafts carry a visible "szkic, czeka na weryfikację" badge.
- **Normative text** in Polish from the authorized W3C translation of WCAG 2.1, collapsed on each criterion page. The criteria new in 2.2 link to their sources until a licensed Polish text is available.
- **Glossary** (`/slownik`) of about 30 terms, alphabetical, each with a plain explanation and, where WCAG defines the term, its normative wording. The first use of a term in a criterion links to it, with a small button that opens a short definition.
- **Search** (`/szukaj`, also on the home page) over criteria and the glossary. It finds criteria by number, name or symptom ("modal", "placeholder") and ignores Polish diacritics.

| Light | Dark | Mobile |
| --- | --- | --- |
| ![Home, light mode](docs/screenshots/home-light.png) | ![Home, dark mode](docs/screenshots/home-dark.png) | ![Home on a 390px wide screen](docs/screenshots/home-mobile.png) |

| Criteria list | Criterion page |
| --- | --- |
| ![Criteria list with version, level, principle and role filters](docs/screenshots/criteria-list.png) | ![Criterion page for 1.4.3 Kontrast (minimum) with a draft badge](docs/screenshots/criterion-page.png) |

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
  - `lastVerified`: the date of that check. Required with `zweryfikowane`, not allowed with `szkic`.
- **Sections** must use these `##` titles, in this order: Kogo to dotyczy, Jak to spełnić, Typowe błędy, Jak sprawdzić, Częste pomyłki. Use `###` inside a section, for example to split it by role. Every A and AA criterion needs the first four.
- **Glossary terms:** mark a term as `[nazwę](slownik:nazwa)`. The first use on a page becomes a link with a definition preview, later uses stay plain text. Terms are marked by hand because Polish inflection makes automatic matching unreliable.
- **Checks:** a file with a typo in a section title, an unknown key or glossary term, a summary that is too long, or a reference to a criterion that does not exist fails `pnpm test` and the build, with the file name and the reason. So does a missing A or AA explanation, and verified content older than 12 months.

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
| `pnpm test` | Runs the Vitest content and data tests, then builds the app and runs the Playwright suite: axe in light and dark mode, 44px target checks, and keyboard flows. |
| `pnpm import:wcag` | Regenerates the WCAG structure with Polish names. See [Where the criterion names come from](#where-the-criterion-names-come-from). |

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

The baseline is WCAG 2.2 Level AA, plus 2.3.3 and 2.5.5 at AAA. See [`docs/accessibility.md`](docs/accessibility.md). Because this is an app about accessibility, it also goes further in a few places:

- **1.4.6 Contrast (Enhanced), AAA.** Every text colour pair reaches at least 7:1 in both themes, and axe runs with the AAA rule set.
- **2.4.13 Focus Appearance, AAA.** A 3px solid outline on every focusable element, switched to the system `Highlight` colour in forced colours mode.
- **2.5.5 Target Size (Enhanced), AAA.** Interactive elements are at least 44 by 44 pixels, and a test checks this on every route.
- Zoom is never blocked, and no information is carried by colour alone.

> [!IMPORTANT]
> Automated checks catch only part of the problems. Before a release, walk through the app with NVDA and Firefox and with VoiceOver and Safari.

## Project structure

```text
content/
  kryteria/      one Markdown file per criterion
  slownik/       one Markdown file per glossary term
scripts/
  import-wcag.ts generates src/content/wcag.gen.ts and wcag-text.gen.ts
src/
  content/       WCAG structure, Markdown parsing and validation, server functions
  search/        search options, index builder and relevance tests
  routes/        file-based routes (__root.tsx holds the layout)
  components/    header, theme toggle, route announcer, badges, glossary previews
  styles.css     Tailwind setup, colour tokens, styles for rendered Markdown
e2e/             Playwright tests: axe, target size, keyboard
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
- [ ] **3. Examples.** Bad and good examples, with the bad one isolated in an iframe.
- [ ] **4. Legal module.** Polish acts, EN 301 549, the law-to-criterion mapping.
- [ ] **5. Accounts.** Optional progress, notes and bookmarks with Convex.
- [ ] **6. Paths and quizzes.**
- [ ] **7. Impairment simulators.**
- [ ] **8. AAA criteria and WCAG 3.0 tracking.**
