# Full SEO Audit v4 — topcryptocards.eu
**Date:** July 6, 2026 · **Auditor method:** live HTTP inspection (raw + rendered), full codebase review, Supabase content DB queries, SERP competitor research. All findings verified directly, not assumed.
**Languages:** FR · DE · ES · IT · EN (~1,170 indexable URLs after sitemap cleanup; ~2,700 total routes)

---

# 1. Executive Summary

## Overall SEO Health Score: **54 / 100**

**Justification:** The on-page layer is genuinely excellent (localized slugs ×5 languages, clean hreflang, correct canonicals, rich JSON-LD, segmented sitemaps — verified). But the single most important thing — **what crawlers actually receive** — is still broken in production: every URL serves an identical 2.5KB English shell with no content, `lang="en"` on all 5 languages, and soft-404s everywhere. The fix is written and committed (`bc4de64`) **but not deployed**. Until that ships, ~90% of the on-page work is invisible to Bing, DuckDuckGo, social scrapers, and most AI engines, and Google indexes you slowly via its render queue. Score after deploying the already-committed fix: ~72. After the content program below: ~85.

## Top 5 Quick Wins (highest impact ÷ lowest effort)

| # | Win | Effort | Why now |
|---|---|---|---|
| 1 | **Activate the deploy pipeline** (add 4 GitHub secrets, stop Netlify builds, trigger the Action) | ~10 min | Everything is committed and waiting. This single step ships prerendered HTML for ~1,050 pages ×5 langs, real 404s, forced root redirects, trimmed sitemaps |
| 2 | Register **Bing Webmaster Tools** + submit sitemap-index after deploy | 15 min | You are currently ~invisible on Bing/DDG (CSR shell). Bing also feeds ChatGPT browsing |
| 3 | Regenerate **sitemap-blog.xml** (DB has 543 posts, sitemap lists 533) | 15 min | 10 newest articles — including 3 card reviews — are invisible to crawlers |
| 4 | Add `rel="sponsored"` to affiliate links in **CardDetail, BrandPage, ComparisonPage, CardDetailDrawer** | 1 h | Google guideline compliance on your 4 highest-traffic templates; protects against link-spam classification in a YMYL niche |
| 5 | Fix **39 weak FR excerpts** in blog_posts (they become meta descriptions) | 2 h | FR is your x-default/primary market; excerpts drive SERP CTR |

## Biggest Opportunities for Organic Traffic Growth

1. **Ship the rendering fix** — unlocks 4 of 5 language markets on all non-Google engines and accelerates Google indexing of ~1,170 URLs. Nothing else compares.
2. **Depth program on money pages** — 55% of 543 blog posts are <500 words; reviews/thematic pages are the pages that convert and rank. Competitors ranking above you (Journal du Coin, Cryptonaute, Koinly) publish 2,000–3,500-word guides.
3. **GEO / AI-search visibility** — your comparison tables, fee data, and structured FAQs are exactly what AI Overviews and LLMs cite, but they can't see them (CSR). Post-deploy, you're structurally *better* positioned than most competitors (clean FinancialProduct/FAQPage schema, comparison tables in HTML).
4. **Authority gap** — 0-backlink-profile niche site vs. crypto media with thousands of referring domains. Realistic wedge: be the only *structured, always-current, 5-language* card database; win long-tail + AI citations first, head terms later.

## Estimated traffic uplift (if top recommendations implemented)

Base: currently near-zero non-Google organic; Google partially indexing a rendered SPA. No GSC data was provided, so these are directional, anchored to the mechanics:

- **Conservative (6 months):** +60–120% organic sessions — from full indexation of existing 1,170 URLs, Bing/DDG going from zero to normal, FR/DE long-tail wins, AI-engine citations beginning.
- **Optimistic (6–12 months):** 3–5× — requires the depth program on the top 30 money pages ×5 languages plus ~20 quality backlinks (see §5). In a YMYL niche, authority is the binding constraint after the technical fix.

## Key strengths (verified — keep these)

- 5-language architecture with **localized slugs** (`/de/karten/`, `/es/tarjetas/`…) — rare and valuable
- Clean hreflang clusters (one set per page, correct deep-page mapping, consistent x-default → /fr)
- Rich structured data on the right templates: `FinancialProduct` + `FAQPage` + `BreadcrumbList` (cards), `Article` (blog), `ItemList` (home), `Person`/author (new)
- Disciplined canonicals incl. alphabetical normalization of A-vs-B pairs
- Segmented sitemap architecture with real lastmod; robots.txt sensible
- 543-post content base with zero duplicate titles and complete EN/DE/ES/IT excerpts
- Fast server (TTFB ~210ms Netlify CDN), HTTPS, HSTS

---

# 2. Detailed Findings by Category

## 2.1 Technical SEO

**Current status:** Fix committed but NOT deployed. Live production (verified today): raw `/fr` = English shell, `lang="en"`, 2,568 bytes, no content; garbage URLs return 200; root `/` redirect rules shadowed (never fire); sitemap-compare still lists 1,736 URLs incl. ~1,650 noindexed ones; bolt.new badge still loads.

**Specific issues found:**
- Client-side rendering of all SEO signals (title, meta, canonical, hreflang, JSON-LD, content) — every crawler except Google's renderer sees nothing
- Soft-404s sitewide (200 + client-injected noindex)
- Root language redirects dead (Netlify shadowing — needs `302!`, already fixed in repo)
- Sitemap/DB drift: blog 533 vs 543; compare sitemap lists noindexed URLs (fixed in repo, not live)
- Single 400KB JS bundle gates first paint (repo has manualChunks configured; live serves one bundle — will resolve on next deploy)
- No CrUX field data exists for the origin (site too new/low-traffic) — lab-only monitoring for now; PSI anonymous API quota was exhausted during audit, re-run with a key
- GA4 loads synchronously-ish in `<head>` (async but competes early); bolt.new badge = third-party JS on a finance site

**Prioritized recommendations:**

| Priority | Issue/Opportunity | Impact on Traffic | Effort | Specific Action Steps | Expected Result |
|---|---|---|---|---|---|
| P0 | Deploy pipeline not activated | ★★★★★ | 10 min | Add `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` as GitHub Actions secrets; Netlify → Stop builds; push/dispatch workflow | ~1,050 pages ship full localized HTML; real 404s; root 302s |
| P0 | Verify deploy | ★★★★★ | 5 min | `curl -s https://topcryptocards.eu/fr \| grep '<title>'` → French; garbage URL → 404; `Accept-Language: de` on `/` → `/de` | Confidence the fix is live |
| P1 | Blog sitemap drift | ★★★ | 15 min | `node scripts/gen-blog-sitemap.mjs`; add as prebuild step | 10 hidden posts indexed |
| P1 | GA4 + badge JS | ★★ | 30 min | Load gtag after `window.load`; remove bolt badge (Netlify snippet injection if not in code) | Better LCP/INP headroom |
| P2 | hreflang logic ×20 components | ★★ (risk mitigation) | 3 h | Extract `useHreflang()` hook; delete 20 copies | Prevents future drift bugs |
| P2 | CWV field monitoring | ★★ | 1 h | GSC CWV report post-indexing + PSI API with key, weekly cron | Detect regressions |

## 2.2 On-Page SEO & Site Architecture

**Current status (rendered layer — good):** Titles follow keyword+geo+year+benefit pattern, right length, all 5 langs verified. Meta descriptions compelling. One H1/page, logical H2s. All images had alt text on sampled pages. Internal linking strong: nav → thematic/brands/reviews; AutoLinker cross-links brands/tokens in body text.

**Specific issues:**
- **Click depth for blog**: 543 posts behind a paginated `/blog` listing; oldest posts are 5+ clicks deep. No topic-cluster hub pages
- **`/en/best-crypto-card-2026` vs `/en/best-crypto-card`** (and equivalents ×5 langs): near-identical intent — cannibalization risk. Same for `crypto-card-cashback` vs `crypto-card-rewards`
- Legal pages (`/impressum`, `/datenschutz`, `/privacy`) root-level, unlocalized, outside the lang tree
- Favorites/simulator/recommendation pages correctly excluded from sitemaps ✓

**Prioritized recommendations:**

| Priority | Issue/Opportunity | Impact | Effort | Action Steps | Expected Result |
|---|---|---|---|---|---|
| P1 | Topic cluster hubs | ★★★★ | 1–2 d | Create `/blog/categorie/<cat>` hub pages per lang listing all posts in category with intro copy; link from nav | Blog long-tail lifts; crawl depth ≤3 |
| P1 | 2026-page cannibalization | ★★★ | 2 h | Make `best-crypto-card-2026` canonical to `best-crypto-card` OR differentiate intent (year page = "what changed in 2026") and cross-link | One strong URL per intent |
| P2 | Localize legal pages | ★★ | 3 h | Follow AffiliateDisclosurePage pattern (already ×5) | Trust + consistency |
| P2 | Breadcrumb visibility | ★ | done? | BreadcrumbList schema exists — ensure visible breadcrumbs on all deep templates | Sitelinks + UX |

## 2.3 Content Quality, Strategy & E-E-A-T

**Current status:** 543 posts / 110 topics / 5 langs. Measured: FR avg 657 words (56 thin), EN 531 (63 thin), DE 511 (64 thin), ES 584 (58), IT 565 (58). AuthorPage (Tipitee) live with 35 sitemap URLs ✓. No methodology page. 3 review topics (Gnosis Pay, Brighty, MetaMask card) exist only in DE+EN. 39 FR posts have weak/missing excerpts.

**The strategic issue:** ~55% of the content base is under 500 words in a **YMYL finance niche** where the Helpful Content system explicitly rewards first-hand experience and depth. Competitors winning your head terms publish 2,000+ word hands-on guides with screenshots, fee math, and update logs.

**Prioritized recommendations:**

| Priority | Issue/Opportunity | Impact | Effort | Action Steps | Expected Result |
|---|---|---|---|---|---|
| P0 | Depth on money pages | ★★★★★ | ongoing | Top 30 topics (reviews of Crypto.com/Nexo/Bybit/Bitpanda/Wirex, thematic best/cashback/no-fees) → 1,200–2,000 words ×5 langs: real fee tables, screenshots of the app/card, "who should NOT get this card", update log ("Checked July 2026: fees unchanged") | The pages that rank & convert become competitive |
| P0 | First-hand experience signals | ★★★★ | per review | Photos of physical cards, real statement screenshots (redacted), "we paid €X in fees testing this" | E-E-A-T differentiation vs. affiliate-farm competitors; AI engines cite first-hand data |
| P1 | Translate 3 missing reviews to FR/ES/IT | ★★★ | 2 h | `scripts/translate-missing-articles.mjs` | 9 new indexable review pages in primary market |
| P1 | Fix 39 FR excerpts | ★★★ | 2 h | Rewrite as 140–155 char benefit-led summaries | FR SERP CTR |
| P1 | Methodology page ×5 + footer link | ★★★ | 2 h | Content already written (seo-fixes/methodology.json from previous session) | YMYL trust signal Google raters look for |
| P2 | Prune/merge weakest ~30 topics | ★★ | 1 d | <300-word posts with no impressions: merge into hubs or 410 | Sitewide quality signal |
| P2 | Visible dates + bylines on all posts | ★★ | 2 h | datePublished/dateModified visible + Person schema linked (partially done) | Freshness + E-E-A-T |

## 2.4 AI Search / GEO (Generative Engine Optimization)

**Current status:** Structurally excellent, practically invisible. Your comparison tables, per-card fee data, FAQPage schema, and entity-rich content are precisely what AI Overviews/Perplexity/ChatGPT cite — but most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do NOT execute JavaScript, so today they see an empty English shell. **The prerender deploy is also your GEO fix.**

**Specific opportunities:**

| Priority | Issue/Opportunity | Impact | Effort | Action Steps | Expected Result |
|---|---|---|---|---|---|
| P0 | AI crawlers see empty shell | ★★★★★ | (same deploy) | Ship prerender | All GEO work below becomes possible |
| P1 | Citation-worthy data blocks | ★★★★ | 1–2 d | On each review/thematic page add a "Key facts" box: issuance fee, FX fee, cashback %, staking req., availability — as a plain HTML `<table>` with `<caption>`, near the top | LLMs extract & cite structured facts; AI Overview inclusion |
| P1 | Allow AI crawlers explicitly | ★★★ | 10 min | Confirm robots.txt does NOT block GPTBot/ClaudeBot/PerplexityBot/Google-Extended (currently doesn't ✓ — keep it that way; it's a traffic channel for you, not a content-theft risk at your scale) | AI referral traffic |
| P2 | Definitional content | ★★★ | per page | First 2 sentences of each thematic page = direct answer ("The best crypto card in Europe in July 2026 is X because Y/Z") — currently pages open with marketing copy | Featured snippet + AI answer extraction |
| P2 | `dateModified` accuracy | ★★ | with CMS | Real update dates in Article schema (AI engines weight freshness heavily for "best X 2026" queries) | Citation preference |

## 2.5 Off-Page SEO & Authority

**Current status:** Cannot verify backlink profile without tools (see §5 — run Ahrefs/Semrush free tier). Directional reality: new domain, likely <10 referring domains. FR/EN SERPs for head terms are held by DR 70–90 crypto media. You have existing groundwork: `SEO-BACKLINKS-GUIDE.md`, bitcointalk drafts, and a Medium article draft in the repo.

**Recommendations:**

| Priority | Opportunity | Impact | Effort | Action Steps | Expected Result |
|---|---|---|---|---|---|
| P1 | Data-driven link asset | ★★★★ | 2–3 d | Publish "European Crypto Card Fee Index — July 2026": aggregate your DB into one stats page (avg fees by country, cashback trends, MiCA-licensed issuers count). Update monthly. Pitch to crypto newsletters/journalists ×5 langs | The only realistic way a small site earns media links in this niche |
| P1 | HARO/journalist requests (FR+EN) | ★★★ | ongoing 30 min/d | Respond to crypto/fintech queries as "founder of a 5-language crypto card comparison database" | 2–5 DR 40+ links/quarter |
| P2 | Execute existing drafts | ★★ | ready | Publish the bitcointalk posts + Medium article already in repo root | First referring domains |
| P2 | Competitor link gap | ★★★ | after tools | In Ahrefs: links to cryptocardindex.com + koinly.io/blog/best-crypto-debit-card that don't link to you → replicate resource-page/listicle inclusions | Steady link velocity |

## 2.6 UX & Conversion Signals

**Current status:** Good nav (Guides dropdown, brands, reviews), quiz/recommendation flow is a genuine differentiator, dark UI is distinctive. TTFB ~210ms.

| Priority | Issue | Impact | Effort | Action | Expected Result |
|---|---|---|---|---|---|
| P1 | First-paint blocked by 400KB bundle | ★★★ | (ships with deploy) | Prerendered HTML paints instantly; verify vendor chunks split post-deploy | Bounce ↓, LCP <2.5s |
| P2 | Comparison table on mobile | ★★ | 1 d | Sticky first column + horizontal scroll affordance on CompareTable | Mobile dwell time |
| P2 | Affiliate CTA consistency | ★★ | 1 h | One `<AffiliateButton>` component (also fixes rel="sponsored" gap) | CTR tracking consistency |

## 2.7 Competitor Analysis

| Competitor | Type | What they do better | Your wedge |
|---|---|---|---|
| **Journal du Coin** (FR), **Cryptonaute** (FR) | Crypto media | DR 70+, 3,000-word guides, constant freshness, editorial staff | They cover cards as one topic among hundreds; you ARE the topic. Win on data freshness, structure, and 5-language coverage |
| **Koinly blog** (EN) | SaaS content | DR 80+, monthly-updated listicle ranks everywhere | Their data is manual/stale between updates; your DB-driven pages can be provably current (visible "last verified" dates) |
| **cryptocardindex.com** (EN) | Direct niche rival | Same model, EN-only, already indexed/prerendered | You have 5 languages and a recommendation quiz. Beat them on EU-localization (MiCA, per-country availability) — they can't follow cheaply |
| **Vendor blogs** (Brighty, Bleap, MetaMask) | Self-interested | Product authority, fast publishing | They can't rank neutral "X vs Y" comparisons credibly; you can |
| **MoneyRadar, Spendways** (FR) | Finance comparison | Broader finance authority | Deeper crypto-card specialization; better structured data |

**Key gap summary:** Every ranking competitor has (a) rendered HTML and (b) authority. After the deploy you match (a) with better structure than most; (b) is the §2.5 program. None of them have your multilingual structured database — that's the moat to double down on.

---

# 3. Prioritized Action Plan

## Quick Wins (Week 1–2)
1. **Day 1:** GitHub secrets + stop Netlify builds + run workflow + verify (curl checklist in README-SEO-FIXES)
2. **Day 1:** GSC: URL-inspect 1 page/lang → Request indexing on 5 homepages; submit sitemap-index
3. **Day 2:** Bing Webmaster Tools: verify + submit sitemap-index
4. **Day 2:** Regenerate blog sitemap; commit as prebuild step
5. **Day 3–5:** `rel="sponsored"` via AffiliateButton component; fix 39 FR excerpts; translate 3 missing reviews (FR/ES/IT)
6. **Day 5–10:** Methodology page ×5; GA defer; kill bolt badge

## High-Impact Projects (30–60 days)
- **Money-page depth program:** 30 topics × 5 langs, ~2/week cadence, with first-hand evidence (photos, fee receipts, update logs)
- **Key-facts data boxes** on all review/thematic pages (GEO)
- **Topic cluster hubs** per blog category ×5 langs
- **Fee Index link asset** v1 + first outreach round
- **2026-page cannibalization** resolution
- `useHreflang()` consolidation

## Strategic Initiatives (60–90+ days)
- Backlink program steady-state (HARO, listicle inclusion, Fee Index monthly PR)
- Content pruning round based on first GSC data (merge/410 zero-impression posts)
- Per-country availability pages (`/fr/cartes-crypto-france` exists — extend model: Belgium, Switzerland FR; Austria DE) — high-intent, low-competition
- Consider migrating prerender → proper SSG (Astro) once content stabilizes; not urgent, prerender output is equivalent for crawlers

### 30/60/90 milestones
- **Day 30:** 100% of sitemap URLs serving static HTML; GSC coverage >800 indexed; Bing indexed >500; 10 money pages deepened; sponsored/excerpt/translation quick wins done
- **Day 60:** 25 money pages deepened; Fee Index live + 5 referring domains; blog hubs live; AI engines citing ≥1 page (test: ask Perplexity "best crypto card Europe")
- **Day 90:** 1,000+ indexed on Google, non-Google organic ≥15% of traffic, 15+ referring domains, FR long-tail top-10 rankings measurable in GSC

---

# 4. Competitor Benchmarking Summary

You're competing against **media authority** with a **product database**. Don't fight Journal du Coin on 3,000-word editorial breadth — fight on: (1) provable freshness (DB-driven "last verified" everywhere), (2) 5-language EU coverage nobody else has, (3) structured data AI engines prefer to cite, (4) neutral A-vs-B pages vendors can't write. cryptocardindex.com proves the niche-directory model ranks in EN — you're that, ×5 languages, with a quiz. Their existence is validation, not threat: match their indexability (deploy!), exceed their localization.

---

# 5. Recommended Tools & Next Steps

| Tool | Cost | Use for this site specifically |
|---|---|---|
| **Google Search Console** | Free | THE priority: verify all 5 langs indexed post-deploy. Use: URL Inspection → "View crawled page" on `/fr`, `/de/karten/nexo-card` to confirm Google sees prerendered HTML. Page filter by `/fr/` etc. for per-language coverage |
| **Bing Webmaster Tools** | Free | Verify + submit sitemap. Import from GSC (1 click). Check "Crawled but not indexed" after 2 weeks |
| **Ahrefs Webmaster Tools** | Free tier | Backlink baseline + monthly link-gap vs cryptocardindex.com and koinly.io/blog/best-crypto-debit-card |
| **PageSpeed Insights API** (with free API key) | Free | Anonymous quota is exhausted; create a key in Google Cloud Console → weekly lab CWV on /fr, /en, one card page, one blog post (no CrUX field data exists yet for your origin) |
| **Screaming Frog** (free ≤500 URLs, or license) | £199/yr | Post-deploy full crawl in "JavaScript disabled" mode — should now show correct titles/meta on every URL. Re-run monthly |
| **Perplexity / ChatGPT / Google AI Overviews** | Free | Monthly GEO check: "best crypto card Europe 2026", "meilleure carte crypto" — track when you start being cited, which pages |

**Missing data that would sharpen this audit — send when available:**
1. GSC access/export (impressions per language, coverage report, manual actions check)
2. GA4: current organic baseline per language
3. Confirmation the GitHub Actions deploy succeeded (or the error log if not)
4. Any Ahrefs/Semrush export of current backlinks

---

# 6. KPIs to Track

| KPI | Tool | Baseline (today) | Target Day 90 |
|---|---|---|---|
| Google indexed pages | GSC coverage | unknown (likely <300) | 1,000+ |
| Bing indexed pages | Bing WMT | ~0 | 500+ |
| Organic clicks/week per language | GSC (page filter) | unknown | FR > 500, others > 100 |
| Raw-HTML correctness | curl spot-checks | ❌ failing | 100% pass |
| Soft-404 count | GSC coverage | high | ~0 |
| CWV lab LCP (mobile, /fr) | PSI | unmeasured (bundle-bound) | <2.5s |
| Referring domains | Ahrefs | ~0 | 15+ |
| AI citations (Perplexity/AIO test set of 10 queries) | manual monthly | 0 | ≥3 queries citing you |
| Avg words, money pages | Supabase query (I can re-run) | 511–657 | 1,200+ top 30 |
| % posts with weak excerpts (FR) | Supabase query | 35% | 0% |

---

*Honest bottom line: this audit found nothing new to fix in the code — v3's fixes are committed and correct. The entire game right now is: (1) turn on the deploy pipeline, (2) then spend 90% of effort on content depth + authority, which no further technical work can substitute for.*
