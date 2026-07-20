# Plan v8 — Site + AI workflow (guide « 7 Configs » implémenté)
**Date : 16 juillet 2026.** Le guide Amadora est ingéré, adapté et **déjà installé** dans `seo/` — pré-rempli avec les vraies données du projet, pas des templates. Ce document : ce qui a été fait, les gaps comblés, et le plan de fonctionnement.

---

## 1. Ce qui vient d'être installé (dossier `seo/`)

Les 7 configs du guide, adaptées 7-marchés :

1. **your-site/** — overview (money pages ×7 marchés + snapshot santé), keywords.csv (priority/secondary + tier « ignore » : prix bitcoin, exchanges…), brand-voice.md (catégorie exacte, one-liner cible pour ChatGPT, différenciateur, bans)
2. **gsc-data/** — squelettes queries/pages.csv, à écraser chaque lundi avec l'export GSC (2 min)
3. **technical-seo/** — site-audit.md et schema.md adaptés à NOTRE stack (pièges Netlify/_redirects, drift sitemap↔prerender, hreflang 7 locales, check crawlers IA)
4. **ai-visibility/** — **25 buyer queries pré-écrites en 5 langues** (le cœur du système), citations.md (scan hebdo 3 plateformes), perception.md (check mensuel contre brand-voice)
5. **competitors/** — share-of-voice.csv (log de tendance) + comparison-pages.md (orienté vers notre gap réel : pages « alternatives » ×10 marques)
6. **content-strategy/** — content-gap.md (3 passes, par marché) + content-briefs.md (réponse dans les 100 premiers mots, H2 questions, FAQ, données Supabase datées)
7. **reporting/ + automations/ + settings.json** — dashboard segmenté par marché, rapport lundi (page-2 prisoners avec benchmarks CTR, cannibalisation fr/be–de/at), 3 automations, raccourcis `/audit` `/visibility` `/report` etc. branchés dans CLAUDE.md

## 2. Gaps que le guide révélait chez nous (comblés ou planifiés)

| Gap | État |
|---|---|
| Aucun suivi de visibilité IA (le « Search Console de l'IA ») | ✅ Système installé — **lancer la baseline `/visibility` cette semaine** |
| Pas de brand-voice écrit → perception IA non mesurable | ✅ Écrit (catégorie : « comparateur », PAS « blog crypto ») |
| Pas de tier « ignore » de mots-clés → dérive vers le trafic non-convertisseur | ✅ Écrit |
| Contexte re-briefé à chaque session IA | ✅ Fini — CLAUDE.md pointe vers seo/ |
| Pas de boucle GSC hebdo structurée | ✅ Playbook + automation lundi (exports manuels 2 min) |
| Pages « [marque] alternatives » absentes | Déjà identifié en v7 — confirmé par le guide comme gagnant n°1 des citations IA |
| Réponse directe dans les 100 premiers mots | À vérifier page par page via `/schema` (AI-readability check) |

Déjà conformes au guide (rien à faire) : crawlers IA autorisés, llms.txt, schema riche, FAQ, prerender/SSG, IndexNow, sitemaps propres, comparaisons honnêtes, auteurs.

## 3. Le rythme de fonctionnement (l'« AI workflow »)

**Lundi 8h — `/report`** : tu exportes GSC (2 min), l'IA compare 28j vs 28j par marché, flag les baisses (>20 %, money pages à 0 %), réécrit les titles des prisonniers de page 2, détecte la cannibalisation, met à jour le dashboard. → UNE action.
**Mercredi 8h — `/visibility`** : scan des 25 buyer queries sur ChatGPT/Perplexity/Gemini, log dans share-of-voice.csv, alerte si −5 pts. 1er mercredi du mois : `/perception` en plus. → UNE action.
**Vendredi 8h — `/brief`** (à activer semaine 3+) : un brief prêt à écrire sur le top gap.
**Mensuel — `/gap`** : analyse des trous de contenu. **Trimestriel — `/audit` + `/schema`**.

Je peux créer les tâches planifiées Cowork (lundi/mercredi 8h) — dis-le et je les pose.

## 4. Séquence de démarrage (cette semaine)

1. ☐ Relire/ajuster `seo/your-site/` et les 25 buyer queries (15 min — c'est TA connaissance des prospects qui compte)
2. ☐ **Baseline `/visibility`** — le « before picture ». S'attendre à < 20 %.
3. ☐ Export GSC → `seo/gsc-data/` → premier `/report` → livrer les 3 réécritures de titles le jour même
4. ☐ Planifier les 2 automations
5. ☐ Livrer l'action recommandée par la baseline
6. ☐ Commit du dossier seo/ (fait localement — pousser avec le prochain commit)

## 5. Ce que ça change vs le plan v7

v7 reste le plan de fond (refresh loop, outils, Reddit, autorité). v8 ajoute **le système d'exploitation** qui rend v7 exécutable sans re-contextualisation : les mêmes actions, mais mesurées chaque semaine (GSC + visibilité IA), avec une seule action prioritaire par rapport. Attendus du guide : semaines 1–2 gains de CTR (titles), 3–4 premières tendances, 6–8 citations IA sur les pages comparaison.
