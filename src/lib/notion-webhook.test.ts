import { createHmac } from "node:crypto";
import { describe, expect, test } from "vitest";
import { isSignedByNotion, verificationToken } from "./notion-webhook";

const secret = "secret_test";
const body = '{"type":"page.content_updated","entity":{"id":"abc"}}';
const sign = (text: string) => `sha256=${createHmac("sha256", secret).update(text).digest("hex")}`;

describe("isSignedByNotion", () => {
  test("accepts the signature of the body", () => {
    expect(isSignedByNotion(body, sign(body), secret)).toBe(true);
  });

  test.each([
    ["no header", null],
    ["a changed body", sign(`${body} `)],
    ["another secret", `sha256=${createHmac("sha256", "other").update(body).digest("hex")}`],
    ["a signature of another length", "sha256=abc"],
  ])("rejects %s", (_, signature) => {
    expect(isSignedByNotion(body, signature, secret)).toBe(false);
  });
});

describe("verificationToken", () => {
  test("reads the token of the handshake and nothing from events or junk", () => {
    expect(verificationToken('{"verification_token":"secret_x"}')).toBe("secret_x");
    expect(verificationToken(body)).toBeNull();
    expect(verificationToken("not json")).toBeNull();
  });
});
