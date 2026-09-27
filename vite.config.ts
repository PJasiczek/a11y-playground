import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { criteria } from "./src/content/wcag.gen.ts";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // Nitro picks the Vercel preset automatically when the build runs on Vercel.
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Content is static, so every page is rendered to HTML at build time. Crawling finds the
      // linked pages; criterion pages are listed explicitly because some (4.1.1) are only linked
      // from filtered views.
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      pages: criteria.map((c) => ({ path: `/kryteria/${c.id}` })),
    }),
    nitro(),
    viteReact(),
  ],
});
