import { describe, expect, test } from "vitest";
import { staleEntries } from "./markdown";
import { simulationKinds } from "./simulations";
import { parseSimulator, simulators, strayFiles } from "./simulators";

const source = `---
title: Widzenie barw
summary: Krótko.
criteria: ["1.4.1"]
examples: [formularz-z-bledami]
limits: Nie wszystko.
status: szkic
---
Opis.
`;

describe("simulator files", () => {
  // Loading the module parses every file in content/symulatory and throws on the first bad one.
  test("every kind has a file, all parse, and verified ones are fresh", () => {
    expect([...simulators.keys()]).toEqual(simulationKinds);
    expect(strayFiles).toEqual([]);
    expect(staleEntries(simulators)).toEqual([]);
  });
});

describe("parseSimulator", () => {
  test("resolves example titles and renders the description", () => {
    const simulator = parseSimulator("barwy", source);
    expect(simulator.examples).toEqual([{ slug: "formularz-z-bledami", title: "Formularz z błędami" }]);
    expect(simulator.html).toBe("<p>Opis.</p>\n");
  });

  test.each([
    ["an unknown example", source.replace("formularz-z-bledami", "nie-ma"), /nie-ma/],
    ["an unknown criterion", source.replace('"1.4.1"', '"9.9.9"'), /9\.9\.9/],
    ["a missing limits line", source.replace("limits: Nie wszystko.\n", ""), /limits/],
    ["an unknown key", source.replace("status: szkic", "status: szkic\nicon: x"), /icon/],
  ])("rejects %s", (_, input, message) => {
    expect(() => parseSimulator("barwy", input)).toThrow(message);
  });
});
