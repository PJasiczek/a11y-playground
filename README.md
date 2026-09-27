<div align="center">

# a11y playground

**Learn WCAG in plain Polish: what a criterion says, what it looks like in code, and which law requires it.**

[![CI](https://github.com/PJasiczek/a11y-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/PJasiczek/a11y-playground/actions/workflows/ci.yml)
![WCAG 2.2 AA+](https://img.shields.io/badge/target-WCAG%202.2%20AA%20%2B%20selected%20AAA-2c36a8)
![TanStack Start](https://img.shields.io/badge/TanStack-Start-14171a)

[Overview](#overview) • [Getting started](#getting-started) • [Scripts](#scripts) • [Accessibility](#accessibility-of-the-app-itself) • [Roadmap](#roadmap)

</div>

## Overview

a11y playground is a learning app for people who build digital products in Poland. It connects three layers that today live in separate places: the WCAG standard, plain-language explanations with code examples, and the Polish and EU law that makes each criterion an obligation.

The interface is in Polish. This README is in English.

> [!NOTE]
> The project is in phase 0 (foundation). The app shell, navigation and accessibility tooling are in place. The Kryteria, Prawo, Praktyka and Ścieżki sections are placeholders until their content lands in later phases.

### What works today

- Home screen following design variant A ("Trzy drzwi"), with entry points to criteria, law and practice.
- Main navigation that wraps onto its own row on narrow screens instead of hiding behind a menu button.
- Light and dark mode. It follows the operating system by default, and the header toggle stores an explicit choice.
- Skip link, a stable landmark structure, and focus moved to the new `h1` with the page title announced after every client-side route change.

| Light | Dark | Mobile |
| --- | --- | --- |
| ![Home, light mode](docs/screenshots/home-light.png) | ![Home, dark mode](docs/screenshots/home-dark.png) | ![Home on a 390px wide screen](docs/screenshots/home-mobile.png) |

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

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the Vite dev server. |
| `pnpm build` | Builds the production app into `.output/`. |
| `pnpm preview` | Serves the production build locally. |
| `pnpm lint` | Runs ESLint (with `jsx-a11y` in strict mode) and the TypeScript compiler. |
| `pnpm test` | Builds the app and runs the Playwright suite: axe in light and dark mode, 44px target checks, and keyboard flows. |

CI runs `lint`, `build` and `test` on every pull request and on pushes to `master`.

## Tech stack

- [TanStack Start](https://tanstack.com/start) with file-based routes, on Vite and pnpm.
- [Tailwind CSS](https://tailwindcss.com) v4. Colour tokens live in `src/styles.css` as CSS variables using `light-dark()`, so themes and forced colours mode are handled in one place.
- Inter, self-hosted through `@fontsource-variable/inter`. Criterion numbers, article numbers and dates use the system monospace font.
- [Nitro](https://nitro.build) for the server build. It picks the Vercel preset automatically when the build runs on Vercel.
- [Playwright](https://playwright.dev) with [axe-core](https://github.com/dequelabs/axe-core) for end-to-end accessibility tests.

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
src/
  routes/        file-based routes (__root.tsx holds the layout)
  components/    header, theme toggle, route announcer
  styles.css     Tailwind setup and colour tokens
e2e/             Playwright tests: axe, target size, keyboard
docs/
  accessibility.md   the accessibility checklist
  design/            dated plans and mocks
  screenshots/       images used in this README
```

## Roadmap

The full plan, with content scope, architecture and risks, is in [`docs/design/2026-09-27-wcag-learning-app`](docs/design/2026-09-27-wcag-learning-app/wcag-learning-app.en.html) ([Polish version](docs/design/2026-09-27-wcag-learning-app/wcag-learning-app.pl.html)). Each phase ships on its own branch.

- [x] **0. Foundation.** App shell, navigation, themes, lint, tests, CI.
- [ ] **1. Content skeleton.** Criterion types and registry, criterion list with filters, criterion pages.
- [ ] **2. Explanations.** Plain-language content for every A and AA criterion, glossary, search.
- [ ] **3. Examples.** Bad and good examples, with the bad one isolated in an iframe.
- [ ] **4. Legal module.** Polish acts, EN 301 549, the law-to-criterion mapping.
- [ ] **5. Accounts.** Optional progress, notes and bookmarks with Convex.
- [ ] **6. Paths and quizzes.**
- [ ] **7. Impairment simulators.**
- [ ] **8. AAA criteria and WCAG 3.0 tracking.**
