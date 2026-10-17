import { type } from "arktype";
import { type Fail, IsoDate, splitFrontmatter } from "./markdown";
import { createRenderer } from "./render";

/**
 * Standalone pages, one file per page in content/strony/<slug>.md: the privacy policy and the
 * contact page. Server-only, like glossary.ts.
 */

// The keys every page has. Each schema rejects keys it does not list (merge() would drop that).
const common = {
  title: "string > 0",
  description: "string > 0",
  updated: IsoDate,
} as const;

/** The frontmatter of each page. The contact page also names the address it shows above the text. */
export const pageSchemas = {
  prywatnosc: type({ ...common, "+": "reject" }),
  kontakt: type({ ...common, email: "string.email", "+": "reject" }),
};

/** The parsed frontmatter plus the body as rendered HTML. */
export type StandalonePage<Meta> = Meta & { html: string };

/** Checks the frontmatter of one file against `schema` and renders its body. */
export function parsePageMarkdown<Meta extends object>(schema: (data: unknown) => Meta | type.errors, file: string, source: string): StandalonePage<Meta> {
  const fail: Fail = (reason) => new Error(`${file}: ${reason}`);
  const { data, body } = splitFrontmatter(source, fail);
  const meta = schema(data);
  if (meta instanceof type.errors) throw fail(meta.summary);
  if (body.trim() === "") throw fail("the page is empty");
  return { ...meta, html: createRenderer(fail).render(body.trim()) };
}

const files = import.meta.glob<string>("/content/strony/*.md", { query: "?raw", import: "default", eager: true });

/** The page in content/strony/<slug>.md. A missing file fails the build, not the reader. */
export function standalonePage<Slug extends keyof typeof pageSchemas>(slug: Slug): StandalonePage<(typeof pageSchemas)[Slug]["infer"]> {
  const path = `/content/strony/${slug}.md`;
  const source = files[path];
  if (source === undefined) throw new Error(`content/strony/${slug}.md is missing`);
  return parsePageMarkdown(pageSchemas[slug], path, source);
}
