#!/usr/bin/env node
/**
 * Analyse les exports GSC (seo/gsc-data/queries.csv + pages.csv).
 * Sort : prisonniers page 2 (striking distance), CTR faible à optimiser, pages par marché.
 *   node scripts/analyze-gsc.mjs
 */
import { readFileSync } from 'node:fs';

// Parse CSV robuste : les 4 derniers champs sont numériques, le reste = libellé (peut contenir des virgules).
function parse(path) {
  const lines = readFileSync(path, 'utf8').trim().split(/\r?\n/);
  lines.shift(); // header
  return lines.map(l => {
    const parts = l.split(',');
    const position = parseFloat(parts.pop());
    const ctr = parseFloat(parts.pop());       // "3.45%" -> 3.45
    const impressions = parseInt(parts.pop(), 10);
    const clicks = parseInt(parts.pop(), 10);
    const label = parts.join(',');
    return { label, clicks, impressions, ctr, position };
  }).filter(r => !isNaN(r.position));
}

const q = parse('seo/gsc-data/queries.csv');
const p = parse('seo/gsc-data/pages.csv');
const market = url => (url.match(/topcryptocards\.eu\/([a-z]{2})\//) || [])[1] || '?';

const totClicks = q.reduce((a, r) => a + r.clicks, 0);
const totImpr = q.reduce((a, r) => a + r.impressions, 0);
console.log(`\n=== VUE D'ENSEMBLE (90j) ===`);
console.log(`Requetes: ${q.length} | Clics totaux: ${totClicks} | Impressions: ${totImpr}`);

// 1. Prisonniers page 2 : requetes en position 11-20 avec impressions, tri par impressions.
console.log(`\n=== 1. PRISONNIERS PAGE 2 (pos 11-20, gains rapides) ===`);
q.filter(r => r.position >= 11 && r.position <= 20.5 && r.impressions >= 10)
 .sort((a, b) => b.impressions - a.impressions).slice(0, 20)
 .forEach(r => console.log(`  ${r.impressions.toString().padStart(4)} imp · pos ${r.position.toFixed(0).padStart(2)} · ${r.clicks} clic · "${r.label}"`));

// 2. Bas de page 1 (pos 5-10) grosses impressions, CTR faible -> optimiser titre/meta.
console.log(`\n=== 2. BAS DE PAGE 1 (pos 4-10, gros volume, CTR a ameliorer) ===`);
q.filter(r => r.position >= 4 && r.position < 11 && r.impressions >= 30)
 .sort((a, b) => b.impressions - a.impressions).slice(0, 15)
 .forEach(r => console.log(`  ${r.impressions.toString().padStart(4)} imp · pos ${r.position.toFixed(1).padStart(4)} · CTR ${r.ctr}% · "${r.label}"`));

// 3. Requetes a fort volume tout marche (top impressions global) pour reperer les gros sujets.
console.log(`\n=== 3. PLUS GROS VOLUMES (impressions, tous rangs) ===`);
q.sort((a, b) => b.impressions - a.impressions).slice(0, 15)
 .forEach(r => console.log(`  ${r.impressions.toString().padStart(4)} imp · pos ${r.position.toFixed(0).padStart(2)} · ${r.clicks} clic · "${r.label}"`));

// 4. Pages : prisonniers page 2, par marche.
console.log(`\n=== 4. PAGES PRISONNIERES PAGE 2 (pos 11-20) ===`);
p.filter(r => r.position >= 11 && r.position <= 20.5 && r.impressions >= 15)
 .sort((a, b) => b.impressions - a.impressions).slice(0, 20)
 .forEach(r => console.log(`  [${market(r.label)}] ${r.impressions.toString().padStart(4)} imp · pos ${r.position.toFixed(0).padStart(2)} · ${r.label.replace('https://topcryptocards.eu', '')}`));

// 5. Clics + impressions par marche.
console.log(`\n=== 5. PERFORMANCE PAR MARCHE (pages) ===`);
const byM = {};
for (const r of p) { const m = market(r.label); (byM[m] ??= { clicks: 0, impr: 0, n: 0 }); byM[m].clicks += r.clicks; byM[m].impr += r.impressions; byM[m].n++; }
Object.entries(byM).sort((a, b) => b[1].impr - a[1].impr)
 .forEach(([m, v]) => console.log(`  ${m.padEnd(3)} · ${v.clicks.toString().padStart(4)} clics · ${v.impr.toString().padStart(6)} imp · ${v.n} pages`));

// 6. Meilleures pages actuelles (clics).
console.log(`\n=== 6. TES PAGES QUI RAMENENT DES CLICS ===`);
p.sort((a, b) => b.clicks - a.clicks).slice(0, 12)
 .forEach(r => console.log(`  [${market(r.label)}] ${r.clicks.toString().padStart(3)} clic · ${r.impressions} imp · pos ${r.position.toFixed(0)} · ${r.label.replace('https://topcryptocards.eu', '')}`));
