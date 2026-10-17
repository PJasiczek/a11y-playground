import { describe, expect, test } from "vitest";
import { pageSchemas, parsePageMarkdown, standalonePage } from "./pages";

const page = `---
title: Polityka prywatności
description: Jakie dane zbieramy.
updated: 2026-10-17
---
## Kto odpowiada za dane

Tekst.
`;

const contact = page.replace("updated:", "email: jan@przyklad.pl\nupdated:");

describe("standalone pages", () => {
  test.each(["prywatnosc", "kontakt"] as const)("%s parses", (slug) => {
    expect(standalonePage(slug).title).not.toBe("");
  });
});

describe("parsePageMarkdown", () => {
  test("renders the body", () => {
    const parsed = parsePageMarkdown(pageSchemas.prywatnosc, "x.md", page);
    expect(parsed.updated).toBe("2026-10-17");
    expect(parsed.html).toBe("<h2>Kto odpowiada za dane</h2>\n<p>Tekst.</p>\n");
  });

  test("reads the contact address", () => {
    expect(parsePageMarkdown(pageSchemas.kontakt, "x.md", contact).email).toBe("jan@przyklad.pl");
  });

  test.each([
    ["a date that is not ISO", pageSchemas.prywatnosc, page.replace("2026-10-17", "17.10.2026"), /updated/],
    ["an empty body", pageSchemas.prywatnosc, page.replace(/## [\s\S]*$/, ""), /empty/],
    ["an unknown key", pageSchemas.prywatnosc, page.replace("updated:", "author: x\nupdated:"), /author/],
    ["a contact page without an address", pageSchemas.kontakt, page, /email/],
    ["an address that is not one", pageSchemas.kontakt, contact.replace("jan@przyklad.pl", "jan przyklad.pl"), /email/],
    ["an unknown key on the contact page", pageSchemas.kontakt, contact.replace("updated:", "author: x\nupdated:"), /author/],
  ])("rejects %s", (_, schema, source, message) => {
    expect(() => parsePageMarkdown(schema, "x.md", source)).toThrow(message);
  });
});
