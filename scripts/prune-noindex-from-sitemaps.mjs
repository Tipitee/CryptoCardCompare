#!/usr/bin/env node
/**
 * prune-noindex-from-sitemaps.mjs
 * Retire des sitemaps (dans dist/) toute URL dont la page prérendue porte
 * <meta name="robots" content="noindex…>. À lancer APRÈS le build+prerender,
 * AVANT le deploy. Déterministe : lit l'état réel de chaque page prérendue,
 * donc s'adapte tout seul quand une page change d'indexabilité.
 *
 * Pourquoi ne pas l'avoir branché plus tôt : pendant la désindexation du prune
 * (be/at dupliqués, cryptos, blog < 500 mots), GARDER ces URLs au sitemap
 * accélère leur recrawl → désindexation plus rapide. Une fois qu'elles sont
 * sorties de l'index (GSC « Exclue par noindex » stabilisé / vidé), on lance ce
 * script pour que les sitemaps ne listent plus que le cœur indexable.
 *
 *   npm run build            # ou le build qui prerender dans dist/
 *   node scripts/prune-noindex-from-sitemaps.mjs --dry-run   # aperçu, ne touche rien
 *   node scripts/prune-noindex-from-sitemaps.mjs             # applique
 *   node scripts/prune-noindex-from-sitemaps.mjs --drop-missing   # retire aussi les URLs sans fichier prérendu (SPA-only)
 *
 * Puis déployer dist/ normalement. Pour l'automatiser à chaque build, ajouter
 * l'appel (sans --dry-run) dans .github/workflows/deploy.yml juste après le
 * prerender et avant `wrangler pages deploy`.
 */
import fs from 'fs';
import path from 'path';

const DIST = path.resolve(process.cwd(), 'dist');
const DRY = process.argv.includes('--dry-run');
const DROP_MISSING = process.argv.includes('--drop-missing');
const ORIGIN = 'https://topcryptocards.eu';

if (!fs.existsSync(DIST)) { console.error('❌ dist/ introuvable — lance d’abord le build (prerender).'); process.exit(1); }

const NOINDEX_RE = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i;

// loc → fichier prérendu. prerender écrit des fichiers plats "path.html"
// (ex. /fr/cartes/nexo-card → dist/fr/cartes/nexo-card.html ; /fr → dist/fr.html).
function fileFor(loc) {
  let p = loc.replace(ORIGIN, '').replace(/[?#].*$/, '').replace(/\/$/, '');
  if (p === '') return null; // racine (redirigée), jamais au sitemap
  const flat = path.join(DIST, p + '.html');
  if (fs.existsSync(flat)) return flat;
  const idx = path.join(DIST, p, 'index.html');
  if (fs.existsSync(idx)) return idx;
  return null; // pas de fichier prérendu
}

function classify(loc) {
  const f = fileFor(loc);
  if (!f) return 'missing';
  try { return NOINDEX_RE.test(fs.readFileSync(f, 'utf8')) ? 'noindex' : 'ok'; }
  catch { return 'missing'; }
}

const sitemaps = fs.readdirSync(DIST).filter(f => /^sitemap-.*\.xml$/.test(f) && f !== 'sitemap-index.xml');
let totalKept = 0, totalNoindex = 0, totalMissing = 0;
const report = [];

for (const name of sitemaps) {
  const fp = path.join(DIST, name);
  const xml = fs.readFileSync(fp, 'utf8');
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  let kept = [], ni = 0, miss = 0;
  for (const b of blocks) {
    const loc = (b.match(/<loc>([^<]+)<\/loc>/) || [])[1];
    if (!loc) { kept.push(b); continue; }
    const c = classify(loc);
    if (c === 'noindex') { ni++; continue; }
    if (c === 'missing') { miss++; if (DROP_MISSING) continue; }
    kept.push(b);
  }
  totalKept += kept.length; totalNoindex += ni; totalMissing += miss;
  report.push({ name, before: blocks.length, after: kept.length, noindex: ni, missing: miss });
  if (!DRY && ni > 0) {
    const head = xml.slice(0, xml.indexOf('<url>') >= 0 ? xml.indexOf('<url>') : xml.length);
    const tail = '</urlset>\n';
    const body = kept.join('\n');
    const rebuilt = head + body + '\n' + tail;
    fs.writeFileSync(fp, rebuilt);
  }
}

console.log(`\n${DRY ? '(dry-run) ' : ''}Nettoyage noindex des sitemaps dans dist/${DROP_MISSING ? ' (+ drop-missing)' : ''}\n`);
for (const r of report.sort((a, b) => b.noindex - a.noindex)) {
  if (r.noindex || r.missing) console.log(`  ${r.name.padEnd(24)} ${r.before} → ${r.after}  (noindex -${r.noindex}${r.missing ? `, missing ${r.missing}` : ''})`);
}
console.log(`\n  Total conservé : ${totalKept} | noindex retirés : ${totalNoindex} | sans fichier : ${totalMissing}${DROP_MISSING ? ' (retirés)' : ' (gardés — relancer avec --drop-missing pour les retirer)'}`);
if (DRY) console.log('\n  (dry-run : aucun fichier modifié)');
