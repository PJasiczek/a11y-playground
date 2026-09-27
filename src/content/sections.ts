/**
 * Sections an author may write in content/kryteria/<id>.md, as `## <title>`, in this order.
 * Shared by the server-side parser and the criterion page, so it must stay free of imports.
 */
export const contentSections = [
  { key: "kogo-dotyczy", title: "Kogo to dotyczy" },
  { key: "jak-spelnic", title: "Jak to spełnić" },
  { key: "typowe-bledy", title: "Typowe błędy" },
  { key: "jak-sprawdzic", title: "Jak sprawdzić" },
  { key: "czeste-pomylki", title: "Częste pomyłki" },
] as const;

export type SectionKey = (typeof contentSections)[number]["key"];
