import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { readdirSync } from "node:fs";
import { defineConfig } from "vite";
import { criteria } from "./src/content/wcag.gen.ts";

// One folder per example; each has a page and two demo documents for its iframes.
const exampleSlugs = readdirSync("content/praktyka");

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // Nitro picks the Vercel preset automatically when the build runs on Vercel.
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Content is static, so every page is rendered to HTML at build time. Crawling finds the
      // linked pages; criterion pages are listed explicitly because some (4.1.1) are only linked
      // from filtered views, and the search index because nothing links to it.
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
        // A link like /slownik#nazwa points at the same page as /slownik. Crawling each anchor
        // separately writes the same file in parallel, which can leave it empty.
        filter: ({ path }) => !path.includes("#"),
      },
      pages: [
        ...criteria.map((c) => ({ path: `/kryteria/${c.id}` })),
        ...exampleSlugs.flatMap((slug) => [
          { path: `/praktyka/${slug}` },
          { path: `/demo/${slug}/bad` },
          { path: `/demo/${slug}/good` },
        ]),
        // Written as a plain file, not /search-index.json/index.html.
        { path: "/search-index.json", prerender: { autoSubfolderIndex: false } },
      ],
    }),
    nitro(),
    viteReact(),
  ],
});
