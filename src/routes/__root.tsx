import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { RouteAnnouncer } from "~/components/route-announcer";
import { SiteHeader } from "~/components/site-header";
import { themeInitScript } from "~/components/theme-toggle";
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
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="py-10">
      <h1 className="text-[1.875rem] font-bold tracking-tight">Nie ma takiej strony</h1>
      <p className="mt-3 text-ink-2">
        Sprawdź adres albo wróć do{" "}
        <Link to="/kryteria" className="text-accent underline underline-offset-3">
          listy kryteriów
        </Link>
        .
      </p>
    </div>
  );
}

function RootDocument() {
  return (
    // The init script sets data-theme before hydration, hence the suppressed warning.
    <html lang="pl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="mx-auto max-w-245 px-4 pb-16 outline-none sm:px-7">
          <Outlet />
        </main>
        <RouteAnnouncer />
        <Scripts />
      </body>
    </html>
  );
}
