import type { Level } from "~/content/wcag";

/** Conformance level as bordered letters. The level is never carried by colour alone (1.4.1). */
export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className="rounded-xs border border-current px-1.5 py-1 font-mono text-xs leading-none font-semibold tracking-wide whitespace-nowrap">
      <span className="sr-only">Poziom </span>
      {level}
    </span>
  );
}

/** Marks criteria added in WCAG 2.2. The marker colour always sits next to its text label. */
export function NewBadge() {
  return (
    <span className="rounded-xs border border-on-marker bg-marker px-1.5 py-1 font-mono text-xs leading-none font-semibold whitespace-nowrap text-on-marker">
      nowe w 2.2
    </span>
  );
}

/** Content written but not yet checked by a person. Dashed border and a glyph, so not colour alone. */
export function DraftBadge({ long = false }: { long?: boolean }) {
  return (
    <span className="rounded-xs border border-dashed border-ink px-1.5 py-1 font-mono text-xs leading-none font-semibold whitespace-nowrap text-ink">
      <span aria-hidden="true">✎ </span>
      {long ? "szkic, czeka na weryfikację" : "szkic"}
    </span>
  );
}
