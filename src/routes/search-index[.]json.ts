import { createFileRoute } from "@tanstack/react-router";
import { buildSearchIndex } from "~/search/build-index";

// The serialized MiniSearch index for /szukaj. Listed in the prerender pages in vite.config.ts,
// so in production it is a static file and the server never builds it per request.
export const Route = createFileRoute("/search-index.json")({
  server: {
    handlers: {
      GET: () => Response.json(buildSearchIndex()),
    },
  },
});
