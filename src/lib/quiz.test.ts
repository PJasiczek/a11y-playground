import { describe, expect, test } from "vitest";
import { isRight, optionOutcomes } from "./quiz";

const single = [{ correct: true }, { correct: false }, { correct: false }];
const multiple = [{ correct: true }, { correct: true }, { correct: false }];

describe("quiz scoring", () => {
  test.each([
    ["the one correct option", single, [0], true],
    ["a wrong option", single, [1], false],
    ["all correct options of several", multiple, [0, 1], true],
    ["some of the correct options", multiple, [0], false],
    ["the correct options plus a wrong one", multiple, [0, 1, 2], false],
    ["nothing", multiple, [], false],
  ])("picking %s", (_, options, picked, right) => {
    expect(isRight(options, new Set(picked))).toBe(right);
  });

  test("names what happened to every option", () => {
    expect(optionOutcomes(multiple, new Set([0, 2]))).toEqual(["trafiona", "pominieta", "bledna"]);
  });
});
