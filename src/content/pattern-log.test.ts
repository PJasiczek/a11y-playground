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
