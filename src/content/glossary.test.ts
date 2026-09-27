import { describe, expect, test } from "vitest";
import { criterionContent } from "./criterion-content";
import { glossary, parseGlossaryMarkdown } from "./glossary";
import { staleEntries } from "./markdown";

const entry = `---
term: nazwa
normative: nazwa
status: szkic
---
Wyjaśnienie.
`;

describe("glossary files", () => {
  test("all parse, and verified ones are fresh", () => {
    expect(glossary.size).toBeGreaterThan(0);
    expect(staleEntries(glossary)).toEqual([]);
  });

  test("every term marked in criteria exists", () => {
    const used = [...criterionContent.values()].flatMap((c) => c.terms);
    expect(used.filter((slug) => !glossary.has(slug))).toEqual([]);
  });
});

describe("parseGlossaryMarkdown", () => {
  test("attaches the normative WCAG definition", () => {
    const parsed = parseGlossaryMarkdown("x.md", "nazwa", entry);
    expect(parsed.normativeHtml).toContain("tekst, po którym oprogramowanie może zidentyfikować obiekty w treści");
    expect(parsed.html).toBe("<p>Wyjaśnienie.</p>\n");
  });

  test.each([
    ["a normative term missing from WCAG", entry.replace("normative: nazwa", "normative: coś"), /not a term in the WCAG 2.1 glossary/],
    ["an empty explanation", entry.replace("Wyjaśnienie.\n", ""), /empty/],
    ["an unknown key", entry.replace("status:", "topic: x\nstatus:"), /topic/],
  ])("rejects %s", (_, source, message) => {
    expect(() => parseGlossaryMarkdown("x.md", "x", source)).toThrow(message);
  });
});
