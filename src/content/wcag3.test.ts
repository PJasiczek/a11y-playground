import { describe, expect, test } from "vitest";
import { maxCheckedAgeMonths, parseWcag3Group, parseWcag3Index, wcag3Groups, wcag3GuidelinesFor, wcag3Overview } from "./wcag3";

const guideline = `  - num: "2.1.1"
    en: Image alternatives
    title: Alternatywy
    criteria: ["1.1.1"]
`;

const group = `---
num: "2.1"
title: Obrazy
en: Images
status: szkic
guidelines:
${guideline}---
`;

const index = `---
status: szkic
draft: 2026-09-10
draftUrl: https://www.w3.org/TR/2026/WD-wcag-3.0-20260910/
checked: 2026-10-01
compare:
  - topic: Poziomy
    wcag2: A, AA, AAA
    wcag3: core i supplemental
---
Tekst.
`;

describe("content files", () => {
  // Loading the module parses every file in content/wcag3 and throws on the first bad one.
  test("index.md and twelve groups parse, in draft order", () => {
    expect(wcag3Groups.map((g) => g.num)).toEqual(["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "2.10", "2.11", "2.12"]);
  });

  test(`the draft was compared with w3.org at most ${String(maxCheckedAgeMonths)} months ago`, () => {
    const limit = new Date();
    limit.setMonth(limit.getMonth() - maxCheckedAgeMonths);
    expect(new Date(wcag3Overview.checked) >= limit, `content/wcag3/index.md checked ${wcag3Overview.checked}`).toBe(true);
  });

  test("the reverse index finds a criterion under its guideline", () => {
    expect(wcag3GuidelinesFor("1.1.1")).toContainEqual({ num: "2.1.1", title: "Alternatywy dla obrazów", anchor: "w3-2-1-1" });
  });
});

describe("parseWcag3Group", () => {
  test("gives every guideline an anchor without dots", () => {
    expect(parseWcag3Group("x.md", group).guidelines[0]?.anchor).toBe("w3-2-1-1");
  });

  test.each([
    ["a guideline outside its group", group.replace('num: "2.1.1"', 'num: "2.2.1"'), /not in group 2\.1/],
    ["an unknown criterion", group.replace('["1.1.1"]', '["9.9.9"]'), /9\.9\.9/],
    ["a guideline listed twice", group.replace(guideline, guideline + guideline), /twice/],
    ["text after the frontmatter", `${group}Wstęp.`, /no text/],
    ["a note over 160 characters", group.replace('criteria: ["1.1.1"]', `criteria: []\n    note: ${"a".repeat(161)}`), /note/],
  ])("rejects %s", (_, source, message) => {
    expect(() => parseWcag3Group("x.md", source)).toThrow(message);
  });
});

describe("parseWcag3Index", () => {
  test.each([
    ["a check before the draft", index.replace("checked: 2026-10-01", "checked: 2026-09-01"), /earlier than the draft/],
    ["a draft URL outside w3.org", index.replace("https://www.w3.org/TR/", "https://example.com/"), /draftUrl/],
    ["no comparison rows", index.replace(/compare:[\s\S]*?---/, "compare: []\n---"), /compare/],
  ])("rejects %s", (_, source, message) => {
    expect(() => parseWcag3Index("x.md", source)).toThrow(message);
  });
});
