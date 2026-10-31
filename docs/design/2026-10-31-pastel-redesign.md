# Pastel playground redesign - 2026-10-31

## Authority and review

The supplied pastel playground image supersedes the October 17-18 centred hero and vertical xylophone variants. DESIGN.md is the current shared contract. Existing uncommitted branch work was preserved.

Review scope: all modified source files, shared components, route families, tests, design plans and screenshot inventory. Main discrepancies: centred hero, tall vertical keys, purple-black text, hard shadows and missing inherited section colours on inner pages.

## Implementation coverage

- Home: split hero, real search form, six linked blocks with decorative SVG playground, curated starter cards, interactive contrast example, all seven categories and a quote, paths beside law, accessibility commitments.
- Shared shell: cream ground, navy typography, pastel surfaces, rounded depth, responsive desktop header and existing phone dock, footer, consent and structure tool.
- Criteria: blue catalogue, filters, details, normative sections and related content.
- Practice: orange examples, patterns and before/after. Isolated educational frames preserve intentional failures.
- Law: purple index, acts, articles, EN standard and obligations mapping.
- Learning: green paths, lessons, saved progress and quizzes.
- Simulators: pink controls and previews. Glossary: yellow. WCAG 3: teal.
- Search, contact, privacy and missing pages: neutral surfaces with the shared typography and controls.

Root route classification applies the section tokens across every nested page. Actual content counts remain authoritative; the reference does not justify fabricated popularity statistics or publication dates.

## Acceptance

Run lint/TypeScript, unit tests, production build and existing functional/accessibility tests. Inspect home and representative inner pages on desktop/mobile, light/dark, keyboard and calm mode. Check horizontal overflow and reduced motion. Record actual outcomes below.

## Fidelity limits

The hero uses a native decorative SVG slide, clouds and plants rather than the reference's 3D character. Labels and links remain HTML. Historical screenshots document the previous iteration, not validation of the current design.

## Validation results

- ESLint and TypeScript: passed.
- Vitest: 24 files, 409 tests passed.
- Production Vite build and prerender: completed. Existing bundler chunk-size/directive warnings remain.
- Broad functional run: 337 tests passed; four consent tests required rebuilding with the test analytics ID.
- Final production run after fixes: all 154 tests passed (all-route light/dark axe scans, target sizes, no idle animation, keyboard, phone navigation, paths, consent and responsive regression).
- New responsive checks pass at 320, 390, 768 and 1440 pixels, with all category destinations present and no horizontal overflow.
- Browser inspection: home on phone/desktop, dark theme, and criterion detail. The desktop header stays on one row; mobile retains the dock.

## Second pass: complete home reference

The user explicitly requested the entire composition and artwork. This supersedes the SVG fidelity limit above. The hero now uses an imagegen-derived transparent rendered scene with character, slide, swing and scenery, plus accessible HTML labels on the blank blocks. A second generated asset supplies the purple statute books. All eight home regions, a dated recent-materials list sourced from repository feature history, numbered learning cards, medallions, pastel surfaces and compact footer follow the reference. DESIGN.md has been rewritten around that authority. Asset prompts are in 2026-10-31-pastel-assets.md.

Accessibility deviations are intentional: darker headline gradient, 12px minimum compact text, 44px controls, dark-theme adaptations and reflowed hero links on phones. These add height compared with the static image. Popularity heading follows the requested copy; no numeric popularity data is fabricated. Content counts and recent-feature dates remain factual.

### Verification of second pass

ESLint/TypeScript, the production build and all 409 unit tests passed. The broad browser run passed 342 tests and exposed three home-only issues (span naming and two footer target widths); after correcting those, all 12 affected production checks passed, covering home light/dark axe, 44px targets, search, contrast keyboard interaction, skip link and four responsive widths. Additional direct axe scans at 1024px passed in both themes. New captures: home-reference-light.png, home-reference-dark.png and home-reference-mobile.png in docs/screenshots.

## Refinement after visual feedback

Removed hard-edged background ellipses and replaced them with smoothly fading accents inside their drawing area. Increased desktop practice-band padding to 32px/36px, limited and centred the demo, and gave its frame and controls more internal room. Its rotated bounding rectangle retains at least 20px of clear space on all four sides at every tested responsive width. Strengthened home-card washes and toy icon colours, and increased headline saturation while retaining enhanced large-text contrast. Hero labels no longer break a word on desktop.

Validation: production build, ESLint and TypeScript passed. All 10 affected production browser tests passed, including the new spacing assertions, responsive overflow, home axe in light/dark, target sizes, search and contrast keyboard interaction. Separate axe scans passed in both themes. Captures: home-spacing-desktop.png, home-spacing-mobile.png and practice-spacing.png.

## Header, brand and headline reference

Matched the supplied header/favicon crops: four glossy cyan/mint/violet/orange bars, shared wordmark and SVG favicon, yellow active-menu underline, pale blue preference/search rings and a cloud icon for calm mode. Consolidated competing header layout rules into src/header.css. The headline now has pastel lavender/sky/mint/peach/orange fills with a narrow navy halo for separation. The favicon URL is versioned so browsers request the new artwork.

Validation: production build, 409 unit tests and all 147 selected production browser tests passed (all-route light/dark axe, target sizes, keyboard, phone navigation and responsive spacing). No horizontal overflow at 320/768/1024/1280/1440px. Header capture: docs/screenshots/header-reference-detail.png.

## Palette based on the 21:17 screenshot

Updated shared light-mode cream, navy/blue text and seven pastel fills; recoloured the hero discs to match the illustration, refined the lavender-to-orange heading gradient, and gave search/suggestions blue and pastel rings. No layout changes. Navy and secondary blue were adjusted slightly darker after the first scan identified insufficient enhanced contrast on lavender tabs and cream panels.

Verification: production build and all 147 selected browser tests passed, including all-route light/dark axe, target sizes, keyboard, phone navigation and responsive spacing. The final capture is docs/screenshots/home-colour-reference.png. Temporary verification servers were stopped after testing.

## Category and hero content spacing

Category heading copies now reserve their medallion height and keep a 20px gap before the grid. Hero links use a 16px horizontal inset, a separate bottom-right arrow and reserved arrow space in counts. Phone tiles stack icon/text vertically with enough height instead of squeezing them horizontally.

Verification: production build and all 10 affected browser tests passed, including new category-gap and hero-inset assertions, responsive overflow, contrast keyboard interaction, home axe in both themes and target sizes. Captures: hero-content-spacing.png, category-heading-spacing.png and home-content-spacing-mobile.png. Temporary preview servers were stopped after verification.

## Typography and navigation styling pass

Aligned header, home and footer to one content measure. Navigation now uses intrinsic width beside the logo, compact 13px text, restrained link padding and one auto space before the search/control group. Removed the competing auto margins that stretched the menu across the header. Targets remain at least 44px.

Reduced the hero title cap to 48px; introduced a consistent 24px section / 15px card title / 14px body scale with more readable line height. Unified section spacing at 32px and brought practice, paths, recent materials and footer into the same typography. Phone layouts preserve the dock and use shorter horizontal first/last hero tiles.

Verification: production build and all 149 selected production browser tests passed (all-route axe in light/dark, targets, keyboard, mobile navigation and six responsive widths). Added header/content alignment and content-width menu assertions. Captures: home-type-desktop.png, home-type-mobile.png and menu-content-width.png. Temporary servers were stopped after verification.

## Remove header search and open up hero copy

Removed both desktop search input and phone search shortcut from the header. Preference controls now use the remaining right-hand space without an empty search placeholder. The home search remains a working labelled GET form.

Hero copy is a single vertical stack: 24px gaps on desktop and 20px on phones, with 16px top/24px bottom padding and 1.65 lead line height. New regression checks cover absence of header search, visibility of home search and title-to-description spacing.

Verification: production build and all 149 selected browser tests passed, covering all-route light/dark axe, target sizes, keyboard search, phone navigation and six responsive widths. Temporary preview servers were stopped after verification.

## Reorganise the lower home page

Categories now use three wider columns with 20px gutters and a wider quote tile. Learning paths use the full width in a balanced 3+2 arrangement, with larger insets and titles. The law callout is a separate full-width block below, with a real heading and an illustration in its own column. Recent materials have roomy cards with title and metadata on separate lines; decoration no longer reduces list width. Sections are separated by 48px.

Verification: production build and all 16 affected browser tests passed, including six responsive sizes, law text/image separation, spacing before recent materials, home axe in light/dark, target sizes, keyboard search and phone navigation. Desktop/mobile captures: discovery-spacious-desktop.png and discovery-spacious-mobile.png. Fixed navigation/structure overlays were hidden only during these section captures. Temporary servers were stopped afterwards.

## Mobile playground map

Replaced the phone's full empty-block illustration and duplicate solid tiles with an art-directed mobile composition. A small character/slide cutout and discovery heading introduce the group; practice is a full-width warm featured card with an example action, four soft pastel destinations form the middle mosaic, and WCAG 3 is a full-width closing row. All counts and links remain live. The desktop scene and its layout are preserved through picture art direction.

Asset: public/images/playground-mobile.png, generated using the built-in imagegen tool from the existing scene; final prompt is recorded in 2026-10-31-mobile-playground-asset.md.

Verification: production build and all 18 affected browser tests passed, including six viewport widths, mobile image selection, light/dark mobile axe, keyboard navigation, phone dock, home targets and search. Light/dark mobile captures are mobile-playground-light.png and mobile-playground-dark.png; fixed overlays were hidden only during section captures. Temporary preview servers were stopped afterwards.
