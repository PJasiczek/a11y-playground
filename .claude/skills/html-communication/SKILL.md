---
name: html-communication
description: Use when the user asks to communicate through an HTML document.
---

# HTML Communication

## When to Use

Use this skill when the user wants a plan, spec, write-up, findings, summary, report, comparison, or set of UI mocks presented as readable HTML.

Do not use it for HTML that ships as part of a product.

## Document

Create one self-contained HTML file, capped at 512 KB.

- Write it like a spec, not a landing page: dense, scannable, no hero, decorative chrome, marketing voice, or em dashes.
- Default to true black (`#000`), white primary text, and dark gray only for secondary surfaces or accents. No decorative card or pill chrome, and no light-gray subtitle lines above sections.
- Keep copy minimal.
- Make it mobile-readable with a responsive viewport and no fixed-width layout.
- Use semantic HTML, inline CSS, inline SVG, and HTTPS or data-URL images.
- Avoid continuously repainting CSS animations (pulse, shimmer, blur, spinners); they peg the GPU on high-refresh displays.
- Use an inline classic script only when interactivity materially helps. Keep scripted pages useful without JavaScript; the sandbox blocks storage, fetch, workers, frames, forms, and popups.
- In script-free files, give external links `target="_blank"` and `rel="noopener noreferrer"`. If any script exists, omit `target="_blank"`.

Never include external or module scripts, inline event handlers, `javascript:` URLs, forms, frames, embeds, objects, applets, meta refresh, linked stylesheets, secrets, private URLs, or local filesystem paths.

## Languages

Ship every document in two files in the same directory: `<name>.en.html` and `<name>.pl.html`.

- Both files carry the same content, headings, and ordering, so a reader switching between them lands in the same place.
- Translate the prose. Leave code, commands, file paths, identifiers, flags, and error strings in their original form.
- Write the Polish version as Polish. Do not carry English sentence shapes across.
- Link each file to its counterpart from the top of the page, using the sibling filename as a relative href. This is the only local path allowed.
- When a document changes, update both files in the same pass. A half-updated pair is worse than a single file.

## UI Mocks

Mocks are the exception to the language rule. Build one file, not a pair.

When the user asks for variants:

- Render real styled variants, not descriptions.
- Label them `A`, `B`, `C`... for easy selection.
- Lay them out for direct comparison.
- Keep one file across iterations so its path stays stable.
- Copy inside a mock stays in the language the product's interface uses. Keep framing text around the variants short and in English.

## Delivery

Save the files at the path the user gave. If they gave none, save them next to the material the document covers. Report every absolute path in your reply, English first.

Do not open a browser or verify the result in one unless the user asks.
