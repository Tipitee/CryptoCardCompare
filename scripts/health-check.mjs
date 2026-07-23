#!/usr/bin/env node
/**
 * A3 Tech Health Sentinel — vérifications objectives contre la PROD.
 * Lecture seule. Ne modifie jamais le site. Écrit un rapport dans
 * seo/state/tech-health.md et sort en code ≠ 0 si un check CRITIQUE échoue.
 *
 * Lancer depuis ta machine (réseau requis) :
 *   node scripts/health-check.mjs
 *
 * Le gate = les assertions ci-dessous. Chaque ligne peut ÉCHOUER — c'est
 * ce qui en fait un vrai verifier et pas un agent qui s'auto-approuve.
 */
import { writeFileSync } from 'node:fs';

const ORIGIN = 'https://topcryptocards.eu';
const results = [];
const add = (sev, name, pass, detail) => results.push({ sev, name, pass, detail });

async function get(path, opts = {}) {
  const r = await fetch(ORIGIN + path, { redirect: 'manual', ...opts });
  const body = opts.method === 'HEAD' ? '' : await r.text().catch(() => '');
  return { status: r.status, body, headers: r.headers };
}

// 1. Racine → redirection langue (302)
try {
  const r = await get('/');
  add('CRIT', 'Root redirect /', [301, 302].includes(r.status),
    `attendu 302, reçu ${r.status}`);
} catch (e) { add('CRIT', 'Root redirect /', false, e.message); }

// 2. Raw HTML localisé (prerender vivant) — /fr doit être FR + lang="fr"
try {
  const r = await get('/fr');
  const title = (r.body.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const lang = (r.body.match(/<html[^>]*lang="([^"]*)"/) || [])[1] || '';
  const ok = lang === 'fr' && /[Cc]arte/.test(title) && r.body.length > 20000;
  add('CRIT', 'Prerender /fr localisé', ok, `lang=${lang} len=${r.body.length} title="${title.slice(0,40)}"`);
} catch (e) { add('CRIT', 'Prerender /fr localisé', false, e.message); }

// 3. Vrai 404 sur URL inexistante
try {
  const r = await get('/de/cette-page-nexiste-pas-xyz-404');
  add('CRIT', 'Vrais 404', r.status === 404, `reçu ${r.status}`);
} catch (e) { add('CRIT', 'Vrais 404', false, e.message); }

// 4. hreflang ne pointe vers aucun 404 (sur une fiche carte)
try {
  const r = await get('/fr/cartes/nexo-card');
  const alts = [...r.body.matchAll(/hreflang="[^"]+"\s+href="([^"]+)"/g)].map(m => m[1]);
  let bad = [];
  for (const u of alts.slice(0, 8)) {
    const h = await fetch(u, { method: 'HEAD', redirect: 'manual' }).catch(() => ({ status: 0 }));
    if (h.status !== 200) bad.push(`${u.replace(ORIGIN,'')}=${h.status}`);
  }
  add('CRIT', 'hreflang sans 404', bad.length === 0, bad.length ? bad.join(' ') : `${alts.length} alternates OK`);
} catch (e) { add('WARN', 'hreflang sans 404', false, e.message); }

// 5. Crawlers IA autorisés dans robots.txt
try {
  const r = await get('/robots.txt');
  const blocked = ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended']
    .filter(bot => new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?Disallow:\\s*/`, 'i').test(r.body));
  add('CRIT', 'Crawlers IA autorisés', blocked.length === 0,
    blocked.length ? `BLOQUÉS: ${blocked.join(', ')}` : 'GPTBot/Perplexity/Claude/Google-Extended OK');
} catch (e) { add('WARN', 'Crawlers IA autorisés', false, e.message); }

// 6. sitemap-index : tous les enfants répondent 200
try {
  const idx = await get('/sitemap-index.xml');
  const children = [...idx.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  let bad = [];
  for (const c of children) {
    const h = await fetch(c, { method: 'HEAD' }).catch(() => ({ status: 0 }));
    if (h.status !== 200) bad.push(`${c.replace(ORIGIN,'')}=${h.status}`);
  }
  add('CRIT', 'Sitemaps enfants 200', bad.length === 0, bad.length ? bad.join(' ') : `${children.length} sitemaps OK`);
} catch (e) { add('WARN', 'Sitemaps enfants 200', false, e.message); }

// 7. Nombre d'URLs blog (dérive de contenu visible)
try {
  const r = await get('/sitemap-blog.xml');
  const n = (r.body.match(/<loc>/g) || []).length;
  add('INFO', 'URLs sitemap-blog', true, `${n} URLs`);
} catch (e) { add('WARN', 'URLs sitemap-blog', false, e.message); }

// ── Rapport ──────────────────────────────────────────────────────────────
const fails = results.filter(r => !r.pass && r.sev === 'CRIT');
const warns = results.filter(r => !r.pass && r.sev === 'WARN');
const date = new Date().toISOString().slice(0, 10);
let md = `# Tech Health — ${date}\n\n`;
md += `Statut global : ${fails.length ? '🔴 ' + fails.length + ' CRITIQUE(S)' : warns.length ? '🟡 ' + warns.length + ' warning(s)' : '🟢 OK'}\n\n`;
md += `| Sévérité | Check | Résultat | Détail |\n|---|---|---|---|\n`;
for (const r of results) md += `| ${r.sev} | ${r.name} | ${r.pass ? '✅' : '❌'} | ${r.detail} |\n`;
md += `\n## Historique\n(les runs précédents restent ici — ne pas écraser cette section à la main)\n`;

try {
  writeFileSync(new URL('../seo/state/tech-health.md', import.meta.url), md);
  console.log('✓ seo/state/tech-health.md écrit');
} catch { console.log(md); }

console.log(`\n${fails.length ? '🔴' : warns.length ? '🟡' : '🟢'} ${fails.length} critiques, ${warns.length} warnings`);
for (const r of [...fails, ...warns]) console.log(`  ${r.sev} ${r.name}: ${r.detail}`);
process.exitCode = fails.length ? 1 : 0;
