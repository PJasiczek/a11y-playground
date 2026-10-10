import { describe, expect, test } from "vitest";
import { checkProblems, markersIn, parseProblem, problems, problemsFor } from "./before-after";

const valid = `---
title: Menu tylko pod myszą
criteria: ["2.1.1"]
marker: menu
who: [klawiatura]
axe: []
pattern: nawigacja-wielopoziomowa
status: szkic
---
## Problem

Podmenu otwiera się tylko po najechaniu.

## Rozwiązanie

Przycisk z \`aria-expanded\`.

\`\`\`przed
<li class="pod">
\`\`\`

\`\`\`po
<button aria-expanded="false">
\`\`\`
`;

describe("before and after problems", () => {
  test("every problem in the content parses, numbered from 1 in page order", () => {
    expect(problems.map((p) => p.number)).toEqual(Array.from({ length: problems.length }, (_, i) => i + 1));
    expect(problems.length).toBe(20);
  });

  test("a problem file becomes its number, sections and code", () => {
    const problem = parseProblem("07-menu.md", valid);
    expect(problem).toMatchObject({ number: 7, marker: "menu", who: ["klawiatura"], pattern: { slug: "nawigacja-wielopoziomowa" }, example: null });
    expect(problem.code).toEqual({ przed: '<li class="pod">', po: '<button aria-expanded="false">' });
    expect(problem.solutionHtml).not.toContain("```");
  });

  test.each([
    ["a bad file name", "menu.md", valid, "NN-slug.md"],
    ["an unknown criterion", "01-a.md", valid.replace('["2.1.1"]', '["9.9.9"]'), "unknown criteria"],
    ["an unknown pattern", "01-a.md", valid.replace("nawigacja-wielopoziomowa", "nie-ma"), 'unknown pattern "nie-ma"'],
    ["an unknown group", "01-a.md", valid.replace("[klawiatura]", "[wszyscy]"), "who"],
    ["no code after", "01-a.md", valid.replace("```po", "```html"), "```po"],
    ["no solution", "01-a.md", valid.replace("## Rozwiązanie", "## Inne"), 'unknown section "Inne"'],
  ])("rejects %s", (_, file, source, message) => {
    expect(() => parseProblem(file, source)).toThrow(message);
  });

  test("markers and the broken page match one to one", () => {
    const page = '<body data-problem="jezyk"><div data-problem="menu kontrast"></div>';
    expect(markersIn(page)).toEqual(["jezyk", "menu", "kontrast"]);
    const list = [
      { number: 1, marker: "jezyk" },
      { number: 2, marker: "menu" },
      { number: 3, marker: "kontrast" },
    ];
    expect(() => {
      checkProblems(list, page);
    }).not.toThrow();
    expect(() => {
      checkProblems(list.slice(0, 2), page);
    }).toThrow('data-problem "kontrast" in przed.html has no problem');
    expect(() => {
      checkProblems([...list, { number: 5, marker: "brak" }], page);
    }).toThrow(/expected problem 4, found 5.*marker "brak" appears 0 times/);
  });

  test("a criterion page finds the problems that break it", () => {
    expect(problemsFor("2.4.11")).toEqual([{ number: 19, title: "Pasek cookies zasłania element z fokusem" }]);
  });
});
