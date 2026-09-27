import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import stylesUrl from "~/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      // No maximum-scale or user-scalable: zoom must stay available (1.4.4).
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "a11y playground" },
    ],
    links: [{ rel: "stylesheet", href: stylesUrl }],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="pl">
      <head>
        <HeadContent />
      </head>
      <body>
        <main id="main" className="mx-auto max-w-245 px-4 pb-16 sm:px-7">
          <Outlet />
        </main>
        <Scripts />
      </body>
    </html>
  );
}
