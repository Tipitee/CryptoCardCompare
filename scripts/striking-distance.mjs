#!/usr/bin/env node
/**
 * A6 Striking-Distance Miner — requêtes en position 8-20 (juste sous la page 1),
 * les gains les moins chers en SEO. Lit l'export GSC LOCAL (aucun réseau requis).
 * Écrit une file de propositions ; ne touche jamais le site.
 *
 * Prérequis : export GSC frais dans seo/gsc-data/queries.csv
 *   (GSC → Performance → 90j → Export → onglet Queries).
 * Lancer : node scripts/striking-distance.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const MIN_IMPRESSIONS = Number(process.env.SD_MIN_IMPRESSIONS || 50);
const CSV = new URL('../seo/gsc-data/queries.csv', import.meta.url);

let rows;
try {
  const raw = readFileSync(CSV, 'utf8').trim().split('\n');
  const header = raw[0].toLowerCase();
  if (!header.includes('position') || raw.length < 2 || raw[1].startsWith('(')) {
    console.log('⏳ Export GSC manquant. 2 min : GSC → Performance → 90j → Export → onglet Queries → écraser seo/gsc-data/queries.csv');
    process.exit(0);
  }
  const idx = header.split(',').reduce((a, h, i) => (a[h.trim()] = i, a), {});
  const qi = idx['query'] ?? idx['top queries'] ?? 0;
  const ci = idx['clicks'] ?? 1, ii = idx['impressions'] ?? 2, pi = idx['position'] ?? 4;
  rows = raw.slice(1).map(l => {
    const c = l.split(',');
    return { query: c[qi], clicks: +c[ci] || 0, impressions: +c[ii] || 0, position: parseFloat(c[pi]) || 0 };
  });
} catch {
  console.log('⏳ seo/gsc-data/queries.csv introuvable. Déposer l\'export GSC.');
  process.exit(0);
}

const striking = rows
  .filter(r => r.position >= 8 && r.position <= 20 && r.impressions >= MIN_IMPRESSIONS)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25);

let md = `# File — striking distance (pos 8-20)\nGénéré le ${new Date().toISOString().slice(0,10)} par A6. Seuil impressions ≥ ${MIN_IMPRESSIONS}.\nPour chaque requête : vérifier que la page cible traite bien la query, sinon ajouter un H2/section/FAQ/ancre. Approuver avant édition.\n\n`;
md += `| # | requête | pos | impr. | clics | action proposée |\n|---|---|---|---|---|---|\n`;
striking.forEach((r, i) => {
  const action = r.position <= 12 ? 'renforcer le H1/intro + FAQ ciblée' : 'ajouter une section H2 dédiée à cette query';
  md += `| ${i+1} | ${r.query} | ${r.position.toFixed(1)} | ${r.impressions} | ${r.clicks} | ${action} |\n`;
});
md += `\n**Gate** : seule une requête pos 8-20 avec ≥ ${MIN_IMPRESSIONS} impressions qualifie. ${striking.length} candidates. Action n°1 = la ligne du haut (plus d'impressions).\n`;

try { writeFileSync(new URL('../seo/state/striking-distance-queue.md', import.meta.url), md); console.log(`✓ seo/state/striking-distance-queue.md — ${striking.length} requêtes`); }
catch { console.log(md); }
