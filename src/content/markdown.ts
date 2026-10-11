import { type } from "arktype";
import { parse as parseYaml } from "yaml";

// Shared pieces of the content parsers in criterion-content.ts and glossary.ts. Server-only.

export const IsoDate = type(/^\d{4}-\d{2}-\d{2}$/);

export type Fail = (reason: string) => Error;

/** Splits `---` frontmatter from the body and parses it as YAML, unvalidated. */
export function splitFrontmatter(source: string, fail: Fail) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) throw fail("missing frontmatter between --- lines");
  const [, yaml = "", body = ""] = match;
  const data: unknown = parseYaml(yaml);
  return { data, body };
}
