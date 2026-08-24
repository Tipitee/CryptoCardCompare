# Plan de demande d'indexation, Search Console

Objectif : forcer Google à recrawler en priorité les pages déjà proches de la page 1,
pour que la reprise post-migration se traduise en clics le plus vite possible.
Base : export GSC Performance du 2026-08-23 (74 jours).

Méthode dans Search Console : barre de recherche en haut (Inspection d'URL) →
coller l'URL → "Demander une indexation". Quota d'environ 10 à 12 par jour.
Étaler ce lot sur 2 ou 3 jours si le quota bloque. Toujours l'URL sans slash final.

## Lot 1, cette semaine (les 12 pages les plus rentables)

Priorité haute, position sous 12, un petit gain les fait basculer en page 1 :

1. https://topcryptocards.eu/en/cards/okx-card            (pos 12,0 · 137 impressions)
2. https://topcryptocards.eu/it/carte/brighty-card        (pos 6,8 · 50)
3. https://topcryptocards.eu/en/reviews/kraken-card       (pos 10,7 · 38)
4. https://topcryptocards.eu/fr/cartes/kraken-krak-card   (pos 9,5 · 31)
5. https://topcryptocards.eu/en/crypto-card-no-staking    (pos 8,6 · 29)
6. https://topcryptocards.eu/en/cards/bitrefill-card      (pos 12,0 · 30)

Priorité forte, position 12 à 16, grosse réserve d'impressions :

7.  https://topcryptocards.eu/en/cards/deblock-card             (pos 14,4 · 87)
8.  https://topcryptocards.eu/es/tarjetas/kraken-krak-card      (pos 14,0 · 66)
9.  https://topcryptocards.eu/en/cards/crypto-com-royal-indigo  (pos 15,0 · 53)
10. https://topcryptocards.eu/en/cards/kucard                   (pos 15,6 · 31)
11. https://topcryptocards.eu/it/carte/gnosis-pay-card          (pos 12,6 · 28)
12. https://topcryptocards.eu/es/tarjeta-crypto-austria         (pos 14,2 · 32)

## Lot 2, la semaine suivante (position 16 à 30)

À demander une fois le lot 1 traité :

- https://topcryptocards.eu/en/cards/plutus-card          (pos 29,2 · 118)
- https://topcryptocards.eu/en/cards/kast-card            (pos 29,0 · 118)
- https://topcryptocards.eu/fr/cartes/gnosis-pay-card     (pos 16,6 · 20)
- https://topcryptocards.eu/en/reviews                    (pos 16,5 · 17)
- https://topcryptocards.eu/it/carte/kraken-krak-card     (pos 13,5 · 28)
- https://topcryptocards.eu/fr/carte-crypto-cashback      (pos 25,3 · 47)
- https://topcryptocards.eu/fr/cartes/binance-standard    (pos 32,7 · 61)
- https://topcryptocards.eu/en/cards/binance-standard     (pos 43,2 · 164)

## Suivi Search Console, chaque semaine

1. Performance → filtrer sur ces URLs, surveiller la position moyenne et les clics.
   Le but : voir la position passer sous 10, puis les premiers clics arriver.
2. Indexation des pages → suivre le nombre d'indexées (976 au 24 août) et la baisse
   du bloc "Découverte, non indexée" (1041 au 24 août).
3. Not found (404) → cliquer "Valider la correction" une fois le déploiement en ligne,
   pour que Google recrawle les URLs qu'on vient de réparer.
4. Réglages → Statistiques d'exploration → vérifier que les requêtes de Googlebot
   remontent après le 28 juillet.

## Rappel

Le recrawl aide les pages déjà bien placées à basculer. Il ne remplace pas l'autorité.
Les pages d'accueil et les gros thématiques restent en position 60 à 90, ils ne
bougeront qu'avec des backlinks. Le recrawl, c'est la vitesse ; les liens, c'est le plafond.
