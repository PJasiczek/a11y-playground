# SEO release checklist

## Implemented on the feature branch

- Existing prerendered sitemap retained, XML escaping and canonical URL deduplication added.
- Shared brand and section cards, individual WCAG criterion cards, explicit Open Graph and X metadata, and a square manual-post asset.
- More descriptive landing-page search titles; existing JSON-LD and content links retained.
- Explicit `noindex` in Vercel preview builds; canonical host remains `https://www.a11y-playgrounds.site` from `src/lib/site.ts`.
- Production-HTML tests verify image tags, files, dimensions, sitemap consistency, unique metadata and HTTP 404s.

## Before publication

1. Confirm that the canonical host is the intended public domain. For a custom domain, update `src/lib/site.ts` once and redirect previous public hosts to it.
2. Run lint, production build, Vitest and Playwright. Inspect home, criterion and longest-title graphics at full size and thumbnail size. Graphics are static light artwork in either app theme.
3. Check the deployment's actual response for a preview `X-Robots-Tag` or rendered `noindex`. Build-time `VERCEL_ENV=preview` is an additional guard, not authentication.

## After publication (requires deployment and account access)

1. Request `/robots.txt` and `/sitemap.xml`; verify 200 responses, correct MIME types and a sitemap URL on the final host. Confirm all listed pages are canonical, indexable and return 200.
2. Inspect `/`, `/kryteria/1.4.3`, one lesson, `/szukaj` and an unknown URL without executing JavaScript. Verify unique title/description, one canonical on indexed pages, expected noindex on hidden pages, no duplicate OG tags and a real HTTP 404.
3. Fetch image URLs without cookies. Check their MIME and image dimensions. Run Facebook Sharing Debugger and LinkedIn Post Inspector, then share a link in X, Messenger, WhatsApp and Slack. Refresh caches where the service supports it.
4. Verify the Search Console property, submit the sitemap, inspect sample URLs, and record indexing, impressions, queries and CTR. Revisit after 2–4 weeks; sitemap submission does not guarantee indexing or rankings.
5. Record mobile Core Web Vitals from production field data where available and a lab baseline. Check existing structured data against visible content; schema validity does not guarantee rich results. Do not add ratings, FAQ claims or dates absent from the page.

Square artwork (`/social/post-square-v1.png`) is for manual posts, not an automatic Instagram link card. Section images are shared across lessons and examples; the card title and description remain specific to each shared page. No live deployment, Search Console submission or external social post is performed by the implementation.

Sources: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Open Graph](https://ogp.me/).
