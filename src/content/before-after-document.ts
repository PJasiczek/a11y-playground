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
  #demo-znaczniki a { position: absolute; z-index: 99; display: flex; align-items: center; justify-content: center; min-width: 44px; height: 44px; padding: 0 .4rem; border-radius: 22px; background: #14171a; color: #fff; font: 700 1rem ui-monospace, Consolas, monospace; text-decoration: none; box-shadow: 0 0 0 3px #f4e75b; }
`;

const back = `<a href="/praktyka/przed-i-po">Wróć do aplikacji</a>`;

function barFor(view: View, markers: readonly Marker[]) {
  switch (view) {
    case "przed":
      return `
  <span class="demo-etykieta">Wersja zepsuta</span>
  <p>Ta strona celowo łamie zasady dostępności. Część rzeczy nie zadziała z klawiatury ani z czytnikiem ekranu.</p>
  <button type="button" id="demo-ruch" aria-pressed="false">Włącz ruch</button>
  <a href="/demo/przed-i-po/przed-znaczniki">Pokaż znaczniki problemów</a>
  <a href="/praktyka/przed-i-po/lista">Lista problemów</a>
  ${back}`;
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
