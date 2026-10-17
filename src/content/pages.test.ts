import { describe, expect, test } from "vitest";
import { parsePageMarkdown, standalonePage } from "./pages";

const page = `---
title: Polityka prywatności
description: Jakie dane zbieramy.
updated: 2026-10-17
---
## Kto odpowiada za dane

Tekst.
`;

describe("standalone pages", () => {
  test("the privacy policy parses", () => {
    expect(standalonePage("prywatnosc").title).not.toBe("");
  });
});

describe("parsePageMarkdown", () => {
  test("renders the body", () => {
    const parsed = parsePageMarkdown("x.md", page);
    expect(parsed.updated).toBe("2026-10-17");
    expect(parsed.html).toBe("<h2>Kto odpowiada za dane</h2>\n<p>Tekst.</p>\n");
  });

  test.each([
    ["a date that is not ISO", page.replace("2026-10-17", "17.10.2026"), /updated/],
    ["an empty body", page.replace(/## [\s\S]*$/, ""), /empty/],
    ["an unknown key", page.replace("updated:", "author: x\nupdated:"), /author/],
  ])("rejects %s", (_, source, message) => {
    expect(() => parsePageMarkdown("x.md", source)).toThrow(message);
  });
});
