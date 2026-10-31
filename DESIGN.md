# a11y playground - design contract

## Visual authority

The user-supplied **Pastelowy plac zabaw dostepnosci cyfrowej** reference is the authority for the complete home page, including its section order, proportions, graphics, colours, soft lighting and alignment. It supersedes the October 17-18 mocks, centred hero, vertical xylophone keys and the simplified SVG playground from the first implementation.

The original reference is kept in `docs/design/2026-10-18-home-graphic/home-graphic.png`. Implementation: `src/routes/index.tsx`, `src/home.css`; shared tokens and controls: `src/styles.css`. The accessibility rules in `docs/accessibility.md` take precedence over a visual match.

## Home page composition

At the reference width of 1024px, content has approximately 45px side margins. At larger widths its outer container stops at 1200px. The home page uses this exact sequence:

1. One-row header: four glossy cyan, mint, violet and orange bars and a two-line wordmark, the eight main links, search, calm and theme pills. Active navigation has an underline as well as aria-current.
2. Split hero, 44% text / 56% scene: three-line heading, multi-colour final line, blue lede, search pill and three suggested queries. On the right, the waving character, slide, swing, blue flag, clouds, sun, plants and accessibility signpost. Six pastel blocks carry real HTML links: yellow practice above green paths/purple law, pink simulators/blue glossary, then a wide turquoise WCAG 3 block.
3. Crown heading and four cards in one row: blue criterion, green target-size practice, purple contrast practice, pink keyboard simulation. Each contains a raised icon disc, title, brief description, tags and circular arrow.
4. Wide yellow practice band: eyebrow and two-line title on the left, copy and blue action; a slightly rotated white password/contrast demonstration on the right, with coloured sparks around it.
5. Crown heading and eight category tiles, four per row: criteria, practice, paths, law / simulators, glossary, WCAG 3 and the quote. Each category has an icon, live count and arrow.
6. Five compact green numbered path cards occupying two thirds of the width, beside a purple law callout with a small white label, description, action and rendered statute books.
7. Recent materials in two columns beside the sun/cloud and handwritten-style small-steps message. Dates are actual repository feature dates, not dates invented from the visual reference.
8. Compact footer: wordmark and section links, then copyright, privacy, contact and consent settings. Social icons are added only when real project destinations exist.

The hero's six labels, icons, counts and arrows are positioned over the blank rendered blocks. None of the interface text is embedded in an image. All navigation works before any decorative asset has loaded.

## Graphics and assets

- `public/images/playground-hero.png`: transparent raster scene generated with the built-in imagegen tool from the supplied reference. Contains the character, playground, blank coloured blocks, scenery and signpost; no interface labels.
- `public/images/law-books.png`: transparent rendered statute books from the reference.
- Prompts, source and generation method are recorded in `docs/design/2026-10-31-pastel-assets.md`.
- All decorative images have empty alt text. Explicit dimensions prevent layout shifts; the hero is eager/high-priority and the books lazy-load. Never replace the complete page with a screenshot.
- Vector icons use the shared 20px grid and rounded strokes. Criteria uses a document, practice a cog, paths a route, law a section sign, simulators a play button, glossary an open book and WCAG 3 a shield. These meanings remain consistent across the app.

## Colour and depth

Exact token values live in `src/styles.css`, avoiding stale duplicated contrast tables. Light mode uses cream ground, near-white cards and deep navy text. Dark mode uses dark purple ground with pale text; the rendered hero retains its light block surfaces and uses fixed navy labels so their contrast remains correct.

The seven content colours are sky, orange, green, lavender, pink, yellow and turquoise. Starter cards may use the reference's green and lavender washes while their explicit labels still identify their content type. The hero practice block is yellow and the glossary block blue, exactly as in the reference; category and inner-page colours retain their content meaning.

Cards use faint tinted borders, soft gradients and rounded corners. Hero depth comes from the rendered image. Icon discs have small inset highlights; buttons use a navy pill with subtle lighting and a soft shadow. No hard coloured shelves beneath the home cards. Reference callouts keep white raised surfaces and gentle rotation.

Multi-colour headline stops are deliberately darker than the mock's pastels to preserve readable contrast. Do not remove readable text in order to match a low-contrast reference pixel.

## Typography and spacing

Geist Variable for all interface text, titles, labels, dates and numbers. Atkinson Hyperlegible Mono for code only. Titles use weight 800, tight tracking and no italics. Home heading scales with the viewport; body text is 14-16px, compact text at least 12px. Running text remains at most 68ch.

Home section headings have a small icon medallion at the left and an optional all-items link at the right. Cards use 12-14px text, short copy and ample space for tags. Pills, tabs and category cards follow the image's rounded geometry. The final height can exceed the static mock because the real controls retain accessible target sizes and the actual content counts differ.

## Accessibility and responsive behaviour

- Target WCAG 2.2 AA plus the app's opted-in AAA criteria: enhanced text contrast, reduced interaction animation, focus appearance and 44px targets. Verify actual rendered pairs with axe, not an assumed palette ratio.
- Body text and meaningful small text require 7:1; large headings require at least the enhanced 4.5:1 threshold. Controls and meaningful graphics require 3:1. All links, form controls, filters and navigation have a visible 3px focus outline.
- Every control/navigation target is at least 44px. Small decorative arrows inside a large linked tile are not separate targets. Colour always has a text/icon counterpart.
- Semantic heading hierarchy, native form labels, radio groups and polite live status. The contrast sample is inert and aria-hidden because it deliberately demonstrates inadequate contrast; its accessible controls and live verdict convey its state. It starts at 4.5:1, matching the reference.
- On narrow screens the hero stacks, the artwork remains visible and the six links become a regular grid below it, so text never shrinks or overlaps inside an image. Categories become two columns, recent materials one column and the law callout follows the paths. No horizontal scrolling at 320px.
- Keep the phone dock and the existing short-screen fallback. Navigation, theme and calm controls are available on every page.
- No animation at rest. Motion occurs only on interaction. Calm mode and system reduced-motion settings stop transitions and animation; colour is not the only source of meaning. Forced-colour mode replaces image-backed controls with system-coloured surfaces.

## Application-wide consistency

The root layout classifies every nested route into a content kind. All inner pages share the cream/navy foundations, typography, icon meanings, rounded controls, focus, header, footer, phone dock, consent UI and structure tool.

- Reference: criteria, law, WCAG 3 and glossary use tinted title bands, readable sections and related-content cards.
- Practice: examples, ARIA patterns, before/after and simulators retain their live frames and controls. Isolated educational documents preserve intentional failures; never recolour their contents through global selectors.
- Learning: green paths, lesson cards, progress and quizzes. Saved progress remains local to the browser.
- Search, contact, privacy and 404 use neutral surfaces and the same controls.

Filters stay in the URL. Navigation changes focus to the new title; in-page filters do not steal focus. Tooltips open on keyboard focus and close with Escape. Theme and calm settings persist before paint. No unnecessary success toasts.

## Review and verification

Before accepting home changes, compare a full-page capture at 1024px with the supplied reference, then inspect 320/390/768/1440px, dark mode and forced colours. Verify all six hero links, seven category links, the real search form, contrast radios, path progress and law action. Run ESLint/TypeScript, production build, responsive tests and axe in both themes. Historical screenshots are not evidence of the latest layout.

## Visual refinement: space and colour

Background accents must fade smoothly before their drawing boundary; do not use radial gradients with hard colour stops at a container edge. No decorative half-ellipses with visible straight cuts.

The yellow practice band reserves at least 32px vertical and 36px horizontal padding on desktop, plus breathing room around its rotated demo. The demo has its own 16px inner padding and a maximum width; radio controls wrap when space is limited. At tablet/phone widths the columns stack and the rotation is removed. Never reduce this space just to match the mock height.

Home cards use richer 18-42% tinted washes and categories 28-48%. Icon discs use vivid toy colours; labels retain text-safe ink. The large heading uses a more saturated purple/blue/teal/orange gradient while retaining the enhanced large-text contrast threshold. Dark mode and calm mode remain separate treatments.

## Header and brand reference amendment

The supplied header crop and favicon crop now govern the shared brand. Four rounded glossy bars (cyan, mint, violet with pink highlight, orange) are used in the wordmark and cream favicon tile. The mark is vector/CSS, not a raster screenshot. The desktop menu uses evenly spaced navy links, a 3px yellow active underline and pale blue rings on search, calm and theme pills. Calm uses a cloud icon. Focus remains a strong 3px outline; pressed preference buttons retain aria-pressed and a visible fill/ring state. The phone dock remains available and the header wraps on tablets.

The home headline uses the requested light pastel lavender, sky, mint, peach and orange gradient. A narrow navy halo around the letter shapes provides separation from the cream background; dark mode uses a matching dark halo. Calm and forced colours use a solid readable foreground. Do not revert the fill to the previous dark teal/brown gradient.

## Latest colour reference

The screenshot supplied at 21:17 (docs/design/2026-10-31-colour-reference.png) is the current palette authority. Light-mode foundations: cream #fdfbf6, navy #06316b and readable blue #184b7f. Pastel content fills: sky #a8dffc, apricot #ffd2aa, mint #acf0b6, lavender #d0b9fa, pink #ffbcd8, warm yellow #ffe78a and turquoise #92e5e7. Exact dark variants remain in src/styles.css.

The hero headline runs lavender through sky and mint to peach/orange; its readability halo remains. Suggested searches have section-coloured pastel borders. The main search uses a blue inner edge and a pale outer ring. Hero icon discs match the rendered block illustration (orange, green, violet, pink, sky and cyan), rather than assigning the yellow glossary colour to its blue hero block. This amendment changes colour only; preserve the reviewed spacing and layout.

## Content spacing refinement

Section heading copies reserve at least 36px so their icon medallions fit within the heading row. The categories heading has 20px of space before its grid. Hero links reserve 16px horizontal padding and a separate bottom-right position for arrows; count text reserves arrow space. On phones, icon and text stack inside taller tiles instead of being squeezed into a narrow horizontal row. Preserve these insets when adjusting the illustration overlay.

## Typography and content-fitting navigation

The header, home content and footer now share the same 1200px outer container and responsive side padding. Desktop navigation stays at its intrinsic content width beside the brand; only the search group uses the remaining space. Menu text is 13px (12px in the compact desktop range), with restrained horizontal padding and 44px targets. Do not distribute links across an artificially stretched menu.

Home typography uses three main sizes: 24px section headings (21px on phones), 15px card titles and 14px body text with 1.5-1.55 line height. Metadata remains 12px. The hero title is capped at 48px and the lead uses 16px. Section spacing is a consistent 32px; category headings keep their 20px grid gap. Practice and learning headings follow the same scale. On phones, the wide first/last hero tiles use a compact horizontal layout while the narrow pairs keep stacked content.

These rules supersede the earlier per-component micro-sizes and stretched header spacing. Keep the current colour palette and artwork.

## Header breathing room

The header reserves 32px above and 24px below its navigation row on tablet/desktop. Link gaps and horizontal padding are slightly wider without stretching the menu. Compact desktop widths retain the smaller link gaps to prevent overflow. Phones use 16px above and 8px below, preserving the short-screen navigation fallback.

## Search and hero spacing amendment

Search has been removed from the shared header on desktop and phone. The working home search and dedicated search route remain. Header preference controls use the space at the right previously occupied by search; do not leave an empty search slot.

Hero copy uses one vertical stack with 24px gaps between eyebrow, heading, lede, search and suggestions (20px on phones), plus 16px above and 24px below. The lede has a 1.65 line height. Avoid accumulating independent margins or squeezing these groups together.

## Spacious discovery layout

The lower home page is no longer compressed into a four-column category grid, five narrow path cards and an adjacent law callout. Categories use three columns with 20px gutters and 112px minimum card height; the quote spans the final two columns. Tablet uses two columns; phone category cards stack their icon and label.

Learning paths use the full content width in a three-column grid with 24px inner padding. The path cards form a balanced three-card first row and two equally wide cards in the second row; phones retain two columns with the final card spanning the row. Law is a separate full-width callout beneath the path grid, with its own eyebrow, real heading, description and action. Its book illustration occupies a dedicated column, or a separate row on phones, and cannot cover the text.

Discovery sections are separated by 48px. Recent materials use spacious two-column cards with the title on its own line and category/date metadata below; on phones these become one column. Decorative small-steps art sits below the list rather than squeezing its width. This layout supersedes the compact lower-page arrangement in the original reference.

## Mobile playground navigation

At widths up to 550px, use a purpose-built mobile navigation composition rather than showing the large scene with empty blocks above duplicate cards. A small transparent character/slide illustration accompanies a short discovery heading. The first practice card spans both columns, uses a warm sun gradient and has a clear example action. The four middle destinations form soft pastel cards with generous icon/text space; WCAG 3 closes the group as a compact full-width row. All six destinations remain ordinary links in their original order, with live counts and 44px minimum targets. No carousel, hidden destinations or automatic motion.

The picture element art-directs between public/images/playground-hero.png on desktop and public/images/playground-mobile.png on phones. The mobile asset has no empty UI blocks and contains no labels. Dark, calm and forced-colour modes retain readable labels and visible focus. The full desktop scene and its linked block layout remain unchanged.

## Final copy cleanup

The sun eyebrow and slogan above the main home title have been removed. The hero copy starts with its heading, followed by the lede, search and suggestions. The separate mobile navigation introduction remains.
