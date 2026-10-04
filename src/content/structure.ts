import { computeAccessibleName, isInaccessible } from "dom-accessibility-api";
import { countOf } from "../lib/plural";
import { polishRoles } from "./announce";

/**
 * The landmarks and headings of a page, the two things a screen reader lets you jump between,
 * and what is wrong with them. Runs on the app's own pages (the "Struktura strony" tool loads it
 * on first use) and inside example frames (bundled as virtual:structure, see frame-script.vite.ts),
 * so it imports only plain modules, by relative paths.
 *
 * scanStructure reads the page, markStructure draws the outlines from that reading, and
 * clearStructure takes them off again. Scan before marking: the labels are CSS generated content,
 * which dom-accessibility-api would read into heading names.
 */

export const landmarkRoles = ["banner", "navigation", "main", "complementary", "contentinfo", "search", "form", "region"] as const;
export type LandmarkRole = (typeof landmarkRoles)[number];

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type Landmark = { role: LandmarkRole; name: string; element: Element; children: Landmark[] };

/** `after` is the level of the heading before, set only when this one skips levels below it. */
export type Heading = { level: HeadingLevel; text: string; element: Element; after: HeadingLevel | null };

export type Finding =
  | { kind: "brak-main" }
  | { kind: "brak-banera" }
  | { kind: "brak-stopki" }
  | { kind: "powtorzony"; role: "main" | "banner" | "contentinfo"; count: number }
  | { kind: "nierozroznialne"; role: LandmarkRole; count: number }
  | { kind: "brak-h1" }
  | { kind: "wiele-h1"; count: number }
  | { kind: "przeskok"; after: HeadingLevel; level: HeadingLevel; text: string }
  | { kind: "pusty-naglowek" }
  | { kind: "poza-punktami"; count: number };

export type Structure = { landmarks: Landmark[]; headings: Heading[]; findings: Finding[] };

/** Which outlines to draw. The text list beside them always covers both. */
export type StructureView = { landmarks: boolean; headings: boolean };

/** Put on the tool's own interface, which the scan leaves out. */
export const ignoreAttribute = "data-a11y-structure-ignore";

const isLandmarkRole = (role: string): role is LandmarkRole => (landmarkRoles as readonly string[]).includes(role);
const isHeadingLevel = (level: number): level is HeadingLevel => Number.isInteger(level) && level >= 1 && level <= 6;

// header and footer inside these are not the page's banner and contentinfo (HTML-AAM).
const sectioning =
  "article, aside, main, nav, section, [role=article], [role=complementary], [role=main], [role=navigation], [role=region]";
// Live regions speak for themselves, so their text does not count as lost outside landmarks.
const live = "[aria-live], [role=status], [role=alert], [role=log]";

function firstRole(element: Element) {
  return element.getAttribute("role")?.trim().split(/\s+/)[0] ?? "";
}

/**
 * The landmark role an element exposes, or null. dom-accessibility-api's getRole maps header,
 * footer and section without looking at scope or name, so this follows HTML-AAM directly.
 */
function landmarkRole(element: Element, name: string): LandmarkRole | null {
  const explicit = firstRole(element);
  if (explicit) {
    if (!isLandmarkRole(explicit)) return null;
    return (explicit === "region" || explicit === "form") && !name ? null : explicit;
  }
  const scoped = element.parentElement?.closest(sectioning) != null;
  switch (element.localName) {
    case "header":
      return scoped ? null : "banner";
    case "footer":
      return scoped ? null : "contentinfo";
    case "aside":
      return scoped && !name ? null : "complementary";
    case "nav":
      return "navigation";
    case "main":
      return "main";
    case "search":
      return "search";
    case "section":
      return name ? "region" : null;
    case "form":
      return name ? "form" : null;
    default:
      return null;
  }
}

function headingLevel(element: Element): HeadingLevel | null {
  const explicit = firstRole(element);
  const tag = /^h([1-6])$/.exec(element.localName);
  if (explicit ? explicit !== "heading" : !tag) return null;
  const level = Number(element.getAttribute("aria-level") ?? tag?.[1] ?? 2);
  return isHeadingLevel(level) ? level : 2;
}

const nameOf = (element: Element) => computeAccessibleName(element).replace(/\s+/g, " ").trim();

/** Every landmark, depth first, with how deep it is nested in other landmarks. */
export function flatten(landmarks: readonly Landmark[], depth = 0): { landmark: Landmark; depth: number }[] {
  return landmarks.flatMap((landmark) => [{ landmark, depth }, ...flatten(landmark.children, depth + 1)]);
}

/** Reads the landmarks, headings and findings under `root`, as a screen reader would see them. */
export function scanStructure(root: Element): Structure {
  const landmarks: Landmark[] = [];
  const headings: Heading[] = [];
  const found = new Map<Element, Landmark>();
  let previous: HeadingLevel | null = null;

  const candidates = root.querySelectorAll("header, footer, nav, main, aside, section, form, search, [role], h1, h2, h3, h4, h5, h6");
  for (const element of candidates) {
    if (element.closest(`[${ignoreAttribute}]`) || isInaccessible(element)) continue;

    const level = headingLevel(element);
    if (level) {
      const after = previous !== null && level > previous + 1 ? previous : null;
      headings.push({ level, text: nameOf(element), element, after });
      previous = level;
      continue;
    }

    const name = nameOf(element);
    const role = landmarkRole(element, name);
    if (!role) continue;
    const landmark: Landmark = { role, name, element, children: [] };
    found.set(element, landmark);
    (enclosing(element, root, found)?.children ?? landmarks).push(landmark);
  }

  return { landmarks, headings, findings: findingsOf(landmarks, headings, textOutside(root, found)) };
}

function enclosing(element: Element, root: Element, found: ReadonlyMap<Element, Landmark>) {
  for (let parent = element.parentElement; parent && parent !== root.parentElement; parent = parent.parentElement) {
    const landmark = found.get(parent);
    if (landmark) return landmark;
  }
  return undefined;
}

/** How many visible pieces of text sit outside every landmark, where only reading line by line reaches them. */
function textOutside(root: Element, found: ReadonlyMap<Element, Landmark>) {
  const outside = new Map<Element, boolean>();
  const isOutside = (element: Element): boolean => {
    const known = outside.get(element);
    if (known !== undefined) return known;
    let result = !element.closest(`[${ignoreAttribute}], ${live}, script, style, template, noscript`) && !isInaccessible(element);
    for (let parent: Element | null = element; result && parent; parent = parent.parentElement) {
      if (found.has(parent)) result = false;
    }
    outside.set(element, result);
    return result;
  };

  let count = 0;
  // 4 is NodeFilter.SHOW_TEXT, written out so this also runs where NodeFilter is not a global.
  const walker = root.ownerDocument.createTreeWalker(root, 4);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.textContent?.trim() && node.parentElement && isOutside(node.parentElement)) count += 1;
  }
  return count;
}

function findingsOf(landmarks: readonly Landmark[], headings: readonly Heading[], outside: number): Finding[] {
  const all = flatten(landmarks).map(({ landmark }) => landmark);
  const ofRole = (role: LandmarkRole) => all.filter((landmark) => landmark.role === role);
  const findings: Finding[] = [];

  if (ofRole("main").length === 0) findings.push({ kind: "brak-main" });
  if (ofRole("banner").length === 0) findings.push({ kind: "brak-banera" });
  if (ofRole("contentinfo").length === 0) findings.push({ kind: "brak-stopki" });
  for (const role of ["main", "banner", "contentinfo"] as const) {
    const count = ofRole(role).length;
    if (count > 1) findings.push({ kind: "powtorzony", role, count });
  }
  for (const role of landmarkRoles) {
    if (role === "main" || role === "banner" || role === "contentinfo") continue;
    const same = ofRole(role);
    if (same.length > 1 && new Set(same.map((landmark) => landmark.name)).size < same.length) {
      findings.push({ kind: "nierozroznialne", role, count: same.length });
    }
  }

  const h1 = headings.filter((heading) => heading.level === 1).length;
  if (h1 === 0) findings.push({ kind: "brak-h1" });
  if (h1 > 1) findings.push({ kind: "wiele-h1", count: h1 });
  for (const { after, level, text } of headings) {
    if (after !== null) findings.push({ kind: "przeskok", after, level, text });
    if (!text) findings.push({ kind: "pusty-naglowek" });
  }
  if (outside > 0) findings.push({ kind: "poza-punktami", count: outside });
  return findings;
}

/** "H3" for one skipped level, "H2–H3" for more. */
export function skippedLevels(after: HeadingLevel, level: HeadingLevel) {
  return level - after === 2 ? `H${String(after + 1)}` : `H${String(after + 1)}–H${String(level - 1)}`;
}

/** The role as a Polish screen reader names it, with the name after a colon. */
export function landmarkLabel({ role, name }: Pick<Landmark, "role" | "name">) {
  const word = polishRoles[role] ?? role;
  return name ? `${word}: ${name}` : word;
}

/** One finding as a sentence for the list. */
export function describeFinding(finding: Finding): string {
  switch (finding.kind) {
    case "brak-main":
      return "Brak obszaru głównego (main). Czytnik nie ma skrótu do treści strony.";
    case "brak-banera":
      return "Brak banera (header poza sekcjami). Nie jest wymagany, ale prowadzi prosto do logo i menu.";
    case "brak-stopki":
      return "Brak stopki (footer poza sekcjami). Nie jest wymagana, ale prowadzi prosto do informacji o serwisie.";
    case "powtorzony":
      return `${String(finding.count)} × ${landmarkLabel({ role: finding.role, name: "" })}. Taki obszar powinien być jeden.`;
    case "nierozroznialne":
      return `${String(finding.count)} × ${landmarkLabel({ role: finding.role, name: "" })} bez różnych nazw. Czytnik nie powie, który jest który.`;
    case "brak-h1":
      return "Brak nagłówka H1, który mówi, o czym jest strona.";
    case "wiele-h1":
      return `${countOf(finding.count, ["nagłówek", "nagłówki", "nagłówków"])} H1. Zwykle wystarcza jeden.`;
    case "przeskok":
      return `Po H${String(finding.after)} od razu H${String(finding.level)} („${finding.text}”). Pominięte: ${skippedLevels(finding.after, finding.level)}.`;
    case "pusty-naglowek":
      return "Nagłówek bez tekstu. Na liście nagłówków czytnika będzie pusty.";
    case "poza-punktami":
      return `${countOf(finding.count, ["fragment tekstu", "fragmenty tekstu", "fragmentów tekstu"])} poza punktami orientacyjnymi. Czytnik dojdzie tam tylko, czytając po kolei.`;
  }
}

const attributes = {
  landmark: "data-a11y-landmark",
  role: "data-a11y-role",
  position: "data-a11y-pos",
  heading: "data-a11y-heading",
  skip: "data-a11y-skip",
  stack: "data-a11y-stack",
} as const;

/** Put on a decorative square in a list to show the colour of a landmark role. */
export const swatchAttribute = "data-a11y-swatch";

const styleId = "a11y-structure-styles";

// A hue per role, for the light and the dark theme. Every one is at least 4.5:1 against the
// background of its theme, so the label text in that colour stays readable.
const hues = {
  banner: ["#8a4b00", "#f0b36b"],
  navigation: ["#0a6363", "#6fd3d3"],
  main: ["#6a2c91", "#d4a6f5"],
  complementary: ["#0b4f8a", "#8cc4ff"],
  contentinfo: ["#3d4a5c", "#b4c2d6"],
  search: ["#a3135a", "#ff9ecb"],
  form: ["#4d5b16", "#bfd77c"],
  region: ["#6e5400", "#e3c75a"],
} as const satisfies Record<LandmarkRole, readonly [string, string]>;

const hatch = "repeating-linear-gradient(135deg, color-mix(in srgb, var(--a11y-l) 8%, transparent) 0 6px, transparent 6px 12px)";
const mono = 'ui-monospace, "Cascadia Mono", Consolas, monospace';

// Variant 2C of the landmarks mocks: a hue per role, a faint hatch so nesting reads as layers,
// and the label in the top right corner. Colour is never the only cue, the label names the role.
// Labels use `content: x / ""`, so screen readers skip them; the text list says the same.
// Unlayered on purpose: it must win over the app's Tailwind layers while the tool is on.
const styles = `
  ${Object.entries(hues)
    .map(([role, [light, dark]]) => `[${attributes.role}="${role}"], [${swatchAttribute}="${role}"] { --a11y-l: light-dark(${light}, ${dark}); }`)
    .join("\n  ")}
  [data-a11y-pos] { position: relative; }
  [data-a11y-landmark] { outline: 2px solid var(--a11y-l); outline-offset: -2px; background-image: ${hatch}; }
  [data-a11y-landmark]::before {
    content: attr(data-a11y-landmark); content: attr(data-a11y-landmark) / "";
    position: absolute; top: 0; right: 0; z-index: 2147483646; max-width: 100%;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    padding: 0.125rem 0.375rem; border: 2px solid var(--a11y-l); border-block-start: 0; border-inline-end: 0;
    background: Canvas; color: var(--a11y-l);
    font: 700 0.75rem/1.4 ${mono}; letter-spacing: 0; text-transform: none;
    pointer-events: none;
  }
  [data-a11y-stack="1"]::before { top: 1.375rem; }
  [data-a11y-stack="2"]::before { top: 2.75rem; }
  [data-a11y-stack="3"]::before { top: 4.125rem; }
  [${swatchAttribute}] { display: inline-block; flex: none; width: 0.875rem; height: 0.875rem; border: 2px solid var(--a11y-l); background-image: ${hatch}; }
  [data-a11y-heading] { outline: 2px dotted currentColor; outline-offset: 2px; }
  [data-a11y-heading]::before {
    content: attr(data-a11y-heading); content: attr(data-a11y-heading) / "";
    display: inline-block; margin-inline-end: 0.5em; padding: 0.125rem 0.375rem; border-radius: 2px;
    background: CanvasText; color: Canvas; vertical-align: 0.2em;
    font: 700 0.75rem/1.3 ${mono}; letter-spacing: 0; text-transform: none;
  }
  [data-a11y-skip]::before { background: light-dark(#9a1b1b, #ffa3a3); }
  :is([data-a11y-landmark], [data-a11y-heading]):focus-visible { outline: 3px solid light-dark(#2c36a8, #aeb5ff); outline-offset: 2px; }
  @media (forced-colors: active) {
    [${attributes.role}], [${swatchAttribute}] { --a11y-l: CanvasText; }
    [data-a11y-skip]::before { background: Mark; color: MarkText; }
  }
`;

/** "H2", or "H4 · pominięte H2–H3" for a heading that skips levels. */
export function headingLabel({ level, after }: Pick<Heading, "level" | "after">) {
  return after ? `H${String(level)} · pominięte ${skippedLevels(after, level)}` : `H${String(level)}`;
}

/** Draws the outlines of a scan. Call clearStructure first when drawing a new one. */
export function markStructure(structure: Structure, view: StructureView, document: Document) {
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = styles;
    document.head.append(style);
  }
  if (view.landmarks) {
    for (const { landmark } of flatten(structure.landmarks)) {
      const { element } = landmark;
      element.setAttribute(attributes.landmark, landmarkLabel(landmark));
      element.setAttribute(attributes.role, landmark.role);
      // The label is placed against its landmark; anything already positioned keeps its own position.
      if (document.defaultView?.getComputedStyle(element).position === "static") element.setAttribute(attributes.position, "");
    }
    stackLabels(structure.landmarks, []);
  }
  if (view.headings) {
    for (const heading of structure.headings) {
      heading.element.setAttribute(attributes.heading, headingLabel(heading));
      if (heading.after) heading.element.setAttribute(attributes.skip, "");
    }
  }
}

/**
 * Moves a label down when the landmark starts near the top right corner of a landmark around it
 * (main that starts with the breadcrumbs), so no label hides another.
 */
function stackLabels(landmarks: readonly Landmark[], corners: readonly DOMRect[]) {
  for (const { element, children } of landmarks) {
    const box = element.getBoundingClientRect();
    const shared = corners.filter((corner) => Math.abs(corner.top - box.top) < 24 && Math.abs(corner.right - box.right) < 120).length;
    if (shared > 0) element.setAttribute(attributes.stack, String(Math.min(shared, 3)));
    stackLabels(children, [...corners, box]);
  }
}

/** Takes every outline and the stylesheet off the document. */
export function clearStructure(document: Document) {
  for (const name of Object.values(attributes)) {
    for (const element of document.querySelectorAll(`[${name}]`)) element.removeAttribute(name);
  }
  document.getElementById(styleId)?.remove();
}

const headingKinds: ReadonlySet<Finding["kind"]> = new Set(["brak-h1", "wiele-h1", "przeskok", "pusty-naglowek"]);

/** The findings about what is on view, as sentences: heading findings with headings, the rest with landmarks. */
export function findingsFor(findings: readonly Finding[], view: StructureView) {
  return findings.filter((finding) => (headingKinds.has(finding.kind) ? view.headings : view.landmarks)).map(describeFinding);
}

/** What an example frame posts to the page: the scan as text, without elements. */
export type StructureSummary = {
  landmarks: { label: string; depth: number }[];
  headings: { label: string; text: string }[];
  findings: string[];
};

export function summarize({ landmarks, headings, findings }: Structure, view: StructureView): StructureSummary {
  return {
    landmarks: view.landmarks ? flatten(landmarks).map(({ landmark, depth }) => ({ label: landmarkLabel(landmark), depth })) : [],
    headings: view.headings ? headings.map((heading) => ({ label: headingLabel(heading), text: heading.text })) : [],
    findings: findingsFor(findings, view),
  };
}
