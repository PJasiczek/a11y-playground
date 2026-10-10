import { expect, test } from "vitest";
import { absoluteUrl, clip, pageHead } from "./seo";
import { siteUrl } from "./site";

test("clip keeps short text and cuts long text at a word boundary", () => {
  expect(clip("Krótki  opis.\n")).toBe("Krótki opis.");
  const long = clip("słowo ".repeat(40));
  expect(long.length).toBeLessThanOrEqual(160);
  expect(long).toMatch(/słowo…$/);
});

test("absoluteUrl drops the trailing slash except on the home page", () => {
  expect(absoluteUrl("/")).toBe(`${siteUrl}/`);
  expect(absoluteUrl("/kryteria/")).toBe(`${siteUrl}/kryteria`);
});

test("a noindex page has no canonical link", () => {
  const indexed = pageHead({ title: "Kryteria", description: "Opis.", path: "/kryteria" });
  expect(indexed.links).toEqual([{ rel: "canonical", href: `${siteUrl}/kryteria` }]);
  expect(indexed.meta).toContainEqual({ title: "Kryteria · a11y playground" });

  const hidden = pageHead({ title: "Szukaj", description: "Opis.", path: "/szukaj", noindex: true });
  expect(hidden.links).toEqual([]);
  expect(hidden.meta).toContainEqual({ name: "robots", content: "noindex" });
});
