// What a screen reader says about an element, in Polish. Free of imports, so it runs anywhere:
// in Node for the build-time reading order (reading-order.ts) and inside a demo document.

/** ARIA roles as a Polish screen reader names them. A role missing here fails the content tests. */
export const polishRoles: Record<string, string> = {
  alert: "alert",
  alertdialog: "okno alertu",
  button: "przycisk",
  cell: "komórka",
  checkbox: "pole wyboru",
  columnheader: "nagłówek kolumny",
  combobox: "pole kombi",
  dialog: "okno dialogowe",
  figure: "rycina",
  form: "formularz",
  heading: "nagłówek",
  img: "grafika",
  link: "łącze",
  password: "pole hasła",
  list: "lista",
  listbox: "lista wyboru",
  listitem: "element listy",
  navigation: "nawigacja",
  option: "opcja",
  radio: "przycisk opcji",
  region: "region",
  row: "wiersz",
  rowheader: "nagłówek wiersza",
  searchbox: "pole wyszukiwania",
  slider: "suwak",
  spinbutton: "pole liczbowe",
  status: "status",
  switch: "przełącznik",
  tab: "karta",
  table: "tabela",
  textbox: "pole edycji",
};

/**
 * Keys a pattern's exercise can ask for, named as the page shows them. The frame logs every
 * announcement with the key that caused it, by these names, so a step can be ticked off.
 */
export const keyNames = ["Tab", "Shift+Tab", "Enter", "Spacja", "Esc", "↑", "↓", "←", "→", "Home", "End", "PageUp", "PageDown"] as const;
export type KeyName = (typeof keyNames)[number];

/** DOM state read as a property rather than an attribute: the attribute only holds the initial value. */
export const stateProperties = ["checked", "disabled", "hidden", "indeterminate", "open", "value"] as const;

/** What the ARIA table of a pattern can show live: attributes the frame reads, and the properties above. */
export const reportedAttributes = [
  ...stateProperties,
  "role",
  "href",
  "tabindex",
  "aria-activedescendant",
  "aria-atomic",
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
  "aria-selected",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
] as const;
export type ReportedAttribute = (typeof reportedAttributes)[number];

