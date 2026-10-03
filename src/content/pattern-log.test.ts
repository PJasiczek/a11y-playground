// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vitest";
import type { PatternMessage, Watch } from "./announce";
import { startLog } from "./pattern-log";

let stop = () => {};
afterEach(() => {
  stop();
  document.body.innerHTML = "";
});

/** Renders a fragment, starts the log on it and collects what it posts. */
function run(html: string, watch: Watch[] = []) {
  document.body.innerHTML = html;
  const messages: PatternMessage[] = [];
  stop = startLog(window, (message) => messages.push(message), watch);
  const lines = () => messages.flatMap((m) => ("a11yAnnounce" in m ? [m.a11yAnnounce] : []));
  const states = () => messages.flatMap((m) => ("a11yState" in m ? [m.a11yState] : []));
  return { lines, states };
}

// Focus lines wait a task, so a radio that arrows check is read checked.
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const byId = (id: string) => {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLElement)) throw new Error(`#${id} is missing`);
  return el;
};

describe("startLog", () => {
  test("reads a button on focus, then only the state that changed, with the key behind each", async () => {
    const { lines } = run(
      `<button id="b" aria-expanded="false" onclick="this.setAttribute('aria-expanded', 'true')">Dostawa</button>`,
    );
    byId("b").focus();
    await tick();
    byId("b").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    byId("b").click();
    await tick();
    expect(lines()).toEqual([
      { kind: "focus", text: "Dostawa, przycisk, zwinięte", key: "Tab" },
      { kind: "state", text: "rozwinięte", key: "Enter" },
    ]);
  });

  test("names the group on the way in and counts the radios", async () => {
    const { lines } = run(
      `<fieldset><legend>Dostawa</legend>
        <label><input type="radio" name="d" id="k" checked> Kurier</label>
        <label><input type="radio" name="d"> Paczkomat</label>
      </fieldset>`,
    );
    byId("k").focus();
    await tick();
    expect(lines().map((line) => line.text)).toEqual(["Dostawa, grupa", "Kurier, przycisk opcji, zaznaczone, 1 z 2"]);
  });

  test("reads a description after the states, and an alert dialog's message on the way in", async () => {
    const { lines } = run(
      `<button id="k" aria-label="Kopiuj link" aria-describedby="t">⧉</button><div role="tooltip" id="t" hidden>Skopiuje adres strony</div>
      <div role="alertdialog" aria-labelledby="h" aria-describedby="m"><h2 id="h">Usunąć adres?</h2><p id="m">Tego nie da się cofnąć.</p><button id="a">Anuluj</button></div>`,
    );
    byId("k").focus();
    await tick();
    byId("a").focus();
    await tick();
    expect(lines().map((line) => line.text)).toEqual([
      "Kopiuj link, przycisk, Skopiuje adres strony",
      "Usunąć adres?, okno alertu, Tego nie da się cofnąć.",
      "Anuluj, przycisk",
    ]);
  });

  test("counts tree items on their level, says the level, and uses a role description", async () => {
    const { lines } = run(
      `<ul role="tree" aria-label="Pliki">
        <li role="treeitem" aria-expanded="true" aria-labelledby="d"><span id="d">Dokumenty</span>
          <ul role="group"><li role="treeitem" id="u" tabindex="-1">umowa.pdf</li><li role="treeitem">faktura.pdf</li></ul>
        </li>
        <li role="treeitem" aria-expanded="false">Zdjęcia</li>
      </ul>
      <section aria-roledescription="karuzela" aria-label="Promocje"><button id="p">Uruchom przewijanie</button></section>`,
    );
    byId("u").focus();
    await tick();
    byId("p").focus();
    await tick();
    expect(lines().map((line) => line.text)).toEqual([
      "Pliki, drzewo",
      "umowa.pdf, element drzewa, 1 z 2, poziom 2",
      "Promocje, karuzela",
      "Uruchom przewijanie, przycisk",
    ]);
  });

  test("reads one change of a slider once, after its own script has updated the text", async () => {
    const { lines } = run(
      `<input type="range" id="r" aria-label="Cena" min="0" max="100" value="10" aria-valuetext="10 zł"
        oninput="this.setAttribute('aria-valuetext', this.value + ' zł')">`,
    );
    const slider = byId("r");
    slider.focus();
    await tick();
    slider.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    if (slider instanceof HTMLInputElement) slider.value = "20";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    await tick();
    expect(lines().map((line) => line.text)).toEqual(["Cena, suwak, 10 zł", "20 zł"]);
  });

  test("reads text added to a live region that was already there, by its politeness", async () => {
    const { lines } = run(`<p role="status" id="s"></p><div aria-live="assertive" id="a"></div>`);
    byId("s").textContent = "Zapisano";
    byId("a").append("Błąd", " serwera");
    await tick();
    expect(lines()).toEqual([
      { kind: "live", text: "Zapisano", key: null, politeness: "polite" },
      { kind: "live", text: "Błąd serwera", key: null, politeness: "assertive" },
    ]);
  });

  test("waits while a live region is busy", async () => {
    const { lines } = run(`<div aria-busy="true"><p role="status" id="s"></p></div><p role="status" id="t"></p>`);
    byId("s").textContent = "Ładuję";
    byId("t").textContent = "Znaleziono 3 wyniki";
    await tick();
    expect(lines().map((line) => line.text)).toEqual(["Znaleziono 3 wyniki"]);
  });

  test("stays silent for a region added with its text, except an alert", async () => {
    const { lines } = run(`<div id="host"></div>`);
    byId("host").innerHTML = `<p role="status">Zapisano</p><p role="alert">Nie zapisano</p>`;
    await tick();
    expect(lines()).toEqual([{ kind: "live", text: "Nie zapisano", key: null, politeness: "assertive" }]);
  });

  test("reports the watched values, attributes and properties alike", async () => {
    const { states } = run(`<input type="checkbox" id="c"><button id="b" aria-pressed="false">Wycisz</button>`, [
      { selector: "#c", attr: "checked" },
      { selector: "#b", attr: "aria-pressed" },
      { selector: "#nie-ma", attr: "hidden" },
    ]);
    await tick();
    byId("b").setAttribute("aria-pressed", "true");
    await tick();
    await tick();
    expect(states()).toEqual([
      ["false", "false", null],
      ["false", "true", null],
    ]);
  });
});
