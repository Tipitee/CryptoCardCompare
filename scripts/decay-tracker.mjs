#!/usr/bin/env node
/**
 * A5 Content-Decay Detector — repère les pages en déclin soutenu (3 semaines+)
 * et met des briefs de refresh en file. La plupart du trafic perdu est du decay,
 * pas des pénalités : on rattrape les gagnants avant qu'ils tombent de la page 1.
 *
 * Comment ça marche : chaque run archive un snapshot daté de pages.csv dans
 * seo/gsc-data/history/, puis compare les 3 derniers snapshots. Aucune histoire
 * = le script le dit et s'arrête (il faut ≥ 3 semaines d'exports).
 *
 * Prérequis : seo/gsc-data/pages.csv frais (onglet Pages de l'export GSC).
 * Lancer chaque lundi : node scripts/decay-tracker.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HIST = new URL('../seo/gsc-data/history/', import.meta.url);
const PAGES = new URL('../seo/gsc-data/pages.csv', import.meta.url);
mkdirSync(HIST, { recursive: true });

function parse(csv) {
  const raw = csv.trim().split('\n');
  if (raw.length < 2 || raw[1].startsWith('(')) return null;
  const h = raw[0].toLowerCase().split(',').reduce((a, x, i) => (a[x.trim()] = i, a), {});
  const pi = h['page'] ?? h['top pages'] ?? 0, ci = h['clicks'] ?? 1;
  return new Map(raw.slice(1).map(l => { const c = l.split(','); return [c[pi], +c[ci] || 0]; }));
}

let today;
try {
  today = parse(readFileSync(PAGES, 'utf8'));
  if (!today) throw 0;
} catch {
  console.log('⏳ seo/gsc-data/pages.csv manquant ou placeholder. Déposer l\'export GSC (onglet Pages).');
  process.exit(0);
}

// Archive le snapshot du jour
const date = new Date().toISOString().slice(0, 10);
writeFileSync(new URL(`./pages-${date}.csv`, HIST), readFileSync(PAGES));

// Charge l'historique (snapshots datés)
const snaps = readdirSync(fileURLToPath(HIST)).filter(f => /^pages-\d{4}-\d{2}-\d{2}\.csv$/.test(f)).sort();
if (snaps.length < 3) {
  console.log(`📈 Historique : ${snaps.length}/3 snapshots. Il faut ≥ 3 semaines d'exports pour détecter un déclin soutenu. Reviens la semaine prochaine.`);
  process.exit(0);
}

const last3 = snaps.slice(-3).map(f => parse(readFileSync(new URL('./' + f, HIST), 'utf8')));
const pages = new Set([...last3[0].keys()]);
const declining = [];
for (const p of pages) {
  const s = last3.map(m => m.get(p) ?? 0);
  if (s[0] > 0 && s[2] < s[1] && s[1] < s[0]) { // déclin monotone sur 3 relevés
    declining.push({ page: p, from: s[0], to: s[2], lost: s[0] - s[2] });
  }
}
declining.sort((a, b) => b.lost - a.lost);
const top = declining.slice(0, 10);

let md = `# File — refresh (decay détecté) — ${date}\nComparaison des 3 derniers snapshots hebdo. ${declining.length} pages en déclin soutenu.\n\n`;
md += `| page | clics il y a 3 relevés | clics maintenant | perdus |\n|---|---|---|---|\n`;
top.forEach(d => { md += `| ${d.page.replace('https://topcryptocards.eu','')} | ${d.from} | ${d.to} | −${d.lost} |\n`; });
md += `\n**Gate** : seul un déclin monotone sur 3 relevés entre en file (pas un creux d'une semaine). Pour chaque page : tirer le contenu, dater ce qui est périmé, ajouter les sous-sujets/queries manquants, tester un nouveau title/meta. Approuver avant refresh. Action n°1 = la page tout en haut (plus de clics perdus).\n`;

writeFileSync(new URL('../seo/state/refresh-queue.md', import.meta.url), md);
console.log(`✓ seo/state/refresh-queue.md — ${declining.length} pages en déclin (top 10 listées)`);
