import { type } from "arktype";
import { parse as parseYaml } from "yaml";

// Shared pieces of the content parsers in criterion-content.ts and glossary.ts. Server-only.

export const Status = type("'szkic' | 'zweryfikowane'");
export const IsoDate = type(/^\d{4}-\d{2}-\d{2}$/);

/**
 * A draft never carries a verification date, so the app cannot claim a check that did not
 * happen. Verified content always does.
 */
export type Verification = { status: "szkic" } | { status: "zweryfikowane"; lastVerified: string };

/** A verified file older than this fails the content tests and needs a fresh check. */
export const maxVerifiedAgeMonths = 12;

export type Fail = (reason: string) => Error;

/** Splits `---` frontmatter from the body and parses it as YAML, unvalidated. */
export function splitFrontmatter(source: string, fail: Fail) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) throw fail("missing frontmatter between --- lines");
  const [, yaml = "", body = ""] = match;
  const data: unknown = parseYaml(yaml);
  return { data, body };
}

/** Enforces the draft and verified rules on validated frontmatter. */
export function readVerification(
  { status, lastVerified }: { status: Verification["status"]; lastVerified?: string },
  fail: Fail,
): Verification {
  if (status === "szkic") {
    if (lastVerified) throw fail("a draft (status: szkic) cannot have lastVerified");
    return { status };
  }
  if (!lastVerified) throw fail("status: zweryfikowane needs lastVerified");
  return { status, lastVerified };
}

/** Verified entries whose check is older than maxVerifiedAgeMonths, as "id (date)" labels. */
export function staleEntries(entries: Iterable<[string, Verification]>, today = new Date()) {
  const limit = new Date(today);
  limit.setMonth(limit.getMonth() - maxVerifiedAgeMonths);
  return [...entries].flatMap(([id, v]) =>
    v.status === "zweryfikowane" && new Date(v.lastVerified) < limit ? [`${id} (${v.lastVerified})`] : [],
  );
}
