#!/usr/bin/env node
/**
 * Régénère public/sitemap-index.xml avec un lastmod = AUJOURD'HUI pour chaque
 * sitemap enfant. Le fichier était statique (figé au 2026-07-08), ce qui signalait
 * à Google qu'aucun contenu n'avait changé -> pas de recrawl. À lancer au build.
 *
 *   node scripts/gen-sitemap-index.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
const FILE = new URL('../public/sitemap-index.xml', import.meta.url);
const TODAY = new Date().toISOString().slice(0, 10);
let xml = readFileSync(FILE, 'utf8');
const before = xml;
xml = xml.replace(/<lastmod>[0-9-]+<\/lastmod>/g, `<lastmod>${TODAY}</lastmod>`);
writeFileSync(FILE, xml);
const n = (before.match(/<lastmod>/g) || []).length;
console.log(`sitemap-index.xml : ${n} lastmod mis à ${TODAY}`);
