import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { frameScriptPlugin } from "./src/content/frame-script.vite.ts";
import { readingOrderPlugin } from "./src/content/reading-order.vite.ts";
import { sitePages } from "./src/content/site-pages.ts";
import { siteContentFromDisk } from "./src/content/site-pages.node.ts";

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
      // Content is static, so every page is rendered to HTML at build time: every page in
      // site-pages.ts, anything else crawling finds, and the files nothing links to.
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
        ...sitePages(siteContentFromDisk()).map(({ path }) => ({ path })),
        // Written as plain files, not /search-index.json/index.html.
        ...["/search-index.json", "/robots.txt", "/sitemap.xml"].map((path) => ({ path, prerender: { autoSubfolderIndex: false } })),
      ],
    }),
    nitro(),
    viteReact(),
  ],
});
