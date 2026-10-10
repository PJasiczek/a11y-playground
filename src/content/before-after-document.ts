// The whole-page demo on /praktyka/przed-i-po: the KMW home page, broken and fixed, as
// standalone documents. Server-only; the demo route serves them, the tests read them.

export const views = ["przed", "po"] as const;
export type View = (typeof views)[number];

export function isView(value: unknown): value is View {
  return typeof value === "string" && (views as readonly string[]).includes(value);
}

const files = import.meta.glob<string>("/content/przed-i-po/*.html", { query: "?raw", import: "default", eager: true });

function readPage(name: View) {
  const source = files[`/content/przed-i-po/${name}.html`];
  if (source === undefined) throw new Error(`content/przed-i-po/${name}.html is missing`);
  return source;
}

/** The two pages as written, with the data-problem markers the list of problems points at. */
export const pages: Readonly<Record<View, string>> = { przed: readPage("przed"), po: readPage("po") };

/**
 * The page with nothing that hints at an answer: no data-problem attributes and no HTML comments,
 * so the source of the broken page gives nothing away while the reader checks it.
 */
export function withoutHints(source: string) {
  return source.replace(/\s+data-problem="[^"]*"/g, "").replace(/<!--[\s\S]*?-->/g, "");
}

// The bar is the app's, not KMW's: it must stay usable on a page that removes every focus outline
// and puts an overlay over everything, hence the id selectors and the stacking order.
const barStyles = `
  #demo-pasek { position: relative; z-index: 100; display: flex; flex-wrap: wrap; align-items: center; gap: .5rem 1rem; padding: .5rem 1rem; background: #14171a; color: #fbfaf7; font: 15px/1.5 "Segoe UI", system-ui, sans-serif; }
  #demo-pasek * { box-sizing: border-box; }
  #demo-pasek :focus-visible { outline: 3px solid #f4e75b; outline-offset: 2px; }
  #demo-pasek .demo-etykieta { font: 700 .75rem/1.4 ui-monospace, Consolas, monospace; letter-spacing: .08em; text-transform: uppercase; background: #f4e75b; color: #14171a; padding: .2rem .5rem; }
  #demo-pasek .demo-etykieta.demo-po { background: #bfe3cc; }
  #demo-pasek p { margin: 0; flex: 1 1 20rem; }
  #demo-pasek a { color: #fff; text-decoration: underline; text-underline-offset: 3px; display: inline-flex; align-items: center; min-height: 44px; }
  #demo-pasek button { display: inline-flex; align-items: center; gap: .4rem; min-height: 44px; padding: 0 .8rem; font: 600 .9rem "Segoe UI", system-ui, sans-serif; color: #fff; background: #14171a; border: 1px solid #a8a296; border-radius: 2px; cursor: pointer; }
  #demo-pasek button[aria-pressed="true"] { background: #fbfaf7; color: #14171a; }
  #demo-pasek button[aria-pressed="true"]::before { content: "✓" / ""; }
  #demo-komunikat:empty { display: none; }
  #demo-komunikat { flex-basis: 100%; font-weight: 600; }
`;

const bars: Record<View, string> = {
  przed: `
  <span class="demo-etykieta">Wersja zepsuta</span>
  <p>Ta strona celowo łamie zasady dostępności. Część rzeczy nie zadziała z klawiatury ani z czytnikiem ekranu.</p>
  <button type="button" id="demo-ruch" aria-pressed="false">Włącz ruch</button>
  <a href="/praktyka">Wróć do aplikacji</a>`,
  po: `
  <span class="demo-etykieta demo-po">Wersja poprawiona</span>
  <p>Tak ta strona powinna wyglądać.</p>
  <a href="/praktyka">Wróć do aplikacji</a>`,
};

/** A bundled script as an inline script element. Nothing in it may close the element early. */
function inlineScript(source: string) {
  return `<script>${source.replace(/<\/script/gi, "<\\/script")}</script>`;
}

/**
 * One page with the demo bar in front of it. `barScript` is the bundle from virtual:demo-bar,
 * which runs the bar: the motion switch and the links that lead nowhere in the demo.
 */
export function beforeAfterDocument(view: View, barScript: string) {
  const bar = `<style>${barStyles}</style>
<aside id="demo-pasek" lang="pl" aria-label="Demonstracja">${bars[view]}
  <p id="demo-komunikat" role="status"></p>
</aside>`;
  const options = JSON.stringify({ view }).replace(/</g, "\\u003c");
  const scripts = `${inlineScript(barScript)}
<script>a11yDemoBar.start(${options});</script>`;
  const source = view === "przed" ? withoutHints(pages.przed) : pages.po;
  // Replacer functions, not strings: the bundle contains `$'` and `$&`, which a replacement
  // string would expand into pieces of the page.
  return source.replace(/<body[^>]*>/, (body) => `${body}\n${bar}`).replace(/<\/body>/, () => `${scripts}\n</body>`);
}
