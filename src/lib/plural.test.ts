import { expect, test } from "vitest";
import { countOf } from "./plural";

const forms = ["pojęcie", "pojęcia", "pojęć"] as const;

test.each([
  [0, "0 pojęć"],
  [1, "1 pojęcie"],
  [3, "3 pojęcia"],
  [5, "5 pojęć"],
  [12, "12 pojęć"],
  [22, "22 pojęcia"],
  [32, "32 pojęcia"],
])("%i → %s", (n, expected) => {
  expect(countOf(n, forms)).toBe(expected);
});
