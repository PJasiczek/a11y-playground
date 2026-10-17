import { type } from "arktype";
import { type Fail, IsoDate, splitFrontmatter } from "./markdown";
import { createRenderer } from "./render";

/**
 * Standalone pages, one file per page in content/strony/<slug>.md. Only the privacy policy so
 * far. Server-only, like glossary.ts.
 */

const Frontmatter = type({
  title: "string > 0",
  description: "string > 0",
  updated: IsoDate,
  "+": "reject",
});

export type StandalonePage = typeof Frontmatter.infer & {
  /** The body, rendered HTML. */
  html: string;
};

export function parsePageMarkdown(file: string, source: string): StandalonePage {
  const fail: Fail = (reason) => new Error(`${file}: ${reason}`);
  const { data, body } = splitFrontmatter(source, fail);
  const meta = Frontmatter(data);
  if (meta instanceof type.errors) throw fail(meta.summary);
  if (body.trim() === "") throw fail("the page is empty");
  return { ...meta, html: createRenderer(fail).render(body.trim()) };
}

const files = import.meta.glob<string>("/content/strony/*.md", { query: "?raw", import: "default", eager: true });

/** The page in content/strony/<slug>.md. A missing file fails the build, not the reader. */
export function standalonePage(slug: string) {
  const path = `/content/strony/${slug}.md`;
  const source = files[path];
  if (source === undefined) throw new Error(`content/strony/${slug}.md is missing`);
  return parsePageMarkdown(path, source);
}
