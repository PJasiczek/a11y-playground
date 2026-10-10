import { createFileRoute } from "@tanstack/react-router";
import { allPages } from "~/content/site-content";
import { absoluteUrl } from "~/lib/seo";

// Every indexed page for search engines, linked from /robots.txt. Prerendered as a plain file
// (see vite.config.ts). No lastmod: without a real change date per page, search engines ignore it.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = allPages.filter((page) => page.index).map((page) => `  <url><loc>${absoluteUrl(page.path)}</loc></url>`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
