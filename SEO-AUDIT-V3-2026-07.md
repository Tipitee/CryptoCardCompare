# SEO Audit v3 — topcryptocards.eu

**Date:** July 6, 2026 · Full audit: live site + codebase + Supabase content, all 5 languages.
Everything below was verified directly (live HTTP responses, repo source, DB queries).

---

## Where you stand

Most on-page work is done and done well: clean per-page hreflang (the duplication is gone), reverse-compare canonicals, noindex on thin compare pairs and the 404 route, per-post OG images, AuthorPage with sitemap entries, x-default consistently on `/fr`, sitemap index consistent with files. The gap between you and "best possible" is now **one deployment problem, one config bug, and a content-depth program**.

---

## 🔴 Critical — ordered

### 1. Prerender exists but never runs — production is still a blank CSR shell
Verified live right now: `/fr` raw HTML = English title, `lang="en"`, 2.5KB, no content. Bing/DDG/social/AI crawlers still see nothing localized; Google still renders 2,700 pages client-side.

Three stacked causes found in the repo:

- `netlify.toml` build command is `npx vite build` — **npm lifecycle hooks don't run**, so your `postbuild` prerender never triggers on Netlify. (This is why commit `e582d35` "remove prerender from build command" seemed necessary — the real failure was cause #2.)
- **`puppeteer` is not in `devDependencies`** — the script can't run anywhere, including locally.
- `postbuild` is `node scripts/prerender.mjs || true` — the `|| true` hides every failure.

**Fix:**
```bash
npm i -D puppeteer
```
`package.json`: `"postbuild": "node scripts/prerender.mjs"` (remove `|| true`).
`netlify.toml`: `command = "npm run build"` (triggers postbuild).
Test locally first: `npm run build` → check `dist/fr/index.html` contains the French title and full content. If Netlify's build image gives Chrome trouble, set env `PUPPETEER_CACHE_DIR=/opt/build/cache/puppeteer` so it persists between builds. Fallback plan if build minutes become a problem: run prerender in a GitHub Action and deploy `dist/` to Netlify via CLI.

### 2. Root language redirect is dead — shadowed by index.html
`_redirects` has `/  /fr  302  Language=fr` — but Netlify serves the physical `/index.html` **before** unforced redirects, so these rules never fire. Verified live: `/` returns 200 with the shell.

**Fix:** force the rules with `!`:
```
/  /fr  302!  Language=fr
/  /de  302!  Language=de
/  /es  302!  Language=es
/  /it  302!  Language=it
/  /fr  302!
```

### 3. Still no real 404s
`_redirects` ends with `/* /index.html 200` (the SPA fallback was restored). Every garbage URL is a 200 (verified live). The client-side noindex helps Google only.

**Fix (after #1 ships):** prerender writes `dist/404.html` and physical files for every valid route, so the fallback becomes:
```
/*  /404.html  404
```
Keep the admin/legal passthrough rules above it. Do NOT make this change before prerender is live, or every deep URL will 404.

### 4. sitemap-blog.xml is 10 posts behind the database
DB has **543** posts; the sitemap lists **533**. Ten articles are invisible to crawlers (likely the newest: gnosis-pay/brighty/metamask reviews + orphan cmp posts).

**Fix:** `node scripts/gen-blog-sitemap.mjs` and add it to the build pipeline (prebuild step) so it can never drift again.

---

## 🟠 High priority

### 5. Blog content is thin at scale — now with exact numbers

| Lang | Posts | Avg words | Thin (<500 w) | Weak/missing excerpt |
|---|---|---|---|---|
| FR | 113 | 657 | 56 (50%) | **39** |
| EN | 109 | 531 | 63 (58%) | 0 |
| DE | 109 | 511 | 64 (59%) | 0 |
| ES | 106 | 584 | 58 (55%) | 0 |
| IT | 106 | 565 | 58 (57%) | 0 |

~55% of all posts are under 500 words — in a YMYL niche this is your main ranking-quality risk once rendering is fixed. **Program:** (a) pick the 20 topics with real search demand, expand those to 1,200+ words in all 5 languages (data tables, fee math, screenshots); (b) merge or 410 the weakest ~30 topics; (c) fix the 39 weak FR excerpts (they become meta descriptions). Good news: no duplicate titles anywhere.

### 6. Five topic_keys have missing translations
`blog-gnosis-pay-review-2026`, `blog-brighty-card-review-2026`, `blog-metamask-card-review-2026` exist only in DE+EN (missing FR/ES/IT — and FR is your x-default market). Two orphan compare posts exist only in ES / only in IT. Your `translate-missing-articles.mjs` script looks built for exactly this.

### 7. Affiliate links missing `rel="sponsored"` on your 4 highest-value templates
`CardDetail.tsx`, `BrandPage.tsx`, `ComparisonPage.tsx`, `CardDetailDrawer.tsx` render affiliate links without `sponsored` (other components have it). Google's guidelines require qualifying paid links; inconsistency across templates is the worst version. **Fix:** add `rel="sponsored noopener"` in those 4 files — or better, create one `<AffiliateButton>` component so it can't drift.

---

## 🟡 Medium

**8. tsc is failing your own commit rule.** `AffiliateDisclosurePage.tsx(207)`: unused `Code` import (TS6133). One-line fix.

**9. hreflang logic is copy-pasted across ~20 page components.** Each does its own `document.createElement('link')` dance. It works today (verified: clean, correct sets), but 20 copies will drift. Extract a `useHreflang(pathsByLang)` hook; one implementation, one test. Do this *before* it breaks, not after.

**10. GA loads eagerly in `<head>`.** Move gtag to `defer` + load after `window.load` (or switch to Partytown) — free LCP/INP win on mobile. The bolt.new badge is gone from index.html — good — but it still loads on the live deploy; confirm it disappears with the next deploy (if not, it's Netlify snippet injection — remove it there).

**11. Methodology / "how we test" page still missing.** AuthorPage shipped (good — 35 author URLs in sitemaps), but there's no methodology page in any language. The 5-language content for it was delivered in the previous session (`seo-fixes/src/i18n/methodology.json`). For YMYL finance, this + visible bylines on blog posts is the remaining E-E-A-T gap. Link it from the footer.

**12. Legal pages still EN/DE-only at root level.** `/impressum`, `/datenschutz`, `/privacy` remain unlocalized (AffiliateDisclosure is done — same pattern, apply to the rest).

---

## 🟢 Verified good (no action)

- hreflang: one clean set per page, correct localized deep-page mapping, x-default consistent on `/fr` everywhere
- Canonicals: self-referencing; reverse compare pairs canonical to alphabetical direction
- noindex: 404 route + non-allowlisted compare pairs (client-side; becomes crawler-proof once prerender ships)
- Sitemaps: index ↔ files consistent, xhtml:link annotations, single compare direction, real lastmod dates
- robots.txt sensible; no duplicate titles in 543 posts; excerpts solid in EN/DE/ES/IT; OG images per post; og:locale set; JSON-LD rich on all key templates

---

## Do-in-this-order checklist

| # | Change | Where | Effort |
|---|---|---|---|
| 1 | `npm i -D puppeteer`; postbuild without `\|\| true`; netlify command → `npm run build` | package.json, netlify.toml | 30 min + test |
| 2 | Force root redirects with `302!` | public/_redirects | 2 min |
| 3 | After prerender is live: fallback → `/* /404.html 404` | public/_redirects | 2 min |
| 4 | Regenerate blog sitemap + add to build | scripts, package.json | 15 min |
| 5 | `rel="sponsored"` on 4 templates (→ one AffiliateButton) | src | 1 h |
| 6 | Fix TS6133 | AffiliateDisclosurePage.tsx | 1 min |
| 7 | Translate 3 review topics to FR/ES/IT | translate script + DB | 2 h |
| 8 | Fix 39 FR excerpts | DB | 2 h |
| 9 | Content program: deepen top 20 topics ×5 langs | DB | ongoing |
| 10 | `useHreflang` hook consolidation | src/hooks | 2–3 h |
| 11 | Methodology page ×5 + footer link | src/pages | 2 h |
| 12 | Defer GA; verify bolt badge gone post-deploy | index.html | 30 min |
| 13 | Localize impressum/datenschutz/privacy | src/pages | 3 h |

After step 1–3 deploy, verify:
```bash
curl -s https://topcryptocards.eu/fr | grep -o '<title>[^<]*'        # French title
curl -s -o /dev/null -w "%{http_code}" https://topcryptocards.eu/xyz # 404
curl -s -o /dev/null -w "%{redirect_url}" -H "Accept-Language: de" https://topcryptocards.eu/  # → /de
```
Then: GSC URL-inspect one page per language + request indexing on the 5 homepages; register Bing Webmaster Tools and submit the sitemap index.
