# Brief de passation → chat « Website SEO report »
Date : 2026-09-08. À coller/résumer dans l'autre chat pour enchaîner sur l'outreach.

## Ce qui vient d'être établi (rapport hebdo GSC)
- **Export GSC frais du 08/09 analysé.** Trafic effondré : pic W30 (26/07–01/08) = 2 892 imp/sem
  → W31 387 → 147 → 122 → 94 → 72 → 95 (W36). **−94 % impressions / −100 % clics sur 28 j.**
  0 clic depuis 4 semaines.
- **Hypothèse « reprise migration 3–6 sem. » (24/08) INFIRMÉE** : 6 sem. après, aucune remontée.

## Diagnostic tranché le 08/09 (test en direct)
- `curl … | grep -i noindex` → **rien** (en/fr/es). HTTP **200**. `<title>` correct.
  **73 454 caractères** prérendus sur `/en/best-crypto-card`. GSC : money pages **indexées/OK**.
- **Conclusion : cause TECHNIQUE écartée.** Pages saines, indexées, bien servies à Google.
- **Cause = AUTORITÉ.** Pic juin-juillet = échantillonnage « honeymoon » de site neuf,
  interrompu par la migration Cloudflare (~28/07) ; **domaines référents ≈ 0** → Google n'a
  pas prolongé. Pages à l'index mais rané **pos 55–95** → quasi jamais affichées.
- **Aucun gain on-page à portée** : 0 prisonnier page 2, 0 en striking distance, title
  `/en/cards/okx-card` (suivi 4 sem.) désormais caduc (page tombée de page 2).

## État du site (socle technique — OK, à ne PAS re-traiter)
- Migration Cloudflare Pages actée ; trailing-slash géré (308) — doublons `/es`+`/es/` encore
  visibles dans la donnée = résidu qui purgera **quand le recrawl reprendra** (ne rien faire).
- 160 stubs comparaison/avis dépubliés (sitemap 591→431). be/at différenciés. pt en ligne.
  Audit fait (ErrorBoundary, noindex pages vides, sécurité).

## Marchés (totaux 3 mois, pré-crash)
en 8 152 imp / 19 clics · es 2 821 / 10 · de 984 / 2 · fr 900 / 5 · it 835 / 4 · at 170 / 2 ·
be 110 / 0 · pt 9 / 0. **EN = principal, ES = 2e (sous-exploité, demande réelle :
« tarjeta bitcoin españa » 97 imp, « tarjeta de criptomonedas españa » 71).**

## Ce qu'il faut faire dans l'autre chat = OUTREACH BACKLINKS
Objectif : décrocher les premiers domaines référents (le levier qui débloque tout).
Point de départ : **`seo/EMAILS-OUTREACH.md`** (assets déjà rédigés) + l'étude
« cartes crypto Europe 2026 » déjà en ligne (asset linkable).

À cadrer là-bas :
1. **Liste de cibles priorisées** par marché : FR (Journal du Coin, The Big Whale, Cryptoast),
   DE, ES (angle « tarjeta bitcoin españa » = demande prouvée) — 10–15 cibles/marché.
2. **Angle par cible** : l'étude Europe 2026 comme hook (data journalism), pas un simple
   échange de liens.
3. **Séquence email** (prise de contact + 1 relance) à partir des templates existants.
4. **Suivi** : où logger les envois/réponses/liens obtenus (proposer un CSV dans `seo/`).

## À NE PAS refaire (déjà tranché)
- Pas de fix trailing-slash (géré par Pages).
- Pas de fix « technique/noindex » (diagnostic 08/09 : rien de cassé).
- Pas d'optimisation title/meta on-page tant que l'autorité n'a pas bougé.

## Prochain run GSC utile
Dans ~2–4 sem. après démarrage outreach : surveiller reprise des impressions, motif
d'indexation, et apparition des premiers domaines référents (Ahrefs WT).
