import { expect, test } from "vitest";
import { absoluteUrl, clip, pageHead } from "./seo";
import { siteUrl } from "./site";
import { socialImageForPath } from "./social";

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

test("JSON-LD cannot close its script element", () => {
  const { scripts } = pageHead({
    description: "Opis.",
    path: "/",
    jsonLd: [{ "@context": "https://schema.org", "@type": "Thing", name: "</script><script>alert(1)</script>" }],
  });
  const json = scripts[0]?.children ?? "";
  expect(json).not.toContain("<");
  expect(JSON.parse(json)).toMatchObject({ name: "</script><script>alert(1)</script>" });
});

test("social cards use a criterion-specific image and a dedicated X composition", () => {
  const { meta } = pageHead({ title: "Kontrast", description: "Opis.", path: "/kryteria/1.4.3" });
  expect(meta).toContainEqual({ property: "og:image", content: `${siteUrl}/social/criterion-1.4.3-v1.png` });
  expect(meta).toContainEqual({ name: "twitter:image", content: `${siteUrl}/social/criterion-1.4.3-x-v1.png` });
  expect(meta).toContainEqual({ name: "twitter:card", content: "summary_large_image" });
  expect(meta).toContainEqual({ property: "og:image:width", content: "1200" });
  expect(socialImageForPath("/kryteria/1.4.3/?wersja=2.2")).toEqual(socialImageForPath("/kryteria/1.4.3"));
  expect(socialImageForPath("/kontakt").path).toBe("/social/home-v1.png");
  expect(socialImageForPath("/sciezki/autor-tresci").path).toBe("/social/sciezki-v1.png");
});
