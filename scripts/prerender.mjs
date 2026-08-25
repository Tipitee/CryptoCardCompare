#!/usr/bin/env node
/**
 * Post-build prerenderer for topcryptocards.eu
 * ------------------------------------------------
 * Renders every URL found in the sitemaps with headless Chrome and writes
 * static HTML into dist/. After this runs, every page ships its correct
 * <html lang>, <title>, meta description, canonical, hreflang, JSON-LD and
 * full body content in the initial HTML response — no JS needed by crawlers.
 *
 * Usage:  npx vite build && node scripts/prerender.mjs
 * Env:    PRERENDER_LIMIT=50        (optional, for quick test runs)
 *         PRERENDER_CONCURRENCY=8   (default 8)
 *         PRERENDER_PORT=45173      (default)
 *
 * Requires: npm i -D puppeteer
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';

// Skip prerender if env var set or puppeteer not installed (e.g. Bolt/CI environments)
if (process.env.SKIP_PRERENDER) {
  console.log('Prerender skipped (SKIP_PRERENDER set).');
  process.exit(0);
}
let puppeteer;
try {
  puppeteer = (await import('puppeteer')).default;
} catch {
  console.log('Prerender skipped: puppeteer not installed.');
  process.exit(0);
}

const DIST = join(process.cwd(), 'dist');
const ORIGIN = 'https://topcryptocards.eu';
const PORT = Number(process.env.PRERENDER_PORT || 45173);
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || 8);
const LIMIT = Number(process.env.PRERENDER_LIMIT || 0);

/** Routes that exist but are intentionally NOT in any sitemap. Add here if needed. */
const EXTRA_ROUTES = [
  // Pages légales / footer hors sitemaps : prérendues en fichiers physiques pour
  // être servies de façon fiable (indépendamment du cache CDN et des règles _redirects).
  '/impressum', '/datenschutz', '/privacy', '/risk-summary', '/affiliate-disclosure',
  // Mentions légales par marché (LegalPage)
  '/fr/mentions-legales', '/be/mentions-legales', '/de/rechtliches', '/at/rechtliches',
  '/es/aviso-legal', '/it/avviso-legale', '/en/legal-notice',
  // Divulgation affiliés par marché
  '/fr/divulgation-affilies', '/be/divulgation-affilies', '/de/affiliate-offenlegung',
  '/at/affiliate-offenlegung', '/es/divulgacion-afiliados', '/it/divulgazione-affiliati',
  '/en/affiliate-disclosure',
];

/** Compare pairs worth indexing (high search demand). Everything else with
 *  "-vs-" in the slug gets noindex,follow injected. Slugs are alphabetically
 *  sorted card ids (language-independent). Edit freely. */
const COMPARE_ALLOWLIST = new Set(
  JSON.parse(readFileSync(join(process.cwd(), 'scripts', 'comparison-allowlist.json'), 'utf8'))
);

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2',
};

// ── Tiny static server with SPA fallback ──────────────────────────────────
function serveDist() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname);
      let file = join(DIST, urlPath);
      if (existsSync(file) && !readdirSafeIsDir(file)) {
        res.setHeader('content-type', MIME[extname(file)] || 'application/octet-stream');
        res.end(readFileSync(file));
        return;
      }
      // SPA fallback
      res.setHeader('content-type', 'text/html');
      res.end(readFileSync(join(DIST, 'index.html')));
    });
    server.listen(PORT, () => resolve(server));
  });
}
function readdirSafeIsDir(p) { try { readdirSync(p); return true; } catch { return false; } }

// ── Collect URLs from sitemaps ─────────────────────────────────────────────
function collectPaths() {
  const idx = readFileSync(join(DIST, 'sitemap-index.xml'), 'utf8');
  const children = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = new Set(EXTRA_ROUTES);
  for (const child of children) {
    const fname = child.replace(ORIGIN + '/', '');
    const file = join(DIST, fname);
    if (!existsSync(file)) { console.warn(`! sitemap missing in dist: ${fname}`); continue; }
    const xml = readFileSync(file, 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      paths.add(new URL(m[1]).pathname);
    }
  }
  // Skip non-allowlisted compare pages entirely: they are noindex anyway and
  // rendering ~1,650 of them with Chrome is what blew past Netlify's build
  // timeout. They stay SPA-served via a passthrough rule in _redirects
  // (written by writeRedirects() below).
  const all = [...paths];
  // '/etudes/*' sont des pages HTML statiques (public/etudes/*.html), PAS des routes SPA.
  // Les prérendre écraserait le fichier statique par une 404 du SPA -> on les saute.
  const kept = all.filter((p) => p === '/' || p.startsWith('/etudes/') ? false : !shouldNoindex(p));
  console.log(`URL set: ${all.length} in sitemaps → ${kept.length} to prerender (${all.length - kept.length} noindex compares + root skipped)`);
  return kept;
}

// ── Decide noindex for thin programmatic compare pages ────────────────────
// Normalizes to alphabetical order before checking the allowlist, so both
// /fr/comparer/a-vs-b and /fr/comparer/b-vs-a resolve to the same key.
// Sections de comparaison programmatique (SPA, noindex). Les articles de BLOG
// comparatifs (…/blog/vergleich-…-vs-…) sont du vrai contenu et ne doivent PAS
// être attrapés par la règle -vs-.
const COMPARE_SECTIONS = new Set(['comparer', 'vergleichen', 'comparar', 'confrontare', 'compare']);
function shouldNoindex(path) {
  const segs = path.split('/').filter(Boolean);
  if (!segs.some((s) => COMPARE_SECTIONS.has(s))) return false; // hors section compare → jamais noindex
  const last = segs.pop() || '';
  if (!last.includes('-vs-')) return false;
  const vsIdx = last.indexOf('-vs-');
  const a = last.slice(0, vsIdx);
  const b = last.slice(vsIdx + 4);
  const normalized = [a, b].sort().join('-vs-');
  return !COMPARE_ALLOWLIST.has(normalized);
}

// ── Render one path ────────────────────────────────────────────────────────
async function renderPath(page, path) {
  // Wait for a POSITIVE signal that React ran and applied the page's SEO tags.
  // useSeoMeta sets document.title AND injects <meta property="og:title"> in the
  // same synchronous effect; the shell index.html has NO og:title, so its
  // presence reliably means the real localised title is in place. This avoids
  // brittle shell-title string matching (which drifts and broke the homepage).
  const isHub = path.split('/').filter(Boolean).length === 1; // /fr, /de, /es …
  const seoReady = () => page.$('meta[property="og:title"]');
  const load = async (waitMs) => {
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle0', timeout: 45000 });
    await page.waitForFunction(
      () => document.querySelector('meta[property="og:title"]') && document.querySelector('h1'),
      { timeout: waitMs }
    ).catch(() => {});
  };
  await load(15000);
  // Homepages are the only pages the deploy sanity-check validates. If React
  // hasn't applied SEO tags yet, retry once with a longer wait.
  if (isHub && !(await seoReady())) {
    console.warn(`! seo tags missing on hub, retrying: ${path}`);
    await load(30000);
    if (!(await seoReady())) console.warn(`! slow render (kept anyway): ${path}`);
  }

  let html = await page.evaluate(() => '<!DOCTYPE html>' + document.documentElement.outerHTML);

  // Make canonicals/hreflang absolute to production origin (rendered on localhost)
  html = html.replaceAll(`http://localhost:${PORT}`, ORIGIN);

  // Force correct lang attribute from URL — BCP 47 mapping guards against
  // useEffect timing races and ensures prerendered HTML has valid lang codes.
  const pathLang = path.split('/')[1];
  const BCP47_MAP = { be: 'fr-BE', at: 'de-AT', en: 'en-GB' };
  const langAttr = BCP47_MAP[pathLang] ?? pathLang;
  if (['fr','be','de','at','es','it','en'].includes(pathLang)) {
    html = html.replace(/(<html[^>]*)\blang="[^"]*"/, `$1lang="${langAttr}"`);
  }

  // Inject noindex for non-allowlisted compare pairs
  if (shouldNoindex(path)) {
    html = html.includes('name="robots"')
      ? html.replace(/<meta name="robots" content="[^"]*"/, '<meta name="robots" content="noindex, follow"')
      : html.replace('</head>', '<meta name="robots" content="noindex, follow"></head>');
  }

  // Write as path.html (not path/index.html) so Netlify serves at the
  // non-trailing-slash URL and avoids 301 redirects that confuse GSC.
  const segments = path.split('/').filter(Boolean);
  const outDir = join(DIST, ...segments.slice(0, -1));
  const filename = segments[segments.length - 1] + '.html';
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, filename), html);
}

// ── Make a fresh intercepted page ─────────────────────────────────────────
async function newPage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const u = req.url();
    if (u.startsWith(`http://localhost:${PORT}`) || u.includes('supabase.co')) req.continue();
    else req.abort();
  });
  return page;
}

// ── Main ───────────────────────────────────────────────────────────────────
const server = await serveDist();
let paths = collectPaths();
if (LIMIT > 0) paths = paths.slice(0, LIMIT);
console.log(`Prerendering ${paths.length} URLs with concurrency ${CONCURRENCY}…`);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const queue = [...paths];
let done = 0, failed = 0;

await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  let page = await newPage(browser);
  while (queue.length) {
    const path = queue.shift();
    // Try up to twice: transient navigation timeouts almost always pass on retry.
    let rendered = false;
    for (let attempt = 1; attempt <= 2 && !rendered; attempt++) {
      try {
        await renderPath(page, path);
        rendered = true;
      } catch (e) {
        // Re-create the page so a broken state doesn't affect subsequent renders
        try { await page.close(); } catch { /* ignore */ }
        page = await newPage(browser);
        if (attempt === 2) {
          failed++;
          console.error(`✗ ${path}: ${e.message.slice(0, 120)}`);
        }
      }
    }
    if (rendered) {
      done++;
      if (done % 100 === 0) console.log(`  ${done}/${paths.length}`);
    }
  }
  await page.close();
}));

// ── 404 page (served by Netlify with real 404 status via _redirects) ──────
try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}/fr/page-inexistante-xyz-404`, { waitUntil: 'networkidle0' });
  const html = await page.evaluate(() => '<!DOCTYPE html>' + document.documentElement.outerHTML);
  writeFileSync(join(DIST, '404.html'), html.replaceAll(`http://localhost:${PORT}`, ORIGIN));
  console.log('✓ dist/404.html written');
  await page.close();
} catch (e) { console.error('404 page failed:', e.message); }

await browser.close();
server.close();

// public/_redirects already ships with the real-404 catch-all and all
// required SPA rules — vite build copies it to dist/_redirects automatically.
// No dynamic overwrite needed here.
const total = done + failed || 1;
const okRatio = done / total;
console.log(`Render ratio: ${(okRatio * 100).toFixed(1)}% (${done} ok, ${failed} failed)`);
console.log(`\nDone. ${done} rendered, ${failed} failed.`);

// Tolerate a small number of transient failures: a handful of navigation
// timeouts out of ~2,300 pages should not nuke a multi-minute build. Those few
// pages simply fall back to SPA rendering, and the deploy sanity-check step
// separately guarantees the critical homepages rendered correctly.
const maxFailures = Math.max(10, Math.ceil(total * 0.01));
if (failed > maxFailures) {
  console.error(`::error::${failed} pages failed to prerender (tolerance ${maxFailures}) — investigate`);
  process.exitCode = 1;
} else if (failed > 0) {
  console.warn(`${failed} page(s) failed but within tolerance (${maxFailures}); continuing.`);
}
