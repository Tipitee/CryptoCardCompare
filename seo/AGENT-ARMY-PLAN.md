# L'armée d'agents SEO — plan de loops pour TopCryptoCards
Adapté de « Claude Code Loops for SEO » (Ryze) à NOTRE stack et à ce qui existe déjà.
Date : 2026-07-16.

## Le principe (Ryze, résumé)
Un **loop** = un objectif + une condition d'arrêt, qui tourne **sur un planning**, avec :
1. un **skill** (contexte écrit, lu à chaque run) — chez nous : le dossier `seo/`
2. une **cadence** (tâche planifiée Cowork) — le « battement de cœur »
3. un **verifier gate** (un test objectif qui peut FAIRE ÉCHOUER le travail) — la pièce que tout le monde rate
4. un **state file** (mémoire hors conversation) — l'agent oublie entre les runs, pas le fichier
5. pour le contenu : un split **maker / checker** — un agent rédige (rapide, pas cher), un autre juge (lent, strict)

**Règle d'or Ryze (vitale ici) :** un loop qui PUBLIE du contenu mince en masse peut faire couler tout le domaine, pas juste les mauvaises pages. On a déjà 560 posts dont 55 % < 500 mots → **aucun agent ne publie sans toi**. Le gate de publication chez nous est déjà en place : `blog_posts.published = false` par défaut → tu approuves → un script bascule à `true` + régénère le sitemap + tu pushes.

## Nos contraintes réelles (ce qui change vs l'article)
| Article suppose | Chez nous |
|---|---|
| GSC en direct via MCP (loops quotidiens) | Export GSC **manuel hebdo** dans `seo/gsc-data/` → loops rank en **hebdo**, pas quotidien (ou brancher Ahrefs/Semrush plus tard) |
| GA4 connecté | Pas connecté — on optimise sur positions/citations, pas conversions (pour l'instant) |
| CMS avec write API | Supabase (`blog_posts`) + push GitHub → prerender. La sandbox **ne peut pas pusher** → publication toujours manuelle = filet de sécurité naturel |
| Modèles au budget large | Budget serré → maker en Haiku/Sonnet, checker en Sonnet, watchers légers, sorties plafonnées |

---

## L'organigramme — 4 escouades, 12 agents

### 🛰️ Escouade 1 — WATCHERS (lecture seule, zéro risque, à automatiser en premier)
| # | Agent | Job | Cadence | Source | Gate | Modèle |
|---|---|---|---|---|---|---|
| A1 | **Rank Watcher** ✅ existe | Compare 28j vs 28j, prisonniers page 2, cannibalisation, réécrit titres/metas | Lundi 8h | GSC CSV | read-only + seuils | Sonnet |
| A2 | **AI Visibility Watcher** ✅ existe | 25 buyer queries × ChatGPT/Perplexity/Gemini, share-of-voice, alerte −5 pts | Mercredi 8h | WebSearch | read-only | Sonnet |
| A3 | **Tech Health Sentinel** 🆕 | 404 réels, drift sitemap↔prerender, hreflang→404, crawlers IA autorisés, raw-HTML localisé, CWV | Mardi 8h | Site prod + repo | read-only, alerte | Sonnet |
| A4 | **SERP & Competitor Watch** 🆕 | Top-10 sur mots-clés priority par marché : qui monte, AI overview apparu, nouveau concurrent | Jeudi 8h | WebSearch | read-only, seuil de mouvement | Sonnet |

### 🗺️ Escouade 2 — PLANNERS (lecture seule, écrivent dans une FILE d'attente, tu approuves)
| # | Agent | Job | Cadence | Source | Gate |
|---|---|---|---|---|---|
| A5 | **Decay Detector** 🆕 | Pages en déclin 3 semaines+ → brief de refresh en file | Lundi (après A1) | GSC CSV 90j | seuil de déclin soutenu |
| A6 | **Striking-Distance Miner** 🆕 | Requêtes pos 8-20 + impressions → l'édition précise qui pousse en page 1 | Tous les 3 jours | GSC CSV | bande de position + plancher d'impressions |
| A7 | **Internal-Link Finder** 🆕 | Pour chaque money page, 3-5 posts qui parlent du sujet sans lier → ancre proposée | Hebdo | Supabase `blog_posts` | pertinence + lien absent |
| A8 | **Content-Gap Brief Gen** 🆕 | buyer-queries sans page dédiée × sujets couverts par concurrents → briefs | Vendredi (playbook `/gap`+`/brief`) | sitemaps + buyer-queries | demande + anti-doublon |

### 🔨 Escouade 3 — MAKERS + CHECKER (rédigent seulement, caps durs, jamais d'auto-publish)
| # | Agent | Job | Déclenché par | Gate |
|---|---|---|---|---|
| A9 | **Refresh Writer** (maker) 🆕 | Prend un brief approuvé → rédige le markdown refreshé en `published=false` | Toi, sur un brief validé | cap : max 3 drafts/run |
| A10 | **Localization Agent** (maker) 🆕 | Comble les variantes de langue manquantes (be→fr, at→de + traductions) | Toi / détection de trous | 5 langues cohérentes, dispo par marché |
| A11 | **Quality Gate / Éditeur** (checker) 🆕 | Note chaque draft vs `brand-voice.md` + rubrique — **peut REFUSER** : réponse dans 100 mots ? H2 = questions ? FAQ ? données datées ? pas de remplissage ? | Automatique sur tout draft A9/A10 | score < seuil = rejet, retour au maker |

### 🎖️ Escouade 4 — ORCHESTRATEUR
| # | Agent | Job | Cadence | Gate |
|---|---|---|---|---|
| A12 | **Weekly Digest** 🆕 | Roule A1-A8 + state files en 1 résumé < 300 mots, sans jargon, + UNE action prioritaire | Lundi 9h (après A1/A5) | aucun — lit et écrit un message |

---

## Le pipeline de publication (le gate qui protège le domaine)
```
Planner (A5/A8) → brief dans seo/state/refresh-queue.md
   ↓ TU approuves un brief
Maker (A9/A10) → draft dans blog_posts (published=false) + entrée seo/state/drafts.md
   ↓ automatique
Checker (A11) → note le draft. FAIL → retour maker. PASS → marqué "prêt à review"
   ↓ TU relis dans /admin/blog (ou le fichier queue)
Toi → published=true  →  node scripts/gen-blog-sitemap.mjs  →  git push
   ↓
GitHub Actions → prerender → live
```
Trois protections Ryze intégrées : **cap** (max 3 pages/run), **quality gate qui peut échouer**, **approbation humaine** avant le live. Et bonus : la sandbox ne peut pas pusher, donc même un bug ne peut rien mettre en ligne tout seul.

---

## Ordre de construction (MVP d'abord — la règle n°1 de l'article)
- **Phase 0 ✅ faite** : A1 Rank Watcher + A2 AI Visibility (déjà planifiés)
- **Phase 1 — cette semaine (zéro risque, aucun nouveau connecteur)** : A3 Tech Health Sentinel + A4 SERP Watch. 100 % lecture seule, tournent sur prod + WebSearch.
- **Phase 2 — planners** : A7 Internal-Link + A8 Gap (faisables tout de suite via Supabase/sitemaps) ; A5 Decay + A6 Striking-distance dès que l'export GSC hebdo est en place.
- **Phase 3 — makers + gate** : A9/A10/A11 + le script de publication. On active seulement quand un brief a été rédigé à la main une fois, validé, et qu'on fait confiance au gate.
- **Phase 4 — option data live** : brancher Ahrefs ou Semrush (payant) pour passer A1/A4/A6 en données quotidiennes ; GA4 pour optimiser sur les conversions.

## Qui fait quoi
**Moi, maintenant (code + config, aucune permission spéciale) :**
- Écrire le playbook/SKILL de chaque agent dans `seo/agents/`
- Écrire les verifier scripts (health-check prod, internal-link finder Supabase, rubrique quality-gate)
- Écrire `scripts/publish-drafts.mjs` (le gate de publication) + les state files `seo/state/`
- Créer les tâches planifiées A3 et A4 (Phase 1)

**Toi seul :**
- Approuver les briefs et les drafts (le rôle d'éditeur que l'article insiste pour garder humain)
- `git push` (sandbox verrouillée) et déposer l'export GSC hebdo
- Cliquer « Run now » sur chaque tâche pour pré-approuver les outils
- Décider les caps et, plus tard, brancher un connecteur payant

**Nous deux, après les premiers runs :**
- Régler les seuils (quand un déclin compte, score minimal de qualité)
- Décider quels loops passent de « lecture seule » à « rédige en file »

## Coût — la discipline Ryze
Mesurer le **coût par changement accepté**, pas les tokens. Si tu jettes plus de la moitié de ce qu'un maker propose, le gate ou le brief est mauvais — on le corrige. Chaque loop a un cap de tokens et d'itérations ; les watchers tournent en modèle léger ; seul le checker A11 mérite un modèle strict.
