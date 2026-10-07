#!/usr/bin/env node
/**
 * audit-links.mjs — audit site-wide des liens cassés / redirections / soft-404.
 *
 * Crawle TOUTES les URLs des sitemaps + les liens internes rencontrés, et signale :
 *   - 404 / 5xx / statut final non-200
 *   - chaînes de redirection (>1 saut) et boucles
 *   - redirections vers une 404 ("redirect error")
 *   - soft-404 : page 200 mais contenu "introuvable" OU <meta robots noindex> sur une URL de sitemap
 *   - liens internes (href) pointant vers une URL non-200
 *
 * Sans dépendance (Node 18+, fetch global). Lit le HTML prérendu (pas de JS),
 * ce qui reflète exactement ce que voit Googlebot au premier rendu.
 *
 *   node scripts/audit-links.mjs                      # audite https://topcryptocards.eu
 *   node scripts/audit-links.mjs --base https://topcryptocards.eu --max 4000 --conc 12
 *   node scripts/audit-links.mjs --crawl-links        # suit aussi les <a href> internes des pages
 *
 * Sortie : seo/reporting/audit-links-YYYY-MM-DD.csv (URL, type, statut, détail)
 */
import fs from 'fs';
import path from 'path';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes(k);
const BASE = (arg('--base', 'https://topcryptocards.eu')).replace(/\/$/, '');
const MAX = parseInt(arg('--max', '5000'), 10);
const CONC = parseInt(arg('--conc', '10'), 10);
const CRAWL_LINKS = has('--crawl-links');
const HOST = new URL(BASE).host;

// Marqueurs de page "introuvable" (soft-404) par langue — alignés sur les composants.
const SOFT404 = [
  'Avis introuvable', 'Bewertung nicht gefunden', 'Opinión no encontrada',
  'Recensione non trovata', 'Review not found', 'Análise não encontrada',
  'blog_not_found', "n'existe pas ou a été déplacé", 'does not exist or has been moved',
  'existiert nicht', 'no existe o ha sido', 'non esiste o è stata', 'não existe ou foi',
  'Page introuvable', 'Seite nicht gefunden', 'Página no encontrada', 'Pagina non trovata',
];

async function fetchChain(url, maxHops = 6) {
  const chain = [];
  let cur = url;
  for (let i = 0; i < maxHops; i++) {
    let res;
    try { res = await fetch(cur, { redirect: 'manual', headers: { 'User-Agent': 'TopCryptoCards-Audit/1.0' } }); }
    catch (e) { return { chain, final: cur, status: 0, error: String(e), html: '' }; }
    chain.push({ url: cur, status: res.status });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (!loc) return { chain, final: cur, status: res.status, html: '' };
      cur = new URL(loc, cur).toString();
      continue;
    }
    let html = '';
    if (res.status === 200 && (res.headers.get('content-type') || '').includes('text/html')) {
      try { html = await res.text(); } catch {}
    }
    return { chain, final: cur, status: res.status, html };
  }
  return { chain, final: cur, status: 'LOOP', html: '' };
}

function classify(url, r) {
  const hops = r.chain.length - 1;
  if (r.status === 0) return ['fetch-error', r.status, r.error || ''];
  if (r.status === 'LOOP') return ['redirect-loop', 'LOOP', r.chain.map(c => c.url).join(' → ')];
  if (r.status === 404) return ['404', 404, r.chain.map(c => `${c.status}`).join('→')];
  if (r.status >= 500) return ['5xx', r.status, ''];
  if (r.status >= 300 && r.status < 400) return ['redirect-no-location', r.status, ''];
  // final 200 (possibly after redirects)
  if (hops >= 1) {
    // redirect that ultimately 200 is OK, but flag long chains
    if (hops >= 3) return ['long-redirect-chain', 200, `${hops} hops: ${r.chain.map(c => c.url).join(' → ')}`];
  }
  const html = r.html || '';
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) return ['noindex-in-sitemap', 200, 'robots noindex sur une URL de sitemap'];
  for (const m of SOFT404) if (html.includes(m)) return ['soft-404', 200, `marqueur: "${m}"`];
  return ['ok', 200, hops ? `${hops} redirect hop(s)` : ''];
}

async function getSitemapUrls() {
  const idx = await (await fetch(`${BASE}/sitemap-index.xml`)).text();
  const children = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const urls = new Set();
  for (const c of children) {
    try {
      const xml = await (await fetch(c)).text();
      for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
    } catch (e) { console.error('sitemap fetch fail', c, String(e)); }
  }
  return [...urls];
}

function internalLinks(html, pageUrl) {
  const out = new Set();
  for (const m of html.matchAll(/href=["']([^"'#]+)["']/g)) {
    let href = m[1];
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    try {
      const u = new URL(href, pageUrl);
      if (u.host === HOST) { u.hash = ''; out.add(u.toString()); }
    } catch {}
  }
  return [...out];
}

async function pool(items, worker) {
  const results = []; let i = 0;
  const run = async () => { while (i < items.length) { const idx = i++; results[idx] = await worker(items[idx], idx); } };
  await Promise.all(Array.from({ length: Math.min(CONC, items.length) }, run));
  return results;
}

(async () => {
  console.log(`Audit ${BASE} (max ${MAX}, conc ${CONC}, crawl-links=${CRAWL_LINKS})`);
  let urls = await getSitemapUrls();
  const inSitemap = new Set(urls);
  console.log(`Sitemap URLs: ${urls.length}`);
  urls = urls.slice(0, MAX);

  const problems = [];
  let done = 0;
  const checkedExtra = new Set();

  await pool(urls, async (u) => {
    const r = await fetchChain(u);
    const [type, status, detail] = classify(u, r);
    if (type !== 'ok') problems.push({ url: u, type, status, detail });
    if (CRAWL_LINKS && r.html) {
      for (const link of internalLinks(r.html, u)) {
        if (!inSitemap.has(link) && !checkedExtra.has(link)) checkedExtra.add(link);
      }
    }
    if (++done % 200 === 0) console.log(`  ...${done}/${urls.length}`);
  });

  if (CRAWL_LINKS && checkedExtra.size) {
    const extra = [...checkedExtra].slice(0, MAX);
    console.log(`\nVérification de ${extra.length} liens internes hors-sitemap...`);
    await pool(extra, async (u) => {
      const r = await fetchChain(u);
      const [type, status, detail] = classify(u, r);
      if (type !== 'ok' && type !== 'noindex-in-sitemap') problems.push({ url: u, type: 'link:' + type, status, detail });
    });
  }

  const date = new Date().toISOString().slice(0, 10);
  const dir = path.join('seo', 'reporting'); fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `audit-links-${date}.csv`);
  const rows = [['URL', 'type', 'status', 'detail'], ...problems.map(p => [p.url, p.type, p.status, (p.detail || '').replace(/"/g, "'")])];
  fs.writeFileSync(out, rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n'));

  const byType = {};
  for (const p of problems) byType[p.type] = (byType[p.type] || 0) + 1;
  console.log(`\n==== Problèmes: ${problems.length} ====`);
  for (const [t, n] of Object.entries(byType).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${t}`);
  console.log(`\nRapport: ${out}`);
})();
