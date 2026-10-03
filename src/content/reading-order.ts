import { computeAccessibleName, getRole, isInaccessible } from "dom-accessibility-api";
import { JSDOM, VirtualConsole } from "jsdom";
import { countOf } from "../lib/plural.ts";
import { polishRoles } from "./announce.ts";

/**
 * What a screen reader would read in one example fragment, computed at build time for the state
 * right after load. An approximation for the "Czytnik ekranu" simulator, not a substitute for
 * NVDA or VoiceOver. It loads the fragment into jsdom and runs its scripts, which are our own
 * content, so lists a script fills in are read too. Runs in Node only, from the Vite plugin in
 * reading-order.vite.ts; the app reads the result from `virtual:reading-order`.
 */

/** One announcement. `missing` marks a control a screen reader cannot name or recognise. */
export type Line = { text: string; role?: string; missing?: "rola" | "nazwa" };

export type ReadingOrder = {
  /** Browse mode, top to bottom. */
  reading: Line[];
  /** What Tab stops on, in order. */
  tab: Line[];
  /** Roles met with no Polish name below; the content tests keep this empty. */
  unknownRoles: string[];
};

/** What the page gets per variant. */
export type VariantReading = Pick<ReadingOrder, "reading" | "tab">;

// Controls read as one announcement: name, role, state. Their content is not read again.
const leafRoles = new Set([
  "button", "checkbox", "combobox", "img", "link", "option", "password", "radio", "searchbox", "slider", "spinbutton", "switch", "tab", "textbox",
]);
// Containers announced before their content.
const containerRoles = new Set(["alert", "alertdialog", "dialog", "list", "listbox", "table", "navigation", "form", "region", "status"]);
// Containers a screen reader only announces when they have a name. An empty live region says nothing.
const namedOnlyRoles = new Set(["form", "region", "status", "alert"]);
// Roles that add nothing to what is read.
const silentRoles = new Set(["generic", "none", "presentation", "paragraph", "group", "row", "rowgroup", "cell", "listitem", "term", "definition"]);
const inlineTags = new Set(["a", "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var"]);
const skippedTags = new Set(["script", "style", "template", "noscript", "caption"]);
const focusable = "a[href], button, input:not([type='hidden']), select, textarea, summary, [tabindex]";

/** Reads one HTML fragment. */
export function readingOrder(fragment: string): ReadingOrder {
  const { window } = new JSDOM(`<!doctype html><html lang="pl"><body>${fragment}</body></html>`, {
    runScripts: "dangerously",
    // A demo script may use an API jsdom lacks; what it managed to render is still read.
    virtualConsole: new VirtualConsole(),
  });
  const { document } = window;
  const getComputedStyle = window.getComputedStyle.bind(window);
  const unknownRoles = new Set<string>();

  const hidden = (el: Element) => el.hasAttribute("hidden") || isInaccessible(el, { getComputedStyle });
  const nameOf = (el: Element) => computeAccessibleName(el, { getComputedStyle }).replace(/\s+/g, " ").trim();

  const describe = (el: Element, role: string) => {
    const polish = polishRoles[role];
    if (!polish) unknownRoles.add(role);
    const parts = [polish ?? role];
    if (role === "heading") parts.push(`poziom ${el.getAttribute("aria-level") ?? el.localName.slice(1)}`);
    if (role === "table") {
      const columns = Math.max(0, ...[...el.querySelectorAll("tr")].map((tr) => tr.children.length));
      parts.push(countOf(columns, ["kolumna", "kolumny", "kolumn"]));
    }
    if (role === "list" || role === "listbox") {
      const items = [...el.children].filter((child) => !hidden(child)).length;
      parts.push(countOf(items, ["element", "elementy", "elementów"]));
    }
    if (el instanceof window.HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
      parts.push(el.checked ? "zaznaczone" : "niezaznaczone");
    }
    const expanded = el.getAttribute("aria-expanded");
    if (expanded) parts.push(expanded === "true" ? "rozwinięte" : "zwinięte");
    if (el.getAttribute("aria-invalid") === "true") parts.push("nieprawidłowe dane");
    return parts.join(", ");
  };

  const lineFor = (el: Element, role: string): Line => {
    const text = nameOf(el);
    return text ? { text, role: describe(el, role) } : { text: "", role: describe(el, role), missing: "nazwa" };
  };

  // A role worth announcing, or null for plain structure. A password field has no ARIA role,
  // and getRole calls every th a column header, so both are settled here.
  const roleOf = (el: Element) => {
    if (el.localName === "input" && el.getAttribute("type") === "password") return "password";
    if (el.localName === "th" && el.getAttribute("scope") === "row") return "rowheader";
    const role = getRole(el);
    return role && !silentRoles.has(role) ? role : null;
  };

  const reading: Line[] = [];
  let buffer = "";
  const flush = () => {
    const text = buffer.replace(/\s+/g, " ").trim();
    // Punctuation left over after a link or button is read with it, not on its own.
    if (/[\p{L}\p{N}]/u.test(text)) reading.push({ text });
    buffer = "";
  };

  const visit = (node: Node) => {
    if (node.nodeType === window.Node.TEXT_NODE) {
      buffer += node.textContent ?? "";
      return;
    }
    if (!(node instanceof window.Element) || skippedTags.has(node.localName) || hidden(node)) return;
    const role = roleOf(node);

    if (role && (leafRoles.has(role) || role === "heading")) {
      flush();
      reading.push(lineFor(node, role));
      return;
    }
    // Something that reacts to clicks but has no role: a screen reader reads it as plain text.
    if (!role && node.hasAttribute("onclick")) {
      flush();
      reading.push({ text: nameOf(node) || node.textContent.trim(), missing: "rola" });
      return;
    }
    const block = !inlineTags.has(node.localName);
    if (block) flush();
    if (role && (containerRoles.has(role) || role === "columnheader" || role === "rowheader")) {
      if (role === "columnheader" || role === "rowheader") {
        reading.push(lineFor(node, role));
        return;
      }
      const name = nameOf(node);
      if (name || !namedOnlyRoles.has(role)) reading.push({ text: name, role: describe(node, role) });
    } else if (role && !polishRoles[role]) {
      unknownRoles.add(role);
    }
    for (const child of node.childNodes) visit(child);
    if (block) flush();
  };
  for (const child of document.body.childNodes) visit(child);
  flush();

  // Positive tabindex first, in its order, then document order. Hidden and disabled elements drop out.
  const stops = [...document.body.querySelectorAll(focusable)].filter((el) => {
    if (el instanceof window.HTMLElement && el.tabIndex < 0) return false;
    if (el.matches(":disabled")) return false;
    for (let at: Element | null = el; at && at !== document.body; at = at.parentElement) if (hidden(at)) return false;
    return true;
  });
  const tabIndex = (el: Element) => (el instanceof window.HTMLElement && el.tabIndex > 0 ? el.tabIndex : Infinity);
  const tab = stops
    .map((el, index) => ({ el, index }))
    .toSorted((a, b) => tabIndex(a.el) - tabIndex(b.el) || a.index - b.index)
    .map(({ el }): Line => {
      const role = roleOf(el);
      return role ? lineFor(el, role) : { text: nameOf(el) || el.textContent.trim(), missing: "rola" };
    });

  window.close();
  return { reading, tab, unknownRoles: [...unknownRoles] };
}
