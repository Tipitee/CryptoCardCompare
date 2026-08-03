# TopCryptoCards — Reste à faire (check-up 2026-08-03)

## ✅ Opérationnel (vérifié en direct)
- Déploiement Cloudflare réparé : build → prerender → wrangler → IndexNow, sur push + cron nocturne
- Racine `/` = vrai 302 serveur (Pages Function + `_routes.json`), détection de langue
- Vrais 404, hreflang 7 marchés, `_headers` (CSP/sécurité/cache), sitemaps
- 6 agents planifiés actifs (dashboard mis à jour par A12 le 03/08 ; A3 a tourné le 28/07)
- Système `seo/` complet (playbooks A1–A12, quality gate, pipeline publication)

---

## A. Corrections code (rapides — Claude peut les faire)
- [ ] **tsc cassé** : `src/pages/ToolsPage.tsx:155` — `useHreflang(...)` appelé avec 1 argument au lieu de 2 (il manque le tableau de dépendances `[]`). Viole la règle « 0 erreur tsc ». Fix = 1 ligne.
- [ ] **A3 faux positif** : `health-check.mjs` renvoie 🔴 « fetch failed » quand il tourne sans réseau vers le site → fausse alerte « site injoignable » dans le dashboard. Le rendre robuste (distinguer « sonde réseau indisponible » d'un vrai échec) ou le faire tourner via web_fetch.

## B. Déblocages (toi — comptes externes)
- [ ] **Export GSC** : `seo/gsc-data/*.csv` sont des placeholders depuis le 20/07 → A5 (decay), A6 (striking-distance) et le weekly report sont à l'arrêt. Choix : (a) setup `pull-gsc.mjs` (compte de service Google Cloud, gratuit, ~10 min) pour l'automatiser, ou (b) export manuel hebdo.
- [ ] **Bing Webmaster Tools** : confirmer l'inscription + soumission du sitemap-index (index utilisé par ChatGPT/Copilot).
- [ ] **Sécurité** : régénérer la clé Supabase `service_role` qui a fuité en clair plus tôt (migration vers `sb_secret_`), puis mettre à jour `.env` + secret GitHub.
- [ ] **E-E-A-T auteur** : remplir les vrais liens LinkedIn/X dans `src/data/authors.ts` (`sameAs`) + avatar.

## C. Activer le moteur de contenu
- [ ] **Tester l'auto-article** : `node scripts/auto-article.mjs --dry-run` → juger la qualité réelle avant de laisser tourner. Démarrer à **1 article/semaine**, monter à 3 une fois validé.
- [ ] **Baseline visibilité IA** : lancer `/visibility` (ou vérifier le run A2 du mercredi) — la photo « avant » (attendu < 20 %).
- [ ] Vérifier que les tâches planifiées n'attendent pas d'approbation d'outil (« Run now » une fois si besoin).

## D. Le vrai travail SEO (continu — le plus fort levier)
- [ ] **Profondeur contenu** : 55 % des ~560 posts font < 500 mots. Approfondir les **30 money pages** (reviews cartes, thématiques) à 1 200+ mots ×5 langues, avec preuves de première main (photos, frais réels datés). C'est LE levier n°1.
- [ ] **Pages « [marque] alternatives »** ×10 marques (Crypto.com, Nexo, Bybit…) — gap identifié, fort intent, gagne les citations IA.
- [ ] **Autorité / backlinks** : publier les drafts bitcointalk + Medium (déjà dans le repo), Fee Index mensuel + outreach, brancher Ahrefs Webmaster Tools (gratuit).
- [ ] **Pages légales** localisées ×5 (impressum/datenschutz/privacy) — mineur.

---
_Priorité : A (code, 20 min) → B (déblocages, surtout l'export GSC) → C (activer) → D (continu)._
