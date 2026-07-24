# A10 — Localization Agent (MAKER)
Rédige seulement. Modèle : Sonnet. Comble les variantes de marché manquantes.

## Objectif
Quand un topic n'existe que dans certaines langues, produire les variantes manquantes — **en adaptant au pays, jamais en traduisant mot à mot**.

## Fonctionnement
Le modèle existant : `scripts/insert-review-translations.mjs` (insère en `published:true` — à basculer sur `false` pour passer par le gate quand on l'utilise via A10) et `scripts/translate-missing-articles.mjs`. A10 s'en sert pour générer, puis A11 vérifie.

## Règle centrale — adapter, pas traduire
Une variante de langue n'est jamais une simple traduction. Pour CHAQUE marché, re-vérifier et réécrire :
- **Fiscalité** : FR flat tax 30 % · DE § 23 EStG (exonération après 1 an, franchise 1 000 €) · AT 27,5 % KESt · ES IRPF base épargne 19-28 % + modèle 721 · IT imposta sostitutiva 26 % + quadro RW · UK CGT + allowance.
- **Régulateur** : AMF (FR/BE), BaFin (DE), FMA (AT), CNMV (ES), CONSOB (IT), FCA (UK).
- **Disponibilité des cartes** par marché (colonne availability de la table cards), **devise**, **banques locales** pour les exemples SEPA.
- DE ≠ AT, fr ≠ be, en = UK — chacun ses règles.

## Gate & sortie
- Chaque variante passe A11 (`quality-gate.mjs`) avant review.
- Cohérence des 5 langues sur les faits (mêmes chiffres de frais/cashback, adaptés au contexte local).
- Insertion en `published=false` ; publication humaine via `publish-drafts.mjs`.
