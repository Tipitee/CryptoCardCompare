# AI Perception Check — 2026-10-19

Méthode : requêtes réelles non-marque (EN/FR/DE) + requête de marque, via recherche web (proxy ChatGPT/Perplexity, qui s'appuient massivement sur le web). Comparé à `your-site/brand-voice.md`.

## Requêtes non-marque (intention d'achat)
| Requête | Qui gagne la citation | Nous ? |
|---|---|---|
| best crypto card Europe 2026 | jeangalea.com, bleap.finance (vendor, multilingue), datawallet | **Absent** |
| meilleure carte crypto 2026 cashback | cryptoast.fr, datawallet/fr, journaldugeek, presse-citron | **Absent** |
| beste Krypto Kreditkarte 2026 | datawallet/de, bankinggeek.de, finanzwissen.de, cryptoticker.io | **Absent** |

## Requête de marque
- « topcryptocards.eu avis » → **aucun résultat** : zéro avis, zéro mention tierce, Trustpilot vide. Le site se classe #1 sur son nom (cf. sept.) mais rien ne le corrobore de l'extérieur.

## Verdict
Invisible sur toutes les requêtes non-marque. Cause = **autorité externe / mentions ≈ 0** (confirme le diagnostic 2026-09-08). Les corrections on-site d'octobre (cohérence 80+, dates dynamiques, fiches honnêtes sur 5 langues) étaient nécessaires — un LLM qui tombe sur le site n'a plus d'incohérence à reprocher (c'était le reproche de ChatGPT) — mais ne créent pas de visibilité.

## Pattern des pages gagnantes
Listicles « best of » multilingues (datawallet, bleap) + médias crypto établis (cryptoast, BTC-ECHO adjacents) + présence Reddit/forums. Ils gagnent par **notoriété de domaine**, pas par qualité de comparatif.

## Corrections appliquées ce run (on-site)
- Phrase-étalon brand-voice ajoutée **verbatim** dans le schema Organization de la home (description + slogan), localisée 6 langues, compte « 80+ » cohérent, + `areaServed` 8 marchés et `knowsAbout`. Objectif : fixer la description d'entité que les LLM reprennent sur requête de marque, et verrouiller la catégorie « comparateur indépendant ».

## UNE action < 4 h (prochaine)
Créer + réclamer le profil **Trustpilot** de topcryptocards.eu (actuellement vide) et obtenir 3-5 premiers avis authentiques. Les LLM lisent Trustpilot ; une fiche vide = signal d'absence. Puis enchaîner l'outreach presse (`EMAILS-OUTREACH.md`, séquence J0/J2/J4).
