/**
 * Names shared by the parser in before-after.ts, the pages and the notes. Safe for the client.
 */

/** The progress store keeps the reader's notes and the end of the check under this key. */
export const reviewKey = "przed-i-po";

/** Who a problem hurts, as written in the `who` frontmatter and filtered on the list (?komu=). */
export const harmedIds = ["klawiatura", "czytnik", "slabe-widzenie", "daltonizm", "poznawcze", "telefon"] as const;
export type Harmed = (typeof harmedIds)[number];

export const harmedLabels = {
  klawiatura: "Klawiatura",
  czytnik: "Czytnik ekranu",
  "slabe-widzenie": "Słabe widzenie",
  daltonizm: "Daltonizm",
  poznawcze: "Trudności poznawcze",
  telefon: "Telefon i dotyk",
} as const satisfies Record<Harmed, string>;

export function isHarmed(value: unknown): value is Harmed {
  return typeof value === "string" && Object.hasOwn(harmedLabels, value);
}
