/**
 * Imports the Polish acts of the legal module into src/content/legal.gen.ts (acts, chapters and
 * article index) and src/content/legal-text.gen.ts (the statute text, server-only).
 * Run by hand with `pnpm import:legal`; review the diff of the generated files in a PR.
 *
 * Source: the Sejm ELI API, api.sejm.gov.pl/eli. It serves the same acts as ISAP, whose pages
 * ask for a CAPTCHA. Each act is read from the consolidated text pinned below, or from its
 * original text when it has none. Amendments that took effect after that consolidated text
 * are recorded as `amendedAfter` and shown on the act page; we never merge them ourselves.
 *
 * The annex to the 2019 digital accessibility act is a table that exists only in the PDF. It
 * is transcribed by hand in src/content/annex-2019-848.ts; here it is only an index entry.
 */
import { type } from "arktype";
import { writeFileSync } from "node:fs";
import { readAct } from "./legal-html.ts";

const api = "https://api.sejm.gov.pl/eli/acts";

type Scope = "all" | { chapters: number[]; articles?: string[] };

// What we import and from which text. When ELI lists a newer consolidated text, update `text`.
const sources = [
  {
    slug: "ustawa-2019-848",
    eli: "DU/2019/848",
    text: "DU/2023/1440",
    scope: "all",
    annex: "Wytyczne dla dostępności treści internetowych 2.1 stosowane do stron internetowych i aplikacji mobilnych",
  },
  {
    slug: "ustawa-2019-1696",
    eli: "DU/2019/1696",
    text: "DU/2024/1411",
    // General provisions, the accessibility coordinator, complaints and requests for accessibility.
    scope: { chapters: [1, 4], articles: ["art-14"] },
  },
  {
    slug: "ustawa-2024-731",
    eli: "DU/2024/731",
    text: "DU/2024/731",
    // Leaves out market surveillance procedure (5) and amendments to other acts (7).
    scope: { chapters: [1, 2, 3, 4, 6, 8] },
  },
] as const satisfies readonly { slug: string; eli: string; text: string; scope: Scope; annex?: string }[];

// Only the fields we use; ArkType fails loudly if the API changes shape.
const ActMeta = type({
  ELI: "string",
  title: "string",
  displayAddress: "string",
  announcementDate: "string",
  "entryIntoForce?": "string",
  "references?": type({ "[string]": type({ id: "string", "date?": "string" }).array() }),
});

async function fetchOk(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${String(response.status)}`);
  return response;
}

const meta = async (eli: string) => ActMeta.assert(await (await fetchOk(`${api}/${eli}`)).json());

/** "DU/2019/848" as the Journal of Laws cites it, "Dz.U. 2019 poz. 848". */
const address = (eli: string) => {
  const [, year, pos] = eli.split("/");
  return `Dz.U. ${String(year)} poz. ${String(pos)}`;
};

const isap = (eli: string) => {
  const [, year = "", pos = ""] = eli.split("/");
  return `https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU${year}${pos.padStart(7, "0")}`;
};

const inScope = (scope: Scope, article: { slug: string; chapter: number | null }) =>
  scope === "all" ||
  (article.chapter !== null && scope.chapters.includes(article.chapter)) ||
  (scope.articles ?? []).includes(article.slug);

const today = new Date().toISOString().slice(0, 10);
const acts = [];
const units = [];
const texts: Record<string, unknown> = {};

for (const source of sources) {
  const act = await meta(source.eli);
  const consolidated = source.text === source.eli ? null : await meta(source.text);
  const html = await (await fetchOk(`${api}/${source.text}/text.html`)).text();
  const parsed = readAct(html);

  const textDate = consolidated?.announcementDate ?? act.announcementDate;
  const amendedAfter = (act.references?.["Akty zmieniające"] ?? [])
    .filter((ref) => ref.date !== undefined && ref.date > textDate)
    .map((ref) => ({ eli: ref.id, label: address(ref.id), from: ref.date ?? "" }));
  for (const change of amendedAfter) {
    console.warn(`${source.slug}: amended by ${change.label} from ${change.from}, after the text of ${textDate}`);
  }

  const articles = parsed.articles.filter((article) => inScope(source.scope, article));
  const chapters = parsed.chapters.filter((chapter) => articles.some((a) => a.chapter === chapter.number));
  acts.push({
    slug: source.slug,
    eli: source.eli,
    title: act.title,
    address: act.displayAddress,
    isap: isap(source.eli),
    ...(act.entryIntoForce ? { inForce: act.entryIntoForce } : {}),
    consolidated: consolidated ? { eli: source.text, address: consolidated.displayAddress, date: consolidated.announcementDate } : null,
    retrieved: today,
    complete: source.scope === "all",
    amendedAfter,
    chapters,
  });
  for (const article of articles) {
    const id = `${source.slug}/${article.slug}`;
    units.push({ id, act: source.slug, slug: article.slug, label: article.label, chapter: article.chapter });
    texts[id] = article.lines;
  }
  if ("annex" in source) {
    units.push({ id: `${source.slug}/zal`, act: source.slug, slug: "zal", label: "Załącznik", chapter: null });
  }
  console.log(`${source.slug}: ${String(articles.length)} of ${String(parsed.articles.length)} articles from ${address(source.text)}`);
}

const json = (value: unknown) => JSON.stringify(value, null, 2);
const header = `// Generated by scripts/import-legal.ts on ${today}. Do not edit by hand, rerun \`pnpm import:legal\`.
// Source: ${api} (Sejm ELI API, the data behind ISAP).`;

writeFileSync(
  new URL("../src/content/legal.gen.ts", import.meta.url),
  `${header}

export const acts = ${json(acts)} as const;

/** Articles in scope, plus the annex of the 2019 act, in statute order. */
export const legalUnits = ${json(units)} as const;
`,
);

writeFileSync(
  new URL("../src/content/legal-text.gen.ts", import.meta.url),
  `${header}
// Server-only: import it from server code, never from components.

export type LegalLine = { label: string | null; depth: number; ust: string | null; text: string };

/** Statute text of every article in legal.gen.ts, as lines in document order. */
export const legalTexts: Readonly<Record<string, readonly LegalLine[]>> = ${json(texts)};
`,
);

console.log(`Wrote ${String(acts.length)} acts and ${String(units.length)} units`);
