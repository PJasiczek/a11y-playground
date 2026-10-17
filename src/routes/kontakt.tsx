import { createFileRoute } from "@tanstack/react-router";
import { CopyAddress } from "~/components/copy-address";
import { getContactPage } from "~/content/pages.functions";
import { pageHead } from "~/lib/seo";

export const Route = createFileRoute("/kontakt")({
  loader: () => getContactPage(),
  head: ({ loaderData, match }) =>
    pageHead({
      title: loaderData?.title ?? "Kontakt",
      description: loaderData?.description ?? "",
      path: match.pathname,
    }),
  component: ContactPage,
});

/**
 * The contact page, edited in Notion (content/strony/kontakt.md). The description doubles as
 * the lead under the heading, the address comes from the frontmatter, the rest is the body.
 */
function ContactPage() {
  const { title, description, email, html } = Route.useLoaderData();
  return (
    <>
      <h1 className="pt-8 text-[1.875rem] font-bold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-[68ch]">{description}</p>
      <CopyAddress email={email} />
      <div className="prose mt-6" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
