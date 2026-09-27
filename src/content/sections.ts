// Shared by the server-side content parser and the pages, so this module stays free of imports.

/** Sections an author may write in content/kryteria/<id>.md, as `## <title>`, in this order. */
export const contentSections = [
  { key: "kogo-dotyczy", title: "Kogo to dotyczy" },
  { key: "jak-spelnic", title: "Jak to spełnić" },
  { key: "typowe-bledy", title: "Typowe błędy" },
  { key: "jak-sprawdzic", title: "Jak sprawdzić" },
  { key: "czeste-pomylki", title: "Częste pomyłki" },
] as const;

export type SectionKey = (typeof contentSections)[number]["key"];

/** Who a criterion concerns, as listed in the `roles` frontmatter and filtered on /kryteria. */
export const roles = ["programista", "projektant", "autor treści", "tester"] as const;

export type Role = (typeof roles)[number];
