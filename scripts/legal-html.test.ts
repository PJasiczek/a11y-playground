import { describe, expect, test } from "vitest";
import { readAct } from "./legal-html";

// A trimmed copy of the ELI markup: a quoted article from the Marshal's notice, a chapter, an
// article with ustępy, punkty, a tiret list and a footnote, and a repealed article.
const html = `
<section id="part_1"><div class="cite-box pro-cite-text"><div class="unit unit_arti pro-cite-text false" data-id="arti_5">
  <h3>Art.&nbsp;5.</h3><div class="unit-inner"><div data-template="xText">Cytowany przepis.</div></div>
</div></div></section>
<section id="part_2">
<div class="unit unit_chpt pro-text with-title" id="chpt_1">
  <h3><P ALIGN="center">Rozdział&nbsp;1</P><P><B><SPAN CLASS="pro-title-unit">Przepisy ogólne</SPAN></B></P></h3>
  <div class="unit-inner">
    <div class="unit unit_arti pro-text false" id="chpt_1-arti_5a">
      <h3 CLASS="pro-none"><B CLASS="b">Art.&nbsp;5a.</B></h3>
      <div class="unit-inner">
        <div class="unit unit_pass pro-text false" id="pass_1">
          <h3>1<A class="gloss-link tooltip" href="#g"><sup>4)</sup><span class="tooltip-text">W brzmieniu ustalonym przez…</span></A>.</h3>
          <div class="unit-inner">
            <div data-template="xText" CLASS="pro-text">Podmiot publiczny zapewnia
              dostępność&nbsp;cyfrową <span class="xHidden">(<A HREF="#">Dz. U. poz. 511</A>)</span>:</div>
            <div class="unit unit_pint pro-text false"><h3>1)</h3><div class="unit-inner">
              <div data-template="xText">stron;</div>
              <ul data-template="xEnum" CLASS="enum pro-text"><li><DIV>&nbsp;-&nbsp;</DIV><DIV><div data-template="xText">nowych,</div></DIV></li></ul>
            </div></div>
          </div>
        </div>
        <div class="unit unit_pass pro-text false" id="pass_2"><h3>2.</h3><div class="unit-inner">
          <div data-template="xText">(uchylony)</div>
        </div></div>
      </div>
    </div>
  </div>
</div>
<div class="unit unit_arti pro-text false" id="arti_9"><h3>Art.&nbsp;9.</h3><div class="unit-inner"><div data-template="xText">(uchylony)</div></div></div>
</section>`;

describe("readAct", () => {
  const act = readAct(html);

  test("skips quoted articles and reads chapters with their titles", () => {
    expect(act.chapters).toEqual([{ number: 1, title: "Przepisy ogólne" }]);
    expect(act.articles.map((a) => [a.slug, a.label, a.chapter])).toEqual([
      ["art-5a", "Art. 5a", 1],
      ["art-9", "Art. 9", null],
    ]);
  });

  test("flattens ustępy, punkty and tirets into labelled lines, without footnotes", () => {
    expect(act.articles[0]?.lines).toEqual([
      { label: "1.", depth: 0, ust: "1", text: "Podmiot publiczny zapewnia dostępność cyfrową (Dz. U. poz. 511):" },
      { label: "1)", depth: 1, ust: "1", text: "stron;" },
      { label: "–", depth: 2, ust: "1", text: "nowych," },
      { label: "2.", depth: 0, ust: "2", text: "(uchylony)" },
    ]);
  });

  test("keeps a repealed article as a stub, so numbering stays continuous", () => {
    expect(act.articles[1]?.lines).toEqual([{ label: null, depth: 0, ust: null, text: "(uchylony)" }]);
  });
});
