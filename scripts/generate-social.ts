import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { socialCards } from "../src/lib/social.ts";

// Offline export using the project's Playwright renderer; no network or image service needed.
const dir = "public/social";
await mkdir(dir, { recursive: true });
const scene = (await readFile("public/images/playground-hero.png")).toString("base64");
const font = (await readFile("node_modules/@fontsource-variable/geist/files/geist-latin-ext-wght-normal.woff2")).toString("base64");
const latin = (await readFile("node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2")).toString("base64");
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const card of socialCards) {
    await page.setContent(`<!doctype html><html lang="pl"><meta charset="utf-8"><style>
      @font-face{font-family:Geist;src:url(data:font/woff2;base64,${font})} @font-face{font-family:Geist;src:url(data:font/woff2;base64,${latin});unicode-range:U+0000-00FF}
      *{box-sizing:border-box}body{margin:0;background:#fdfbf6;color:#06316b;font-family:Geist,Arial,sans-serif}
      main{position:relative;width:1200px;height:630px;overflow:hidden;padding:64px}
      .glow{position:absolute;right:-120px;top:-200px;width:500px;height:500px;border-radius:50%;background:${card.color};opacity:.25}
      header{display:flex;gap:20px;align-items:center;font-size:30px;font-weight:800} .bars{display:flex;gap:6px}.bars i{width:15px;height:42px;border-radius:9px;background:linear-gradient(#ffffff90,transparent 60%),var(--bar);box-shadow:inset 0 -3px 3px #06316b18}
      .label{font-size:23px;font-weight:700;margin-top:44px;letter-spacing:1px}h1{font-size:68px;line-height:1.1;letter-spacing:-2px;width:580px;margin:24px 0;position:relative;z-index:1}
      .lede{font-size:26px;margin:0;position:absolute;left:64px;top:440px}img{position:absolute;left:665px;top:155px;width:490px;height:390px;object-fit:contain}footer{position:absolute;left:64px;bottom:50px;font-size:22px}
      </style><main><div class="glow"></div><header><span class="bars">${["#a8dffc", "#acf0b6", "#d0b9fa", "#ffd2aa"].map((c) => `<i style="--bar:${c}"></i>`).join("")}</span>a11y playground</header><div class="label">${escape(card.label)}</div><h1>${escape(card.title)}</h1><p class="lede">Poznaj WCAG. Sprawdź w praktyce.</p><img alt="" src="data:image/png;base64,${scene}"><footer>WCAG po polsku · wiedza i praktyka</footer></main>`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode()));
      const title = document.querySelector("h1");
      if (!title) throw new Error("Missing card title");
      let size = 68;
      while (title.getBoundingClientRect().bottom > 412 && size > 32) title.style.fontSize = `${String(--size)}px`;
      if (title.getBoundingClientRect().bottom > 412 || title.scrollWidth > title.clientWidth) throw new Error("Card title overflows");
    });
    await page.screenshot({ path: `${dir}/${card.key}-v1.png` });
    // Dedicated 2:1 composition: safe insets preserved, rather than cropping the text.
    await page.setViewportSize({ width: 1200, height: 600 });
    await page.addStyleTag({ content: "main{height:600px}img{top:140px;height:360px}.lede{top:425px}" });
    await page.screenshot({ path: `${dir}/${card.key}-x-v1.png` });
    if (card.key === "home") {
      await page.setViewportSize({ width: 1080, height: 1080 });
      await page.addStyleTag({ content: "main{width:1080px;height:1080px}h1{width:900px;font-size:68px}.lede{top:420px}img{left:380px;top:460px;width:630px;height:510px}" });
      await page.evaluate(() => { const title = document.querySelector("h1"); if (title) title.textContent = "Dostępność zaczyna się tutaj."; });
      await page.screenshot({ path: `${dir}/post-square-v1.png` });
    }
    await page.setViewportSize({ width: 1200, height: 630 });
  }
  console.log(`Exported ${String(socialCards.length * 2 + 1)} PNG cards to ${dir}`);
} finally {
  await browser.close();
}
