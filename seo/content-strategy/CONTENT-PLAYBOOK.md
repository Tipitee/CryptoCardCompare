# Playbook contenu TopCryptoCards — écrire du contenu qui rank (YMYL crypto/finance)
Synthèse des meilleures pratiques (Google Helpful Content, E-E-A-T, guides des top spécialistes SEO 2026) appliquée à notre niche : cartes crypto, 7 marchés. À suivre pour CHAQUE page (rédaction manuelle ou maker A9).

---

## 0. Le principe qui prime sur tout
Google et les LLM récompensent le contenu **qui répond mieux que la page qui gagne déjà**. Avant d'écrire, on répond à UNE question : « qu'est-ce qui rend notre page 2× meilleure que le n°1 actuel ? » Si on ne peut pas le nommer (donnée exclusive, fraîcheur, test réel, structure supérieure), on ne l'écrit pas — on approfondit une page existante à la place.

Notre avantage structurel unique = **la base de 90+ cartes × 7 marchés, à jour**. On gagne sur : fraîcheur vérifiable, disponibilité par pays, frais réels datés, neutralité (vs blogs de vendors). Chaque page doit exploiter ça.

---

## 1. Ce qui rank dans cette niche (analyse SERP)
Sur « meilleure carte crypto », « [carte] avis », « [A] vs [B] », les gagnants (Journal du Coin, Cryptonaute, Koinly, cryptocardindex) ont tous :
- Un **tableau comparatif** en haut (cashback, frais, staking, dispo) — la donnée scannable d'abord.
- Une **réponse directe dès l'intro** (« la meilleure carte X en 2026 est Y parce que Z »).
- Des **fiches par carte** structurées identiquement (comparables).
- Une section **critères de choix** (comment décider selon son profil).
- Une section **fiscalité** du pays (YMYL finance = Google veut la nuance légale).
- Une **FAQ** (long-tail + AI Overviews).
- Des **signaux de confiance** : auteur, date de test, méthodologie, divulgation affiliée.

Ce qu'ils font MAL et où on gagne : données souvent périmées entre deux mises à jour manuelles, mono-langue, pas de dispo par marché. → Nous : « vérifié [mois 2026] », 7 marchés, filtre pays.

---

## 2. Structure gagnante par type de page

### Money page « meilleure carte [thème/pays] »
1. **H1** = requête exacte (ex. « Meilleure carte crypto en France 2026 »).
2. **Réponse directe (100 premiers mots)** avec le verdict + 1 chiffre concret + date de vérif.
3. **Tableau comparatif top 5–10** (cashback réel, frais annuels, staking, dispo pays, IBAN).
4. **Top 3 en détail** : pour qui / pas pour qui, chiffres, 1 phrase de verdict.
5. **Comment choisir** (critères par profil : voyageur, débutant, gros dépensier…).
6. **Frais & fiscalité du marché** (adapté au pays — voir §4).
7. **FAQ** (5 questions issues des vraies recherches).
8. **Méthodologie + divulgation affiliée** (E-E-A-T).
9. Liens internes : fiches cartes citées + 2–3 pages sœurs.

### Review « [carte] avis »
1. H1 « [Carte] : avis et test 2026 ».
2. Verdict + note /5 + « pour qui » en 100 mots.
3. **Encadré faits clés** (émission, frais FX, cashback base/premium, staking requis, dispo, IBAN, licence) — tableau datant les chiffres.
4. Cashback en détail (paliers, conditions réelles, calcul d'un exemple chiffré).
5. Frais réels (émission, recharge, retrait ATM, change) — le poste qui tue la rentabilité.
6. **Preuve de première main** : capture d'un paiement test, frais constatés, photo de la carte.
7. Avantages / limites (honnête : dire pour qui ce n'est PAS adapté).
8. Alternatives (2–3, avec lien vers les comparatifs).
9. FAQ + méthodologie + divulgation.

### Comparaison « [A] vs [B] »
Tableau côte à côte sur critères d'acheteur → verdict par profil → FAQ. (Déjà en place, 7 marchés.)

---

## 3. Les règles de rédaction (vérifiées par le quality gate A11)
- **Réponse dans les 100 premiers mots**, avec une donnée chiffrée. Zéro échauffement (« dans le monde de la crypto… » = banni).
- **H2 = vraies questions** que tapent les acheteurs.
- **Longueur** : money page 1 200–1 800 mots ; review 1 000–1 500. Jamais de remplissage — la longueur suit la profondeur, pas l'inverse.
- **Chiffres datés** : tout frais/cashback porte « vérifié [mois] 2026 » et vient de Supabase.
- **≥ 1 lien interne** vers une money page + fiches citées.
- **Honnêteté** : nommer les faiblesses. Honnête = citable par les IA ET convertit mieux.
- **Pas de conseil financier personnalisé** (YMYL) ; formuler « selon votre profil ».
- Voix : analyste qui a testé, phrases courtes, exemples concrets. Voir `seo/your-site/brand-voice.md`.

---

## 4. Adaptation pays (jamais traduire) — notre différenciateur
Chaque variante de marché doit contenir des infos propres à CE pays :
- **Fiscalité** : FR flat tax 30 % (PFU) · BE régime plus-values/revenus divers (pas de flat tax FR) · DE §23 EStG (exonéré après 1 an, franchise 1 000 €) · AT 27,5 % KESt · ES IRPF épargne 19–28 % + modèle 721 · IT imposta sostitutiva 26 % + quadro RW · UK CGT + allowance.
- **Régulateur** : AMF/ACPR (FR), FSMA (BE), BaFin (DE), FMA (AT), CNMV (ES), CONSOB/OAM (IT), FCA (UK).
- **Disponibilité réelle des cartes** (colonne availability), **devise**, **banques locales** pour les exemples SEPA.
- DE ≠ AT, fr ≠ be, en = UK. Une variante n'est jamais une simple traduction.

---

## 5. GEO / IA (être cité par ChatGPT, Perplexity, Google AIO)
- **Bloc « Faits clés »** en `<table>` daté en haut de chaque review/thématique — c'est ce que les LLM extraient.
- **Phrase-réponse** en ouverture (format snippet).
- **FAQ** = format Q/R que les IA adorent (query fan-out).
- Ancres stables (`#frais`, `#cashback`) pour des citations propres.
- Schema : FinancialProduct + FAQPage + BreadcrumbList (reviews), Article + Person (blog). Déjà en place — le garder à jour.

---

## 6. Processus (du sujet à la publication)
1. **Priorisation par données** : GSC (prisonniers page 2, requêtes à impressions) + gap concurrentiel (A8) → 1 cible. Sans GSC : SERP + buyer-queries + dispo/gaps.
2. **Brief** (`content-briefs.md`) : requête, intention, angle 2×-meilleur, outline, données Supabase à insérer, notes localisation.
3. **Rédaction** FR premium → quality gate A11 → localisation adaptée 5 langues → gate.
4. **Revue humaine** → publication (`publish-drafts.mjs`).
5. **Refresh** : re-daté tous les 3–6 mois (tactique n°1 : le refresh bat la page neuve quand l'URL a de l'autorité).

---

## 7. Erreurs à ne jamais commettre (elles coulent le domaine)
- Publier en masse du contenu mince/quasi-dupliqué (Helpful Content → démotion de TOUT le domaine).
- Changer la date sans vraie mise à jour de fond.
- Chiffres non sourcés / périmés sur du YMYL.
- Cannibalisation : deux pages sur la même requête → fusionner ou différencier l'intention.
- Traduire au lieu d'adapter par pays.

> Mesure de succès : **coût par page acceptée** (si > 50 % des drafts échouent au gate, le brief est mauvais) et positions GSC des pages travaillées (objectif : prisonniers page 2 → top 5 en 4–8 semaines).
