import { describe, expect, test } from "vitest";
import { beforeAfterDocument, pages, withoutHints } from "./before-after-document";

describe("before and after documents", () => {
  test("the broken page served for checking carries no hints", () => {
    const served = beforeAfterDocument("przed", "");
    expect(pages.przed).toContain("data-problem");
    expect(served).not.toContain("data-problem");
    expect(served).not.toContain("<!--");
  });

  test("hints are stripped wherever they sit", () => {
    expect(withoutHints('<div class="a" data-problem="menu kontrast">x</div><!-- note\n -->')).toBe('<div class="a">x</div>');
  });

  test("the bar script goes in as written, even with replacement patterns in it", () => {
    const script = "const a = `$'` + '$&' + '$`';";
    expect(beforeAfterDocument("po", script)).toContain(script);
  });

  test("the bar comes first in the body and its script last", () => {
    const served = beforeAfterDocument("po", "/* bar */");
    expect(served.indexOf('<aside id="demo-pasek"')).toBeLessThan(served.indexOf('class="przejdz"'));
    expect(served.indexOf("/* bar */")).toBeGreaterThan(served.indexOf("</dialog>"));
  });
});
