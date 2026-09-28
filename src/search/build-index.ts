import MiniSearch from "minisearch";
import { criterionContent } from "~/content/criterion-content";
import { examples } from "~/content/examples";
import { glossary } from "~/content/glossary";
import { criteria } from "~/content/wcag";
import { type SearchDoc, searchOptions } from "./options";

// Server-only: reads every content file. The browser gets the serialized index from
// /search-index.json, which is prerendered as a static file.

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** Every criterion (with or without written content), glossary term and example, as search documents. */
export function buildSearchDocs(): SearchDoc[] {
  const criterionDocs = criteria.map((c): SearchDoc => {
    const content = criterionContent.get(c.id);
    return {
      id: `kryterium:${c.id}`,
      kind: "kryterium",
      ref: c.id,
      title: c.name,
      summary: content?.summary ?? "",
      keywords: content?.keywords.join(" ") ?? "",
      body: content ? text(Object.values(content.sections).join(" ")) : "",
    };
  });
  const termDocs = [...glossary.values()].map(
    (entry): SearchDoc => ({
      id: `pojecie:${entry.slug}`,
      kind: "pojecie",
      ref: entry.slug,
      title: entry.term,
      summary: text(entry.html).split(". ")[0] ?? "",
      keywords: entry.also.join(" "),
      body: text(entry.html),
    }),
  );
  const exampleDocs = [...examples.values()].map(
    (example): SearchDoc => ({
      id: `przyklad:${example.slug}`,
      kind: "przyklad",
      ref: example.slug,
      title: example.title,
      summary: example.summary,
      keywords: example.criteria.join(" "),
      body: [text(example.introHtml), example.bad.why, example.good.why].join(" "),
    }),
  );
  return [...criterionDocs, ...termDocs, ...exampleDocs];
}

export function buildSearchIndex() {
  const index = new MiniSearch<SearchDoc>(searchOptions);
  index.addAll(buildSearchDocs());
  return index;
}
