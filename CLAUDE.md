# TopCryptoCards — Architecture Overview

## Stack
- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS
- **Routing**: React Router v6 (multilingual, see below)
- **Backend**: Supabase (PostgreSQL + Edge Functions in Deno)
- **Hosting**: Cloudflare Pages (project `topcryptocards`, **Direct Upload** mode — migrated off Netlify ~2026-07-28). Account ID `8fce1e4ded2b348e9dd8f0df6b687221`.
- **Image generation**: Together AI (FLUX.1-schnell) via Edge Function

### Deploy pipeline (Cloudflare Pages)
`.github/workflows/deploy.yml` runs on push to `main`, manual dispatch, and nightly (03:17 UTC, to reflect live Supabase data). It: regenerates sitemaps + `llms-full.txt`, `vite build`, prerenders ~1,050 URLs, then `npx wrangler pages deploy dist --project-name=topcryptocards --branch=main`. Required GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

### Hosting config (Cloudflare Pages conventions — NOT netlify.toml)
- `public/_headers` → security headers (HSTS 2y, CSP, X-Frame-Options SAMEORIGIN, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) + `/assets/*` immutable caching. Vite copies it to `dist/_headers`.
- `public/_redirects` → root `/ → /fr` (302), SPA-only fallbacks (`/admin/*`, legal pages, blog-admin) to `/index.html` 200. Cloudflare Pages does NOT support Netlify's `Language=` directive.
- **Trailing slash**: handled automatically by Pages. `prerender.mjs` writes flat `path.html` files (not `path/index.html`), so Pages 308-redirects `/x/ → /x`; canonicals (`useSeoMeta.ts`) and sitemaps use the no-slash form. Do NOT add manual trailing-slash rules to `_redirects` — Pages can't splat-strip a slash generically and doesn't need to.
- `deploy-cloudflare.sh` is a one-off migration helper. `.netlify/` is a dead leftover (safe to delete, gitignored).

---

## Project structure

```
src/
├── components/       # Shared UI components (all actively used)
├── data/             # Static content — crypto pages, card reviews, A/B comparisons
├── hooks/            # useLanguage, useLocalizedRoute, useSeoMeta
├── i18n/             # Translation system (7 langs: fr/be/de/at/es/it/en)
│   └── locales/      # JSON files per language: common.json, cards.json, blog.json
├── lib/              # supabase.ts client
├── pages/            # One file per route (see routing below)
├── store/            # Zustand store (useAppStore)
├── types/            # TypeScript types: card.ts, blog.ts
└── utils/            # format.ts, markdown.ts, recommend.ts, cardDetection.ts

supabase/
└── functions/
    └── generate-hero-image/   # Edge Function: generates + uploads blog hero images

scripts/              # One-off Node.js scripts used to seed/migrate Supabase data
                      # Not part of the app — run manually from terminal
```

---

## Routing

The app is fully multilingual. Every user-facing route is prefixed with `/:lang` (fr/be/de/at/es/it/en).

**Market locales:** `be` = Belgium (French content, Belgian market filter); `at` = Austria (German content, Austrian market filter). These are NOT BCP 47 language codes — `useHreflang` maps them to `fr-BE` / `de-AT` via `HREFLANG_BCP47`. The `en` market = United Kingdom 🇬🇧 (maps to `en-GB`).

**Pattern:** `/:lang/<localized-slug>` → component with `theme` or other prop

Example: `/fr/carte-crypto-cashback` and `/de/krypto-karte-cashback` both render `<ThematicPage theme="cashback" />`.

All routes are defined in `App.tsx`. The verbosity is intentional — each localized slug is a distinct SEO target.

**Admin routes** (no `:lang` prefix, no Layout wrapper):
- `/admin/blog` → `AdminBlog.tsx`
- `/admin/generate-hero-images` → `AdminHeroImages.tsx`

---

## Key pages

| Page | Description |
|------|-------------|
| `Home.tsx` | Homepage with card listing + filters |
| `CardDetail.tsx` | Full card detail page (fetches from Supabase) |
| `Compare.tsx` | Side-by-side comparison tool |
| `ComparisonPage.tsx` | SEO A vs B pages (e.g. "Binance vs Wirex") |
| `ThematicPage.tsx` | SEO thematic pages (best, cashback, no-fees…) |
| `BlogPost.tsx` | Blog article (Markdown from Supabase `blog_posts`) |
| `CryptoPage.tsx` | Static crypto guide pages (BTC, ETH, SOL…) |
| `ReviewPage.tsx` | Card review pages |
| `AlternativesPage.tsx` | "[Brand] alternatives" SEO pages × 10 brands × 7 langs |
| `AdminHeroImages.tsx` | Admin: generate/propagate blog hero images |
| `ContactPage.tsx` | Contact page × 7 langs (E-E-A-T) |

---

## Data sources

### Supabase tables
- `cards` — all card data (cashback, fees, extras, availability by market)
- `blog_posts` — blog articles with `lang`, `slug`, `topic_key`, `image_hero`

### Static data files
- `src/data/cryptoContent.ts` — FR content for 10 crypto pages; imports translations from `cryptoContentTranslations.ts`
- `src/data/cardReviews.ts` — structured review data for ~10 cards
- `src/data/comparisonContent.ts` — specific A/B copy overrides for ComparisonPage
- `src/data/alternativesContent.ts` — 10 brands × 5 content langs × slugs; exports `ALT_BRANDS`, `ALT_BRAND_MAP`, `ALT_ROUTES`. `ALT_BRAND_MAP` is used in BrandPage, ReviewPage, ComparisonPage for cross-links. `getEquivalentRoute` in `i18n/utils.ts` uses `ALT_BRANDS` for language switching.

### topic_key (blog_posts)
Groups language variants of the same article. When a hero image is generated for a FR article, the Edge Function propagates it to all rows sharing the same `topic_key`. Assigned via SQL regex (see `scripts/add-topic-key.sql`).

---

## Key components

| Component | Description |
|-----------|-------------|
| `IndependentNotice.tsx` | E-E-A-T trust signal: "Comparatif indépendant — commissions d'affiliation." Used on Home, Compare, ComparisonPage. Links to affiliate disclosure page. |
| `AffiliateButton.tsx` | `rel="sponsored"` wrapper for affiliate CTA buttons |
| `AutoLinker.tsx` | Auto-links brand names + crypto tokens in text content |
| `CountrySwitcher.tsx` | Country+language selector (replaces old LanguageSwitcher) — switches URL lang prefix and market filter |

---

## i18n system

Language is stored in the URL (first path segment). `useLanguage()` reads it from `useParams()`.

Translations live in `src/i18n/locales/{lang}/*.json`. Access via the `t()` function from `src/i18n/index.ts`.

Localized routes (e.g. card detail `/fr/cartes/:id` vs `/en/cards/:id`) are resolved via `useLocalizedRoute()`.

---

## Edge Function — generate-hero-image

Located at `supabase/functions/generate-hero-image/index.ts`.

Flow:
1. Receives `{ id, title, excerpt, tags, slug }` via POST
2. Detects which card is mentioned in the article (to pick matching colors)
3. Builds an image prompt from title/tags/card colors (no external LLM needed)
4. Calls Together AI FLUX.1-schnell to generate the image
5. Uploads to Supabase Storage (`blog-hero-images` bucket)
6. Updates `blog_posts.image_hero` for the target post
7. Propagates the same image URL to all posts sharing the same `topic_key`

Requires env vars: `TOGETHER_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SECRET`.

---

## Scripts (scripts/)

One-off migration/generation scripts. **Not part of the app bundle.**

| Script | Purpose |
|--------|---------|
| `add-topic-key.sql` | Adds `topic_key` column and assigns values via regex |
| `add-category-to-blog-posts.sql` | Adds `category` column |
| `generate-crypto-articles.mjs` | Generated the 10×5 crypto page articles |
| `generate-card-reviews.mjs` | Generated card review content |
| `fix-slugs.mjs` | Fixed malformed slugs in Supabase |
| `inject-thematic-links.mjs` | Added cross-links to blog articles |

---

## SEO & E-E-A-T work done (July 2026)

- BCP 47 hreflang fixed: `be`→`fr-BE`, `at`→`de-AT`, `en`→`en-GB` (in `useHreflang.ts` + all 11 sitemap XML files)
- Home/Compare/ComparisonPage: `IndependentNotice` affiliate disclaimer added
- ContactPage × 7 langs + footer link + sitemap entries
- Security headers in `public/_headers` (HSTS 2y, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP) — migrated from the old `netlify.toml [[headers]]`, now dead
- LCP preload: `<link rel="preload" as="image" href="/logo-small.png">` in index.html
- GTM preconnect in index.html
- Logo width/height attributes set in Layout.tsx
- `useSeoMeta` fallback changed to `en_GB` (not `en_US`)
- `AffiliateDisclosurePage` — added `useSeoMeta` (proper title/desc per lang, removed noindex)

## GEO (Generative Engine Optimization) done (July 2026)

- `public/robots.txt` — explicit `Allow: /` for 12 AI crawlers (GPTBot, PerplexityBot, ClaudeBot, etc.)
- `public/llms.txt` — summary file per llmstxt.org standard, links to llms-full.txt
- `public/llms-full.txt` — full structured card data for LLM consumption: comparison table, country recs, methodology, FAQ
- `public/.well-known/ai-plugin.json` — OpenAI/ChatGPT plugin discovery format
- `Home.tsx` — Schema.org Dataset added (alongside WebSite + Organization + ItemList)
- `FeeIndexPage.tsx` — Schema.org Dataset already present

## Pending tasks (as of July 2026)

**User-side (terminal):**
- Commit + push all GEO changes:
  ```bash
  git add -A && git commit -m "GEO: llms-full.txt, ai-plugin.json, robots.txt AI crawlers, CSP, BCP47 sitemaps, Dataset schema"
  git push
  ```

## SEO playbook reference

The permanent SEO reference for this project is `docs/SEO-GUIDE-15-TACTICS.md`
(15 high-reward tactics + 10 common mistakes + IndexNow/SSR notes).
Consult it before any SEO decision. Current tactic-by-tactic status and plan:
`SEO-AUDIT-V7-PLAN-BEST-WEBSITE.md`.

## AI SEO operating system (seo/)

The `seo/` folder is the operating system for all SEO/AI-visibility work
(adapted from the Amadora "7 Configs" guide, pre-filled for this project).
Read `seo/your-site/*` at the start of any SEO session. Shortcuts defined in
`seo/settings.json`: `/audit`, `/schema`, `/visibility`, `/perception`,
`/gap`, `/brief`, `/report`, `/refresh` — when the user types one, run the
corresponding playbook file. Always segment analyses by market
(fr/be/de/at/es/it/en). Every report ends with ONE action sized < 4 h.
