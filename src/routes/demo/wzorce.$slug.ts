import { createFileRoute } from "@tanstack/react-router";
import logScript from "virtual:pattern-log";
import { patternDocument } from "~/content/demo-document";
import { patterns } from "~/content/patterns";

// One pattern as a standalone document with the live log, for the sandboxed iframe on
// /praktyka/wzorce/$slug and for the axe tests. Prerendered, see vite.config.ts.
export const Route = createFileRoute("/demo/wzorce/$slug")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const pattern = patterns.get(params.slug);
        if (!pattern) return new Response("Nie ma takiego wzorca", { status: 404 });
        return new Response(patternDocument(pattern, logScript), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
