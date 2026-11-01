import { describe, expect, test } from "vitest";
import { siteUrl } from "../src/lib/site.ts";
import { entryFile, entryTitle, fromNotion, toNotion } from "./notion.ts";

const file = `---
summary: Krótko.
---

## Kogo to dotyczy

Osoby z [czytnikiem](slownik:czytnik-ekranu), zob. [art. 5](prawo:ustawa-2019-848/art-5) i [W3C](https://www.w3.org/).

\`\`\`przed
<div>[x]</div>
\`\`\`

\`\`\`po
<button>Zamknij</button>
\`\`\`
`;

describe("entry titles", () => {
  test.each([
    ["kryteria", "1.4.3.md", "1.4.3"],
    ["przed-i-po", "problemy/01-jezyk.md", "problemy/01-jezyk"],
    ["praktyka", "ikona-jako-przycisk/index.md", "ikona-jako-przycisk"],
    ["sciezki", "programista/index.md", "programista"],
    ["sciezki", "programista/nazwy-dostepne.md", "programista/nazwy-dostepne"],
  ])("%s/%s is %s and back", (section, path, title) => {
    expect(entryTitle(section, path)).toBe(title);
    expect(entryFile(section, title)).toBe(path);
  });

  test("rejects a title that is not a slug", () => {
    expect(() => entryFile("kryteria", "Nowa strona")).toThrow(/not a valid entry title/);
  });
});

describe("toNotion and fromNotion", () => {
  test("imports links authored on the previous domain as internal marks", () => {
    const legacy = toNotion(file).replaceAll(siteUrl, "https://a11y-playground-tau.vercel.app");
    expect(fromNotion("kryteria", legacy)).toBe(file);
  });

  test("legacy glossary links become relative without rewriting code or external hosts", () => {
    const source = "---\nterm: fokus\n---\n\n[Focus](/slownik#fokus) i [Other](https://example.org/slownik#fokus).\n\n```html\n<a href=\"https://a11y-playground-tau.vercel.app/slownik#fokus\">Demo</a>\n```\n";
    const legacy = toNotion(source).replaceAll(siteUrl, "https://a11y-playground-tau.vercel.app");
    expect(fromNotion("slownik", legacy)).toBe(source);
  });

  test("a file survives the round trip", () => {
    expect(fromNotion("kryteria", toNotion(file))).toBe(file);
  });

  test("marks travel as links to the site and code blocks as named html blocks", () => {
    const page = toNotion(file);
    expect(page).toContain(`](${siteUrl}/slownik#czytnik-ekranu)`);
    expect(page).toContain(`](${siteUrl}/prawo/ustawa-2019-848/art-5)`);
    expect(page).toContain("```html\n<!-- przed -->\n<div>[x]</div>");
  });

  test("glossary entries keep relative links instead of marks", () => {
    const entry = "---\nterm: fokus\n---\n\nZob. [wskaźnik](/slownik#wskaznik-fokusu).\n";
    expect(toNotion(entry)).toContain(`](${siteUrl}/slownik#wskaznik-fokusu)`);
    expect(fromNotion("slownik", toNotion(entry))).toBe(entry);
  });

  test("undoes what Notion rewrites, outside code blocks only", () => {
    const page = [
      "```yaml\nsummary: Krótko.\n```",
      "Atrybut <code>lang=\"uk\"</code>, <b>Tytuł:</b> \\[dzwonek\\], data [DD.MM](http://DD.MM), [jan@przyklad.pl](mailto:jan@przyklad.pl).",
      "```html\n<code>x</code> \\[y\\]\n```",
    ].join("\n\n");
    expect(fromNotion("kryteria", page)).toBe(
      "---\nsummary: Krótko.\n---\n\nAtrybut `lang=\"uk\"`, **Tytuł:** [dzwonek], data DD.MM, jan@przyklad.pl.\n\n```html\n<code>x</code> \\[y\\]\n```\n",
    );
  });

  test("a page without a yaml block at the top fails", () => {
    expect(() => fromNotion("kryteria", "## Kogo to dotyczy\n\nTekst.")).toThrow(/yaml code block/);
  });
});
