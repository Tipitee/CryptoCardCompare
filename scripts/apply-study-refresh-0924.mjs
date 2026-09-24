#!/usr/bin/env node
/**
 * apply-study-refresh-0924.mjs — actualise les 6 pages-étude aux chiffres du
 * 24/09/2026 (méthodo officielle refresh-study-data.mjs, recalcul sur base live).
 *
 * Deltas depuis le 15/09 (ajout BingX ×2 + dérive base) :
 *   indice de réalité 31 % → 34 %  (France 32 % → 34 %)
 *   affiché moyen 4,33 % → 4,29 %   |  réel sans staking 0,97 % → 1,07 %
 *   part 0 % de base 51 % → 50 %    |  sans frais 95 % → 93 %
 *   cartes analysées 93 → 95        |  actives 84 → 86  |  dispo marché +2
 *   date 15/09 → 24/09
 * + Corrige la formulation trompeuse « affiché X, réel Y, soit Z % » et la
 *   définition « (réel divisé par affiché) » → « moyenne des rapports par carte »
 *   (le 34 % est la moyenne des ratios par carte, pas 1,07/4,29).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'etudes');

// Remplacements spécifiques par fichier (phrases ancrées, faits AVANT le global)
const PER_FILE = {
  'cartes-crypto-2026.html': [
    ['84 cartes actives, dont 82 disponibles en France', '86 cartes actives, dont 84 disponibles en France'],
    ['(réel divisé par affiché) résume ce fossé : 31 %, et 32 % sur le seul marché français', '(moyenne des rapports réel/affiché par carte) résume ce fossé : 34 %'],
    ['<li style="margin:0 0 8px">Cashback affiché moyen 4,33 %, réel sans staking 0,97 %, soit 31 % de la promesse.</li>', '<li style="margin:0 0 8px">Cashback affiché moyen 4,29 %, réel sans staking 1,07 %. En moyenne par carte, 34 % du cashback affiché sont réellement versés.</li>'],
  ],
  'crypto-cards-2026.html': [
    ['84 active cards, <span class="em">43, 51%', '86 active cards, <span class="em">43, 50%'],
    ['reality index (real ÷ advertised) captures that gap in a single figure:', 'reality index (average of per-card real/advertised ratios) captures that gap in a single figure:'],
    ['<li style="margin:0 0 8px">Average advertised cashback 4.33%, real without staking 0.97%, i.e. 31% of the promise.</li>', '<li style="margin:0 0 8px">Average advertised cashback 4.29%, real without staking 1.07%. Per card on average, only 34% of the advertised cashback is actually paid.</li>'],
  ],
  'krypto-karten-2026.html': [
    ['84 aktiven Karten (83 in Deutschland verfügbar', '86 aktiven Karten (85 in Deutschland verfügbar'],
    ['<li style="margin:0 0 8px">Beworbenes Cashback im Schnitt 4,33 %, real ohne Staking 0,97 %, also 31 % des Versprechens.</li>', '<li style="margin:0 0 8px">Beworbenes Cashback im Schnitt 4,29 %, real ohne Staking 1,07 %. Pro Karte werden im Schnitt nur 34 % des beworbenen Cashbacks tatsächlich gezahlt.</li>'],
  ],
  'tarjetas-cripto-2026.html': [
    ['84 tarjetas activas (83 disponibles en España', '86 tarjetas activas (85 disponibles en España'],
    ['<li style="margin:0 0 8px">Cashback anunciado medio 4,33 %, real sin staking 0,97 %, es decir el 31 % de lo prometido.</li>', '<li style="margin:0 0 8px">Cashback anunciado medio 4,29 %, real sin staking 1,07 %. Por tarjeta, de media solo se paga el 34 % del cashback anunciado.</li>'],
  ],
  'carte-crypto-2026.html': [
    ['84 carte attive (83 disponibili in Italia', '86 carte attive (85 disponibili in Italia'],
    ['<li style="margin:0 0 8px">Cashback pubblicizzato medio 4,33 %, reale senza staking 0,97 %, cioè il 31 % della promessa.</li>', '<li style="margin:0 0 8px">Cashback pubblicizzato medio 4,29 %, reale senza staking 1,07 %. Per carta, in media viene versato solo il 34 % del cashback pubblicizzato.</li>'],
  ],
  'cartoes-crypto-2026.html': [
    ['84 cartões ativos', '86 cartões ativos'],
    ['<li style="margin:0 0 8px">Cashback anunciado médio 4,33 %, real sem staking 0,97 %, ou seja 31 % da promessa.</li>', '<li style="margin:0 0 8px">Cashback anunciado médio 4,29 %, real sem staking 1,07 %. Por cartão, em média só é pago 34 % do cashback anunciado.</li>'],
  ],
};

// Global par fichier : { comma:bool, dates:[[from,to]] }
const CFG = {
  'cartes-crypto-2026.html':  { comma: true,  dates: [['15 septembre 2026', '24 septembre 2026']] },
  'crypto-cards-2026.html':   { comma: false, dates: [['15 September 2026', '24 September 2026']] },
  'krypto-karten-2026.html':  { comma: true,  dates: [['15. September 2026', '24. September 2026'], ['15.09.2026', '24.09.2026'], ['15/09/2026', '24/09/2026']] },
  'tarjetas-cripto-2026.html':{ comma: true,  dates: [['15 de septiembre de 2026', '24 de septiembre de 2026'], ['15/09/2026', '24/09/2026']] },
  'carte-crypto-2026.html':   { comma: true,  dates: [['15 settembre 2026', '24 settembre 2026'], ['15/09/2026', '24/09/2026']] },
  'cartoes-crypto-2026.html': { comma: true,  dates: [['15 de setembro de 2026', '24 de setembro de 2026'], ['15/09/2026', '24/09/2026']] },
};

let changed = 0;
for (const [file, cfg] of Object.entries(CFG)) {
  const fp = path.join(DIR, file);
  let h = fs.readFileSync(fp, 'utf-8');
  const before = h;

  // 1) Remplacements spécifiques (phrases entières, avant tout)
  for (const [from, to] of (PER_FILE[file] || [])) h = h.split(from).join(to);

  // 2) Stats non ambiguës
  if (cfg.comma) { h = h.split('4,33').join('4,29').split('0,97').join('1,07'); }
  else           { h = h.split('4.33').join('4.29').split('0.97').join('1.07'); }
  // indice + France + part 0 % (formes avec et sans espace)
  h = h.split('31 %').join('34 %').split('31%').join('34%')
       .split('32 %').join('34 %').split('32%').join('34%')
       .split('51 %').join('50 %').split('51%').join('50%');

  // 3) Sans frais 95 % → 93 % ET compteur 93 → 95, via placeholder anti-collision
  h = h.split('95 %').join('«FF»').split('95%').join('«FFns»');   // gèle le "sans frais"
  h = h.split('93 ').join('95 ');                                   // compteur (toujours suivi d'un espace)
  h = h.split('«FF»').join('93 %').split('«FFns»').join('93%');     // restaure sans frais

  // 4) Dates visibles + schema
  for (const [from, to] of cfg.dates) h = h.split(from).join(to);
  h = h.split('"dateModified":"2026-09-15"').join('"dateModified":"2026-09-24"');

  if (h !== before) { fs.writeFileSync(fp, h, 'utf-8'); changed++; console.log('✓ updated:', file); }
  else console.log('· unchanged:', file);
}
console.log(`\nDone. ${changed} fichier(s) mis à jour.`);
