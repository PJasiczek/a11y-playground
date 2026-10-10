// Relative imports: the bundle is built without the app's path aliases.
import { countOf } from "../lib/plural";
import { type Note, progressStore, reviewOf } from "../progress/core";
import type { Marker, View } from "./before-after-document";
import { reviewKey } from "./before-after-labels";

/**
 * The demo bar above the KMW pages (src/content/before-after-document.ts), bundled into one
 * classic script by frameScriptPlugin and started with the page's view and, on the marked page,
 * its markers. On the broken page it also runs the reader's notes and the two stages of the
 * check, on the same progress store as the app, which shares this origin.
 */

const noteForms = ["notatka", "notatki", "notatek"] as const;

function byId<T extends HTMLElement>(id: string, kind: new () => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof kind)) throw new Error(`#${id} is missing`);
  return element;
}

/** Notes, the notes drawer and the two stages of the check, on the broken page. */
function startCheck() {
  const store = progressStore();
  const toggle = byId("demo-notatki-przycisk", HTMLButtonElement);
  const drawer = byId("demo-notatki", HTMLDivElement);
  const form = byId("demo-nowa", HTMLFormElement);
  const field = byId("demo-pole", HTMLTextAreaElement);
  const count = byId("demo-liczba", HTMLParagraphElement);
  const list = byId("demo-lista", HTMLOListElement);
  const saved = byId("demo-zapis", HTMLParagraphElement);
  let editing: string | null = null;

  const setOpen = (open: boolean) => {
    toggle.setAttribute("aria-expanded", String(open));
    drawer.hidden = !open;
    document.documentElement.classList.toggle("demo-notatki-otwarte", open);
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
    if (open) field.focus();
  });

  const notes = () => reviewOf(store.get().progress, reviewKey).notes;
  const time = (iso: string) => new Date(iso).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  const button = (text: string, label: string, onClick: () => void) => {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = text;
    element.setAttribute("aria-label", label);
    element.addEventListener("click", onClick);
    return element;
  };

  /** One note as text with its buttons, or as a field while it is being edited. */
  const item = (note: Note, index: number) => {
    const li = document.createElement("li");
    li.dataset.id = note.id;
    const n = String(index + 1);
    const actions = document.createElement("p");
    actions.className = "demo-akcje";
    if (editing === note.id) {
      const label = document.createElement("label");
      label.htmlFor = `demo-edycja-${note.id}`;
      label.textContent = `Notatka ${n}`;
      const edit = document.createElement("textarea");
      edit.id = label.htmlFor;
      edit.value = note.text;
      const done = () => {
        editing = null;
        render();
        list.querySelector<HTMLButtonElement>(`li[data-id="${note.id}"] button`)?.focus();
      };
      actions.append(
        button("Zapisz", `Zapisz notatkę ${n}`, () => {
          editing = null;
          store.editNote(reviewKey, note.id, edit.value);
          // An emptied note is gone, so focus goes back to the field.
          if (!edit.value.trim()) field.focus();
          else list.querySelector<HTMLButtonElement>(`li[data-id="${note.id}"] button`)?.focus();
        }),
        button("Anuluj", `Anuluj edycję notatki ${n}`, done),
      );
      li.append(label, edit, actions);
      return li;
    }
    const text = document.createElement("p");
    text.textContent = note.text;
    const when = document.createElement("p");
    when.className = "demo-drobne";
    when.textContent = time(note.createdAt);
    actions.append(
      button("Edytuj", `Edytuj notatkę ${n}`, () => {
        editing = note.id;
        render();
        list.querySelector<HTMLTextAreaElement>(`li[data-id="${note.id}"] textarea`)?.focus();
      }),
      button("Usuń", `Usuń notatkę ${n}`, () => {
        const all = notes();
        const at = all.findIndex((other) => other.id === note.id);
        const neighbour = all[at + 1] ?? all[at - 1];
        store.removeNote(reviewKey, note.id);
        const next = neighbour && list.querySelector<HTMLButtonElement>(`li[data-id="${neighbour.id}"] button`);
        (next ?? field).focus();
      }),
    );
    li.append(text, when, actions);
    return li;
  };

  function render() {
    const { progress, persisted } = store.get();
    const review = reviewOf(progress, reviewKey);
    const stage = review.revealedAt ? "po-sprawdzeniu" : "sprawdzanie";
    for (const element of document.querySelectorAll<HTMLElement>("#demo-pasek [data-etap]")) {
      element.hidden = element.dataset.etap !== stage;
    }
    if (stage === "po-sprawdzeniu") setOpen(false);

    toggle.textContent = review.notes.length > 0 ? `Notatki (${String(review.notes.length)})` : "Notatki";
    saved.textContent = persisted
      ? "Zapisane w tej przeglądarce"
      : "Zapis w przeglądarce jest zablokowany. Notatki znikną po zamknięciu karty.";
    // Only a changed count goes into the status region, so re-rendering stays quiet.
    const counted = review.notes.length > 0 ? countOf(review.notes.length, noteForms) : "Nie masz jeszcze notatek";
    if (count.textContent !== counted) count.textContent = counted;
    list.replaceChildren(...review.notes.map(item));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (store.addNote(reviewKey, field.value)) field.value = "";
    field.focus();
  });

  byId("demo-kopiuj", HTMLButtonElement).addEventListener("click", () => {
    const text = notes()
      .map((note, index) => `${String(index + 1)}. ${note.text}`)
      .join("\n");
    navigator.clipboard.writeText(text).then(
      () => {
        say(`Skopiowano: ${countOf(notes().length, noteForms)}.`);
      },
      () => {
        say("Nie udało się skopiować. Zaznacz notatki na liście i skopiuj je ręcznie.");
      },
    );
  });

  byId("demo-koniec", HTMLButtonElement).addEventListener("click", () => {
    store.reveal(reviewKey);
    location.assign("/praktyka/przed-i-po/lista");
  });

  store.subscribe(render);
  render();
}

/** Says something in the bar's status region, again even when the text repeats. */
function say(text: string) {
  const status = document.getElementById("demo-komunikat");
  if (!status) return;
  status.textContent = "";
  requestAnimationFrame(() => {
    status.textContent = text;
  });
}

function isFixed(element: Element) {
  for (let el: Element | null = element; el; el = el.parentElement) {
    if (getComputedStyle(el).position === "fixed") return true;
  }
  return false;
}

/**
 * Puts a numbered link on every element a problem points at, in page order, linking to the
 * problem's page. Problems of the whole page sit on <body> and are listed in the bar instead.
 * Positions follow the page as it scrolls, resizes or changes.
 */
function drawMarkers(markers: readonly Marker[]) {
  const layer = document.createElement("div");
  layer.id = "demo-znaczniki";
  layer.lang = "pl";
  const placed = markers.flatMap(({ marker, number, title }) => {
    const target = [...document.querySelectorAll("[data-problem]")].find(
      (el) => el !== document.body && (el.getAttribute("data-problem") ?? "").split(/\s+/).includes(marker),
    );
    if (!target) return [];
    const link = document.createElement("a");
    link.href = `/praktyka/przed-i-po/${String(number)}`;
    link.textContent = String(number);
    link.setAttribute("aria-label", `Problem ${String(number)}: ${title}`);
    layer.append(link);
    return [{ link, target }];
  });
  document.body.append(layer);

  // Markers 48px apart at least, so two on the same corner sit side by side, both full size.
  const step = 52;
  const place = () => {
    const taken: { left: number; top: number; fixed: boolean }[] = [];
    for (const { link, target } of placed) {
      const box = target.getBoundingClientRect();
      const fixed = isFixed(target);
      const top = Math.max(0, box.top - 14 + (fixed ? 0 : scrollY));
      let left = Math.max(0, box.left - 14 + (fixed ? 0 : scrollX));
      while (taken.some((t) => t.fixed === fixed && Math.abs(t.top - top) < step && Math.abs(t.left - left) < step)) left += step;
      taken.push({ left, top, fixed });
      link.style.position = fixed ? "fixed" : "absolute";
      link.style.left = `${String(left)}px`;
      link.style.top = `${String(top)}px`;
      link.hidden = box.width === 0 && box.height === 0;
    }
  };
  place();
  addEventListener("resize", place);
  // The page opens and closes its window and slides by switching classes; the markers' own
  // style changes are left out, or placing them would trigger itself.
  new MutationObserver((records) => {
    if (records.some(({ target }) => !layer.contains(target))) place();
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style"] });
}

export function start({ view, markers }: { view: View; markers: readonly Marker[] }) {
  // The broken page moves only after the reader asks (2.3.3); its own script listens for this.
  const motion = document.getElementById("demo-ruch");
  motion?.addEventListener("click", () => {
    const on = motion.getAttribute("aria-pressed") !== "true";
    motion.setAttribute("aria-pressed", String(on));
    motion.textContent = on ? "Ruch włączony" : "Włącz ruch";
    document.dispatchEvent(new CustomEvent("kmw-ruch", { detail: { on } }));
  });

  // KMW has no subpages: its links say so instead of jumping to the top. Links the page handles
  // itself (the carousel arrows) prevent the default first, so they are left alone.
  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href="#"]') : null;
    if (!link || event.defaultPrevented) return;
    event.preventDefault();
    say(`„${link.textContent.trim() || "To łącze"}” prowadzi do podstrony, której w tej demonstracji nie ma.`);
  });

  if (markers.length > 0) drawMarkers(markers);
  if (view === "przed") startCheck();
  document.documentElement.dataset.demo = view;
}
