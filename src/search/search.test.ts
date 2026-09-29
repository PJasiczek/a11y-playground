import { describe, expect, test } from "vitest";
import { buildSearchIndex } from "./build-index";
import { foldTerm } from "./options";

const index = buildSearchIndex();

// Guards relevance as content changes: each query must put the expected document in the top 3.
describe("search", () => {
  test.each([
    ["kontrast", "kryterium:1.4.3"],
    ["1.4.3", "kryterium:1.4.3"],
    ["alt", "kryterium:1.1.1"],
    ["modal", "kryterium:2.1.2"],
    ["przeciaganie", "kryterium:2.5.7"],
    ["napisy", "kryterium:1.2.2"],
    ["placeholder", "kryterium:3.3.2"],
    ["autocomplete", "kryterium:1.3.5"],
    ["focus", "pojecie:fokus"],
    ["dostepna nazwa", "pojecie:nazwa"],
    ["showModal", "przyklad:okno-modalne-i-fokus"],
    ["karuzela", "przyklad:karuzela-automatyczna"],
    ["deklaracja dostepnosci", "przepis:ustawa-2019-848/art-10"],
    ["kary", "przepis:ustawa-2019-848/art-19"],
    ["domniemanie zgodnosci", "przepis:ustawa-2024-731/art-20"],
    ["semantyka", "lekcja:programista/semantyka-najpierw"],
    ["jak opisac blad", "lekcja:tester/jak-opisac-blad"],
  ])("%s finds %s", (query, id) => {
    const top = index
      .search(query)
      .slice(0, 3)
      .map((result: { id: unknown }) => result.id);
    expect(top).toContain(id);
  });

  test("folds Polish diacritics, including ł", () => {
    expect(foldTerm("Źródło")).toBe("zrodlo");
    expect(foldTerm("Przeciąganie")).toBe("przeciaganie");
  });
});

test("typo tolerance does not turn kontrast into kontakt", () => {
  const ids = index.search("kontrast").map((result: { id: unknown }) => result.id);
  expect(ids).not.toContain("kryterium:3.2.6");
  expect(index.search("kontrst").map((result: { id: unknown }) => result.id)).toContain("kryterium:1.4.3");
});
