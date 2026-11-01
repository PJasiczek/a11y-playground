# Content authoring

[Back to the project README](../README.md)

### Editing content in Notion

All Markdown files of `content/` come from Notion and are not in git. Quizzes (`*.quiz.yaml`) and the HTML of examples, patterns and the before and after page stay in the repository.

- **Layout:** under the root page, one page per folder of `content/` (`kryteria`, `slownik`, `praktyka`…), and under it one page per file. The page title is the file name without `.md`: `1.4.3`, `problemy/01-jezyk`, and for folders `ikona-jako-przycisk` (its `index.md`) or `programista/nazwy-dostepne`.
- **Page content:** a YAML code block at the top with the frontmatter, then the text. Everything below describes the files as the import writes them.
- **Links:** glossary and law links are links to the live site in Notion, `https://www.a11y-playgrounds.site/slownik#fokus` and `…/prawo/ustawa-2019-848/art-5`, which the import turns back into `slownik:` and `prawo:` marks. Links authored on the former `https://a11y-playground-tau.vercel.app` host are also recognized during import. The code blocks of a before and after problem are `html` blocks whose first line is `<!-- przed -->` or `<!-- po -->`.
- **Publishing:** saving in Notion sends a webhook to `/api/notion-webhook`, which starts a Vercel deploy; the build imports the content and the change is live a few minutes later. A page that breaks a rule below fails the build, and the site keeps the last version that built. The reason is in the Vercel build log.

> [!NOTE]
> A new page must follow the title rule above, or the import stops with the title it could not read. `pnpm seed:notion` copied the original files into an empty root page once and refuses to run again.

To set up publishing on a new deploy:

1. In Vercel, add `NOTION_TOKEN` and `NOTION_ROOT_PAGE_ID` to the environment variables, create a deploy hook for `master` (Settings → Git → Deploy Hooks) and add its URL as `VERCEL_DEPLOY_HOOK_URL`. Redeploy.
2. In the Notion integration settings, add a webhook subscription to `https://<domain>/api/notion-webhook` for page events. Notion sends a verification token; the endpoint writes it to the Vercel function log.
3. Paste the token into Notion to verify the subscription, add it to Vercel as `NOTION_WEBHOOK_SECRET` and redeploy. From then on the endpoint accepts only requests signed with it.
4. In GitHub, add `NOTION_TOKEN` and `NOTION_ROOT_PAGE_ID` as Actions secrets, for CI.

### Standalone pages

`content/strony/<slug>.md`, the `strony` page in Notion: `prywatnosc`, the privacy policy at `/prywatnosc`, and `kontakt`, the contact page at `/kontakt`. The build fails without either. Each page has its own frontmatter schema in `src/content/pages.ts`, which rejects keys it does not list.

```markdown
---
title: Polityka prywatności
description: Jakie dane zbiera a11y playground, po co, i jak wycofać zgodę na statystyki odwiedzin.
updated: 2026-10-17   # shown as "Ostatnia zmiana"; change it with the text
---

## Kto odpowiada za dane

...
```

The contact page has one more key, and shows no date. Its `description` is also the lead under the heading:

```markdown
---
title: Kontakt
description: Masz pytanie o dostępność, widzisz błąd w treści albo przykład, który nie działa? Napisz do mnie.
updated: 2026-10-17
email: kontakt@przyklad.pl   # shown above the text; an invalid address fails the build
---

Odpowiadam zwykle w ciągu tygodnia.
```

A link whose text is its own address, like `[github.com/x](https://github.com/x)`, comes back from Notion as plain text, because Notion links anything that looks like a domain. Give links descriptive text.

### Criteria

Criterion names, levels, versions and normative text are generated. The explanations are written by hand in Markdown, one file per criterion in `content/kryteria/<id>.md`:

```markdown
---
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
  - `summary`: one sentence, up to 200 characters.
  - `roles`: any of `programista`, `projektant`, `autor treści`, `tester`.
  - `related`: other criterion numbers.
  - `keywords`: optional words people search with, not shown on the page.
  - `enhances` and `difference`: for an AAA criterion that tightens a lower-level one in the same guideline, its number and one line, up to 160 characters, on what changes. Always both or neither.
- **Sections** must use these `##` titles, in this order: Kogo to dotyczy, Jak to spełnić, Typowe błędy, Jak sprawdzić, Częste pomyłki. Use `###` inside a section, for example to split it by role. Every criterion needs the first four, except 4.1.1, which WCAG 2.2 removed.
- **Glossary terms:** mark a term as `[nazwę](slownik:nazwa)`. The first use on a page becomes a link with a definition preview, later uses stay plain text. Terms are marked by hand because Polish inflection makes automatic matching unreliable.
- **Checks:** a file with a typo in a section title, an unknown key or glossary term, a summary that is too long, or a reference to a criterion that does not exist fails `pnpm test` and the build, with the file name and the reason. So does a missing explanation, and an `enhances` that points at the same or a higher level or another guideline.

### Glossary entries

One file per term in `content/slownik/<slug>.md`. The slug is the anchor on `/slownik`.

```markdown
---
term: nazwa
also: [dostępna nazwa]
normative: nazwa
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

The simulation ids are code, in `src/content/simulations.ts`. What each kind of simulator shows is content, one file per kind in `content/symulatory/<kind>.md` (`barwy`, `slabe-widzenie`, `klawiatura`, `czytnik`, `waski-ekran`, `struktura`):

```markdown
---
title: Widzenie barw
summary: Kiedy kolor jest jedyną informacją, część osób tej informacji nie dostaje.
criteria: ["1.4.1", "1.4.11"]
examples: [formularz-z-bledami, kontrast-stanow]
limits: Nie pokazuje słabszych odmian zaburzeń.
---
Opis ogólny, pokazywany przy przykładach bez własnej notatki.
```

- `examples` become the "Wypróbuj na" links on `/symulatory`.
- `limits` is shown as "Czego to nie pokazuje" next to every simulation of that kind.
- The screen reader list is computed by a Vite plugin (`src/content/reading-order.vite.ts`) with jsdom and `dom-accessibility-api`, for each fragment after its script has run. A role without a Polish name fails `pnpm test`.
- The structure simulations run `src/content/structure.ts` inside the frame: it finds landmarks and headings the way HTML-AAM defines them (a `header` inside `main` is not a banner, a `section` needs a name), draws the outlines and posts the list to the page. The same module powers "Struktura strony" on the app's own pages, loaded on the first press.

### ARIA patterns

One folder per pattern in `content/wzorce/<slug>/`: `index.md` and `wzorzec.html`, the fragment the frame renders (markup, style and script, written by us, not copied from Deque).

```markdown
---
title: Rozwiń i zwiń
en: Expand/Collapse
batch: html
native: html-i-aria
summary: Przycisk, który pokazuje i chowa panel pod sobą.
criteria: ["4.1.2"]
preview: <span class="p-disclosure">Szczegóły zamówienia <b>+</b></span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Szczegóły zamówienia, przycisk, zwinięte
aria:
  - attr: aria-expanded
    on: przycisk
    selector: "#szczegoly-przycisk"
    meaning: Czy panel jest otwarty.
sources:
  apg: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
  deque: https://dequeuniversity.com/library/aria/expand-collapse
---
## Kiedy używać
## Typowe błędy
## Jak sprawdzić
```

- `batch` and `native` come from `src/content/pattern-labels.ts`: the batch it belongs to, and whether HTML is enough (`html`), needs a little ARIA (`html-i-aria`) or has nothing (`tylko-aria`).
- `steps` is the exercise. `hear` must be exactly what the live log says after one of `keys`, and the first step starts with Tab, which enters the frame. `pnpm test` presses the keys of every step in a real browser and fails if a step does not tick off.
- `aria` rows are the ARIA table; `selector` says which element the frame reads for the current value. `attr` must be one the frame can report.
- `examples` (optional) names practice examples that show the same thing broken.
- The live log is `src/content/pattern-log.ts`: it reads focus with the name, role, states and description, state changes of the focused element (attributes, native checkboxes, popovers) and live regions. It is bundled with `dom-accessibility-api` by a Vite plugin and inlined into every pattern document.

### Whole page before and after

`content/przed-i-po/` holds the two pages as complete HTML documents, `przed.html` and `po.html`, and one file per problem in `problemy/NN-slug.md`, numbered in page order.

```markdown
---
title: Podmenu otwiera się tylko pod myszą
criteria: ["2.1.1", "4.1.2"]
marker: podmenu
who: [klawiatura, czytnik, telefon]
axe: []
pattern: nawigacja-wielopoziomowa
---
## Problem
## Rozwiązanie
```

- `marker` names the element the problem sits on: `przed.html` carries it in a `data-problem` attribute (several, space-separated, on `<body>` for problems of the whole page). Every marker appears exactly once, and every `data-problem` belongs to a problem, or the build fails. The page served for checking has the attributes and comments stripped, so its source gives nothing away.
- `who` comes from `src/content/before-after-labels.ts`. `example` and `pattern` (optional) name the practice example and the ARIA pattern that show the same thing alone.
- `axe` lists the axe-core rules that report the problem. The e2e test fails unless the broken page reports exactly the rules all problems list together.
- The body ends with one ` ```przed ` and one ` ```po ` code block, shown side by side.

### WCAG 3.0

The tracking page reads `content/wcag3/`: `index.md` for the draft and the comparison, and one file per guideline group.

```markdown
---
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
- Bold in a summary gets the sun-coloured marker: use it for the one phrase that matters to the reader.
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
---
Wstęp do ścieżki.
```

- `lessons` sets the reading order and must name every lesson file in the folder exactly once. `role` is one of the four roles and is left out on the legal minimum path.
- A lesson has `title`, `summary`, `keep` (two to four lines for the "Zapamiętaj" box), and optional `criteria`, `examples` and `law` (article ids such as `ustawa-2019-848/art-10`). The body is Markdown with `##` headings and the same `slownik:` and `prawo:` links as elsewhere.

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
