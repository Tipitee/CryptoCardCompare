# File — briefs de contenu (A8)
Aucun run encore. La tâche A8 (vendredi 8h) ou le raccourci /gap remplit ce fichier.
Chaque brief approuvé → confié au maker A9 (Phase 3) → checker A11 → toi → publication.

## Briefs

---
### RUN 2026-07-23 (A8 /gap)

#### BRIEF 1 — Cartes crypto au Royaume-Uni (marché EN/UK) — NOUVELLE PAGE
- **Query cible / buyer query mappée** : "Which crypto cards work in the UK?" (en, commercial). Slug proposé : `/en/crypto-cards-uk`.
- **Anti-doublon** : aucune page UK-spécifique. `/en/crypto-cards-europe` traite l'Europe ; `en` = marché UK 🇬🇧 (CLAUDE.md) mais aucune page ne cible FCA/GBP → gap réel.
- **Intention** : commercial (choix de carte → clic affilié). Fit money page fort.
- **2× meilleur que le gagnant actuel** : les concurrents listent des cartes "Europe" génériques ; nous livrons un **tableau de disponibilité réelle UK** (statut d'enregistrement FCA cryptoasset, top-up en GBP, Apple/Google Pay UK) tiré de Supabase `cards` (filtre market=en), + note post-Brexit (cartes fermées aux résidents UK).
- **Outline (H2 = questions)** :
  - Which crypto cards are actually available in the UK in 2026?
  - Which UK crypto cards are FCA-registered?
  - Can I top up a crypto card in GBP (not just EUR)?
  - What's the best crypto card for UK cashback?
  - Which cards left the UK / don't accept UK residents?
- **Réponse clé (~100 mots)** : In 2026 the crypto cards that work for UK residents are those with an FCA cryptoasset registration and GBP top-up. Availability differs from the EU: some EU-only cards (SEPA/EUR IBAN) don't onboard UK users, so check the provider's country list before applying. For cashback, no-staking cards (e.g. Binance-style BNB rewards up to 8%) avoid locking tokens, while tiered cards (Crypto.com 0–5% in CRO) require staking. Prioritise cards with GBP loading, Apple/Google Pay UK support and a clear FCA status. Our UK availability table (Supabase, updated 2026-07-23) shows which cards accept UK residents and in what currency.
- **FAQ (3–5)** : Are crypto cards legal in the UK? · Do I pay UK tax when I spend crypto with a card? (link cluster) · Which crypto card has the best GBP cashback? · Does Crypto.com work in the UK in 2026? · Can I use a crypto card without a UK bank account?
- **Liens internes (≥1 money page)** : → `/en/best-crypto-card` (money), `/en/crypto-card-cashback` (money), `/en/reviews/crypto-com-card`, `/en/crypto-cards-europe` (parent), cluster tax UK (Brief 2).
- **Données Supabase à insérer (datées 2026-07-23)** : table cards filtrée market=en → colonnes : carte | accepte résidents UK (O/N) | top-up GBP (O/N) | cashback max | staking requis | FCA-registered. Vérifier chaque ligne contre `cards` avant publication.
- **Localisation 5 langues** : page **EN uniquement** (spécifique marché UK). NE PAS traduire en fr/de/es/it — hors marché. hreflang self `en-GB`. (Exception à la règle 5 langues : justifiée par la spécificité marché.)

#### BRIEF 2 — Krypto-Cashback & Karten-Steuer in Deutschland — NOUVELLE PAGE
- **Query cible / buyer query mappée** : "Muss ich Krypto-Cashback in Deutschland versteuern?" (de) + "Welche Krypto-Karte hat keine Jahresgebühr?" (proximité). Slug proposé : `/de/krypto-karte-steuern` (+ `/at/krypto-karte-steuern`).
- **Anti-doublon** : le seul post fiscal existant (`/de/blog/kryptokarten-steuern-in-frankreich-cashback`) porte sur la **France** traduite en DE — il NE répond PAS à la fiscalité allemande. Gap réel (règle A8 : une réponse FR ne couvre pas la query DE).
- **Intention** : informational, mais **détenue par les concurrents** (Koinly, Blockpit, CoinLedger rankent) et forte valeur E-E-A-T → alimente les money pages DE en confiance + maillage.
- **2× meilleur** : Koinly/Blockpit donnent la théorie générale (§23 EStG, règle 1 an, Freigrenze 256/1000 €) ; nous ajoutons des **exemples chiffrés carte par carte** avec les taux réels Supabase (cashback en CRO/BNB = "sonstige Einkünfte" reçu → base = cours du jour de réception ; puis §23 sur la revente). Angle unique : "cashback versé en token volatil" = double événement fiscal, illustré.
- **Outline (H2 = questions)** :
  - Ist Krypto-Cashback in Deutschland steuerpflichtig?
  - Wie wird Cashback in CRO/BNB besteuert (Zufluss vs. Veräußerung)?
  - Gilt die 1-Jahres-Frist und die Freigrenze von 256/1000 €?
  - Muss ich beim Bezahlen mit der Krypto-Karte Steuern zahlen?
  - Welche Anlage brauche ich (SO)?
- **Réponse clé (~100 Wörter)** : Krypto-Cashback gilt in Deutschland in der Regel als sonstige Einkünfte: maßgeblich ist der Marktwert des Tokens (z. B. CRO, BNB) im Moment des Zuflusses. Bis zur Freigrenze von 256 € pro Jahr bleibt es steuerfrei; darüber ist der volle Betrag zu versteuern. Verkaufst du den erhaltenen Token später, greift zusätzlich § 23 EStG: nach über 12 Monaten Haltedauer ist der Gewinn steuerfrei, sonst bis zur Freigrenze von 1.000 €. Auch das Bezahlen mit Krypto ist eine Veräußerung. Angaben erfolgen über die Anlage SO. Keine Steuerberatung — im Zweifel Fachperson fragen. (Stand 2026-07-23.)
- **FAQ (3–5)** : Ist Cashback in Fiat steuerfrei? · Was ist die Freigrenze 256 € vs. 1.000 €? · Zählt Bezahlen mit Krypto als Verkauf? · Welche Karten zahlen Cashback in Euro statt Token? · Gilt das auch in Österreich? (Hinweis: AT abweichend — 27,5 % KESt).
- **Liens internes (≥1 money page)** : → `/de/beste-krypto-karte` (money), `/de/krypto-karte-cashback` (money), `/de/krypto-karte-ohne-jahresgebuehr`, `/de/karten/bitpanda-card`.
- **Données Supabase (datées 2026-07-23)** : pour l'exemple chiffré, taux réels : Crypto.com 0–5 % CRO (staking), Binance 0,1–8 % BNB (sans staking), Bybit jusqu'à 10 % MNT. Ajouter colonne "cashback en token vs euro" depuis `cards`.
- **Localisation** : **DE + AT** (contenu allemand, filtre marché AT distinct — AT = 27,5 % KESt, PAS de règle 1 an → contenu adapté, pas copié). NE PAS étendre fr/es/it (chacun a sa propre fiscalité ; ne pas dupliquer). Disclaimer non-conseil fiscal obligatoire, auteur cité (E-E-A-T).

#### BRIEF 3 — Quelle carte crypto rembourse Netflix & Spotify — REFORMAT (page existante, mauvais format)
- **Query cible / buyer query mappée** : "Which crypto card gives cashback on Netflix and Spotify?" (en, commercial) + équivalents 5 langues.
- **Anti-doublon** : un slug existe déjà (`/en/blog/crypto-card-subscription-refunds-netflix-spotify-2025` + fr/de/es/it). **Pas de nouvelle page** → **refresh + changement de format** (Pass 3 : bon mot-clé, mauvais format + daté 2025).
- **Intention** : commercial (query "which card" → clic affilié) mais servie aujourd'hui par un post narratif informationnel daté 2025.
- **2× meilleur** : transformer le récit en **tableau comparatif des cartes qui remboursent les abonnements** (carte | Netflix | Spotify | Prime | palier requis | staking), tiré de nos données — que les concurrents n'ont pas de façon carte-par-carte. Donnée en main : Crypto.com rembourse Spotify (≤12,99 €/mois), Netflix (≤13,99 €/mois), Amazon Prime aux paliers supérieurs (staking CRO requis) ; comparer aux cartes sans remboursement d'abo.
- **Outline (H2 = questions)** :
  - Quelles cartes crypto remboursent Netflix et Spotify en 2026 ?
  - Faut-il staker pour débloquer le remboursement d'abonnements ?
  - Crypto.com vs alternatives : combien récupère-t-on vraiment ?
  - Le remboursement est-il versé en token (volatil) ?
- **Réponse clé (~100 mots)** : En 2026, le remboursement d'abonnements Netflix/Spotify reste surtout l'apanage des cartes à paliers avec staking : la Crypto.com Visa rembourse Spotify (jusqu'à 12,99 €/mois), Netflix (jusqu'à 13,99 €/mois) et Amazon Prime sur ses niveaux supérieurs, à condition de staker des CRO. Les cartes sans staking (type Binance, cashback BNB) offrent du cashback mais rarement le remboursement intégral d'abonnements. Le remboursement est versé en token, dont la valeur fluctue. Avant de choisir, comparez le palier requis, le montant de CRO à immobiliser et la valeur réelle récupérée. Notre tableau (données 2026-07-23) détaille carte par carte. 
- **FAQ (3–5)** : Quelles cartes remboursent Netflix ? · Faut-il staker ? · Le remboursement est-il en euros ou en token ? · Combien de CRO faut-il bloquer ? · Existe-t-il une carte sans staking qui rembourse les abos ?
- **Liens internes (≥1 money page)** : → `/fr/carte-crypto-cashback` (money), `/fr/meilleure-carte-crypto` (money), `/fr/avis/crypto-com-card`, `/fr/carte-crypto-recompenses`.
- **Données Supabase (datées 2026-07-23)** : Crypto.com Netflix ≤13,99 €, Spotify ≤12,99 €, Prime remboursé (paliers Ruby+/staking) ; vérifier montants et paliers actuels dans `cards`/`cardReviews` avant publi.
- **Localisation 5 langues** : fr/de/es/it/en — mettre à jour les 5 variantes existantes (même `topic_key`), retirer "2025" du slug/titre → 2026, ajouter le tableau. Adapter montants EUR/GBP par marché.

**→ Le brief n°1 à écrire cette semaine : BRIEF 1 — `/en/crypto-cards-uk` (commercial, aucune page UK, fit money page fort).**

