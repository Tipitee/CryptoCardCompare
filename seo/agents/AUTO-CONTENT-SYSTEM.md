# Système d'articles automatique (3×/semaine) — mode hybride
Décidé avec l'utilisateur : **refresh auto-publié / articles neufs en brouillon**. Rédaction en **Sonnet** (`claude-sonnet-4-6`).

## Pourquoi hybride et pas full-auto
Les deux guides (Ryze + 15 tactiques) sont formels : auto-publier du contenu à l'échelle est le n°1 des causes de démotion de tout un domaine. Le site est YMYL finance avec déjà 55 % de posts minces. Donc : le neuf passe par ton approbation ; seul le *refresh* de pages existantes (URL déjà établie, risque faible) publie en auto.

## Pipeline (`scripts/auto-article.mjs`)
```
Sujet (backlog ou refresh-queue)
  → rédaction FR premium (Sonnet, voix de marque + faits datés Supabase)
  → quality gate A11 (DUR : ≥500 mots, réponse en 100 mots, FAQ, lien interne, 1 H1)
  → localisation ADAPTÉE de/es/it/en (fiscalité/régulateur/dispo par marché, jamais traduire)
  → quality gate sur chaque langue
  → NEUF : insert published=false → notif → tu approuves
    REFRESH : update + published=true → sitemap + push (auto)
```

## Commandes (sur ta machine — réseau Anthropic+Supabase requis)
```
set -a && source .env && set +a
node scripts/auto-article.mjs --dry-run       # TESTER d'abord : génère+gate, n'insère rien
node scripts/auto-article.mjs                 # 1 article neuf → brouillons
node scripts/auto-article.mjs --mode refresh  # 1 refresh → auto-publié
node scripts/publish-drafts.mjs <slugs>       # approuver des brouillons neufs
```

## Cadence (launchd, lun/mer/ven 9h)
Voir `scripts/com.topcryptocards.autoarticle.plist`. Charger :
```
cp scripts/com.topcryptocards.autoarticle.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.topcryptocards.autoarticle.plist
```
Le Mac doit être allumé à 9h ces jours-là (launchd rattrape au réveil sinon).

## Backlog
`seo/state/article-backlog.csv` : colonnes keyword,title,category,status. Le script prend la 1re ligne `todo`, la passe à `done` après génération. Ajoute tes sujets ici (ou l'agent A8 /gap les propose).

## Coût
1 FR + jusqu'à 4 localisations × 3/sem ≈ 15 générations/semaine en Sonnet. Mesurer le **coût par article accepté** : si le gate en rejette >50 %, améliorer le backlog/prompt, pas empiler les runs. Baisser à 2×/sem si besoin.

## Garde-fous intégrés
1 sujet/run · quality gate DUR par langue (rejet = skip) · neuf toujours en brouillon · refresh seulement sur URL existante · la clé service reste locale (git-ignorée).
