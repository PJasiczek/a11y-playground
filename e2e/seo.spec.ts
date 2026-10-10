import { expect, test } from "@playwright/test";
import { readdirSync } from "node:fs";
import { sitePages } from "../src/content/site-pages.ts";

// The page list the build prerenders, read from content/ the way vite.config.ts reads it.
const pages = sitePages({
  examples: readdirSync("content/praktyka"),
  patterns: readdirSync("content/wzorce"),
  problemCount: readdirSync("content/przed-i-po/problemy").length,
});

test("every demo document stays out of search results", async ({ request }) => {
  const demos = pages.filter((path) => path.startsWith("/demo/"));
  expect(demos.length).toBeGreaterThan(0);
  for (const path of demos) {
    const html = await (await request.get(path)).text();
    expect(html, path).toContain('<meta name="robots" content="noindex">');
  }
});
