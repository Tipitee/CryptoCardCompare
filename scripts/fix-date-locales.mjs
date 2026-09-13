#!/usr/bin/env node
/**
 * fix-date-locales.mjs — ensure every DATE_LOCALES map covers be/at/pt.
 * Without them, PT dates render in French ("septembre") and AT in French too.
 * Idempotent: only inserts the keys that are missing, right after the `en:` entry.
 * Run from repo root:  node scripts/fix-date-locales.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '..', 'src', 'pages');
const FILES = ['Blog.tsx', 'BlogCategoryPage.tsx', 'BlogPost.tsx', 'Compare.tsx',
  'BrandPage.tsx', 'ThematicPage.tsx', 'ReviewList.tsx', 'FeeIndexPage.tsx', 'ReviewPage.tsx'];
const WANT = { be: 'fr-BE', at: 'de-AT', pt: 'pt-PT' };

let total = 0;
for (const file of FILES) {
  const fp = path.join(DIR, file);
  if (!fs.existsSync(fp)) { console.log('skip (missing):', file); continue; }
  let src = fs.readFileSync(fp, 'utf-8');

  // Isolate the DATE_LOCALES object literal.
  const m = src.match(/const DATE_LOCALES:[^=]*=\s*\{([\s\S]*?)\}/);
  if (!m) { console.log('no DATE_LOCALES in', file); continue; }
  const body = m[1];
  const missing = Object.entries(WANT).filter(([k]) => !new RegExp(`(^|[^a-z])${k}:`).test(body));
  if (!missing.length) { console.log('ok (complete):', file); continue; }

  // Insert missing keys right after the `en: '...'` entry (all maps have `en`).
  const ins = missing.map(([k, v]) => `${k}: '${v}',`).join(' ');
  const newBody = body.replace(/(en:\s*'[^']*',?)/, (mm) => `${mm.endsWith(',') ? mm : mm + ','} ${ins}`);
  if (newBody === body) { console.log('!! could not find en: anchor in', file); continue; }
  src = src.replace(body, newBody);
  fs.writeFileSync(fp, src, 'utf-8');
  total++;
  console.log(`updated ${file}: +${missing.map(([k]) => k).join('/')}`);
}
console.log(`\nDone. ${total} file(s) updated.`);
