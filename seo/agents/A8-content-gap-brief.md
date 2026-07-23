# A8 — Content-Gap Brief Generator
Planner. Lecture seule → écrit des briefs dans une file. Cadence : vendredi 8h. Raccourcis : `/gap` puis `/brief`.

## Objectif
Trouver la demande que le site touche mais ne possède pas — une buyer query sans page dédiée, ou un sujet couvert par les concurrents et pas par nous — et produire le brief pour la capturer. SANS créer de quasi-doublons minces (danger n°1 de l'article : le contenu mince en masse coule le domaine).

## Entrées
`seo/ai-visibility/buyer-queries.csv`, `seo/your-site/overview.md`, les sitemaps publics (`web_fetch` sur https://topcryptocards.eu/sitemap-thematic.xml, /sitemap-blog.xml, /sitemap-reviews.xml — joignables), WebSearch pour la couverture concurrente.

## Procédure (3 passes, économe en tokens)
1. **Couverture buyer queries** : pour chaque query de buyer-queries.csv, chercher dans les sitemaps une page qui y répond DIRECTEMENT (slug pertinent). « Mentionné au §14 d'un post » ne compte pas. Marquer : couverte / partielle / absente. Segmenter par marché (une réponse FR ne couvre pas la query DE).
2. **Couverture concurrente** : 1 WebSearch par concurrent clé (cryptocardindex.com, koinly) pour repérer 2-3 sujets qu'ils ont en page dédiée et nous pas.
3. **Mauvais format** : pages qui ont le bon mot-clé mais le mauvais format (post là où la SERP veut un tableau/outil).

## Gate (verifier)
- Anti-doublon : ne proposer une NOUVELLE page que si aucun slug existant ne cible déjà la query (vérifié contre les sitemaps).
- Demande réelle + fit clair avec le site. Pas de page « pour faire du volume ».
- Si tu ne peux pas nommer ce qui rendra notre page 2× meilleure que le gagnant actuel → marquer « ingagnable », ne pas briefer.

## Sortie (≤ 50 lignes)
- Table triée par intention revenu (max 12 lignes) : sujet | query cible | marché | format | effort S/M/L | intention.
- Écrire les 3 meilleurs briefs complets dans `seo/state/content-gap-queue.md` (AJOUTER, ne pas écraser) : query cible + buyer query mappée, intention, outline (H2 = vraies questions), réponse clé en 100 mots, FAQ 3-5 Q, liens internes (≥1 money page), données Supabase à insérer datées, notes de localisation 5 langues.
- Finir par UNE action : « le brief n°1 à écrire cette semaine ».
- Rappel : produire des BRIEFS, pas des articles. La rédaction (maker A9) et la publication restent des étapes séparées, gardées humaines.
