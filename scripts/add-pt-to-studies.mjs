#!/usr/bin/env node
/**
 * add-pt-to-studies.mjs — idempotently add the pt-PT hreflang + a PT footer link
 * to the 5 pre-existing study pages (the new PT page already has both).
 * Run from repo root:  node scripts/add-pt-to-studies.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '..', 'public', 'etudes');
const PT_URL = 'https://topcryptocards.eu/etudes/cartoes-crypto-2026';
const FILES = ['cartes-crypto-2026.html', 'crypto-cards-2026.html', 'krypto-karten-2026.html', 'tarjetas-cripto-2026.html', 'carte-crypto-2026.html'];

const HREFLANG_PT = `<link rel="alternate" hreflang="pt-PT" href="${PT_URL}">`;

let changed = 0;
for (const file of FILES) {
  const fp = path.join(DIR, file);
  let html = fs.readFileSync(fp, 'utf-8');
  const before = html;

  // 1) hreflang pt-PT (insert right after the `it` alternate, once)
  if (!/hreflang="pt-PT"/.test(html)) {
    html = html.replace(
      /(<link rel="alternate" hreflang="it" href="[^"]*">)/,
      `$1\n${HREFLANG_PT}`
    );
  }

  // 2) PT footer link (once). Insert after the EN study anchor; on the EN page, after the FR anchor.
  if (!html.includes('etudes/cartoes-crypto-2026"') || /hreflang="pt-PT"/.test(html) && !/">PT<\/a>|Versão PT/.test(html)) {
    if (!/(Versão PT|">PT<\/a>)/.test(html)) {
      const enAnchor = /(<a href="https:\/\/topcryptocards\.eu\/etudes\/crypto-cards-2026">[^<]*<\/a>)/;
      const frAnchor = /(<a href="https:\/\/topcryptocards\.eu\/etudes\/cartes-crypto-2026">[^<]*<\/a>)/;
      const ptLink = `<a href="${PT_URL}">PT</a>`;
      if (enAnchor.test(html)) html = html.replace(enAnchor, `$1${ptLink}`);
      else if (frAnchor.test(html)) html = html.replace(frAnchor, `$1${ptLink}`);
    }
  }

  if (html !== before) { fs.writeFileSync(fp, html, 'utf-8'); changed++; console.log('updated:', file); }
  else console.log('unchanged:', file);
}
console.log(`\nDone. ${changed} file(s) updated.`);
