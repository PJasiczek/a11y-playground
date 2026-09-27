/**
 * Imports the WCAG 2.2 structure with Polish names into src/content/wcag.gen.ts, and the Polish
 * normative text of criteria and glossary terms into src/content/wcag-text.gen.ts.
 * Run by hand with `pnpm import:wcag`; review the diff of the generated files in a PR.
 *
 * Sources:
 * - numbers, W3C ids, levels and versions: the wcag.json that W3C publishes for WCAG 2.2,
 * - Polish names of principles, guidelines and the 78 criteria of WCAG 2.1:
 *   the authorized W3C translation of WCAG 2.1,
 * - Polish names of the 9 criteria new in 2.2: the unofficial IRDPL translation of WCAG 2.2,
 *   because W3C has no authorized Polish translation of 2.2 yet,
 * - normative text of criteria and glossary definitions: the authorized translation of 2.1 only.
 *   Text from IRDPL is not copied until IRDPL confirms the licence.
 *
 * The text files are kept apart from the structure because only the server needs them;
 * the structure is small enough to ship to the browser.
 */
import { type } from "arktype";
import { writeFileSync } from "node:fs";

const sources = {
  structure: "https://www.w3.org/WAI/WCAG22/wcag.json",
  w3cPl: "https://www.w3.org/Translations/WCAG21-pl/",
  irdplPl: "https://wcag.irdpl.pl/guidelines/22/",
} as const;

const outFile = new URL("../src/content/wcag.gen.ts", import.meta.url);
const textFile = new URL("../src/content/wcag-text.gen.ts", import.meta.url);

// Only the fields we use; ArkType ignores the rest and fails loudly if W3C changes the shape.
const W3cStructure = type({
  principles: type({
    num: "string",
    guidelines: type({
      num: "string",
      successcriteria: type({ num: "string", id: "string", level: "'A' | 'AA' | 'AAA' | ''", versions: "string[]" }).array(),
    }).array(),
  }).array(),
});

async function fetchText(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${String(response.status)}`);
  return response.text();
}

/**
 * Reads ReSpec headings such as `<bdi class="secno">Kryterium sukcesu 1.1.1 </bdi> Treść nietekstowa`
 * into a map from number to name. Principles use a bare "1. " secno on an h2.
 */
function readHeadings(html: string) {
  const flat = html.replace(/\s+/g, " ");
  const names = new Map<string, string>();
  const levels = new Map<string, string>();
  for (const [, tag, secno = "", rest = ""] of flat.matchAll(/<h([2-4])[^>]*> ?<bdi class="secno">([^<]*)<\/bdi> ?([^<]*)/g)) {
    const label = secno.trim();
    const name = rest.trim();
    const numbered = /^(?:Wytyczna|Kryterium sukcesu) ([\d.]+)$/.exec(label);
    if (numbered?.[1]) names.set(numbered[1], name);
    else if (tag === "2" && /^[1-4]\.$/.test(label)) names.set(label.slice(0, 1), name);
  }
  for (const [, num = "", level = ""] of flat.matchAll(/Kryterium sukcesu ([\d.]+) <\/bdi>.*?\(Poziom (A{1,3})\)/g)) {
    levels.set(num, level);
  }
  return { names, levels };
}

const keptTags = new Set(["p", "ul", "ol", "li", "dl", "dt", "dd", "em", "strong", "code"]);

/**
 * Reduces ReSpec HTML to paragraphs, lists, definition lists and emphasis, with no attributes.
 * Links become plain text. W3C notes ("Uwaga") become blockquotes that keep their title, and
 * examples get a "Przykład:" lead, so the meaning survives without the original styling.
 */
function sanitize(html: string) {
  const out: string[] = [];
  const divs: ("note" | "title" | "plain")[] = [];
  let title = "";
  for (const token of html.split(/(<[^>]+>)/)) {
    const tag = /^<(\/?)([a-z0-9]+)([^>]*)>$/i.exec(token);
    const inTitle = divs.includes("title");
    if (!tag) {
      if (inTitle) title += token;
      else out.push(token);
      continue;
    }
    const [, close = "", name = "", attrs = ""] = tag;
    if (name === "div") {
      if (!close) {
        const kind = attrs.includes("note-title") ? "title" : attrs.includes('class="note"') ? "note" : "plain";
        divs.push(kind);
        if (kind === "note") out.push("<blockquote>");
        if (kind === "title") title = "";
      } else {
        const kind = divs.pop();
        if (kind === "note") out.push("</blockquote>");
        if (kind === "title") out.push(`<p><strong>${title.trim()}</strong></p>`);
      }
    } else if (inTitle) {
      continue;
    } else if (keptTags.has(name)) {
      out.push(`<${close}${name}>`);
      if (!close && name === "p" && attrs.includes('class="example"')) out.push("<em>Przykład:</em> ");
    } else if (name === "br") {
      out.push(" ");
    }
  }
  return out
    .join("")
    .replace(/\s+/g, " ")
    .replace(/(<(?:p|li|dt|dd|blockquote)>) /g, "$1")
    .replace(/ (<\/(?:p|li|dt|dd|blockquote)>)/g, "$1")
    .replace(/ ([,.;:!?)])/g, "$1")
    .replace(/\( /g, "(")
    .replace(/<p><\/p>/g, "")
    .replace(/> </g, "><")
    .trim();
}

/** Normative text of every criterion in the 2.1 translation, keyed by number. */
function readCriterionTexts(html: string) {
  const texts = new Map<string, string>();
  for (const [, section = ""] of html.matchAll(/<section class="sc"[^>]*>([\s\S]*?)<\/section>/g)) {
    const num = /Kryterium sukcesu ([\d.]+)/.exec(section)?.[1];
    const body = section.split(/<p class="conformance-level">[^<]*<\/p>/)[1];
    if (!num || body === undefined) throw new Error("Unexpected criterion section shape");
    texts.set(num, sanitize(body));
  }
  return texts;
}

/** Definitions from the glossary (section 8) of the 2.1 translation, keyed by the defined term. */
function readGlossary(html: string) {
  const start = html.indexOf('id="x8-s-ownik"');
  const end = html.indexOf('id="x9-', start);
  const terms = new Map<string, string>();
  for (const [, dt = "", dd = ""] of html.slice(start, end).matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/g)) {
    const term = dt.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    terms.set(term, sanitize(dd));
  }
  return terms;
}

function pick(map: Map<string, string>, key: string, what: string) {
  const value = map.get(key);
  if (!value) throw new Error(`Missing ${what} for ${key}`);
  return value;
}

const [structureJson, w3cHtml, irdplHtml] = await Promise.all([
  fetchText(sources.structure),
  fetchText(sources.w3cPl),
  fetchText(sources.irdplPl),
]);
const structure = W3cStructure.assert(JSON.parse(structureJson));
const w3c = readHeadings(w3cHtml);
const irdpl = readHeadings(irdplHtml);

const principles = structure.principles.map((p) => ({ num: p.num, name: pick(w3c.names, p.num, "principle name") }));
const guidelines = structure.principles.flatMap((p) =>
  p.guidelines.map((g) => ({ num: g.num, name: pick(w3c.names, g.num, "guideline name"), principle: p.num })),
);
const criteria = structure.principles.flatMap((p) =>
  p.guidelines.flatMap((g) =>
    g.successcriteria.map((c) => {
      const inW3cPl = c.versions.includes("2.1");
      // 4.1.1 has no level in the 2.2 data because it was removed; the 2.1 text still states it.
      const level = c.level || pick(w3c.levels, c.num, "level");
      if (inW3cPl && pick(w3c.levels, c.num, "level") !== level) throw new Error(`Level mismatch for ${c.num}`);
      return {
        id: c.num,
        w3cId: c.id,
        name: inW3cPl ? pick(w3c.names, c.num, "criterion name") : pick(irdpl.names, c.num, "criterion name"),
        nameSource: inW3cPl ? "w3c" : "irdpl",
        level,
        versions: c.versions,
        guideline: g.num,
        principle: p.num,
      };
    }),
  ),
);

const today = new Date().toISOString().slice(0, 10);
const json = (value: unknown) => JSON.stringify(value, null, 2);

writeFileSync(
  outFile,
  `// Generated by scripts/import-wcag.ts on ${today}. Do not edit by hand, rerun \`pnpm import:wcag\`.
// Structure: ${sources.structure}
// Names: ${sources.w3cPl} (nameSource "w3c", authorized translation of WCAG 2.1)
//        ${sources.irdplPl} (nameSource "irdpl", unofficial translation of WCAG 2.2)

export const principles = ${json(principles)} as const;

export const guidelines = ${json(guidelines)} as const;

export const criteria = ${json(criteria)} as const;
`,
);

const criterionTexts = readCriterionTexts(w3cHtml);
const glossary = readGlossary(w3cHtml);

writeFileSync(
  textFile,
  `// Generated by scripts/import-wcag.ts on ${today}. Do not edit by hand, rerun \`pnpm import:wcag\`.
// Source: ${sources.w3cPl} (authorized translation of WCAG 2.1, W3C Document License).
// Server-only: import it from server code, never from components.

/** Normative Polish text of criteria in WCAG 2.1, as sanitized HTML, keyed by criterion number. */
export const criterionTexts: Readonly<Record<string, string>> = ${json(Object.fromEntries(criterionTexts))};

/** Normative Polish definitions from the WCAG 2.1 glossary, as sanitized HTML, keyed by term. */
export const wcagGlossary: Readonly<Record<string, string>> = ${json(Object.fromEntries(glossary))};
`,
);

console.log(`Wrote ${String(criteria.length)} criteria to ${outFile.pathname}`);
console.log(`Wrote ${String(criterionTexts.size)} criterion texts and ${String(glossary.size)} terms to ${textFile.pathname}`);
