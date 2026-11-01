import { createFileRoute } from "@tanstack/react-router";
import { allPages } from "~/content/site-content";
import { sitemapXml } from "~/lib/sitemap";

// Every indexed page for search engines, linked from /robots.txt. Prerendered as a plain file
// (see vite.config.ts). No lastmod: without a real change date per page, search engines ignore it.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        return new Response(sitemapXml(allPages), { headers: { "content-type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
