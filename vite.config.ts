import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { readdirSync } from "node:fs";
import { defineConfig } from "vite";
import { patternLogPlugin } from "./src/content/pattern-log.vite.ts";
import { readingOrderPlugin } from "./src/content/reading-order.vite.ts";
import { acts, legalUnits } from "./src/content/legal.gen.ts";
import { criteria } from "./src/content/wcag.gen.ts";

// One folder per example; each has a page and two demo documents for its iframes.
const exampleSlugs = readdirSync("content/praktyka");
// One folder per pattern; each has a page and a demo document with the live log.
const patternSlugs = readdirSync("content/wzorce");

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // Nitro picks the Vercel preset automatically when the build runs on Vercel.
  plugins: [
    readingOrderPlugin(),
    patternLogPlugin(),
    tailwindcss(),
    tanstackStart({
      // Content is static, so every page is rendered to HTML at build time. Crawling finds the
      // linked pages; criterion and law pages are listed explicitly because some (4.1.1, repealed
      // articles) are only linked from filtered views or not at all, and the search index
      // because nothing links to it.
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
        // A link like /slownik#nazwa or /praktyka/x?symulacja=czytnik points at the same page as
        // /slownik or /praktyka/x. Crawling each variant separately writes the same file in
        // parallel, which can leave it empty.
        filter: ({ path }) => !path.includes("#") && !path.includes("?"),
      },
      pages: [
        ...criteria.map((c) => ({ path: `/kryteria/${c.id}` })),
        ...acts.map((act) => ({ path: `/prawo/${act.slug}` })),
        ...legalUnits.map((unit) => ({ path: `/prawo/${unit.id}` })),
        ...exampleSlugs.flatMap((slug) => [
          { path: `/praktyka/${slug}` },
          { path: `/demo/${slug}/bad` },
          { path: `/demo/${slug}/good` },
        ]),
        ...patternSlugs.flatMap((slug) => [{ path: `/praktyka/wzorce/${slug}` }, { path: `/demo/wzorce/${slug}` }]),
        // Written as a plain file, not /search-index.json/index.html.
        { path: "/search-index.json", prerender: { autoSubfolderIndex: false } },
      ],
    }),
    nitro(),
    viteReact(),
  ],
});
