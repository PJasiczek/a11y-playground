import { Marked, type Tokens } from "marked";
import { glossary } from "./glossary";
import type { Fail } from "./markdown";

// The Markdown renderer shared by criterion and example content. Server-only.

const termPrefix = "slownik:";

/**
 * A Markdown renderer for one file. `[nazwę](slownik:nazwa)` marks a glossary term: its first
 * use on the page becomes a link to the glossary plus a preview button (hidden until the page
 * is interactive), later uses stay plain text. Unknown slugs fail the file.
 */
export function createRenderer(fail: Fail) {
  const terms: string[] = [];
  const renderer = new Marked({
    renderer: {
      link(token: Tokens.Link) {
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
