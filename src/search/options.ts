import type { Options } from "minisearch";

/** One searchable thing: a criterion, a glossary term, an example or an article of an act. */
export type SearchDoc = {
  id: string;
  kind: "kryterium" | "pojecie" | "przyklad" | "przepis";
  /** Criterion number, glossary slug, example slug or "act/article", used to build the link. */
  ref: string;
  title: string;
  summary: string;
  keywords: string;
  body: string;
};

/**
 * Lowercases and folds Polish diacritics, so "zrodlo" finds "źródło". "ł" does not decompose
 * in Unicode, so it is mapped by hand.
 */
export function foldTerm(term: string) {
  return term.toLocaleLowerCase("pl").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ł/g, "l");
}

/**
 * Splits on whitespace and punctuation but keeps criterion numbers like "1.4.3" whole,
 * so typing a number finds the criterion.
 */
function tokenize(text: string) {
  return text
    .split(/[\s,;:!?()[\]{}„”"'«»/\\|–—]+/)
    .map((token) => token.replace(/^\.+|\.+$/g, ""))
    .filter((token) => token !== "");
}

/**
 * Shared by the server, which builds and serializes the index, and the browser, which loads
 * it with MiniSearch.loadJSON. Both sides must use the same options.
 */
export const searchOptions = {
  fields: ["ref", "title", "summary", "keywords", "body"],
  storeFields: ["kind", "ref", "title", "summary"],
  tokenize,
  processTerm: (term) => {
    const folded = foldTerm(term);
    return folded.length > 1 || /\d/.test(folded) ? folded : null;
  },
  searchOptions: {
    prefix: true,
    // One typo in longer words only; more lets "kontrast" match "kontakt".
    fuzzy: (term: string) => (term.length > 5 ? 1 : false),
    combineWith: "AND",
    boost: { ref: 4, title: 3, keywords: 2, summary: 1.5 },
  },
} satisfies Options<SearchDoc>;
