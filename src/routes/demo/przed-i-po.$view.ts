import { createFileRoute } from "@tanstack/react-router";
import barScript from "virtual:demo-bar";
import { problems } from "~/content/before-after";
import { beforeAfterDocument, isView } from "~/content/before-after-document";

// The KMW home page, broken, broken with markers, or fixed, as a standalone document opened in
// the whole window, with the demo bar in front of it. Prerendered, see vite.config.ts.
export const Route = createFileRoute("/demo/przed-i-po/$view")({
  server: {
    handlers: {
      GET: ({ params }) => {
        if (!isView(params.view)) return new Response("Nie ma takiej wersji", { status: 404 });
        const markers = problems.map(({ marker, number, title }) => ({ marker, number, title }));
        return new Response(beforeAfterDocument(params.view, barScript, markers), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
