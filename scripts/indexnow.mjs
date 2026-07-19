/**
 * indexnow.mjs — Ping IndexNow after every deploy
 *
 * Notifies Bing (+ Yandex via relay) of the most important URLs so they are
 * crawled within hours instead of weeks.
 *
 * Run: node scripts/indexnow.mjs
 * Called automatically by deploy.yml after a successful Netlify deploy.
 *
 * Key file: public/b996e78ec2462e01cad8535230566255.txt (must be live at the URL below)
 */

const KEY  = 'b996e78ec2462e01cad8535230566255';
const HOST = 'topcryptocards.eu';
const BASE = `https://${HOST}`;

// ── URLs to submit ────────────────────────────────────────────────────────────
// Keep to the ~200 most important. IndexNow has no hard limit but being focused
// is better practice. Structured by priority.

const URLS = [
  // ── Homepages (all markets) ─────────────────────────────────────────────────
  `${BASE}/fr`,
  `${BASE}/be`,
  `${BASE}/de`,
  `${BASE}/at`,
  `${BASE}/es`,
  `${BASE}/it`,
  `${BASE}/en`,

  // ── Fee Index ───────────────────────────────────────────────────────────────
  `${BASE}/fr/frais-cartes-crypto`,
  `${BASE}/be/frais-cartes-crypto`,
  `${BASE}/de/krypto-karten-gebuehren`,
  `${BASE}/at/krypto-karten-gebuehren`,
  `${BASE}/es/tarifas-tarjetas-crypto`,
  `${BASE}/it/tariffe-carte-crypto`,
  `${BASE}/en/crypto-card-fees`,

  // ── Country landing pages (dedicated) ──────────────────────────────────────
  `${BASE}/be/carte-crypto-belgique`,
  `${BASE}/at/krypto-karte-oesterreich`,
  `${BASE}/fr/cartes-crypto-france`,
  `${BASE}/de/krypto-karten-deutschland`,
  `${BASE}/es/tarjetas-crypto-espana`,
  `${BASE}/it/carte-crypto-italia`,
  `${BASE}/en/crypto-cards-europe`,

  // ── Best / Cashback thematic ────────────────────────────────────────────────
  `${BASE}/fr/meilleure-carte-crypto`,
  `${BASE}/be/meilleure-carte-crypto`,
  `${BASE}/de/beste-krypto-karte`,
  `${BASE}/at/beste-krypto-karte`,
  `${BASE}/es/mejor-tarjeta-crypto`,
  `${BASE}/it/migliore-carta-crypto`,
  `${BASE}/en/best-crypto-card`,

  `${BASE}/fr/carte-crypto-cashback`,
  `${BASE}/be/carte-crypto-cashback`,
  `${BASE}/de/krypto-karte-cashback`,
  `${BASE}/at/krypto-karte-cashback`,
  `${BASE}/es/tarjeta-crypto-cashback`,
  `${BASE}/it/carta-crypto-cashback`,
  `${BASE}/en/crypto-card-cashback`,

  // ── No-fees / No-staking ────────────────────────────────────────────────────
  `${BASE}/fr/carte-crypto-sans-frais`,
  `${BASE}/de/krypto-karte-ohne-jahresgebuehr`,
  `${BASE}/en/crypto-card-no-fees`,
  `${BASE}/fr/carte-crypto-sans-staking`,
  `${BASE}/de/krypto-karte-ohne-staking`,
  `${BASE}/en/crypto-card-no-staking`,

  // ── Comparer / Reviews / Brands ─────────────────────────────────────────────
  `${BASE}/fr/comparer`,
  `${BASE}/be/comparer`,
  `${BASE}/de/vergleich`,
  `${BASE}/at/vergleich`,
  `${BASE}/es/comparar`,
  `${BASE}/it/confronto`,
  `${BASE}/en/compare`,

  `${BASE}/fr/avis`,
  `${BASE}/be/avis`,
  `${BASE}/de/bewertungen`,
  `${BASE}/at/bewertungen`,
  `${BASE}/es/opiniones`,
  `${BASE}/it/recensioni`,
  `${BASE}/en/reviews`,

  `${BASE}/fr/marques`,
  `${BASE}/be/marques`,
  `${BASE}/de/marken`,
  `${BASE}/at/marken`,
  `${BASE}/es/marcas`,
  `${BASE}/it/marche`,
  `${BASE}/en/brands`,

  // ── Simulator / Recommendation ──────────────────────────────────────────────
  `${BASE}/fr/simulateur`,
  `${BASE}/be/simulateur`,
  `${BASE}/de/simulator`,
  `${BASE}/at/simulator`,
  `${BASE}/en/simulator`,

  `${BASE}/fr/recommandation`,
  `${BASE}/be/recommandation`,
  `${BASE}/de/empfehlung`,
  `${BASE}/at/empfehlung`,
  `${BASE}/en/recommendation`,

  // ── [Brand] alternatives pages ──────────────────────────────────────────────
  `${BASE}/fr/alternatives-revolut`,   `${BASE}/be/alternatives-revolut`,   `${BASE}/de/revolut-alternativen`,   `${BASE}/at/revolut-alternativen`,   `${BASE}/es/alternativas-revolut`,   `${BASE}/it/alternative-revolut`,   `${BASE}/en/revolut-alternatives`,
  `${BASE}/fr/alternatives-crypto-com`,`${BASE}/be/alternatives-crypto-com`,`${BASE}/de/crypto-com-alternativen`,`${BASE}/at/crypto-com-alternativen`,`${BASE}/es/alternativas-crypto-com`,`${BASE}/it/alternative-crypto-com`,`${BASE}/en/crypto-com-alternatives`,
  `${BASE}/fr/alternatives-binance`,   `${BASE}/be/alternatives-binance`,   `${BASE}/de/binance-alternativen`,   `${BASE}/at/binance-alternativen`,   `${BASE}/es/alternativas-binance`,   `${BASE}/it/alternative-binance`,   `${BASE}/en/binance-card-alternatives`,
  `${BASE}/fr/alternatives-bybit`,     `${BASE}/be/alternatives-bybit`,     `${BASE}/de/bybit-alternativen`,     `${BASE}/at/bybit-alternativen`,     `${BASE}/es/alternativas-bybit`,     `${BASE}/it/alternative-bybit`,     `${BASE}/en/bybit-card-alternatives`,
  `${BASE}/fr/alternatives-nexo`,      `${BASE}/be/alternatives-nexo`,      `${BASE}/de/nexo-alternativen`,      `${BASE}/at/nexo-alternativen`,      `${BASE}/es/alternativas-nexo`,      `${BASE}/it/alternative-nexo`,      `${BASE}/en/nexo-card-alternatives`,
  `${BASE}/fr/alternatives-bitpanda`,  `${BASE}/be/alternatives-bitpanda`,  `${BASE}/de/bitpanda-alternativen`,  `${BASE}/at/bitpanda-alternativen`,  `${BASE}/es/alternativas-bitpanda`,  `${BASE}/it/alternative-bitpanda`,  `${BASE}/en/bitpanda-alternatives`,
  `${BASE}/fr/alternatives-wirex`,     `${BASE}/be/alternatives-wirex`,     `${BASE}/de/wirex-alternativen`,     `${BASE}/at/wirex-alternativen`,     `${BASE}/es/alternativas-wirex`,     `${BASE}/it/alternative-wirex`,     `${BASE}/en/wirex-alternatives`,
  `${BASE}/fr/alternatives-coinbase`,  `${BASE}/be/alternatives-coinbase`,  `${BASE}/de/coinbase-alternativen`,  `${BASE}/at/coinbase-alternativen`,  `${BASE}/es/alternativas-coinbase`,  `${BASE}/it/alternative-coinbase`,  `${BASE}/en/coinbase-card-alternatives`,
  `${BASE}/fr/alternatives-kraken`,    `${BASE}/be/alternatives-kraken`,    `${BASE}/de/kraken-alternativen`,    `${BASE}/at/kraken-alternativen`,    `${BASE}/es/alternativas-kraken`,    `${BASE}/it/alternative-kraken`,    `${BASE}/en/kraken-card-alternatives`,
  `${BASE}/fr/alternatives-metamask`,  `${BASE}/be/alternatives-metamask`,  `${BASE}/de/metamask-alternativen`,  `${BASE}/at/metamask-alternativen`,  `${BASE}/es/alternativas-metamask`,  `${BASE}/it/alternative-metamask`,  `${BASE}/en/metamask-card-alternatives`,
  `${BASE}/fr/alternatives-okx`,       `${BASE}/be/alternatives-okx`,       `${BASE}/de/okx-alternativen`,       `${BASE}/at/okx-alternativen`,       `${BASE}/es/alternativas-okx`,       `${BASE}/it/alternative-okx`,       `${BASE}/en/okx-card-alternatives`,
  `${BASE}/fr/alternatives-gnosis-pay`,`${BASE}/be/alternatives-gnosis-pay`,`${BASE}/de/gnosis-pay-alternativen`,`${BASE}/at/gnosis-pay-alternativen`,`${BASE}/es/alternativas-gnosis-pay`,`${BASE}/it/alternative-gnosis-pay`,`${BASE}/en/gnosis-pay-alternatives`,
  `${BASE}/fr/alternatives-deblock`,   `${BASE}/be/alternatives-deblock`,   `${BASE}/de/deblock-alternativen`,   `${BASE}/at/deblock-alternativen`,   `${BASE}/es/alternativas-deblock`,   `${BASE}/it/alternative-deblock`,   `${BASE}/en/deblock-alternatives`,
  `${BASE}/fr/alternatives-plutus`,    `${BASE}/be/alternatives-plutus`,    `${BASE}/de/plutus-alternativen`,    `${BASE}/at/plutus-alternativen`,    `${BASE}/es/alternativas-plutus`,    `${BASE}/it/alternative-plutus`,    `${BASE}/en/plutus-alternatives`,
  `${BASE}/fr/alternatives-brighty`,   `${BASE}/be/alternatives-brighty`,   `${BASE}/de/brighty-alternativen`,   `${BASE}/at/brighty-alternativen`,   `${BASE}/es/alternativas-brighty`,   `${BASE}/it/alternative-brighty`,   `${BASE}/en/brighty-alternatives`,
  `${BASE}/fr/alternatives-bleap`,     `${BASE}/be/alternatives-bleap`,     `${BASE}/de/bleap-alternativen`,     `${BASE}/at/bleap-alternativen`,     `${BASE}/es/alternativas-bleap`,     `${BASE}/it/alternative-bleap`,     `${BASE}/en/bleap-alternatives`,

  // ── New comparison pairs (July 2026) ────────────────────────────────────────
  `${BASE}/fr/comparer/bleap-card-vs-brighty-card`,   `${BASE}/be/comparer/bleap-card-vs-brighty-card`,   `${BASE}/de/vergleichen/bleap-card-vs-brighty-card`,   `${BASE}/at/vergleichen/bleap-card-vs-brighty-card`,   `${BASE}/en/compare/bleap-card-vs-brighty-card`,
  `${BASE}/fr/comparer/bleap-card-vs-nexo-card`,      `${BASE}/be/comparer/bleap-card-vs-nexo-card`,      `${BASE}/de/vergleichen/bleap-card-vs-nexo-card`,      `${BASE}/at/vergleichen/bleap-card-vs-nexo-card`,      `${BASE}/en/compare/bleap-card-vs-nexo-card`,
  `${BASE}/fr/comparer/bleap-card-vs-revolut-metal`,  `${BASE}/be/comparer/bleap-card-vs-revolut-metal`,  `${BASE}/de/vergleichen/bleap-card-vs-revolut-metal`,  `${BASE}/at/vergleichen/bleap-card-vs-revolut-metal`,  `${BASE}/en/compare/bleap-card-vs-revolut-metal`,
  `${BASE}/fr/comparer/brighty-card-vs-gnosis-pay-card`,`${BASE}/be/comparer/brighty-card-vs-gnosis-pay-card`,`${BASE}/de/vergleichen/brighty-card-vs-gnosis-pay-card`,`${BASE}/at/vergleichen/brighty-card-vs-gnosis-pay-card`,`${BASE}/en/compare/brighty-card-vs-gnosis-pay-card`,
  `${BASE}/fr/comparer/brighty-card-vs-nexo-card`,    `${BASE}/be/comparer/brighty-card-vs-nexo-card`,    `${BASE}/de/vergleichen/brighty-card-vs-nexo-card`,    `${BASE}/at/vergleichen/brighty-card-vs-nexo-card`,    `${BASE}/en/compare/brighty-card-vs-nexo-card`,
  `${BASE}/fr/comparer/brighty-card-vs-revolut-metal`,`${BASE}/be/comparer/brighty-card-vs-revolut-metal`,`${BASE}/de/vergleichen/brighty-card-vs-revolut-metal`,`${BASE}/at/vergleichen/brighty-card-vs-revolut-metal`,`${BASE}/en/compare/brighty-card-vs-revolut-metal`,
  `${BASE}/fr/comparer/crypto-com-midnight-blue-vs-okx-card`,`${BASE}/be/comparer/crypto-com-midnight-blue-vs-okx-card`,`${BASE}/de/vergleichen/crypto-com-midnight-blue-vs-okx-card`,`${BASE}/at/vergleichen/crypto-com-midnight-blue-vs-okx-card`,`${BASE}/en/compare/crypto-com-midnight-blue-vs-okx-card`,
  `${BASE}/fr/comparer/nexo-card-vs-plutus-card`,     `${BASE}/be/comparer/nexo-card-vs-plutus-card`,     `${BASE}/de/vergleichen/nexo-card-vs-plutus-card`,     `${BASE}/at/vergleichen/nexo-card-vs-plutus-card`,     `${BASE}/en/compare/nexo-card-vs-plutus-card`,
  `${BASE}/fr/comparer/plutus-card-vs-revolut-metal`, `${BASE}/be/comparer/plutus-card-vs-revolut-metal`, `${BASE}/de/vergleichen/plutus-card-vs-revolut-metal`, `${BASE}/at/vergleichen/plutus-card-vs-revolut-metal`, `${BASE}/en/compare/plutus-card-vs-revolut-metal`,

  // ── Blog posts refreshed (FAQ blocks added July 2026) ───────────────────────
  `${BASE}/en/blog/gnosis-pay-review-2026`,
  `${BASE}/en/blog/gnosis-pay-review-2026-self-custody-crypto-card-2-percent-cashback-eure`,
  `${BASE}/en/blog/gnosis-pay-vs-metamask-card-self-custody`,
  `${BASE}/fr/blog/avis-gnosis-pay-2026`,
  `${BASE}/fr/blog/gnosis-pay-avis-2026`,
  `${BASE}/fr/blog/gnosis-pay-vs-metamask-card-self-custody`,
  `${BASE}/de/blog/gnosis-pay-vs-metamask-card-self-custody`,
  `${BASE}/es/blog/gnosis-pay-vs-metamask-card-self-custody`,
  `${BASE}/it/blog/gnosis-pay-vs-metamask-card-self-custody`,
  `${BASE}/it/blog/confronto-bitpanda-card-vs-okx-card-2026`,
  `${BASE}/it/blog/confronto-coinbase-card-vs-okx-card-2026`,
  `${BASE}/it/blog/confronto-crypto-com-midnight-blue-vs-okx-card-2026`,
  `${BASE}/it/blog/confronto-crypto-com-ruby-steel-vs-okx-card-2026`,
  `${BASE}/it/blog/confronto-okx-card-vs-wirex-elite-2026`,

  // ── Tools hub ───────────────────────────────────────────────────────────────
  `${BASE}/fr/outils-carte-crypto`, `${BASE}/be/outils-carte-crypto`, `${BASE}/de/krypto-karte-tools`, `${BASE}/at/krypto-karte-tools`, `${BASE}/es/herramientas-tarjeta-crypto`, `${BASE}/it/strumenti-carta-crypto`, `${BASE}/en/crypto-card-tools`,
];

// ── Submit ────────────────────────────────────────────────────────────────────
async function submit() {
  const body = JSON.stringify({ host: HOST, key: KEY, urlList: URLS });

  console.log(`IndexNow — submitting ${URLS.length} URLs to Bing…`);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });

  if (res.ok || res.status === 202) {
    console.log(`✓ IndexNow accepted (HTTP ${res.status})`);
  } else {
    const text = await res.text().catch(() => '');
    console.error(`✗ IndexNow returned HTTP ${res.status}: ${text}`);
    process.exit(1);
  }
}

submit();
