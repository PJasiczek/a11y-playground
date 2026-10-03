import { computeAccessibleDescription, computeAccessibleName, getRole, isInaccessible } from "dom-accessibility-api";
import {
  type Announcement,
  type KeyName,
  type PatternMessage,
  polishRoles,
  type ReportedAttribute,
  stateProperties,
  type Watch,
} from "./announce";

/**
 * The live log of a pattern frame: what a screen reader would say as the reader operates the
 * pattern. Runs inside the sandboxed demo document, bundled with dom-accessibility-api by
 * pattern-log.vite.ts, and posts each line to the page. An approximation, not NVDA: it answers
 * "what does the code expose", one line per thing a screen reader would announce.
 *
 * - focus: the name, the role in Polish, the states and the description of whatever takes focus,
 *   after the containers it enters ("Sposób dostawy, grupa"). Logged a tick late, so a radio that
 *   arrows check is read checked.
 * - state: a state change on the focused element, in the words of that state only ("rozwinięte").
 * - live: text added to a live region that was already on the page. A region added together with
 *   its text says nothing, as in most screen readers, except an alert.
 */

type Key = Announcement["key"];

const keys: Record<string, KeyName> = {
  Tab: "Tab",
  Enter: "Enter",
  " ": "Spacja",
  Escape: "Esc",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
};

function keyOf(event: KeyboardEvent): KeyName | null {
  if (event.key === "Tab" && event.shiftKey) return "Shift+Tab";
  return keys[event.key] ?? null;
}

// Containers a screen reader names when focus enters them. All but these need a name to be named.
const containerRoles = new Set(["group", "radiogroup", "dialog", "alertdialog", "navigation", "region", "tablist", "listbox", "tree", "grid"]);
const namedOrNot = new Set(["dialog", "alertdialog", "navigation"]);
// Roles whose items a screen reader counts, "2 z 3", with the container they are counted in.
const setContainers: Partial<Record<string, string>> = { radio: "radiogroup", tab: "tablist", option: "listbox" };
const checkableRoles = new Set(["checkbox", "radio", "switch", "menuitemcheckbox", "menuitemradio"]);
const rangeRoles = new Set(["slider", "spinbutton", "progressbar", "scrollbar"]);
const currentWords: Partial<Record<string, string>> = {
  page: "bieżąca strona",
  step: "bieżący krok",
  location: "bieżące miejsce",
  date: "bieżąca data",
  time: "bieżący czas",
  true: "bieżące",
};

type StateGroup = "checked" | "pressed" | "expanded" | "selected" | "current" | "sort" | "value" | "required" | "invalid" | "disabled";

/** Which state group an attribute change belongs to. Only these attributes are observed. */
const groupOf: Partial<Record<string, StateGroup>> = {
  "aria-checked": "checked",
  "aria-pressed": "pressed",
  "aria-expanded": "expanded",
  open: "expanded",
  "aria-selected": "selected",
  "aria-current": "current",
  "aria-sort": "sort",
  "aria-valuenow": "value",
  "aria-valuetext": "value",
  "aria-required": "required",
  "aria-invalid": "invalid",
  "aria-disabled": "disabled",
  disabled: "disabled",
};

/** Starts the log on `win` and returns a function that stops it. */
export function startLog(win: Window & typeof globalThis, post: (message: PatternMessage) => void, watch: readonly Watch[]) {
  const { document } = win;
  const getComputedStyle = win.getComputedStyle.bind(win);
  const say = (line: Announcement) => {
    post({ a11yAnnounce: line });
  };

  // Generated content is left out of names. Our patterns give it empty alt text (content: "+" / ""),
  // which the library does not understand, and would read the "+" a browser leaves out.
  const accName = { getComputedStyle, computedStyleSupportsPseudoElements: false };
  const nameOf = (el: Element) => computeAccessibleName(el, accName).replace(/\s+/g, " ").trim();
  // aria-describedby: a tooltip's text, an alert dialog's message. Read after the states.
  const descriptionOf = (el: Element) => computeAccessibleDescription(el, accName).replace(/\s+/g, " ").trim();
  const hidden = (el: Element) => el.closest("[hidden]") !== null || isInaccessible(el, { getComputedStyle });
  const roleOf = (el: Element) => getRole(el) ?? "";

  const roleWords = (el: Element, role: string) => {
    // aria-roledescription replaces the role's name: "karuzela", "slajd".
    const custom = el.getAttribute("aria-roledescription");
    if (custom) return custom;
    if (role === "button" && el.hasAttribute("aria-pressed")) return "przycisk przełącznik";
    const words = polishRoles[role] ?? role;
    if (role === "heading") return `${words}, poziom ${el.getAttribute("aria-level") ?? el.localName.slice(1)}`;
    return words;
  };

  // The words for one state group, or null when the element has nothing to say about it.
  const stateWords = (el: Element, role: string, group: StateGroup): string | null => {
    const attr = (name: string) => el.getAttribute(name);
    switch (group) {
      case "checked": {
        if (!checkableRoles.has(role)) return null;
        const native = el instanceof win.HTMLInputElement;
        const mixed = native ? el.indeterminate : attr("aria-checked") === "mixed";
        const checked = native ? el.checked : attr("aria-checked") === "true";
        return mixed ? "częściowo zaznaczone" : checked ? "zaznaczone" : "niezaznaczone";
      }
      case "pressed": {
        const pressed = attr("aria-pressed");
        if (pressed === null) return null;
        return pressed === "true" ? "naciśnięte" : pressed === "mixed" ? "częściowo naciśnięte" : "nienaciśnięte";
      }
      case "expanded": {
        const details = el.localName === "summary" ? el.parentElement : null;
        if (details instanceof win.HTMLDetailsElement) return details.open ? "rozwinięte" : "zwinięte";
        // A button with popovertarget is expanded while its popover is open, with no attribute.
        const popover = el instanceof win.HTMLButtonElement ? el.popoverTargetElement : null;
        if (popover) return popover.matches(":popover-open") ? "rozwinięte" : "zwinięte";
        const expanded = attr("aria-expanded");
        if (expanded === null) return null;
        return expanded === "true" ? "rozwinięte" : "zwinięte";
      }
      case "selected":
        return attr("aria-selected") === "true" ? "wybrane" : null;
      case "current":
        return currentWords[attr("aria-current") ?? "false"] ?? null;
      case "sort": {
        const sort = attr("aria-sort");
        return sort === "ascending" ? "sortowanie rosnąco" : sort === "descending" ? "sortowanie malejąco" : null;
      }
      case "value": {
        if (!rangeRoles.has(role)) return null;
        const native = el instanceof win.HTMLInputElement ? el.value : null;
        return attr("aria-valuetext") ?? attr("aria-valuenow") ?? native;
      }
      case "required":
        return attr("aria-required") === "true" || el.hasAttribute("required") ? "wymagane" : null;
      case "invalid":
        return attr("aria-invalid") === "true" ? "nieprawidłowe dane" : null;
      case "disabled":
        return attr("aria-disabled") === "true" || el.matches(":disabled") ? "niedostępne" : null;
    }
  };
  const allGroups: StateGroup[] = ["checked", "pressed", "expanded", "selected", "current", "sort", "value", "required", "invalid", "disabled"];

  // "2 z 3" for items a screen reader counts. Native radios count by their name.
  const position = (el: Element, role: string) => {
    let items: Element[] = [];
    if (el instanceof win.HTMLInputElement && el.type === "radio" && el.name) {
      const name = el.name;
      items = [...(el.form ?? document).querySelectorAll("input[type='radio']")].filter(
        (radio) => radio instanceof win.HTMLInputElement && radio.name === name,
      );
    } else if (role === "treeitem") {
      // Items count among their siblings on the same level of the tree.
      items = [...(el.parentElement?.children ?? [])].filter((item) => roleOf(item) === "treeitem");
    } else {
      const container = setContainers[role];
      const owner = container ? el.closest(`[role="${container}"]`) : null;
      if (owner) items = [...owner.querySelectorAll(`[role="${role}"]`)];
    }
    const visible = items.filter((item) => !hidden(item));
    const at = visible.indexOf(el);
    return at === -1 ? null : `${String(at + 1)} z ${String(visible.length)}`;
  };

  // How deep a tree item sits: one more than the groups around it.
  const levelOf = (el: Element) => {
    let level = 1;
    for (let at = el.parentElement; at && roleOf(at) !== "tree"; at = at.parentElement) if (roleOf(at) === "group") level += 1;
    return level;
  };

  const describe = (el: Element) => {
    const role = roleOf(el);
    const parts = [nameOf(el) || "bez nazwy", roleWords(el, role)];
    for (const group of allGroups) {
      const words = stateWords(el, role, group);
      if (words) parts.push(words);
    }
    const at = position(el, role);
    if (at) parts.push(at);
    if (role === "treeitem") parts.push(`poziom ${String(levelOf(el))}`);
    const description = descriptionOf(el);
    if (description) parts.push(description);
    return parts.join(", ");
  };

  // A container as a screen reader names it on the way in: name, role, and its description, which
  // is how an alert dialog's message gets read.
  const describeContainer = (el: Element) =>
    [nameOf(el) || "bez nazwy", roleWords(el, roleOf(el)), descriptionOf(el)].filter(Boolean).join(", ");

  // Named containers around `el`, outermost first, that `previous` was not already inside.
  const enteredContainers = (el: Element, previous: Element | null) => {
    const entered: Element[] = [];
    for (let at = el.parentElement; at && at !== document.body; at = at.parentElement) {
      const role = roleOf(at);
      if (!containerRoles.has(role) || at.contains(previous)) continue;
      if (!namedOrNot.has(role) && !nameOf(at)) continue;
      entered.unshift(at);
    }
    return entered;
  };

  // --- What caused the next line ---------------------------------------------------------------
  let lastKey: Key = null;
  let pointerAt = -Infinity;
  // Whether focus is already inside this document; the first focus comes from the page around it.
  let inside = false;
  const onKeyDown = (event: KeyboardEvent) => {
    lastKey = keyOf(event);
    lastState = null;
  };
  const onPointerDown = () => {
    lastKey = "klik";
    pointerAt = performance.now();
  };
  const onBlur = () => {
    inside = false;
  };

  // --- Focus -----------------------------------------------------------------------------------
  let previous: Element | null = null;
  let pending: { el: Element; key: Key } | null = null;
  const flushFocus = () => {
    if (!pending) return;
    const { el, key } = pending;
    pending = null;
    for (const container of enteredContainers(el, previous)) {
      say({ kind: "focus", text: describeContainer(container), key });
    }
    say({ kind: "focus", text: describe(el), key });
    previous = el;
    report();
  };
  const onFocusIn = (event: FocusEvent) => {
    if (!(event.target instanceof win.Element)) return;
    // Entering from the page: a click if the pointer was just pressed, otherwise Tab.
    const key = inside ? lastKey : performance.now() - pointerAt < 500 ? "klik" : "Tab";
    inside = true;
    flushFocus();
    pending = { el: event.target, key };
    win.setTimeout(flushFocus, 0);
  };

  // --- State of the focused element --------------------------------------------------------------
  // The last state line since the last key, so two reports of one change (a slider's input event
  // and its aria-valuetext) make one line.
  let lastState: { el: Element; words: string } | null = null;
  const sayState = (el: Element, group: StateGroup) => {
    // A focus line on its way will carry the new state already.
    if (pending?.el === el) return;
    const words = stateWords(el, roleOf(el), group);
    if (!words || (lastState?.el === el && lastState.words === words)) return;
    lastState = { el, words };
    say({ kind: "state", text: words, key: lastKey });
  };
  // Native state changes no attribute: a checkbox fires change, a range input fires input.
  const onInput = (event: Event) => {
    const el = event.target;
    if (!(el instanceof win.HTMLInputElement) || el !== document.activeElement) return;
    if (event.type === "change" && (el.type === "checkbox" || el.type === "radio")) sayState(el, "checked");
    // A tick late, so the pattern's own handler has updated aria-valuetext.
    if (event.type === "input" && el.type === "range") {
      win.setTimeout(() => {
        sayState(el, "value");
      }, 0);
    }
    report();
  };
  // A popover opening or closing changes no attribute either; its invoker reads expanded.
  const onToggle = (event: Event) => {
    const active = document.activeElement;
    if (!(event.target instanceof win.HTMLElement) || !event.target.hasAttribute("popover")) return;
    if (active instanceof win.HTMLButtonElement && active.popoverTargetElement === event.target) sayState(active, "expanded");
    report();
  };
  const states = new win.MutationObserver((records) => {
    const active = document.activeElement;
    for (const { target, attributeName } of records) {
      if (!(target instanceof win.Element) || !attributeName || !active) continue;
      if (attributeName === "aria-activedescendant") {
        const id = target === active ? target.getAttribute(attributeName) : null;
        const descendant = id ? document.getElementById(id) : null;
        if (descendant) say({ kind: "focus", text: describe(descendant), key: lastKey });
        continue;
      }
      const group = groupOf[attributeName];
      if (!group) continue;
      // Opening details changes its open attribute, while focus sits on its summary.
      const summary = attributeName === "open" && active.localName === "summary" && active.parentElement === target;
      if (target === active || summary) sayState(active, group);
    }
    report();
  });

  // --- Live regions ------------------------------------------------------------------------------
  const politenessOf = (el: Element): Announcement["politeness"] | null => {
    const live = el.getAttribute("aria-live");
    if (live === "off") return null;
    if (live === "assertive" || el.getAttribute("role") === "alert") return "assertive";
    if (live === "polite" || ["status", "log"].includes(el.getAttribute("role") ?? "")) return "polite";
    return null;
  };
  const regionOf = (node: Node) => {
    for (let at = node instanceof win.Element ? node : node.parentElement; at; at = at.parentElement) {
      if (politenessOf(at)) return at;
    }
    return null;
  };
  const isRegion = (el: Element) => politenessOf(el) !== null;
  const known = new WeakSet<Element>([...document.querySelectorAll("*")].filter(isRegion));
  const textOf = (node: Node) => (node.textContent ?? "").replace(/\s+/g, " ").trim();

  const regions = new win.MutationObserver((records) => {
    const added = new Map<Element, string[]>();
    for (const record of records) {
      const region = regionOf(record.target);
      // Regions that arrive inside new content join the known ones without speaking.
      for (const node of record.addedNodes) {
        if (!(node instanceof win.Element)) continue;
        for (const el of [node, ...node.querySelectorAll("*")]) {
          if (!isRegion(el) || known.has(el)) continue;
          known.add(el);
          if (el.getAttribute("role") === "alert" && textOf(el)) added.set(el, [textOf(el)]);
        }
      }
      if (!region || !known.has(region) || hidden(region)) continue;
      const texts = record.type === "characterData" ? [textOf(record.target)] : [...record.addedNodes].map(textOf);
      added.set(region, [...(added.get(region) ?? []), ...texts]);
    }
    for (const [region, texts] of added) {
      const atomic = region.getAttribute("aria-atomic") ?? (["alert", "status"].includes(region.getAttribute("role") ?? "") ? "true" : "false");
      const text = atomic === "true" ? textOf(region) : texts.filter(Boolean).join(" ");
      const politeness = politenessOf(region) ?? "polite";
      if (text) say({ kind: "live", text, key: lastKey, politeness });
    }
  });

  // --- The ARIA table ----------------------------------------------------------------------------
  const isProperty = (attr: ReportedAttribute) => stateProperties.some((property) => property === attr);
  const valueOf = ({ selector, attr }: Watch) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    if (!isProperty(attr)) return el.getAttribute(attr);
    const value: unknown = Reflect.get(el, attr);
    return typeof value === "string" || typeof value === "boolean" ? String(value) : null;
  };
  let reported = "";
  let scheduled = false;
  // Posts the watched values, once per task and only when they changed.
  function report(force = false) {
    if (scheduled) return;
    scheduled = true;
    win.setTimeout(() => {
      scheduled = false;
      const values = watch.map(valueOf);
      const json = JSON.stringify(values);
      if (json === reported && !force) return;
      reported = json;
      post({ a11yState: values });
    }, 0);
  }
  const onMessage = (event: MessageEvent<unknown>) => {
    if (event.data === "a11y-example-measure") report(true);
  };

  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("change", onInput, true);
  document.addEventListener("input", onInput, true);
  document.addEventListener("toggle", onToggle, true);
  win.addEventListener("blur", onBlur);
  win.addEventListener("message", onMessage);
  states.observe(document.body, { subtree: true, attributes: true, attributeFilter: [...Object.keys(groupOf), "aria-activedescendant"] });
  regions.observe(document.body, { subtree: true, childList: true, characterData: true });
  report(true);

  return () => {
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("change", onInput, true);
    document.removeEventListener("input", onInput, true);
    document.removeEventListener("toggle", onToggle, true);
    win.removeEventListener("blur", onBlur);
    win.removeEventListener("message", onMessage);
    states.disconnect();
    regions.disconnect();
  };
}
