import { describe, expect, test } from "vitest";
import { examples, parseExample } from "./examples";
import { staleEntries } from "./markdown";

const index = `---
title: Przykład
summary: Krótko.
criteria: ["1.1.1"]
effort: 1 linia
gain: Zysk.
preview: <span>×</span>
status: szkic
bad:
  why: Źle.
  announces: Nic.
good:
  why: Dobrze.
  announces: Coś.
---
Wstęp.
`;
const files = { index, bad: "<p>zły</p>", good: "<p>dobry</p>" };

describe("example files", () => {
  // Loading the module parses every folder in content/praktyka and throws on the first bad one.
  test("all parse, and verified ones are fresh", () => {
    expect(examples.size).toBeGreaterThan(0);
    expect(staleEntries(examples)).toEqual([]);
  });
});

describe("parseExample", () => {
  test("keeps the fragments as the code to show and renders the introduction", () => {
    const example = parseExample("x", files);
    expect(example.bad.source).toBe("<p>zły</p>");
    expect(example.introHtml).toBe("<p>Wstęp.</p>\n");
    expect(example.motion).toBe(false);
  });

  test.each([
    ["a missing bad.html", { ...files, bad: undefined }, /bad.html is missing/],
    ["a missing good.html", { ...files, good: undefined }, /good.html is missing/],
    ["an unknown criterion", { ...files, index: index.replace('"1.1.1"', '"9.9.9"') }, /9\.9\.9/],
    ["an effort off the scale", { ...files, index: index.replace("1 linia", "chwila") }, /effort/],
    ["an unknown key in a variant", { ...files, index: index.replace("  why: Dobrze.", "  why: Dobrze.\n  axe: [x]") }, /axe/],
  ])("rejects %s", (_, input, message) => {
    expect(() => parseExample("x", input)).toThrow(message);
  });
});
