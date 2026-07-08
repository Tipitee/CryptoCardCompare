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
