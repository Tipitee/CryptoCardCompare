#!/usr/bin/env node
/**
 * A11 Quality Gate — le verifier objectif du contenu. Note un draft (markdown)
 * contre une rubrique qui peut ÉCHOUER. C'est la pièce qui empêche un maker de
 * s'auto-approuver et de publier du contenu mince (danger n°1 de l'article Ryze).
 *
 * Usage :
 *   node scripts/quality-gate.mjs chemin/vers/draft.md
 *   node scripts/quality-gate.mjs --stdin  < draft.md
 *   echo "$MARKDOWN" | node scripts/quality-gate.mjs
 *
 * Sortie : table PASS/FAIL + score. Code de sortie ≠ 0 si un check DUR échoue.
 * Seuils dans seo/settings.json (min_words, etc.) — valeurs par défaut ci-dessous.
 */
import { readFileSync } from 'node:fs';

const MIN_WORDS = 500;
const arg = process.argv[2];
let md = '';
if (arg && arg !== '--stdin') { md = readFileSync(arg, 'utf8'); }
else { md = readFileSync(0, 'utf8'); } // stdin

const words = md.replace(/[#>*_`\-|]/g, ' ').split(/\s+/).filter(Boolean);
const first100 = words.slice(0, 100).join(' ');
const h2s = [...md.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim());
const h1s = [...md.matchAll(/^#\s+(.+)$/gm)];

const checks = [
  { hard: true,  name: 'Longueur ≥ ' + MIN_WORDS + ' mots', pass: words.length >= MIN_WORDS, detail: words.length + ' mots' },
  { hard: true,  name: 'Un seul H1', pass: h1s.length <= 1, detail: h1s.length + ' H1' },
  { hard: true,  name: 'Réponse dans les 100 premiers mots (chiffre/donnée)', pass: /\d/.test(first100) && !/^(dans le monde|à l['’]ère|de nos jours|aujourd)/i.test(first100.trim()), detail: /\d/.test(first100) ? 'contient une donnée' : 'pas de donnée factuelle en tête' },
  { hard: true,  name: 'Section FAQ présente', pass: /faq|questions fré|foire aux questions|häufige fragen|preguntas frecuentes|domande frequenti/i.test(md), detail: /faq/i.test(md) ? 'FAQ trouvée' : 'aucune FAQ' },
  { hard: false, name: 'Au moins un H2 formulé en question', pass: h2s.some(h => h.includes('?')), detail: h2s.filter(h => h.includes('?')).length + ' H2 en question' },
  { hard: true,  name: 'Au moins un lien interne (money page)', pass: /\]\(\/(fr|be|de|at|es|it|en)\//.test(md), detail: (md.match(/\]\(\/(fr|be|de|at|es|it|en)\//g) || []).length + ' liens internes' },
  { hard: false, name: 'Donnée datée (vérifié/mis à jour/2026)', pass: /vérifié|mis à jour|aktualisiert|actualizado|aggiornato|updated|202\d/i.test(md), detail: /vérifié|mis à jour|aktualisiert|actualizado|aggiornato|updated|202\d/i.test(md) ? 'fraîcheur signalée' : 'aucune date' },
  { hard: false, name: 'Pas de remplissage IA générique', pass: !/(dans le monde en constante évolution|à l['’]ère du numérique|in today['’]s digital|paysage numérique)/i.test(md), detail: 'aucun cliché détecté' },
];

const hardFails = checks.filter(c => c.hard && !c.pass);
const softFails = checks.filter(c => !c.hard && !c.pass);
const passed = checks.filter(c => c.pass).length;

console.log(`\nQuality Gate — ${passed}/${checks.length} checks`);
console.log('| dur | check | résultat | détail |');
console.log('|---|---|---|---|');
for (const c of checks) console.log(`| ${c.hard ? '🔒' : '·'} | ${c.name} | ${c.pass ? '✅' : '❌'} | ${c.detail} |`);

if (hardFails.length) {
  console.log(`\n❌ FAIL — ${hardFails.length} check(s) DUR échoué(s). Retour au maker : ${hardFails.map(c => c.name).join(' ; ')}`);
  process.exitCode = 1;
} else if (softFails.length) {
  console.log(`\n🟡 PASS avec réserves — ${softFails.length} check(s) souple(s) : ${softFails.map(c => c.name).join(' ; ')}. À améliorer avant review humaine.`);
} else {
  console.log('\n✅ PASS — prêt pour review humaine puis publication.');
}
