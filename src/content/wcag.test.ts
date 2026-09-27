import { describe, expect, test } from "vitest";
import { criteria, guidelines, inVersion, isNewIn22, isObsolete, levels, principles } from "./wcag";

// Guards the output of scripts/import-wcag.ts against the published WCAG counts.
describe("imported WCAG structure", () => {
  test("has the published number of criteria per version", () => {
    expect(criteria.filter((c) => inVersion(c, "2.2"))).toHaveLength(86);
    expect(criteria.filter((c) => inVersion(c, "2.1"))).toHaveLength(78);
    expect(criteria.filter((c) => inVersion(c, "2.0"))).toHaveLength(61);
  });

  test("splits WCAG 2.2 into 31 A, 24 AA and 31 AAA", () => {
    const current = criteria.filter((c) => !isObsolete(c));
    expect(levels.map((level) => current.filter((c) => c.level === level).length)).toEqual([31, 24, 31]);
  });

  test("marks the nine criteria new in 2.2 and only 4.1.1 as obsolete", () => {
    expect(criteria.filter(isNewIn22).map((c) => c.id)).toEqual([
      "2.4.11", "2.4.12", "2.4.13", "2.5.7", "2.5.8", "3.2.6", "3.3.7", "3.3.8", "3.3.9",
    ]);
    expect(criteria.filter(isObsolete).map((c) => c.id)).toEqual(["4.1.1"]);
  });

  test("links every criterion to an existing guideline and principle", () => {
    for (const c of criteria) {
      expect(guidelines.some((g) => g.num === c.guideline && g.principle === c.principle)).toBe(true);
    }
    expect(principles).toHaveLength(4);
    expect(guidelines).toHaveLength(13);
  });
});
