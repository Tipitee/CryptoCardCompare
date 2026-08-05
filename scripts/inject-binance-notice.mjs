#!/usr/bin/env node
/**
 * Injecte un bandeau « carte Binance arrêtée dans l'EEE » en tête des comparatifs
 * Binance dédiés (slug contenant binance + vs), dans les 7 marchés. Idempotent.
 *
 *   set -a && source .env && set +a
 *   node scripts/inject-binance-notice.mjs             # DRY-RUN (liste les articles ciblés)
 *   node scripts/inject-binance-notice.mjs --confirm   # injecte
 */
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const CONFIRM = process.argv.includes('--confirm');
const MARKER = '<!-- binance-eol-notice -->';

// Bandeau par langue (be→fr, at→de gérés par la même valeur). Lien = page alternatives Binance du marché.
const NOTICE = {
  fr: `${MARKER}\n> ⚠️ **Mise à jour :** la carte Binance n'est plus disponible dans l'Espace économique européen depuis le 20 décembre 2023. Ce comparatif est conservé à titre informatif ; pour des cartes réellement disponibles, consultez nos [alternatives à la carte Binance](/fr/alternatives-binance).`,
  de: `${MARKER}\n> ⚠️ **Update:** Die Binance-Karte ist im EWR seit dem 20. Dezember 2023 nicht mehr verfügbar. Dieser Vergleich bleibt informativ; verfügbare Karten findest du in unseren [Binance-Karte-Alternativen](/de/binance-alternativen).`,
  es: `${MARKER}\n> ⚠️ **Actualización:** la tarjeta Binance ya no está disponible en el EEE desde el 20 de diciembre de 2023. Esta comparativa se conserva a título informativo; para tarjetas realmente disponibles, consulta nuestras [alternativas a la tarjeta Binance](/es/alternativas-binance).`,
  it: `${MARKER}\n> ⚠️ **Aggiornamento:** la carta Binance non è più disponibile nel SEE dal 20 dicembre 2023. Questo confronto è mantenuto a titolo informativo; per carte realmente disponibili, vedi le nostre [alternative alla carta Binance](/it/alternative-binance).`,
  en: `${MARKER}\n> ⚠️ **Update:** the Binance Card is no longer available in the EEA as of 20 December 2023. This comparison is kept for reference; for cards you can actually get, see our [Binance Card alternatives](/en/binance-alternatives).`,
};
const noticeFor = lang => NOTICE[{ be: 'fr', at: 'de' }[lang] ?? lang] ?? NOTICE.en;

const { data, error } = await sb.from('blog_posts').select('id, lang, slug, title, content, published');
if (error) { console.error('✗', error.message); process.exit(1); }

// Comparatifs Binance dédiés : slug contient "binance" ET "vs".
const targets = (data || []).filter(p => {
  const s = (p.slug || '').toLowerCase();
  return s.includes('binance') && /vs/.test(s);
});

console.log(`\n${CONFIRM ? '=== INJECTION ===' : '=== DRY-RUN ==='}  ${targets.length} comparatifs Binance ciblés\n`);
let done = 0, already = 0;
for (const p of targets) {
  const has = (p.content || '').includes(MARKER);
  console.log(`  [${p.lang}] ${p.slug} ${p.published ? '' : '(draft)'} ${has ? '· déjà fait' : ''}`);
  if (has) { already++; continue; }
  if (CONFIRM) {
    const newContent = `${noticeFor(p.lang)}\n\n${p.content || ''}`;
    const { error: e } = await sb.from('blog_posts').update({ content: newContent }).eq('id', p.id);
    if (e) console.log(`      ✗ ${e.message}`); else done++;
  }
}

console.log(`\n${CONFIRM ? `✓ ${done} bandeaux injectés · ${already} déjà présents.` : `DRY-RUN : ${targets.length} articles (${already} ont déjà le bandeau). Pour injecter : --confirm`}`);
if (CONFIRM && done) console.log(`Pense à re-déployer (git push) pour prérendre les articles mis à jour.`);
