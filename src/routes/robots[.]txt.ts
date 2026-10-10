import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "~/lib/seo";

// Prerendered as a plain file (see vite.config.ts). It disallows nothing on purpose: a crawler
// that may not fetch /demo/ never reads the noindex there and can still list the bare address.
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`, {
          headers: { "content-type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
