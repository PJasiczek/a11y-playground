import { createFileRoute } from "@tanstack/react-router";
import { formatDate } from "~/content/legal";
import { getPrivacyPolicy } from "~/content/pages.functions";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/prywatnosc")({
  loader: () => getPrivacyPolicy(),
  head: ({ loaderData, match }) =>
    pageHead({
      title: loaderData?.title ?? "Polityka prywatności",
      description: loaderData?.description ?? "",
      path: match.pathname,
    }),
  component: PrivacyPage,
});

/** The privacy policy, edited in Notion (content/strony/prywatnosc.md). The footer links here. */
function PrivacyPage() {
  const { title, updated, html } = Route.useLoaderData();
  return (
    <>
      <h1 className="pt-8 text-[1.875rem] font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-ink-2">
        Ostatnia zmiana: <time dateTime={updated}>{formatDate(updated)}</time>
      </p>
      <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
