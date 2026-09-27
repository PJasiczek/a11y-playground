import { describe, expect, test } from "vitest";
import { criterionContent, parseCriterionMarkdown } from "./criterion-content";

const frontmatter = `---
summary: Krótkie zdanie.
roles: [programista]
lastVerified: 2026-09-27
---
`;

describe("content files", () => {
  // Loading the module parses every file in content/kryteria and throws on the first bad one.
  test("all parse and are keyed by an existing criterion", () => {
    expect(criterionContent.size).toBeGreaterThan(0);
  });
});

describe("parseCriterionMarkdown", () => {
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
    ["a missing lastVerified", frontmatter.replace("lastVerified: 2026-09-27\n", ""), /lastVerified/],
  ])("rejects %s", (_, source, message) => {
    expect(() => parseCriterionMarkdown("x.md", source)).toThrow(message);
  });
});
