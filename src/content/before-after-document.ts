// The whole-page demo on /praktyka/przed-i-po: the KMW home page, broken and fixed, as
// standalone documents. Server-only; the demo route serves them, the tests read them.

/** The broken page, the broken page with numbered markers on its problems, and the fixed page. */
export const views = ["przed", "przed-znaczniki", "po"] as const;
export type View = (typeof views)[number];

export function isView(value: unknown): value is View {
  return typeof value === "string" && (views as readonly string[]).includes(value);
}

/** A problem as its marker needs it: the data-problem token, the number and the title. */
export type Marker = { marker: string; number: number; title: string };

const files = import.meta.glob<string>("/content/przed-i-po/*.html", { query: "?raw", import: "default", eager: true });

function readPage(name: "przed" | "po") {
  const source = files[`/content/przed-i-po/${name}.html`];
  if (source === undefined) throw new Error(`content/przed-i-po/${name}.html is missing`);
  return source;
}

/** The two pages as written, with the data-problem markers the list of problems points at. */
export const pages = { przed: readPage("przed"), po: readPage("po") } as const;

/**
 * The page with nothing that hints at an answer: no data-problem attributes and no HTML comments,
 * so the source of the broken page gives nothing away while the reader checks it.
 */
export function withoutHints(source: string) {
  return source.replace(/\s+data-problem="[^"]*"/g, "").replace(/<!--[\s\S]*?-->/g, "");
}

/** Escapes text for HTML. Titles come from our own content, but they still go into markup. */
function escape(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// The bar is the app's, not KMW's: it must stay usable on a page that removes every focus outline
// and puts an overlay over everything, hence the id selectors and the stacking order. Markers
// sit just under the bar and over everything of the page.
const barStyles = `
  #demo-pasek { position: relative; z-index: 100; display: flex; flex-wrap: wrap; align-items: center; gap: .5rem 1rem; padding: .5rem 1rem; background: #14171a; color: #fbfaf7; font: 15px/1.5 "Segoe UI", system-ui, sans-serif; }
  #demo-pasek *, #demo-znaczniki * { box-sizing: border-box; }
  #demo-pasek :focus-visible, #demo-znaczniki :focus-visible { outline: 3px solid #f4e75b; outline-offset: 2px; }
  #demo-pasek .demo-etykieta { font: 700 .75rem/1.4 ui-monospace, Consolas, monospace; letter-spacing: .08em; text-transform: uppercase; background: #f4e75b; color: #14171a; padding: .2rem .5rem; }
  #demo-pasek .demo-etykieta.demo-po { background: #bfe3cc; }
  #demo-pasek p { margin: 0; flex: 1 1 20rem; }
  #demo-pasek a { color: #fff; text-decoration: underline; text-underline-offset: 3px; display: inline-flex; align-items: center; min-height: 44px; }
  #demo-pasek button { display: inline-flex; align-items: center; gap: .4rem; min-height: 44px; padding: 0 .8rem; font: 600 .9rem "Segoe UI", system-ui, sans-serif; color: #fff; background: #14171a; border: 1px solid #a8a296; border-radius: 2px; cursor: pointer; }
  #demo-pasek button[aria-pressed="true"] { background: #fbfaf7; color: #14171a; }
  #demo-pasek button[aria-pressed="true"]::before { content: "✓" / ""; }
  #demo-pasek .demo-cala { flex-basis: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 0 1rem; margin: 0; padding: 0; list-style: none; }
  #demo-komunikat:empty { display: none; }
  #demo-komunikat { flex-basis: 100%; font-weight: 600; }
  #demo-pasek [hidden] { display: none; }
  #demo-notatki { flex-basis: 100%; background: #fbfaf7; color: #14171a; padding: 1rem; overflow-y: auto; }
  #demo-notatki :focus-visible { outline-color: #2c36a8; }
  #demo-notatki p { flex: none; margin: 0; }
  #demo-notatki .demo-tytul { font-size: 1.1rem; font-weight: 700; }
  #demo-notatki .demo-drobne { font: .8rem ui-monospace, Consolas, monospace; color: #484d52; margin-bottom: .8rem; }
  #demo-notatki label { display: block; font-weight: 700; margin-bottom: .25rem; }
  #demo-notatki textarea { display: block; width: 100%; min-height: 5rem; margin-bottom: .5rem; padding: .4rem .5rem; font: inherit; color: #14171a; background: #fff; border: 2px solid #14171a; border-radius: 2px; }
  #demo-notatki button { color: #14171a; background: #fff; border-color: #857f72; }
  #demo-notatki button.demo-glowny { color: #fbfaf7; background: #14171a; border-color: #14171a; }
  #demo-liczba { font: 600 .85rem ui-monospace, Consolas, monospace; margin: 1rem 0 .3rem !important; }
  #demo-lista { list-style: none; margin: 0 0 1rem; padding: 0; }
  #demo-lista li { border-top: 1px solid #dfdbd1; padding: .5rem 0; }
  #demo-lista li p { margin: 0 0 .2rem; }
  #demo-lista .demo-drobne { margin: 0; }
  #demo-lista .demo-akcje { display: flex; flex-wrap: wrap; gap: .4rem; }
  #demo-notatki > .demo-akcje { display: flex; flex-wrap: wrap; gap: .5rem; border-top: 2px solid #14171a; padding-top: .8rem; }
  @media (min-width: 60rem) {
    html.demo-notatki-otwarte body { margin-right: 22rem; }
    #demo-notatki { position: fixed; top: 0; right: 0; bottom: 0; width: 22rem; border-left: 2px solid #14171a; }
  }
  #demo-znaczniki a { position: absolute; z-index: 99; display: flex; align-items: center; justify-content: center; min-width: 44px; height: 44px; padding: 0 .4rem; border-radius: 22px; background: #14171a; color: #fff; font: 700 1rem ui-monospace, Consolas, monospace; text-decoration: none; box-shadow: 0 0 0 3px #f4e75b; }
`;

const back = `<a href="/praktyka/przed-i-po">Wróć do aplikacji</a>`;

function barFor(view: View, markers: readonly Marker[]) {
  switch (view) {
    // Two stages (data-etap): while checking, notes and nothing that gives an answer away; after
    // the check, the markers, the list and the fixed page. The bar script shows one of them; the
    // prerendered page shows the first.
    case "przed":
      return `
  <span class="demo-etykieta">Wersja zepsuta</span>
  <p data-etap="sprawdzanie">Ta strona celowo łamie zasady dostępności. Część rzeczy nie zadziała z klawiatury ani z czytnikiem ekranu.</p>
  <p data-etap="po-sprawdzeniu" hidden>Sprawdzanie zakończone. Ta strona dalej celowo łamie zasady dostępności.</p>
  <button type="button" id="demo-notatki-przycisk" aria-expanded="false" aria-controls="demo-notatki" data-etap="sprawdzanie">Notatki</button>
  <button type="button" id="demo-ruch" aria-pressed="false">Włącz ruch</button>
  <a href="/demo/przed-i-po/przed-znaczniki" data-etap="po-sprawdzeniu" hidden>Pokaż znaczniki problemów</a>
  <a href="/praktyka/przed-i-po/lista" data-etap="po-sprawdzeniu" hidden>Lista problemów</a>
  <a href="/demo/przed-i-po/po" data-etap="po-sprawdzeniu" hidden>Wersja poprawiona</a>
  ${back}
  <div id="demo-notatki" role="group" aria-labelledby="demo-notatki-tytul" hidden>
    <p id="demo-notatki-tytul" class="demo-tytul">Twoje notatki</p>
    <p id="demo-zapis" class="demo-drobne">Zapisane w tej przeglądarce</p>
    <form id="demo-nowa">
      <label for="demo-pole">Co nie działa?</label>
      <textarea id="demo-pole" rows="3"></textarea>
      <button type="submit">Dodaj notatkę</button>
    </form>
    <p id="demo-liczba" role="status">Nie masz jeszcze notatek</p>
    <ol id="demo-lista"></ol>
    <p class="demo-akcje">
      <button type="button" id="demo-kopiuj">Kopiuj notatki</button>
      <button type="button" id="demo-koniec" class="demo-glowny">Kończę sprawdzanie</button>
    </p>
  </div>
  <noscript><p>Notatki i znaczniki działają z JavaScriptem.</p></noscript>`;
    case "przed-znaczniki": {
      // Problems of the whole page have no element to sit on, so the bar lists them.
      const body = /<body[^>]*data-problem="([^"]*)"/.exec(pages.przed)?.[1]?.split(/\s+/) ?? [];
      const whole = markers.filter(({ marker }) => body.includes(marker));
      return `
  <span class="demo-etykieta">Wersja zepsuta</span>
  <p>Numery na stronie prowadzą do opisów problemów.</p>
  <button type="button" id="demo-ruch" aria-pressed="false">Włącz ruch</button>
  <a href="/demo/przed-i-po/przed">Ukryj znaczniki</a>
  <a href="/praktyka/przed-i-po/lista">Lista problemów</a>
  <a href="/demo/przed-i-po/po">Wersja poprawiona</a>
  ${back}
  <ul class="demo-cala" aria-label="Problemy całej strony">
    <li>Na całej stronie:</li>${whole.map(({ number, title }) => `
    <li><a href="/praktyka/przed-i-po/${String(number)}">${String(number)}. ${escape(title)}</a></li>`).join("")}
  </ul>`;
    }
    case "po":
      return `
  <span class="demo-etykieta demo-po">Wersja poprawiona</span>
  <p>Tak ta strona powinna wyglądać.</p>
  <a href="/praktyka/przed-i-po/lista">Lista problemów</a>
  ${back}`;
  }
}

/** A bundled script as an inline script element. Nothing in it may close the element early. */
function inlineScript(source: string) {
  return `<script>${source.replace(/<\/script/gi, "<\\/script")}</script>`;
}

/**
 * One page with the demo bar in front of it. `barScript` is the bundle from virtual:demo-bar,
 * which runs the bar: the motion switch, the links that lead nowhere in the demo, and on the
 * marked page the numbered markers, which is the only view that gets `markers`.
 */
export function beforeAfterDocument(view: View, barScript: string, markers: readonly Marker[] = []) {
  const bar = `<style>${barStyles}</style>
<aside id="demo-pasek" lang="pl" aria-label="Demonstracja">${barFor(view, markers)}
  <p id="demo-komunikat" role="status"></p>
</aside>`;
  const options = JSON.stringify({ view, markers: view === "przed-znaczniki" ? markers : [] }).replace(/</g, "\\u003c");
  const scripts = `${inlineScript(barScript)}
<script>a11yDemoBar.start(${options});</script>`;
  const source = view === "po" ? pages.po : view === "przed" ? withoutHints(pages.przed) : pages.przed;
  // Replacer functions, not strings: the bundle contains `$'` and `$&`, which a replacement
  // string would expand into pieces of the page.
  return source.replace(/<body[^>]*>/, (body) => `${body}\n${bar}`).replace(/<\/body>/, () => `${scripts}\n</body>`);
}
