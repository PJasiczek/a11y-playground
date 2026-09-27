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
> The project is in phase 1 (content skeleton). All 86 WCAG 2.2 criteria are listed and have their own page, but most pages are still empty sections. Explanations arrive in phase 2. Prawo, Praktyka and Ścieżki are placeholders until later phases.

### What works today

- Home screen following design variant A ("Trzy drzwi"), with entry points to criteria, law and practice.
- Main navigation that wraps onto its own row on narrow screens instead of hiding behind a menu button.
- Light and dark mode. It follows the operating system by default, and the header toggle stores an explicit choice.
- Skip link, a stable landmark structure, and focus moved to the new `h1` with the page title announced after every client-side route change.
- **Criteria list** (`/kryteria`) with filters for WCAG version, level and principle. The filters are native radio buttons and checkboxes, their state lives in the URL, and the result count is announced to screen readers.
- **Criterion pages** (`/kryteria/1.4.3`) with a fixed section order, a "nowe w 2.2" badge for the nine new criteria, and 4.1.1 marked as removed in 2.2. Every page is prerendered to static HTML.

| Light | Dark | Mobile |
| --- | --- | --- |
| ![Home, light mode](docs/screenshots/home-light.png) | ![Home, dark mode](docs/screenshots/home-dark.png) | ![Home on a 390px wide screen](docs/screenshots/home-mobile.png) |

| Criteria list | Criterion page |
| --- | --- |
| ![Criteria list with version, level and principle filters](docs/screenshots/criteria-list.png) | ![Criterion page for 1.4.3 Kontrast (minimum)](docs/screenshots/criterion-page.png) |

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

Criterion names, levels and versions are generated. The explanations are written by hand in Markdown, one file per criterion in `content/kryteria/<id>.md`:

```markdown
---
summary: Tekst musi odcinać się od tła w stosunku co najmniej 4,5 do 1.
roles: [projektant, programista]
related: ["1.4.6", "1.4.11"]
lastVerified: 2026-09-27
---

## Kogo to dotyczy

Osoby po czterdziestce, którym spada wrażliwość na kontrast.

## Jak to spełnić

### Projektant

- Sprawdź kontrast na etapie palety, nie po wdrożeniu.
```

- **Frontmatter:**
  - `summary`: one sentence, up to 200 characters.
  - `roles`: any of `programista`, `projektant`, `autor treści`, `tester`.
  - `related`: other criterion numbers.
  - `lastVerified`: date of the last check against the sources.
- **Sections** must use these `##` titles, in this order: Kogo to dotyczy, Jak to spełnić, Typowe błędy, Jak sprawdzić, Częste pomyłki. Leave out any you have not written yet. Use `###` inside a section, for example to split it by role.
- **Checks:** a file with a typo in a section title, an unknown key, a summary that is too long, or a reference to a criterion that does not exist fails `pnpm test` and the build, with the file name and the reason.

> [!NOTE]
> Later the content will be edited in Notion. A sync script will write these same files, so this format stays the contract between editors and the app.

### Where the criterion names come from

`pnpm import:wcag` regenerates `src/content/wcag.gen.ts`. It takes numbers, levels and versions from the W3C WCAG 2.2 data. Polish names come from two sources:

- the [authorized W3C translation of WCAG 2.1](https://www.w3.org/Translations/WCAG21-pl/),
- for the nine criteria new in 2.2, the [unofficial IRDPL translation](https://wcag.irdpl.pl/guidelines/22/), because there is no authorized Polish translation of 2.2 yet. Each criterion page says which source its name comes from.

Run the import by hand and review the diff of the generated file in a PR.

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
scripts/
  import-wcag.ts generates src/content/wcag.gen.ts
src/
  content/       WCAG structure, Markdown parsing and validation, server functions
  routes/        file-based routes (__root.tsx holds the layout)
  components/    header, theme toggle, route announcer, level badges
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
- [ ] **2. Explanations.** Plain-language content for every A and AA criterion, glossary, search.
- [ ] **3. Examples.** Bad and good examples, with the bad one isolated in an iframe.
- [ ] **4. Legal module.** Polish acts, EN 301 549, the law-to-criterion mapping.
- [ ] **5. Accounts.** Optional progress, notes and bookmarks with Convex.
- [ ] **6. Paths and quizzes.**
- [ ] **7. Impairment simulators.**
- [ ] **8. AAA criteria and WCAG 3.0 tracking.**
