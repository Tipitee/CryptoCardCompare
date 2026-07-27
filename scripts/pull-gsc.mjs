#!/usr/bin/env node
/**
 * Pull Google Search Console → seo/gsc-data/ (remplace l'export manuel).
 * L'API GSC est 100% gratuite et sans quota.
 *
 * SETUP UNIQUE (gratuit, ~10 min) :
 *   1. https://console.cloud.google.com → nouveau projet → active "Search Console API"
 *   2. Crée un "compte de service" → génère une clé JSON → enregistre-la
 *      dans le repo sous scripts/gsc-service-account.json (déjà git-ignoré, voir plus bas)
 *   3. Dans Google Search Console → Paramètres → Utilisateurs → ajoute l'email
 *      du compte de service (…@….iam.gserviceaccount.com) en "Lecture complète"
 *   4. npm i -D googleapis
 *
 * Lancer :  node scripts/pull-gsc.mjs
 * Env optionnels : GSC_SITE_URL (défaut https://topcryptocards.eu/),
 *                  GSC_SA_KEY (chemin clé JSON, défaut scripts/gsc-service-account.json)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { google } from 'googleapis';

const SITE = process.env.GSC_SITE_URL || 'https://topcryptocards.eu/';
const KEY_PATH = process.env.GSC_SA_KEY || new URL('./gsc-service-account.json', import.meta.url);

let creds;
try { creds = JSON.parse(readFileSync(KEY_PATH, 'utf8')); }
catch { console.error('❌ Clé compte de service introuvable. Voir le SETUP en tête de ce fichier.'); process.exit(1); }

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});
const webmasters = google.webmasters({ version: 'v3', auth });

const end = new Date();
const start = new Date(Date.now() - 90 * 864e5);
const fmt = d => d.toISOString().slice(0, 10);

async function pull(dimension) {
  const res = await webmasters.searchanalytics.query({
    siteUrl: SITE,
    requestBody: {
      startDate: fmt(start), endDate: fmt(end),
      dimensions: [dimension], rowLimit: 1000,
    },
  });
  return res.data.rows || [];
}

function toCsv(rows, keyLabel) {
  const head = `${keyLabel},clicks,impressions,ctr,position`;
  const body = rows.map(r =>
    `${String(r.keys[0]).replace(/,/g, ' ')},${r.clicks},${r.impressions},${(r.ctr * 100).toFixed(2)},${r.position.toFixed(1)}`
  ).join('\n');
  return head + '\n' + body + '\n';
}

const queries = await pull('query');
writeFileSync(new URL('../seo/gsc-data/queries.csv', import.meta.url), toCsv(queries, 'query'));
console.log(`✓ seo/gsc-data/queries.csv — ${queries.length} requêtes`);

const pages = await pull('page');
writeFileSync(new URL('../seo/gsc-data/pages.csv', import.meta.url), toCsv(pages, 'page'));
console.log(`✓ seo/gsc-data/pages.csv — ${pages.length} pages`);

console.log('\nA5 (decay) et A6 (striking-distance) peuvent maintenant tourner sur ces données.');
