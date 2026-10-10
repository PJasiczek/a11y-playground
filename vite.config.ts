import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { readdirSync } from "node:fs";
import { defineConfig } from "vite";
import { frameScriptPlugin } from "./src/content/frame-script.vite.ts";
import { readingOrderPlugin } from "./src/content/reading-order.vite.ts";
import { sitePages } from "./src/content/site-pages.ts";

const pages = sitePages({
  examples: readdirSync("content/praktyka"),
  patterns: readdirSync("content/wzorce"),
  // One file per problem, numbered from 01.
  problemCount: readdirSync("content/przed-i-po/problemy").length,
});

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // Nitro picks the Vercel preset automatically when the build runs on Vercel.
  plugins: [
    readingOrderPlugin(),
    frameScriptPlugin({ id: "virtual:pattern-log", entry: "src/content/pattern-log.entry.ts", name: "a11yPatternLog" }),
    frameScriptPlugin({ id: "virtual:structure", entry: "src/content/structure.entry.ts", name: "a11yStructure" }),
    frameScriptPlugin({ id: "virtual:demo-bar", entry: "src/content/demo-bar.entry.ts", name: "a11yDemoBar" }),
    tailwindcss(),
    tanstackStart({
      // Content is static, so every page is rendered to HTML at build time: the pages crawling
      // finds, the ones in site-pages.ts, and the search index, because nothing links to it.
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
        ...pages.map((path) => ({ path })),
        // Written as a plain file, not /search-index.json/index.html.
        { path: "/search-index.json", prerender: { autoSubfolderIndex: false } },
      ],
    }),
    nitro(),
    viteReact(),
  ],
});
