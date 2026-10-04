// What a screen reader says about an element, in Polish, and the messages a pattern frame posts
// about it. Free of imports, so it runs anywhere: in Node for the build-time reading order
// (reading-order.ts), inside a pattern frame for the live log (pattern-log.ts), and on the page.

/** ARIA roles as a Polish screen reader names them. A role missing here fails the content tests. */
export const polishRoles: Record<string, string> = {
  alert: "alert",
  alertdialog: "okno alertu",
  banner: "baner",
  button: "przycisk",
  cell: "komórka",
  checkbox: "pole wyboru",
  columnheader: "nagłówek kolumny",
  combobox: "pole kombi",
  complementary: "uzupełniający",
  contentinfo: "informacje o zawartości",
  dialog: "okno dialogowe",
  figure: "rycina",
  form: "formularz",
  grid: "siatka",
  gridcell: "komórka",
  group: "grupa",
  heading: "nagłówek",
  img: "grafika",
  link: "łącze",
  password: "pole hasła",
  list: "lista",
  listbox: "lista wyboru",
  listitem: "element listy",
  main: "główny",
  navigation: "nawigacja",
  option: "opcja",
  progressbar: "pasek postępu",
  radio: "przycisk opcji",
  radiogroup: "grupa opcji",
  region: "region",
  row: "wiersz",
  rowheader: "nagłówek wiersza",
  search: "wyszukiwanie",
  searchbox: "pole wyszukiwania",
  slider: "suwak",
  spinbutton: "pole liczbowe",
  status: "status",
  switch: "przełącznik",
  tab: "karta",
  table: "tabela",
  tablist: "lista kart",
  tabpanel: "panel karty",
  textbox: "pole edycji",
  tooltip: "dymek",
  tree: "drzewo",
  treeitem: "element drzewa",
};

/**
 * Keys a pattern's exercise can ask for, named as the page shows them. The frame logs every
 * announcement with the key that caused it, by these names, so a step can be ticked off.
 */
export const keyNames = ["Tab", "Shift+Tab", "Enter", "Spacja", "Esc", "↑", "↓", "←", "→", "Home", "End", "PageUp", "PageDown"] as const;
export type KeyName = (typeof keyNames)[number];

/** DOM state read as a property rather than an attribute: the attribute only holds the initial value. */
export const stateProperties = ["checked", "disabled", "hidden", "indeterminate", "max", "open", "value"] as const;

/** What the ARIA table of a pattern can show live: attributes the frame reads, and the properties above. */
export const reportedAttributes = [
  ...stateProperties,
  "role",
  "href",
  "tabindex",
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-disabled",
  "aria-expanded",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-label",
  "aria-labelledby",
  "aria-live",
  "aria-modal",
  "aria-pressed",
  "aria-relevant",
  "aria-roledescription",
  "aria-selected",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
] as const;
export type ReportedAttribute = (typeof reportedAttributes)[number];

/** The three kinds of line in the log, with the tag the page shows for each. */
export const announceKinds = { focus: "fokus", state: "zmiana", live: "na żywo" } as const;
export type AnnounceKind = keyof typeof announceKinds;

/**
 * One line of the log. `key` is what caused it: a key by its name, "klik" for the pointer, or
 * null when nothing did (a timer). `politeness` comes with live lines only.
 */
export type Announcement = {
  kind: AnnounceKind;
  text: string;
  key: KeyName | "klik" | null;
  politeness?: "polite" | "assertive";
};

/** One row the ARIA table watches: which element, and what to read from it. */
export type Watch = { selector: string; attr: ReportedAttribute };

/**
 * What a pattern frame posts to the page: a log line, or the current values of the watched rows
 * in their order, null where the element or attribute is missing.
 */
export type PatternMessage = { a11yAnnounce: Announcement } | { a11yState: (string | null)[] };
