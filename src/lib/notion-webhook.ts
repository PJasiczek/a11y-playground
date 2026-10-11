import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Checks the X-Notion-Signature header of a webhook request: an HMAC-SHA256 of the raw body,
 * keyed with the verification token Notion sent when the subscription was created.
 * Server-only.
 */
export function isSignedByNotion(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = Buffer.from(`sha256=${createHmac("sha256", secret).update(body).digest("hex")}`);
  const given = Buffer.from(signature);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** The verification token of Notion's first, unsigned request to a new subscription, if this is one. */
export function verificationToken(body: string) {
  try {
    const data: unknown = JSON.parse(body);
    if (typeof data === "object" && data !== null && "verification_token" in data && typeof data.verification_token === "string") {
      return data.verification_token;
    }
  } catch {
    // Not JSON, so not a handshake either.
  }
  return null;
}
