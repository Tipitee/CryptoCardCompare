#!/usr/bin/env node
/**
 * apply-study-refresh.mjs — refresh the study pages with the 2026-09-15 data pull.
 * Only the figures that actually changed are updated: advertised avg 2.37% → 4.33%,
 * real (no-staking) avg 0.53% → 0.97%. The reality index (31%), 0%-cashback share (51%),
 * fee-free share (95%), Visa/MC split and the top-12 gap ranking are unchanged.
 * Also bumps the collection date to 15 Sep 2026 (per locale) and schema dateModified
 * (datePublished stays 2026-08-17). Idempotent-ish; run once.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'etudes');

// [file]: { decimalComma, dateFrom → dateTo pairs }
const FILES = {
  'cartes-crypto-2026.html':  { comma: true,  dates: [['17 août 2026', '15 septembre 2026']] },
  'crypto-cards-2026.html':   { comma: false, dates: [['17 August 2026', '15 September 2026']] },
  'krypto-karten-2026.html':  { comma: true,  dates: [['17. August 2026', '15. September 2026'], ['17.08.2026', '15.09.2026'], ['17/08/2026', '15/09/2026']] },
  'tarjetas-cripto-2026.html':{ comma: true,  dates: [['17 de agosto de 2026', '15 de septiembre de 2026'], ['17/08/2026', '15/09/2026']] },
  'carte-crypto-2026.html':   { comma: true,  dates: [['17 agosto 2026', '15 settembre 2026'], ['17/08/2026', '15/09/2026']] },
  'cartoes-crypto-2026.html': { comma: true,  dates: [['17 de agosto de 2026', '15 de setembro de 2026'], ['17/08/2026', '15/09/2026']] },
};

let changed = 0;
for (const [file, cfg] of Object.entries(FILES)) {
  const fp = path.join(DIR, file);
  let h = fs.readFileSync(fp, 'utf-8');
  const before = h;

  // Advertised & real averages (locale decimal separator)
  if (cfg.comma) {
    h = h.split('2,37').join('4,33').split('0,53').join('0,97');
  } else {
    h = h.split('2.37').join('4.33').split('0.53').join('0.97');
  }

  // Collection dates (visible, per locale)
  for (const [from, to] of cfg.dates) h = h.split(from).join(to);

  // Schema dateModified → 2026-09-15 (datePublished stays 2026-08-17)
  h = h.split('"dateModified":"2026-08-17"').join('"dateModified":"2026-09-15"');

  if (h !== before) { fs.writeFileSync(fp, h, 'utf-8'); changed++; console.log('updated:', file); }
  else console.log('unchanged:', file);
}
console.log(`\nDone. ${changed} file(s) updated.`);
