import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DOMAIN = 'https://topcryptocards.eu';
const LANGS = ['fr', 'de', 'es', 'it', 'en'];
const TODAY = new Date().toISOString().split('T')[0];

// ─── Route slugs per language ─────────────────────────────────────────────────

const ROUTES: Record<string, Record<string, string>> = {
  fr: { compare: 'comparer',  simulator: 'simulateur', recommendation: 'recommandation', favorites: 'favoris',   cards: 'cartes' },
  de: { compare: 'vergleich', simulator: 'simulator',  recommendation: 'empfehlung',     favorites: 'favoriten', cards: 'karten' },
  es: { compare: 'comparar',  simulator: 'simulador',  recommendation: 'recomendacion',  favorites: 'favoritos', cards: 'tarjetas' },
  it: { compare: 'confronto', simulator: 'simulatore', recommendation: 'raccomandazione',favorites: 'preferiti', cards: 'carte' },
  en: { compare: 'compare',   simulator: 'simulator',  recommendation: 'recommendation', favorites: 'favorites', cards: 'cards' },
};

// ─── Crypto page symbols ─────────────────────────────────────────────────────

const CRYPTO_SYMBOLS = ['btc', 'eth', 'xrp', 'bnb', 'sol', 'ada', 'avax', 'doge', 'usdt', 'usdc'];

// ─── Thematic page slugs per language ────────────────────────────────────────

const THEMATIC: Record<string, Record<string, string>> = {
  fr: ['meilleure-carte-crypto', 'carte-crypto-cashback', 'carte-crypto-sans-frais', 'carte-crypto-sans-staking', 'cartes-crypto-france', 'carte-crypto-virtuelle', 'cartes-crypto-debutant'],
  de: ['beste-krypto-karte', 'krypto-karte-cashback', 'krypto-karte-ohne-jahresgebuehr', 'krypto-karte-ohne-staking', 'krypto-karten-deutschland', 'virtuelle-krypto-karte', 'krypto-karten-einsteiger'],
  es: ['mejor-tarjeta-cripto', 'tarjeta-cripto-cashback', 'tarjeta-cripto-sin-comisiones', 'tarjeta-cripto-sin-staking', 'tarjetas-crypto-espana', 'tarjeta-crypto-virtual', 'tarjetas-crypto-principiante'],
  it: ['migliore-carta-cripto', 'carta-cripto-cashback', 'carta-cripto-senza-commissioni', 'carta-cripto-senza-staking', 'carte-crypto-italia', 'carta-crypto-virtuale', 'carte-crypto-principiante'],
  en: ['best-crypto-card', 'crypto-card-cashback', 'crypto-card-no-fees', 'crypto-card-no-staking', 'crypto-cards-europe', 'virtual-crypto-card', 'beginner-crypto-cards'],
} as any;

function xml(urls: string[]): string {
  const entries = urls.map(u => `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const urls: string[] = [];

  // ── Homepage per lang
  for (const lang of LANGS) {
    urls.push(`${DOMAIN}/${lang}`);
  }

  // ── Static tool pages per lang
  for (const lang of LANGS) {
    const r = ROUTES[lang];
    urls.push(`${DOMAIN}/${lang}/${r.compare}`);
    urls.push(`${DOMAIN}/${lang}/${r.simulator}`);
    urls.push(`${DOMAIN}/${lang}/${r.recommendation}`);
    urls.push(`${DOMAIN}/${lang}/${r.favorites}`);
    urls.push(`${DOMAIN}/${lang}/blog`);
  }

  // ── Thematic pages
  for (const lang of LANGS) {
    for (const slug of (THEMATIC[lang] ?? [])) {
      urls.push(`${DOMAIN}/${lang}/${slug}`);
    }
  }

  // ── Card detail pages
  const { data: cards } = await supabase
    .from('cards')
    .select('id, markets')
    .neq('status', 'discontinued');

  for (const card of (cards ?? [])) {
    const markets: string[] = card.markets ?? [];
    const cardLangs = LANGS.filter(l => {
      if (l === 'fr') return markets.includes('fr') || markets.includes('FR');
      if (l === 'de') return markets.includes('de') || markets.includes('DE');
      if (l === 'es') return markets.includes('es') || markets.includes('ES');
      if (l === 'it') return markets.includes('it') || markets.includes('IT');
      if (l === 'en') return markets.includes('en') || markets.includes('EN') || markets.includes('eu') || markets.length === 0;
      return false;
    });
    for (const lang of (cardLangs.length ? cardLangs : LANGS)) {
      urls.push(`${DOMAIN}/${lang}/${ROUTES[lang].cards}/${card.id}`);
    }
  }

  // ── Blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, lang')
    .eq('published', true);

  for (const post of (posts ?? [])) {
    const lang = post.lang ?? 'fr';
    urls.push(`${DOMAIN}/${lang}/blog/${post.slug}`);
  }

  // ── Crypto hub + detail pages (5 langs × 10 symbols = 55 URLs)
  for (const lang of LANGS) {
    urls.push(`${DOMAIN}/${lang}/cryptos`);
    for (const symbol of CRYPTO_SYMBOLS) {
      urls.push(`${DOMAIN}/${lang}/cryptos/${symbol}`);
    }
  }

  return new Response(xml(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
});
