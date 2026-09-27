import { describe, expect, test } from "vitest";
import { criterionContent, parseCriterionMarkdown } from "./criterion-content";
import { maxVerifiedAgeMonths, staleEntries } from "./markdown";

const frontmatter = `---
status: szkic
summary: Krótkie zdanie.
roles: [programista]
---
`;

describe("content files", () => {
  // Loading the module parses every file in content/kryteria and throws on the first bad one.
  test("all parse and are keyed by an existing criterion", () => {
    expect(criterionContent.size).toBeGreaterThan(0);
  });

  test(`verified content is at most ${String(maxVerifiedAgeMonths)} months old`, () => {
    expect(staleEntries(criterionContent)).toEqual([]);
  });
});

describe("parseCriterionMarkdown", () => {
  test("turns the first glossary mark into a link with a preview button and later ones into text", () => {
    const content = parseCriterionMarkdown(
      "x.md",
      `${frontmatter}## Kogo to dotyczy\n\nCzytnik czyta [nazwę](slownik:nazwa). Potem znowu [nazwę](slownik:nazwa).`,
    );
    expect(content.terms).toEqual(["nazwa"]);
    const html = content.sections["kogo-dotyczy"] ?? "";
    expect(html).toContain('<a href="/slownik#nazwa">nazwę</a><button type="button" class="term-tip" data-term="nazwa"');
    expect(html).toContain("Potem znowu nazwę.");
  });

  test("renders known sections to HTML and skips empty ones", () => {
    const content = parseCriterionMarkdown("x.md", `${frontmatter}\n## Kogo to dotyczy\n\nKażdego.\n\n## Typowe błędy\n`);
    expect(content.sections).toEqual({ "kogo-dotyczy": "<p>Każdego.</p>\n" });
  });

  test.each([
    ["an unknown section", `${frontmatter}## Coś innego\n\ntekst`, /unknown section "Coś innego"/],
    ["sections out of order", `${frontmatter}## Typowe błędy\n\na\n\n## Kogo to dotyczy\n\nb`, /out of order/],
    ["text before the first section", `${frontmatter}Wstęp\n\n## Kogo to dotyczy\n\na`, /before the first/],
    ["a related criterion that does not exist", frontmatter.replace("roles:", 'related: ["9.9.9"]\nroles:'), /9\.9\.9/],
    ["a summary over 200 characters", frontmatter.replace("Krótkie zdanie.", "a".repeat(201)), /summary/],
    ["an unknown frontmatter key", frontmatter.replace("roles:", "autor: ktoś\nroles:"), /autor/],
    ["a draft with lastVerified", frontmatter.replace("roles:", "lastVerified: 2026-09-27\nroles:"), /draft/],
    ["verified content without lastVerified", frontmatter.replace("status: szkic", "status: zweryfikowane"), /needs lastVerified/],
    ["an unknown glossary term", `${frontmatter}## Kogo to dotyczy\n\n[x](slownik:nie-ma)`, /unknown glossary term "nie-ma"/],
    ["an unknown status", frontmatter.replace("status: szkic", "status: gotowe"), /status/],
  ])("rejects %s", (_, source, message) => {
    expect(() => parseCriterionMarkdown("x.md", source)).toThrow(message);
  });
});
