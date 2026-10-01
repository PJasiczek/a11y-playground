import { describe, expect, test } from "vitest";
import { examples } from "./examples";
import { readingOrder } from "./reading-order";

describe("readingOrder", () => {
  test("names a button by its label and puts it in the tab order", () => {
    const { reading, tab } = readingOrder('<p>Zapisano.</p><button aria-label="Zamknij komunikat">×</button>');
    expect(reading).toEqual([{ text: "Zapisano." }, { text: "Zamknij komunikat", role: "przycisk" }]);
    expect(tab).toEqual([{ text: "Zamknij komunikat", role: "przycisk" }]);
  });

  test("reads a clickable div as text without a role, and Tab skips it", () => {
    const { reading, tab } = readingOrder('<div onclick="x()">×</div>');
    expect(reading).toEqual([{ text: "×", missing: "rola" }]);
    expect(tab).toEqual([]);
  });

  test("skips decorative images and hidden content, and flags an image without a name", () => {
    const { reading } = readingOrder(
      '<img src="a.png" alt=""><span aria-hidden="true">★</span><p hidden>Ukryte</p><img src="b.png">',
    );
    expect(reading).toEqual([{ text: "", role: "grafika", missing: "nazwa" }]);
  });

  test("gives headings their level and tables their columns", () => {
    const { reading } = readingOrder(
      '<h2>Wyniki</h2><table><caption>Ceny</caption><tr><th scope="col">Miasto</th><th scope="col">Cena</th></tr><tr><th scope="row">Kraków</th><td>129 zł</td></tr></table>',
    );
    expect(reading).toEqual([
      { text: "Wyniki", role: "nagłówek, poziom 2" },
      { text: "Ceny", role: "tabela, 2 kolumny" },
      { text: "Miasto", role: "nagłówek kolumny" },
      { text: "Cena", role: "nagłówek kolumny" },
      { text: "Kraków", role: "nagłówek wiersza" },
      { text: "129 zł" },
    ]);
  });

  test("reads what the fragment's script renders", () => {
    const { reading } = readingOrder('<ul id="l"></ul><script>document.getElementById("l").innerHTML = "<li>Raport</li>";</script>');
    expect(reading).toEqual([{ text: "", role: "lista, 1 element" }, { text: "Raport" }]);
  });

  // Every variant of every example, so a new example cannot bring a role the page cannot name.
  test.each([...examples.values()].flatMap((example) => [[example.slug, "bad", example.bad.source] as const, [example.slug, "good", example.good.source] as const]))(
    "%s (%s) reads something, with every role in Polish",
    (_, __, source) => {
      const { reading, unknownRoles } = readingOrder(source);
      expect(reading.length).toBeGreaterThan(0);
      expect(unknownRoles).toEqual([]);
    },
  );
});
