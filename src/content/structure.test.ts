import { JSDOM } from "jsdom";
import { describe, expect, test } from "vitest";
import { polishRoles } from "./announce";
import { clearStructure, describeFinding, landmarkRoles, markStructure, scanStructure, summarize } from "./structure";

function scan(body: string) {
  const { document } = new JSDOM(`<!doctype html><html lang="pl"><body>${body}</body></html>`).window;
  return { document, structure: scanStructure(document.body) };
}

const roles = (body: string) => summarize(scan(body).structure, { landmarks: true, headings: false }).landmarks.map(({ label, depth }) => `${"  ".repeat(depth)}${label}`);
const kinds = (body: string) => scan(body).structure.findings.map((finding) => finding.kind);

const page = '<header>Logo</header><main><h1>Strona</h1></main><footer>Stopka</footer>';

describe("scanStructure", () => {
  test("nests landmarks and names them", () => {
    expect(roles('<header><nav aria-label="Główna">a</nav></header><main><h1>x</h1></main>')).toEqual([
      "baner",
      "  nawigacja: Główna",
      "główny",
    ]);
  });

  test("header and footer inside sectioning content are not landmarks", () => {
    expect(roles("<main><article><header>a</header><footer>b</footer></article></main>")).toEqual(["główny"]);
  });

  test("section and form count only with a name, search always", () => {
    expect(roles('<section>a</section><section aria-label="Ceny">b</section><form>c</form><search>d</search>')).toEqual([
      "region: Ceny",
      "wyszukiwanie",
    ]);
  });

  test("explicit roles win, and an unnamed region is none", () => {
    expect(roles('<div role="navigation">a</div><div role="region">b</div><nav role="presentation">c</nav>')).toEqual(["nawigacja"]);
  });

  test("leaves out hidden content and the tool's own interface", () => {
    expect(roles('<nav hidden>a</nav><nav aria-hidden="true">b</nav><aside data-a11y-structure-ignore aria-label="x">c</aside>')).toEqual([]);
  });

  test("a page with banner, main, contentinfo and one h1 has no findings", () => {
    expect(kinds(page)).toEqual([]);
  });

  test("flags the missing main, banner, footer and h1, and text outside landmarks", () => {
    expect(kinds("<div>Logo</div><div>Treść</div>")).toEqual(["brak-main", "brak-banera", "brak-stopki", "brak-h1", "poza-punktami"]);
  });

  test("live regions do not count as text outside landmarks", () => {
    expect(kinds(`${page}<p aria-live="polite">Zapisano</p>`)).toEqual([]);
  });

  test("flags two navigations nobody can tell apart, but not two with names", () => {
    expect(kinds(`${page}<nav>a</nav><nav>b</nav>`)).toEqual(["nierozroznialne"]);
    expect(kinds(`${page}<nav aria-label="Główna">a</nav><nav aria-label="Okruszki">b</nav>`)).toEqual([]);
  });

  test("flags a repeated main and several h1", () => {
    expect(kinds('<header>a</header><main><h1>x</h1></main><main><h1>y</h1></main><footer>b</footer>')).toEqual([
      "powtorzony",
      "wiele-h1",
    ]);
  });

  test("flags skipped heading levels and empty headings", () => {
    const { structure } = scan('<header>a</header><main><h1>Strona</h1><h4>Harmonogram</h4><h2></h2></main><footer>b</footer>');
    expect(structure.headings.map(({ level, after }) => [level, after])).toEqual([
      [1, null],
      [4, 1],
      [2, null],
    ]);
    expect(structure.findings.map(describeFinding)).toEqual([
      "Po H1 od razu H4 („Harmonogram”). Pominięte: H2–H3.",
      "Nagłówek bez tekstu. Na liście nagłówków czytnika będzie pusty.",
    ]);
  });

  test("reads aria-level and role=heading", () => {
    const { structure } = scan('<div role="heading" aria-level="3">a</div><h2 role="presentation">b</h2>');
    expect(structure.headings.map(({ level, text }) => [level, text])).toEqual([[3, "a"]]);
  });
});

describe("markStructure", () => {
  test("labels landmarks and headings, and clearStructure takes it all off", () => {
    const { document, structure } = scan('<nav aria-label="Główna">a</nav><h1>x</h1><h3>y</h3>');
    markStructure(structure, { landmarks: true, headings: true }, document);
    expect(document.querySelector("nav")?.getAttribute("data-a11y-landmark")).toBe("nawigacja: Główna");
    expect(document.querySelector("h3")?.getAttribute("data-a11y-heading")).toBe("H3 · pominięte H2");
    expect(document.getElementById("a11y-structure-styles")).not.toBeNull();
    clearStructure(document);
    expect(document.querySelectorAll("[data-a11y-landmark], [data-a11y-heading], [data-a11y-skip], [data-a11y-pos]")).toHaveLength(0);
    expect(document.getElementById("a11y-structure-styles")).toBeNull();
  });
});

test("every landmark role has a Polish name", () => {
  expect(landmarkRoles.filter((role) => !polishRoles[role])).toEqual([]);
});
