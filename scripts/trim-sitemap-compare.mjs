#!/usr/bin/env node
/**
 * Trims public/sitemap-compare.xml to allowlisted (indexable) pairs only.
 * Noindexed pages must not be in sitemaps — it wastes crawl budget and sends
 * Google contradictory signals ("index this" + "noindex").
 * Idempotent: safe to re-run.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const allow = new Set(JSON.parse(readFileSync('scripts/comparison-allowlist.json', 'utf8')));
const file = 'public/sitemap-compare.xml';
const xml = readFileSync(file, 'utf8');

const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
const kept = blocks.filter((b) => {
  const loc = (b.match(/<loc>([^<]+)<\/loc>/) || [])[1] || '';
  const last = loc.split('/').filter(Boolean).pop() || '';
  const i = last.indexOf('-vs-');
  if (i === -1) return true;
  const norm = [last.slice(0, i), last.slice(i + 4)].sort().join('-vs-');
  return allow.has(norm);
});

const head = xml.slice(0, xml.indexOf('<url>'));
const tail = '</urlset>\n';
writeFileSync(file, head + kept.join('\n') + '\n' + tail);
console.log(`sitemap-compare.xml: ${blocks.length} → ${kept.length} URLs`);
