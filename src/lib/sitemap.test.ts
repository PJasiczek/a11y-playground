import { expect, test } from "vitest";
import { sitemapXml } from "./sitemap";

test("sitemap excludes hidden pages, deduplicates canonical URLs and escapes XML", () => {
  const xml = sitemapXml([
    { path: "/kryteria", index: true },
    { path: "/kryteria/", index: true },
    { path: "/szukaj", index: false },
    { path: "/a&b<c", index: true },
  ]);
  expect(xml.match(/<loc>/g)).toHaveLength(2);
  expect(xml).not.toContain("/szukaj");
  expect(xml).toContain("/a&amp;b&lt;c</loc>");
  expect(xml).not.toContain("lastmod");
});
