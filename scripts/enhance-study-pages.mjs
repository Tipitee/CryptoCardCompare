#!/usr/bin/env node
/**
 * enhance-study-pages.mjs
 * Injects, idempotently, into each public/etudes/*.html study page:
 *  1) a FAQPage JSON-LD built from the page's own <details> FAQ (so schema == visible content)
 *  2) a localized "press / journalists" CTA section (link-earning hook) before <footer>
 * Run from repo root:  node scripts/enhance-study-pages.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '..', 'public', 'etudes');

const STRINGS = {
  'cartes-crypto-2026.html': {
    lang: 'fr', contact: 'https://topcryptocards.eu/fr/contact',
    kicker: 'Journalistes &amp; rédactions', h2: 'Reprendre cette étude',
    p: 'Vous couvrez les cartes crypto ou les paiements ? Le détail carte par carte et les chiffres par marché (FR, BE, DE, AT, ES, IT, UK) sont à disposition sur demande. Reprise libre des données avec un lien vers cette page.',
    label: 'À copier-coller :',
    lines: ['Cashback affiché moyen 2,37 %, réel sans staking 0,53 %, soit 31 % de la promesse.', 'Une carte sur deux (51 %) affiche 0 % de cashback de base.', 'Écart record : Bleap, 20 % affichés pour 1 % réel.'],
    cta: 'Demander les données par carte',
  },
  'crypto-cards-2026.html': {
    lang: 'en', contact: 'https://topcryptocards.eu/en/contact',
    kicker: 'Journalists &amp; newsrooms', h2: 'Reuse this study',
    p: 'Covering crypto cards or payments? The full per-card detail and market-level figures (FR, BE, DE, AT, ES, IT, UK) are available on request. Free to reuse with a link back to this page.',
    label: 'Copy-paste stats:',
    lines: ['Average advertised cashback 2.37%, real without staking 0.53%, i.e. 31% of the promise.', 'One card in two (51%) shows 0% base cashback.', 'Widest gap: Bleap, 20% advertised for 1% real.'],
    cta: 'Request the per-card data',
  },
  'krypto-karten-2026.html': {
    lang: 'de', contact: 'https://topcryptocards.eu/de/kontakt',
    kicker: 'Für Journalisten &amp; Redaktionen', h2: 'Studie weiterverwenden',
    p: 'Sie berichten über Krypto-Karten oder Zahlungen? Daten pro Karte und pro Markt (FR, BE, DE, AT, ES, IT, UK) auf Anfrage. Freie Weiterverwendung mit Link zu dieser Seite.',
    label: 'Zum Zitieren:',
    lines: ['Beworbenes Cashback im Schnitt 2,37 %, real ohne Staking 0,53 %, also 31 % des Versprechens.', 'Jede zweite Karte (51 %) zeigt 0 % Basis-Cashback.', 'Größte Lücke: Bleap, 20 % beworben, 1 % real.'],
    cta: 'Daten pro Karte anfragen',
  },
  'tarjetas-cripto-2026.html': {
    lang: 'es', contact: 'https://topcryptocards.eu/es/contacto',
    kicker: 'Para periodistas y redacciones', h2: 'Reutilizar este estudio',
    p: '¿Cubres tarjetas cripto o pagos? El detalle por tarjeta y las cifras por mercado (FR, BE, DE, AT, ES, IT, UK) están a tu disposición. Uso libre citando y enlazando a esta página.',
    label: 'Para copiar y pegar:',
    lines: ['Cashback anunciado medio 2,37 %, real sin staking 0,53 %, es decir el 31 % de lo prometido.', 'Una de cada dos tarjetas (51 %) no da cashback base.', 'Mayor brecha: Bleap, 20 % anunciado, 1 % real.'],
    cta: 'Pedir los datos por tarjeta',
  },
  'carte-crypto-2026.html': {
    lang: 'it', contact: 'https://topcryptocards.eu/it/contact',
    kicker: 'Per giornalisti e redazioni', h2: 'Riutilizzare questo studio',
    p: 'Ti occupi di carte crypto o pagamenti? Il dettaglio per carta e i numeri per mercato (FR, BE, DE, AT, ES, IT, UK) sono disponibili su richiesta. Riuso libero citando e linkando questa pagina.',
    label: 'Da copiare e incollare:',
    lines: ['Cashback pubblicizzato medio 2,37 %, reale senza staking 0,53 %, cioè il 31 % della promessa.', 'Una carta su due (51 %) non dà cashback base.', 'Divario più ampio: Bleap, 20 % pubblicizzato, 1 % reale.'],
    cta: 'Richiedere i dati per carta',
  },
};

const stripTags = (s) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function buildFaqSchema(html, lang) {
  const items = [];
  const re = /<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g;
  let m;
  while ((m = re.exec(html))) {
    items.push({
      '@type': 'Question',
      name: stripTags(m[1]),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(m[2]) },
    });
  }
  if (!items.length) return null;
  const obj = { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: lang, mainEntity: items };
  return `<script type="application/ld+json">\n${JSON.stringify(obj)}\n</script>`;
}

function pressBlock(s) {
  const lis = s.lines.map((l) => `<li style="margin:0 0 8px">${l}</li>`).join('');
  return `<!-- PRESS-CTA-INJECTED -->
<section id="presse"><div class="wrap">
  <h2><span class="sub">${s.kicker}</span>${s.h2}</h2>
  <p>${s.p}</p>
  <div class="cite" style="font-style:normal">
    <div style="font-weight:700;color:#fff;margin-bottom:8px">${s.label}</div>
    <ul style="margin:0;padding-left:18px">${lis}</ul>
  </div>
  <p style="margin-top:16px"><a class="cta" style="display:inline-block;border:1px solid var(--border);padding:10px 16px;border-radius:10px;color:var(--text)" href="${s.contact}">${s.cta} →</a></p>
</div></section>
`;
}

let changed = 0;
for (const [file, s] of Object.entries(STRINGS)) {
  const fp = path.join(DIR, file);
  if (!fs.existsSync(fp)) { console.log('skip (missing):', file); continue; }
  let html = fs.readFileSync(fp, 'utf-8');
  const before = html;

  if (!/"@type":"FAQPage"/.test(html)) {
    const schema = buildFaqSchema(html, s.lang);
    if (schema) html = html.replace('</head>', `${schema}\n</head>`);
    else console.log('!! no FAQ found in', file);
  }

  if (!html.includes('PRESS-CTA-INJECTED')) {
    html = html.replace(/<footer>/, `${pressBlock(s)}<footer>`);
  }

  if (html !== before) { fs.writeFileSync(fp, html, 'utf-8'); changed++; console.log('updated:', file); }
  else console.log('unchanged:', file);
}
console.log(`\nDone. ${changed} file(s) updated.`);
