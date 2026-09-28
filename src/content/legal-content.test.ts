import { describe, expect, test } from "vitest";
import { actContent, parseActMarkdown } from "./legal-content";
import { staleEntries } from "./markdown";

const frontmatter = `---
status: szkic
short: Ustawa
summary: Krótko.
binds: Podmioty publiczne.
---
`;

const parse = (body: string, head = frontmatter) => parseActMarkdown("x.md", "ustawa-2019-848", `${head}${body}`);

describe("act files", () => {
  // Loading the module parses every file in content/prawo and throws on the first bad one.
  test("verified acts are at most 12 months old", () => {
    expect(staleEntries(actContent)).toEqual([]);
  });
});

describe("parseActMarkdown", () => {
  test("reads article summaries, their titles and ustęp summaries", () => {
    const content = parse("Wstęp.\n\n## Art. 5. Wymagania\n\nCałość.\n\n### ust. 3\n\nNorma.\n\n## Załącznik\n\nTabela.");
    expect(content.introHtml).toBe("<p>Wstęp.</p>\n");
    expect(content.articles["ustawa-2019-848/art-5"]).toEqual({ title: "Wymagania", html: "<p>Całość.</p>\n", ust: { "3": "<p>Norma.</p>\n" } });
    expect(content.articles["ustawa-2019-848/zal"]?.title).toBe("");
  });

  test("links a glossary term at its first use on every article page", () => {
    const content = parse("Wstęp o [fokusie](slownik:fokus).\n\n## Art. 5\n\nZnowu [fokus](slownik:fokus).\n\n## Art. 7\n\nI [fokus](slownik:fokus).");
    expect(content.introHtml).toContain('href="/slownik#fokus"');
    expect(content.articles["ustawa-2019-848/art-5"]?.html).toContain('href="/slownik#fokus"');
    expect(content.articles["ustawa-2019-848/art-7"]?.html).toContain('href="/slownik#fokus"');
    expect(content.terms).toEqual(["fokus"]);
  });

  test("links provisions with prawo:", () => {
    const content = parse("## Art. 7\n\nZobacz [art. 5 ust. 3](prawo:ustawa-2019-848/art-5#ust-3).");
    expect(content.articles["ustawa-2019-848/art-7"]?.html).toContain('<a href="/prawo/ustawa-2019-848/art-5#ust-3">art. 5 ust. 3</a>');
  });

  test.each([
    ["a heading that is not an article", "## Wstęp\n\ntekst", /is not an article/],
    ["an article the act does not have", "## Art. 99\n\ntekst", /no article "art-99"/],
    ["an ustęp the article does not have", "## Art. 5\n\n### ust. 9\n\ntekst", /has no ust\. 9/],
    ["a malformed ustęp heading", "## Art. 5\n\n### ustęp 1\n\ntekst", /should be "### ust\. 1"/],
    ["an article summarised twice", "## Art. 5\n\na\n\n## Art. 5\n\nb", /twice/],
    ["an unknown legal reference", "## Art. 5\n\n[x](prawo:ustawa-2019-848/art-99)", /unknown legal reference/],
    [
      "a deadline pointing at a missing article",
      "",
      /no article "art-99"/,
      frontmatter.replace(/---\n$/,"deadlines:\n  - { date: 2020-01-01, what: x, unit: art-99, situations: [strona-publiczna] }\n---\n"),
    ],
    [
      "a deadline with an unknown situation",
      "",
      /situations/,
      frontmatter.replace(/---\n$/, "deadlines:\n  - { date: 2020-01-01, what: x, unit: art-5, situations: [kosmos] }\n---\n"),
    ],
  ])("rejects %s", (_, body, message, head = frontmatter) => {
    expect(() => parse(body, head)).toThrow(message);
  });
});
