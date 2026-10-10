import { expect, test } from "@playwright/test";
import { sitePages } from "../src/content/site-pages.ts";
import { siteContentFromDisk } from "../src/content/site-pages.node.ts";
import { siteUrl } from "../src/lib/site.ts";

// The page list the build prerenders, read from content/ the way vite.config.ts reads it.
const pages = sitePages(siteContentFromDisk());

/** The content of the first tag in `html` matching `pattern`, with its value in the first group. */
function first(html: string, pattern: RegExp) {
  return pattern.exec(html)?.[1];
}

test("robots.txt points at the sitemap and blocks nothing", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  expect(robots).not.toContain("Disallow");
});

test("the sitemap lists exactly the indexed pages, each with its own canonical, title, description and valid JSON-LD", async ({
  request,
}) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? "");
  // The app orders paths by role, the disk alphabetically; the set is what matters.
  const expected = pages.filter((page) => page.index).map((page) => siteUrl + page.path);
  expect(listed.toSorted()).toEqual(expected.toSorted());

  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const url of listed) {
    const path = url.slice(siteUrl.length);
    const html = await (await request.get(path)).text();
    expect(first(html, /<link rel="canonical" href="([^"]+)"/), path).toBe(url);
    expect(html, path).not.toContain('name="robots"');
    const title = first(html, /<title>([^<]+)<\/title>/) ?? "";
    const description = first(html, /<meta name="description" content="([^"]+)"/) ?? "";
    expect(description, path).not.toBe("");
    expect(titles.get(title), `${path} has the title of`).toBeUndefined();
    expect(descriptions.get(description), `${path} has the description of`).toBeUndefined();
    titles.set(title, path);
    descriptions.set(description, path);
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)) {
      expect(() => {
        JSON.parse(json ?? "");
      }, path).not.toThrow();
    }
  }
});

test("every page left out of the sitemap stays out of search results", async ({ request }) => {
  for (const { path } of pages.filter((page) => !page.index)) {
    const html = await (await request.get(path)).text();
    expect(html, path).toMatch(/<meta name="robots" content="noindex"\/?>/);
  }
});
