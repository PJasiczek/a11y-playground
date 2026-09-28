/**
 * Reads the statute HTML served by the Sejm ELI API (api.sejm.gov.pl/eli/acts/…/text.html)
 * into articles with their text as flat lines. Used by scripts/import-legal.ts; kept free of
 * I/O so the tests can feed it saved fragments.
 *
 * The API marks every editorial unit as `<div class="unit unit_<kind>">` with the label in an
 * `h3` and the content in `div.unit-inner`: chapters (chpt), articles (arti), ustępy (pass),
 * punkty (pint) and litery (lett). Tirets are `ul.enum` lists. Footnotes are `a.gloss-link`.
 * Quoted text of other acts (amendments, the Marshal's notice) carries `pro-cite-text` and is
 * skipped.
 */

type Element = { tag: string; attrs: Record<string, string>; children: Node[] };
type Node = Element | string;

/** One line of statute text. `ust` is the ustęp it belongs to, for anchors and summaries. */
export type LegalLine = { label: string | null; depth: number; ust: string | null; text: string };

export type ParsedArticle = {
  /** "Art. 5a" as people cite it, without the trailing period. */
  label: string;
  /** "art-5a", unique within the act. */
  slug: string;
  chapter: number | null;
  lines: LegalLine[];
};

export type ParsedAct = { chapters: { number: number; title: string }[]; articles: ParsedArticle[] };

const voidTags = new Set(["br", "hr", "img", "input", "meta", "link", "wbr"]);

const entities: Record<string, string> = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

function decode(text: string) {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code.startsWith("#x") || code.startsWith("#X")) return String.fromCodePoint(parseInt(code.slice(2), 16));
    if (code.startsWith("#")) return String.fromCodePoint(parseInt(code.slice(1), 10));
    return entities[code.toLowerCase()] ?? match;
  });
}

/** A forgiving tree builder for the API's HTML, which is well formed apart from tag case. */
export function parseHtml(html: string): Element {
  const root: Element = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];
  for (const [token] of html.matchAll(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g)) {
    const current = stack.at(-1) ?? root;
    if (token.startsWith("<!--") || token.startsWith("<!")) continue;
    const tag = /^<(\/?)([a-zA-Z][\w-]*)([^>]*?)\/?>$/.exec(token);
    if (!tag) {
      current.children.push(decode(token));
      continue;
    }
    const [, close, rawName = "", rawAttrs = ""] = tag;
    const name = rawName.toLowerCase();
    if (close) {
      const index = stack.findLastIndex((el) => el.tag === name);
      if (index > 0) stack.length = index;
      continue;
    }
    const attrs: Record<string, string> = {};
    for (const [, key = "", value = ""] of rawAttrs.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)) attrs[key.toLowerCase()] = value;
    const el: Element = { tag: name, attrs, children: [] };
    current.children.push(el);
    if (!voidTags.has(name) && !token.endsWith("/>")) stack.push(el);
  }
  return root;
}

const classes = (node: Node) => (typeof node === "string" ? [] : (node.attrs.class ?? "").split(/\s+/));
const hasClass = (node: Node, name: string) => classes(node).includes(name);
const elements = (el: Element) => el.children.filter((child): child is Element => typeof child !== "string");
const unitKind = (node: Node) => classes(node).find((c) => c.startsWith("unit_"))?.slice("unit_".length);

/** Visible text of a node, without footnote markers and without nested units or lists. */
function textOf(node: Node): string {
  if (typeof node === "string") return node;
  if (hasClass(node, "gloss-link") || hasClass(node, "unit") || node.tag === "ul") return "";
  return node.children.map(textOf).join("");
}

const clean = (text: string) => text.replace(/\s+/g, " ").replace(/\s+([,.;:)])/g, "$1").replace(/\(\s+/g, "(").trim();

function label(unit: Element) {
  const h3 = elements(unit).find((el) => el.tag === "h3");
  return h3 ? clean(textOf(h3)) : "";
}

const inner = (unit: Element) => elements(unit).find((el) => hasClass(el, "unit-inner"));

/** Flattens a unit's content into lines in document order. The unit's own label goes on its first line. */
function linesOf(unit: Element, depth: number, ust: string | null, own: string | null): LegalLine[] {
  const lines: LegalLine[] = [];
  let pending = own;
  const push = (text: string, lineLabel: string | null, lineDepth: number) => {
    lines.push({ label: lineLabel, depth: lineDepth, ust, text });
  };
  for (const child of elements(inner(unit) ?? unit)) {
    if (child.attrs["data-template"] === "xText") {
      push(clean(textOf(child)), pending, depth);
      pending = null;
    } else if (hasClass(child, "unit")) {
      if (pending !== null) {
        push("", pending, depth);
        pending = null;
      }
      const childLabel = label(child);
      const childUst = unitKind(child) === "pass" ? childLabel.replace(/\.$/, "") : ust;
      lines.push(...linesOf(child, depth + 1, childUst, childLabel).map((line) => ({ ...line, ust: line.ust ?? childUst })));
    } else if (child.tag === "ul" && hasClass(child, "enum")) {
      for (const item of elements(child).filter((el) => el.tag === "li")) {
        const body = elements(item).slice(1).map(textOf).join(" ");
        push(clean(body), "–", depth + 1);
      }
    }
  }
  if (pending !== null) push("", pending, depth);
  return lines;
}

/**
 * The act's chapters and articles, in order. Articles nested in quoted text (pro-cite-text)
 * are not part of this act and are left out. Article lines start at depth 0 for the article's
 * own text and ustępy; punkty sit one level deeper.
 */
export function readAct(html: string): ParsedAct {
  const chapters: ParsedAct["chapters"] = [];
  const articles: ParsedArticle[] = [];
  const visit = (el: Element, chapter: number | null) => {
    if (hasClass(el, "pro-cite-text") || hasClass(el, "cite-box")) return;
    const kind = unitKind(el);
    if (hasClass(el, "unit") && kind === "chpt") {
      const number = Number(/Rozdział\s+(\d+)/.exec(label(el))?.[1]);
      const titleEl = findFirst(el, (node) => hasClass(node, "pro-title-unit"));
      chapters.push({ number, title: titleEl ? clean(textOf(titleEl)) : "" });
      for (const child of elements(inner(el) ?? el)) visit(child, number);
      return;
    }
    if (hasClass(el, "unit") && kind === "arti") {
      const articleLabel = label(el).replace(/\.$/, "");
      const lines = linesOf(el, -1, null, null).map((line) => ({ ...line, depth: Math.max(line.depth, 0) }));
      articles.push({ label: articleLabel, slug: articleLabel.toLowerCase().replace(/\s+/g, "-").replace(/\./g, ""), chapter, lines });
      return;
    }
    for (const child of elements(el)) visit(child, chapter);
  };
  visit(parseHtml(html), null);
  return { chapters, articles };
}

function findFirst(el: Element, test: (node: Element) => boolean): Element | undefined {
  for (const child of elements(el)) {
    if (test(child)) return child;
    const found = findFirst(child, test);
    if (found) return found;
  }
  return undefined;
}
