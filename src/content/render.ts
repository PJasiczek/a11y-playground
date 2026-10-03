import { Marked, type Tokens } from "marked";
import { glossary } from "./glossary";
import { findAct, findUnit } from "./legal";
import type { Fail } from "./markdown";

// The Markdown renderer shared by criterion, example and act content. Server-only.

const termPrefix = "slownik:";
const lawPrefix = "prawo:";

/**
 * Resolves `prawo:ustawa-2019-848/art-5#ust-3` (an act, an article or the annex, with an optional
 * ustęp anchor) to its page. Unknown acts and articles fail the file.
 */
function lawHref(target: string, fail: Fail) {
  const [path = "", hash] = target.split("#");
  if (!findAct(path) && !findUnit(path)) throw fail(`unknown legal reference "${target}"`);
  return `/prawo/${path}${hash ? `#${hash}` : ""}`;
}

/**
 * A Markdown renderer for one file. `[nazwę](slownik:nazwa)` marks a glossary term: its first
 * use on the page becomes a link to the glossary plus a preview button (hidden until the page
 * is interactive), later uses stay plain text. Unknown slugs fail the file.
 * `[art. 5](prawo:ustawa-2019-848/art-5)` links to a provision.
 */
export function createRenderer(fail: Fail) {
  const terms: string[] = [];
  const renderer = new Marked({
    renderer: {
      link(token: Tokens.Link) {
        if (token.href.startsWith(lawPrefix)) {
          const href = lawHref(token.href.slice(lawPrefix.length), fail);
          return `<a href="${href}">${this.parser.parseInline(token.tokens)}</a>`;
        }
        if (!token.href.startsWith(termPrefix)) return false;
        const slug = token.href.slice(termPrefix.length);
        const entry = glossary.get(slug);
        if (!entry) throw fail(`unknown glossary term "${slug}"`);
        const text = this.parser.parseInline(token.tokens);
        if (terms.includes(slug)) return text;
        terms.push(slug);
        return (
          `<span class="term"><a href="/slownik#${slug}">${text}</a>` +
          `<button type="button" class="term-tip" data-term="${slug}" aria-expanded="false" aria-label="Definicja: ${entry.term}" hidden>?</button></span>`
        );
      },
    },
  });
  return { terms, render: (markdown: string) => renderer.parse(markdown, { async: false }) };
}

/**
 * Splits a Markdown body into `## <title>` sections and renders each one. Titles must come from
 * `allowed`, in its order, each at most once; text before the first section fails the file. An
 * empty section is left out, so callers can tell written sections from missing ones.
 */
export function renderSections<const Key extends string>(
  body: string,
  allowed: readonly { key: Key; title: string }[],
  fail: Fail,
  render: (markdown: string) => string,
) {
  const [preamble = "", ...chunks] = body.split(/^## /m);
  if (preamble.trim() !== "") throw fail("text before the first ## section");
  const sections: Partial<Record<Key, string>> = {};
  let lastIndex = -1;
  for (const chunk of chunks) {
    const newline = chunk.indexOf("\n");
    const title = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    const index = allowed.findIndex((section) => section.title === title);
    const section = allowed[index];
    if (!section) throw fail(`unknown section "${title}", allowed: ${allowed.map((s) => s.title).join(", ")}`);
    if (index <= lastIndex) throw fail(`section "${title}" is out of order or repeated`);
    lastIndex = index;
    const markdown = newline === -1 ? "" : chunk.slice(newline + 1).trim();
    if (markdown !== "") sections[section.key] = render(markdown);
  }
  return sections;
}
