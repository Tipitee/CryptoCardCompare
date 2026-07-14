# Audit v7 + Plan « best website possible »
### TopCryptoCards vs the 15 High-Reward SEO Tactics
**Date:** July 8, 2026 · Guide saved to `docs/SEO-GUIDE-15-TACTICS.md` · Every status below verified live or in code today.

---

## Executive state check

Production is healthy: prerendered HTML ×7 markets, real 404s, clean sitemaps, IndexNow in the deploy workflow, authors with Person schema, FAQPage on key templates, Dataset schema, llms.txt. The commits from the last session are pushed (`989c360`), and 7 new brands were added. **One pending action from last session: the 9 review translations are still not inserted** (`/fr/blog/gnosis-pay-avis-2026` → 404). Run `node scripts/insert-review-translations.mjs`.

**Score vs the guide: 11 of 15 tactics already in place or partial.** The 4 genuinely open ones are where the plan focuses: content refresh loop (T1), free tools as link magnets (T5), Reddit/GEO presence (T7), and link-building execution (T13). Plus entity/socials buildout (T9).

---

## Tactic-by-tactic status

| # | Tactic | Status | Evidence / Next action |
|---|---|---|---|
| 1 | Refresh old content | 🔴 **To build** | No GSC-driven refresh loop yet. → **The Refresh Loop** below — highest ROI item in this plan |
| 2 | Authors | 🟢 Done | Byline + avatar + `rel="author"` on posts, AuthorPage, Person JSON-LD. Polish: add real LinkedIn/X URLs to `authors.ts` sameAs (currently empty) |
| 3 | Integrations & partnerships | 🟡 Adapt | No marketplace equivalent for a comparator. Adaptation: **embeddable compare widget** (`<iframe>`/script) other sites can embed with a backlink; offer the Fee Index data via API/CSV with attribution license |
| 4 | Exact match domain | 🟢 Done | topcryptocards.eu = "top crypto cards" — nothing to do |
| 5 | Free tools | 🟡 Partial | Simulator + quiz exist but live inside the app, not positioned as standalone linkable tools. → Extract **3 standalone tool pages** (see below) |
| 6 | Fresh regular content | 🟢 Done | 551 posts, generation pipeline, nightly re-render. Watch mistake #3: cadence > volume; prefer refreshing over net-new now |
| 7 | Reddit / parasite SEO | 🔴 To build | Zero presence. → Reddit playbook below (also the #1 GEO lever per the guide: LLMs pull from Reddit) |
| 8 | Keyword gaps | 🟡 Tooling needed | No Ahrefs/Semrush data yet. → Ahrefs Webmaster Tools (free) + GSC query mining once 4 weeks of data accrue. Known gap candidates: "carte crypto IBAN" (done ✓), country×card availability, "alternatives à X" (see T14) |
| 9 | NAP & socials | 🔴 Weak | Only `x.com/cryptocards_eu` in Organization sameAs. → Create + link LinkedIn company page, Crunchbase, YouTube (even 1 video), consistent name/logo/URL everywhere; footer social links; extend sameAs array |
| 10 | Curated directories | 🔴 To do | → Product Hunt launch (the comparator + Fee Index as "products"), There's An AI For That (recommendation quiz), curated crypto/fintech directories only — skip open free-for-alls |
| 11 | Programmatic SEO | 🟢 Done right | 1,725 compare pages with noindex allowlist (exactly the guide's guardrail), localized slugs, real data. Scale gradually if extending |
| 12 | FAQs | 🟢 Done, extend | FAQPage schema on cards + thematic + comparisons ×5 langs. → Add FAQ blocks to the 30 money blog posts (harvest People-Also-Ask questions per market) |
| 13 | Link outreach | 🔴 To execute | Assets ready (Fee Index page exists, bitcointalk + Medium drafts in repo root since weeks). → Publish drafts this week; then the 3-motion outreach program below |
| 14 | Comparison pages | 🟢 + 1 gap | A-vs-B done. **Missing: "[Brand] alternatives" pages** — distinct keyword, bottom-funnel, zero current coverage. One page per major brand ×5 langs (~10 brands: Crypto.com, Binance, Nexo, Coinbase, Revolut…) |
| 15 | Useful schema | 🟢 Done | Person ✓ FAQPage ✓ sameAs ✓ (thin — fix via T9) + FinancialProduct/Dataset/Breadcrumb. Validate 3 templates in Rich Results Test monthly |

## Mistakes checklist (Bonus A)

| Mistake | Status |
|---|---|
| Internal linking / orphans | 🟡 Blog hubs exist (BlogCategoryPage); verify 3-click rule with a Screaming Frog crawl post-deploy; AutoLinker helps |
| Fiverr backlinks / PBNs | 🟢 N/A — never do it |
| Scaling thin AI pages | 🟢 Guardrailed (noindex allowlist; 55% thin posts being addressed by refresh loop rather than new volume) |
| Crawlability | 🟢 Fixed (prerender, real 404s, flat architecture, server redirects) |
| Content structure | 🟢 Verified (single H1, sequential headings) |
| Pathnames | 🟢 Localized keyword slugs everywhere |
| Slow LCP | 🟢 Hero eager + preload, lazy below fold, vendor chunks, GA deferred |
| Ignoring Bing | 🔴 **Register Bing Webmaster Tools now** — IndexNow already pings Bing, but BWT gives the feedback loop; Bing feeds ChatGPT/Copilot/DDG |
| Sitemap misconfig | 🟢 Clean (index + 12 children, no noindex URLs since trim, robots.txt declares index) |

Bonus B: IndexNow 🟢 (in workflow) · SSR/SSG 🟢 (prerender).

---

## The plan — 4 workstreams, 90 days

### W1 — The Refresh Loop (T1) — start week 1, run forever
The guide's #1 tactic, and your 551-post corpus is perfect for it:
1. **Now:** GSC → Performance → filter positions 8–20, group by language. Export top 20 URLs by impressions.
2. **Weekly sprint (2–3 posts/week):** add a fee table from the DB, a 2026 update section, an FAQ block (T12), internal links to money pages; update the `updated_at` → sitemap `lastmod` picks it up → IndexNow pings on deploy.
3. **Rule:** never touch the date without adding a real section (guide's warning).
4. This replaces net-new publishing as the default content motion — you have volume; you need positions.

### W2 — Link magnets (T5 + T13 + T10) — weeks 1–6
1. **Week 1:** publish the dormant bitcointalk + Medium drafts (in repo root). Zero-effort first links.
2. **Weeks 2–3:** extract 3 standalone tools at clean URLs, EN-first:
   - `/en/tools/crypto-card-fee-calculator` (input: monthly spend → real annual cost per card, from DB)
   - `/en/tools/cashback-calculator` (spend profile → best card + € earned/year)
   - Fee Index (exists ✓) → add "cite this data" block + CSV download + monthly changelog
   Each: own H1/title, FAQPage, shareable OG image. These are what journalists and Reddit link to.
3. **Week 3:** Product Hunt launch (comparator + tools). There's An AI For That for the quiz.
4. **Weeks 4–6:** outreach motions, 30 min/day: (a) mentions-without-links via Ahrefs alerts, (b) broken-link replacement on crypto card listicles, (c) pitch Fee Index monthly stat to FR/EN crypto newsletters. Target: 15 referring domains by day 90.

### W3 — Reddit & GEO (T7 + T12) — weeks 2–12, 3h/week
1. Create an account that discloses affiliation ("I run a crypto card comparison DB"). Honesty = survival on Reddit.
2. Monitor: r/CryptoCurrency, r/eupersonalfinance, r/BitcoinFrance, r/vosfinances, r/Finanzen, r/ItaliaPersonalFinance, r/ESPersonalFinance — answer card questions with **data** (fee tables, availability), link only when it genuinely helps.
3. Measure via the AI citation test set (10 queries in Perplexity/ChatGPT monthly) — Reddit mentions feed LLM answers directly per the guide.
4. Extend FAQ blocks on money pages with the exact questions found on Reddit (they ARE the query fan-out).

### W4 — Entity & coverage (T9 + T14 + T8) — weeks 2–8
1. **Week 2:** LinkedIn company page + Crunchbase profile + footer social links + extend `sameAs` on Organization schema. Identical name/logo/description everywhere.
2. **Weeks 3–6:** "[Brand] alternatives" pages ×10 brands ×5 langs (template + DB data + honest editorial verdict — reuse ComparisonPage infrastructure; sitemap + allowlist entries).
3. **Weeks 4–8:** keyword gap pass with Ahrefs free tier vs cryptocardindex.com + koinly listicle; add gaps to the refresh/creation queue.

### Immediate one-offs (this week)
1. ☐ `node scripts/insert-review-translations.mjs` + `gen-blog-sitemap.mjs` + push (pending from last session)
2. ☐ Register **Bing Webmaster Tools**, import from GSC, submit sitemap-index
3. ☐ Fill real profile URLs in `src/data/authors.ts` sameAs
4. ☐ Commit `docs/SEO-GUIDE-15-TACTICS.md` + this plan

### KPIs (day 90)
Referring domains ≥ 15 · GSC: 20 refreshed posts avg position 8–20 → ≤ 7 · Bing indexed ≥ 600 · AI citation test ≥ 5/10 · 3 tool pages earning ≥ 1 organic link/month each · 50 "alternatives" pages indexed · Reddit: ≥ 2 threads/month where the site is referenced by others (not you).

---

*Method note: guide ingested in full and saved to docs/; statuses cross-checked against live production (raw HTML fetches), repo code, and the deploy workflow today. The project already implements more of this guide than most sites ever will — execution now shifts from code to distribution.*
