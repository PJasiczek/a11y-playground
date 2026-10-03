import { JSDOM } from "jsdom";
import { describe, expect, test } from "vitest";
import { staleEntries } from "./markdown";
import { parsePattern, patterns } from "./patterns";
import { readingOrder } from "./reading-order";

const index = `---
title: Wzorzec
en: Pattern
batch: html
native: html
summary: Krótko.
criteria: ["4.1.2"]
preview: <span>×</span>
steps:
  - do: Przejdź do przycisku.
    keys: [Tab]
    hear: Zapisz, przycisk
aria:
  - attr: aria-expanded
    on: przycisk
    selector: button
    meaning: Czy otwarte.
sources:
  deque: https://dequeuniversity.com/library/aria/button
status: szkic
---
## Kiedy używać

Zawsze.

## Typowe błędy

- Brak.
`;
const files = { index, source: "<button>Zapisz</button>" };

describe("pattern files", () => {
  // Loading the module parses every folder in content/wzorce and throws on the first bad one.
  test("all parse, and verified ones are fresh", () => {
    expect(patterns.size).toBeGreaterThan(0);
    expect(staleEntries(patterns)).toEqual([]);
  });

  // The selectors tell the frame which element's value to report in the ARIA table.
  test.each([...patterns.values()].map((pattern) => [pattern.slug, pattern] as const))("%s: every ARIA row points at an element", (_, pattern) => {
    const { document } = new JSDOM(pattern.source).window;
    const lost = pattern.aria.filter((row) => document.querySelector(row.selector) === null).map((row) => row.selector);
    expect(lost).toEqual([]);
  });

  test.each([...patterns.values()].map((pattern) => [pattern.slug, pattern.source] as const))("%s: every role has a Polish name", (_, source) => {
    expect(readingOrder(source).unknownRoles).toEqual([]);
  });
});

describe("parsePattern", () => {
  test("keeps the fragment as the code to show and renders the sections", () => {
    const pattern = parsePattern("x", files);
    expect(pattern.source).toBe("<button>Zapisz</button>");
    expect(pattern.sections).toEqual({ kiedy: "<p>Zawsze.</p>\n", bledy: "<ul>\n<li>Brak.</li>\n</ul>\n" });
    expect(pattern.steps[0]?.keys).toEqual(["Tab"]);
  });

  test.each([
    ["a missing wzorzec.html", { ...files, source: undefined }, /wzorzec.html is missing/],
    ["an unknown criterion", { ...files, index: index.replace('"4.1.2"', '"9.9.9"') }, /9\.9\.9/],
    ["an unknown example", { ...files, index: index.replace("preview:", "examples: [nie-ma]\npreview:") }, /nie-ma/],
    ["an unknown key", { ...files, index: index.replace("keys: [Tab]", "keys: [Tab, F13]") }, /keys/],
    ["an attribute the frame cannot report", { ...files, index: index.replace("attr: aria-expanded", "attr: aria-colspan") }, /attr/],
    ["a first step without Tab", { ...files, index: index.replace("keys: [Tab]", "keys: [Enter]") }, /first step/],
    ["a missing required section", { ...files, index: index.replace("## Typowe błędy\n\n- Brak.\n", "") }, /Typowe błędy/],
    ["an unknown verdict", { ...files, index: index.replace("native: html", "native: aria") }, /native/],
  ])("rejects %s", (_, input, message) => {
    expect(() => parsePattern("x", input)).toThrow(message);
  });
});
