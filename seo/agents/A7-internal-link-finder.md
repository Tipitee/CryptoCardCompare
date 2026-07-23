# A7 — Internal-Link Finder
Planner. Écrit une FILE d'attente, ne modifie jamais la base ni le site. Raccourci : `/links`.
Cadence conseillée : hebdo, lancé à la main (dépend de Supabase → ta machine).

## Objectif
Récupérer l'équité de lien déjà présente sur le site : chaque money page doit être liée depuis les posts qui parlent du sujet mais ne lient pas encore. C'est le levier le plus sous-utilisé (article Ryze, loop 04).

## Gate (verifier)
Un lien n'est proposé que si : (1) le post mentionne réellement la marque/sujet, (2) il ne lie PAS déjà la fiche cible (slug absent du contenu), (3) même langue. Pas d'ancre sur-optimisée, pas de doublon.

## Procédure
1. `set -a && source .env && set +a && node scripts/internal-link-finder.mjs` (depuis ta machine — réseau Supabase requis).
2. Le script écrit `seo/state/internal-link-queue.md` : une case à cocher par opportunité (post source → fiche cible + ancre naturelle).
3. TU approuves les lignes utiles. L'ajout du lien reste manuel (ou confié plus tard au maker A9) — l'AutoLinker gère déjà beaucoup de marques, donc vérifier que le lien n'existe pas déjà en rendu.
4. Cap : ~10 liens/semaine max pour rester naturel.

## Pourquoi pas une tâche planifiée auto
Supabase n'est pas joignable depuis le bac à sable des tâches planifiées. A7 se lance donc depuis ton terminal (ou tu me demandes de le lancer et je te donne la commande). Si tu branches un jour Ahrefs/Semrush, on pourra l'automatiser.
