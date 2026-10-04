import { createFileRoute } from "@tanstack/react-router";
import structureScript from "virtual:structure";
import { demoDocument, variants } from "~/content/demo-document";
import { examples } from "~/content/examples";

// One variant of an example as a standalone document, for the sandboxed iframes on
// /praktyka/$slug and for the axe tests. Prerendered, see vite.config.ts.
export const Route = createFileRoute("/demo/$slug/$variant")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const example = examples.get(params.slug);
        const variant = variants.find((v) => v === params.variant);
        if (!example || !variant) return new Response("Nie ma takiego przykładu", { status: 404 });
        return new Response(demoDocument(example, variant, structureScript), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
