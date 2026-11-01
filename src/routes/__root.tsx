import { createRootRoute, HeadContent, Link, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { kindOfPath, kinds } from "~/components/kinds";
import { calmInitScript } from "~/components/calm-toggle";
import { ConsentBanner } from "~/components/consent";
import { RouteAnnouncer } from "~/components/route-announcer";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import { StructureTool } from "~/components/structure-tool";
import { themeInitScript } from "~/components/theme-toggle";
import { siteName } from "~/lib/site";
import stylesUrl from "~/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      // No maximum-scale or user-scalable: zoom must stay available (1.4.4).
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteName },
      // Shared by every page; pageHead adds the title, description and address of each one.
      { property: "og:site_name", content: siteName },
      { property: "og:locale", content: "pl_PL" },
      { property: "og:type", content: "website" },
      ...(import.meta.env.VITE_NOINDEX ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [
      { rel: "stylesheet", href: stylesUrl },
      // The four bars of the logo on a sand tile (src/components/kinds.tsx, BrandMark).
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=pastel-2" },
    ],
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

function PageContent() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const kind = kindOfPath(pathname);
  return <main id="main" tabIndex={-1} data-page={pathname === "/" ? "home" : "content"} className={`${kind ? kinds[kind].className : ""} mx-auto max-w-280 px-4 pb-16 outline-none sm:px-7`}><Outlet /></main>;
}

function RootDocument() {
  return (
    // The init scripts set data-theme and data-calm before hydration, hence the suppressed warning.
    <html lang="pl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + calmInitScript }} />
        <HeadContent />
      </head>
      <body>
        <SiteHeader />
        <PageContent />
        <ConsentBanner />
        <SiteFooter />
        <RouteAnnouncer />
        <StructureTool />
        <Scripts />
      </body>
    </html>
  );
}
