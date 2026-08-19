#!/usr/bin/env node
/**
 * LECTURE SEULE. Calcule les agrégats de la base `cards` pour l'étude
 * "État des cartes crypto en Europe 2026" (aimant à backlinks).
 * Sortie = stats citables (cashback affiché vs réaliste, staking, frais, réseaux,
 * disponibilité par marché...).
 *
 *   set -a && source .env && set +a
 *   node scripts/gen-card-stats.mjs
 */
import { createClient } from '@supabase/supabase-js';
const sb = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);
const { data, error } = await sb.from('cards').select('*');
if (error) { console.error('X', error.message); process.exit(1); }

const n = data.length;
const num = v => (v == null || isNaN(Number(v))) ? null : Number(v);
const avg = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : 0;
const med = arr => { if(!arr.length) return 0; const s=[...arr].sort((a,b)=>a-b); const m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; };
const pct = (k,t)=> t? (100*k/t).toFixed(1)+'%' : '0%';

// statut
const byStatus = {};
for (const c of data) byStatus[c.status||'active']=(byStatus[c.status||'active']||0)+1;
const active = data.filter(c => (c.status||'active')==='active');

// cashback affiché (max des 3) vs realiste (base/no_staking)
const advertised = active.map(c => Math.max(num(c.cashback_base)||0, num(c.cashback_no_staking)||0, num(c.cashback_premium)||0));
const realistic  = active.map(c => Math.max(num(c.cashback_base)||0, num(c.cashback_no_staking)||0));
const gap = active.map((c,i)=> advertised[i]-realistic[i]);

// staking
const staking = active.filter(c => c.staking_required).length;
const highCash = active.filter((c,i)=> advertised[i] >= 3);
const highCashStaking = highCash.filter(c => c.staking_required).length;

// frais
const free = active.filter(c => (num(c.annual_fees)||0)===0).length;
const fees = active.map(c => num(c.annual_fees)||0);
const paid = fees.filter(f=>f>0);

// reseaux
const net = {};
for (const c of active){ const k=(c.card_network||'?'); net[k]=(net[k]||0)+1; }

// dispo par marche
const markets=['fr','be','de','at','es','it','en'];
const availByMkt = Object.fromEntries(markets.map(m=>[m, active.filter(c=>Array.isArray(c.markets)&&c.markets.includes(m)).length]));

// virtuel / physique, staking sans, annee
const virtual = active.filter(c=>c.virtual_only).length;
const noStakeCashback = active.filter(c=> (num(c.cashback_no_staking)||num(c.cashback_base)||0) > 0 && !c.staking_required).length;

console.log(`\n===== ÉTUDE CARTES CRYPTO EUROPE 2026 — agrégats (base TopCryptoCards) =====`);
console.log(`Total cartes suivies : ${n}  ·  actives ${byStatus.active||0} · discontinuées ${byStatus.discontinued||0} · à venir ${byStatus.coming_soon||0}`);
console.log(`\n-- CASHBACK (sur ${active.length} cartes actives) --`);
console.log(`  Cashback AFFICHÉ moyen (max marketing) : ${avg(advertised).toFixed(2)}%`);
console.log(`  Cashback RÉALISTE moyen (sans staking) : ${avg(realistic).toFixed(2)}%`);
console.log(`  => écart moyen affiché vs réaliste     : ${avg(gap).toFixed(2)} points`);
console.log(`  Cartes dont le taux affiché n'est atteignable qu'avec staking : ${highCashStaking}/${highCash.length} (${pct(highCashStaking,highCash.length)}) des cartes à cashback >=3%`);
console.log(`  Cartes à 0% de cashback de base : ${active.filter(c=>(num(c.cashback_base)||0)===0).length}`);
console.log(`\n-- STAKING --`);
console.log(`  Cartes exigeant du staking : ${staking}/${active.length} (${pct(staking,active.length)})`);
console.log(`  Cartes avec cashback SANS staking : ${noStakeCashback}`);
console.log(`\n-- FRAIS ANNUELS --`);
console.log(`  Cartes gratuites (0€/an) : ${free}/${active.length} (${pct(free,active.length)})`);
console.log(`  Frais annuels médian (cartes payantes) : ${med(paid).toFixed(0)}€ · max ${Math.max(0,...paid)}€`);
console.log(`\n-- RÉSEAUX --`);
Object.entries(net).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(`  ${k}: ${v} (${pct(v,active.length)})`));
console.log(`\n-- FORMAT --`);
console.log(`  Virtuelles uniquement : ${virtual} · avec physique : ${active.length-virtual}`);
console.log(`\n-- DISPONIBILITÉ PAR MARCHÉ (cartes actives listées) --`);
markets.forEach(m=>console.log(`  ${m.toUpperCase()}: ${availByMkt[m]}`));
console.log(`\n-- TOP 5 cashback réaliste (sans staking) --`);
active.map((c,i)=>({name:c.name, r:realistic[i], a:advertised[i], stake:c.staking_required}))
  .sort((x,y)=>y.r-x.r).slice(0,5)
  .forEach(c=>console.log(`  ${c.r}%  (affiché ${c.a}%)  ${c.name}`));

// HALL OF SHAME : plus gros écarts affiché vs réaliste (l'élément citable)
console.log(`\n-- TOP 12 PLUS GROS ÉCARTS affiché vs réaliste (cashback marketing gonflé) --`);
active.map((c,i)=>({name:c.name, issuer:c.issuer, a:advertised[i], r:realistic[i], gap:advertised[i]-realistic[i], stake:c.staking_required}))
  .filter(c=>c.a>0)
  .sort((x,y)=>y.gap-x.gap).slice(0,12)
  .forEach(c=>console.log(`  affiché ${c.a}%  -> réel ${c.r}%  (écart ${c.gap.toFixed(0)} pts${c.stake?' · staking':''})  ${c.name}`));

// indice de realite moyen (realiste / affiche) sur cartes a cashback affiche
const ratios = active.map((c,i)=>({a:advertised[i],r:realistic[i]})).filter(c=>c.a>0).map(c=>c.r/c.a);
console.log(`\n-- INDICE DE RÉALITÉ (part du cashback affiché réellement accessible sans staking) --`);
console.log(`  moyenne : ${(avg(ratios)*100).toFixed(0)}%  (sur ${ratios.length} cartes à cashback affiché > 0)`);

// ---- BLOC PAR MARCHÉ (applique les market_overrides) ----
console.log(`\n===== CHIFFRES PAR MARCHÉ (cartes actives dispo dans le marché, overrides appliqués) =====`);
const MK = { fr:'France', be:'Belgique', de:'Allemagne', at:'Autriche', es:'Espagne', it:'Italie', en:'UK' };
for (const m of Object.keys(MK)) {
  const cards = active.filter(c => Array.isArray(c.markets) && c.markets.includes(m));
  const eff = cards.map(c => {
    const ov = (c.market_overrides && c.market_overrides[m]) || {};
    const b = num(ov.cashbackBase ?? c.cashback_base) || 0;
    const ns = num(ov.cashbackNoStaking ?? c.cashback_no_staking) || 0;
    const pr = num(ov.cashbackPremium ?? c.cashback_premium) || 0;
    const fee = num(ov.annualFees ?? c.annual_fees) || 0;
    return { adv: Math.max(b, ns, pr), real: Math.max(b, ns), base: b, fee };
  });
  const advM = avg(eff.map(e => e.adv));
  const realM = avg(eff.map(e => e.real));
  const rIdx = eff.filter(e => e.adv > 0).map(e => e.real / e.adv);
  const zero = eff.filter(e => e.base === 0).length;
  const free = eff.filter(e => e.fee === 0).length;
  console.log(`  ${MK[m].padEnd(9)} : ${cards.length} cartes · affiché ${advM.toFixed(2)}% · réel ${realM.toFixed(2)}% · indice réalité ${(avg(rIdx)*100).toFixed(0)}% · 0%-cashback ${zero} (${pct(zero,cards.length)}) · gratuites ${pct(free,cards.length)}`);
}
console.log(`\nOK — copie TOUTE la sortie et je rédige les versions localisées avec les chiffres exacts par marché.`);
