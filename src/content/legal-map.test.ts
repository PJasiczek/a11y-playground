import { describe, expect, test } from "vitest";
import { annex2019 } from "./annex-2019-848";
import { edges, enClause, whyNotRequired } from "./legal-map";
import { criteria, findCriterion, inVersion, isNewIn22 } from "./wcag";

describe("the annex to the 2019 act", () => {
  // Pins the hand transcription: a typo or a missing row fails here.
  test("is WCAG 2.1 A and AA without 1.2.4", () => {
    const expected = criteria.filter((c) => inVersion(c, "2.1") && c.level !== "AAA" && c.id !== "1.2.4").map((c) => c.id);
    expect(annex2019.map((row) => row.id)).toEqual(expected);
  });

  test("excludes seven criteria for mobile apps", () => {
    expect(annex2019.filter((row) => !row.mobile).map((row) => row.id)).toEqual(["2.4.1", "2.4.2", "2.4.5", "3.1.2", "3.2.3", "3.2.4", "4.1.3"]);
  });
});

describe("edges", () => {
  // The rule that keeps the app from implying an obligation the law does not impose.
  test("no act requires an AAA criterion or one new in 2.2", () => {
    const binding = edges.filter((edge) => edge.strength !== "powiazane");
    const overreach = binding.filter((edge) => {
      const criterion = findCriterion(edge.criterion);
      return !criterion || criterion.level === "AAA" || isNewIn22(criterion);
    });
    expect(overreach).toEqual([]);
  });

  test("are unique per provision and criterion", () => {
    const keys = edges.map((edge) => `${edge.legal} ${edge.criterion}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

test.each([
  ["1.4.3", "9.1.4.3"],
  ["2.4.11", null],
  ["1.4.6", null],
])("EN 301 549 clause 9 mirrors WCAG 2.1 A and AA only: %s", (id, clause) => {
  const criterion = findCriterion(id);
  expect(criterion && enClause(criterion)).toBe(clause);
});

test.each([
  ["2.4.11", "strona-publiczna", /doszło w 2\.2/],
  ["1.2.4", "strona-publiczna", /napisy na żywo/],
  ["2.4.1", "aplikacja-publiczna", /aplikacji mobilnych/],
  ["1.4.6", "produkt-ue", /AAA/],
] as const)("explains why %s is not required for %s", (id, situation, reason) => {
  expect(whyNotRequired(id, situation)).toMatch(reason);
});
