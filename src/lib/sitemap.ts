import type { SitePage } from "../content/site-pages.ts";
import { absoluteUrl } from "./seo";

/** XML text must be escaped even when today's slugs contain only safe characters. */
function xmlText(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char] ?? char);
}

export function sitemapXml(pages: readonly SitePage[]) {
  const urls = new Set(pages.filter((page) => page.index).map((page) => absoluteUrl(page.path)));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].map((url) => `  <url><loc>${xmlText(url)}</loc></url>`).join("\n")}\n</urlset>\n`;
}
