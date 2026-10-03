/**
 * How the ARIA patterns are grouped and judged. Safe for the client: the catalogue, the pattern
 * page and the parser in patterns.ts all read these ids.
 */

/** Batches from the phase 9 plan, in catalogue order. Each teaches one idea. */
export const patternBatchIds = ["html", "pokazywanie", "zlozone", "zmiany"] as const;
export type PatternBatch = (typeof patternBatchIds)[number];

export const patternBatches = {
  html: { title: "Najpierw HTML", lead: "Element natywny robi większość pracy. Zobacz, co dostajesz za darmo." },
  pokazywanie: { title: "Pokazywanie i ukrywanie", lead: "Przycisk otwiera coś, co było schowane, i mówi, czy jest otwarte." },
  zlozone: { title: "Złożone kontrolki", lead: "Jeden przystanek Tab, a w środku strzałki. Tu każdy klawisz piszesz sam." },
  zmiany: { title: "Treść, która się zmienia", lead: "Strona zmienia się bez ruchu fokusu, a czytnik musi się o tym dowiedzieć." },
} as const satisfies Record<PatternBatch, { title: string; lead: string }>;

/**
 * Whether HTML has the element for the job. Every pattern page opens with this verdict, so the
 * catalogue does not teach "reach for ARIA". The glyph's shape and the label carry the meaning,
 * never colour.
 */
export const nativeVerdictIds = ["html", "html-i-aria", "tylko-aria"] as const;
export type NativeVerdict = (typeof nativeVerdictIds)[number];

export const nativeVerdicts = {
  html: { glyph: "●", label: "Wystarczy HTML" },
  "html-i-aria": { glyph: "◐", label: "HTML z dodatkiem ARIA" },
  "tylko-aria": { glyph: "○", label: "Tylko ARIA" },
} as const satisfies Record<NativeVerdict, { glyph: string; label: string }>;

export function isNativeVerdict(value: unknown): value is NativeVerdict {
  return typeof value === "string" && Object.hasOwn(nativeVerdicts, value);
}

/** Sections a pattern file may have, as `## <title>`, in this order. The first two are required. */
export const patternSections = [
  { key: "kiedy", title: "Kiedy używać" },
  { key: "bledy", title: "Typowe błędy" },
  { key: "sprawdz", title: "Jak sprawdzić" },
] as const;
export type PatternSectionKey = (typeof patternSections)[number]["key"];
