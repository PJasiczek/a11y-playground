import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
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
});

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
