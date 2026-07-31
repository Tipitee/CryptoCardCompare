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
- **Localisation — ADAPTER, jamais traduire** : **DE + AT** = deux pages distinctes avec un droit fiscal différent, PAS une traduction :
  - **DE** : § 23 EStG, règle de détention 1 an (revente exonérée), Freigrenze 256 € (sonstige Einkünfte) / 1 000 € (§23), déclaration Anlage SO, référence BMF-Schreiben.
  - **AT** : régime totalement différent — 27,5 % KESt (Sondersteuersatz), PAS de règle 1 an depuis la réforme 2022, notion de « Neuvermögen », retenue par la plateforme. Ne JAMAIS réutiliser les chiffres DE.
  - NE PAS étendre à fr/es/it depuis ce brief (chaque pays a sa fiscalité propre — voir ci-dessous). Disclaimer non-conseil fiscal + auteur cité (E-E-A-T) sur chaque version.

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
- **Localisation 5 langues — ADAPTER, jamais traduire** : mettre à jour les 5 variantes (même `topic_key`), retirer "2025" → 2026, ajouter le tableau. Chaque marché doit avoir des infos qui lui sont propres, pas une traduction du montant :
  - **en (UK)** : montants en **£** (Netflix UK, Spotify UK au tarif GBP), disponibilité UK de la carte (résidents acceptés), mention statut FCA.
  - **fr / be** : montants € au tarif FR/BE, préciser la disponibilité Belgique (marché be distinct — cartes réellement ouvertes aux résidents belges).
  - **de / at** : montants € au tarif DE/AT, disponibilité Autriche vérifiée séparément ; note sur le remboursement en token = événement fiscal (cf. Brief 2, règles DE ≠ AT).
  - **es / it** : tarifs abonnements locaux (Netflix/Spotify ES et IT diffèrent), cartes réellement disponibles sur chaque marché depuis Supabase `cards`.
  - Règle générale : disponibilité de la carte, devise, tarif d'abonnement et note fiscale = TOUJOURS revérifiés par pays, jamais recopiés d'une langue à l'autre.

**→ Le brief n°1 à écrire cette semaine : BRIEF 1 — `/en/crypto-cards-uk` (commercial, aucune page UK, fit money page fort).**


---
### RUN 2026-07-24 (A8 /gap)

**Constat Pass 1 (couverture buyer-queries)** : les 25 buyer queries sont **quasi toutes couvertes** par une page dédiée pertinente (thématiques × 7 marchés, reviews × 25 cartes × 7 marchés, compare A-vs-B, brands, alternatives × 16 marques, IBAN, sans-KYC, voyage, débutant, virtuelle/physique, calculateurs). Aucun gap **commercial/transactionnel** neuf : l'espace commercial est saturé. Les seuls trous réels restants sont **informationnels (fiscalité)** — territoire détenu par les concurrents (Koinly, Blockpit) et à forte valeur E-E-A-T qui alimente les money pages. Pass 2 confirme : Koinly possède des pages dédiées « crypto debit card taxes » et « spending crypto = disposal (CGT) » que nous n'avons PAS par marché ; nos seules pages fiscales portent sur la **France** (traduite en de/en/es), donc EN/UK, ES et IT n'ont **aucune** page fiscale propre. cryptocardindex.com/CardScan mise sur un **tableau filtrable par frais/KYC/cashback** — déjà couvert chez nous (Compare + `/xx/crypto-card-fees` + calculateurs), pas un gap.

| # | Sujet | Query cible | Marché | Format | Effort | Intention |
|---|-------|-------------|--------|--------|--------|-----------|
| 1 | Fiscalité carte crypto UK (spend + cashback) | Do I pay UK tax when I spend crypto with a card? | en/UK | Page-guide + FAQ | M | info (cluster→commercial UK) |
| 2 | Fiscalidad tarjeta cripto España | ¿Los cashbacks cripto tributan en España? | es | Page-guide + FAQ | M | informational |
| 3 | Tasse carte crypto Italia | Le carte crypto sono tassate in Italia? | it | Page-guide + FAQ | M | informational |
| — | Meilleure carte / cashback / sans-staking / IBAN / débutant / voyage / sans-KYC | (10 queries commerciales) | tous | thématique | — | **COUVERTE** |
| — | Crypto.com vaut le coup / Bitpanda / Nexo conviene | (transactionnel) | fr/de/es/it | review | — | **COUVERTE** |
| — | Crypto.com ou Nexo | comparatif A-vs-B | tous | compare | — | **COUVERTE** |
| — | Alternatives Binance en Europe | binance card alternatives | tous | alternatives | — | **COUVERTE** |
| — | Disponible en Belgique / Autriche | (dispo pays) | be/at | thématique pays | — | **COUVERTE** |
| — | Cashbacks imposables en France | fiscalité cashback FR | fr | blog + §thématique | — | **COUVERTE** |
| — | Krypto-Cashback versteuern DE/AT | fiscalité DE/AT | de/at | (briefé RUN 07-23) | — | EN FILE |
| — | Netflix/Spotify reformat | which card refunds subs | en+5 | (briefé RUN 07-23) | — | EN FILE |

#### BRIEF 1 — Fiscalité des cartes crypto au Royaume-Uni (dépense + cashback) — NOUVELLE PAGE
- **Query cible / buyer query mappée** : "Do I pay UK tax when I spend crypto with a card?" + "Is crypto card cashback taxable in the UK?" (en, informational). Slug proposé : `/en/crypto-card-tax-uk`.
- **Anti-doublon** : aucune page fiscale UK. La seule page fiscale EN (`/en/blog/taxation-of-crypto-cards-in-france...`) porte sur la **France** — hors sujet pour un résident UK (règle A8 : une réponse FR ne couvre pas la query UK). Gap réel. Comble aussi la FAQ « Do I pay UK tax when I spend crypto with a card? » identifiée comme cluster dans le BRIEF 1 du RUN 07-23 (page UK cards).
- **Intention** : informational, mais **détenue par Koinly** (page « crypto debit card taxes » rank) + forte valeur E-E-A-T → nourrit la confiance des money pages EN/UK et le maillage vers la page UK cards.
- **2× meilleur que le gagnant actuel** : Koinly donne la théorie HMRC générique (spending = disposal = CGT ; cashback ≈ rebate/misc income) ; nous ajoutons **l'angle carte-par-carte** avec nos données Supabase : chaque paiement en crypto via la carte = *disposal* soumis à la CGT (allowance annuelle réduite), et le **cashback versé en token volatil** = double événement (revenu à réception + CGT à la revente). Illustration chiffrée en £ avec les taux réels de nos cartes. Personne ne relie la mécanique fiscale à la carte précise.
- **Outline (H2 = questions)** :
  - Do I pay tax when I spend crypto with a card in the UK?
  - Is crypto card cashback taxable in the UK?
  - How does the Capital Gains Tax allowance apply to card spending?
  - Cashback paid in a volatile token: two taxable events explained
  - Which records do I need to keep (and which cards make it easier)?
- **Réponse clé (~100 mots)** : In the UK, spending crypto with a card is a disposal, so HMRC may charge Capital Gains Tax on any gain between what you paid for the coin and its value when you spend it — the annual CGT allowance is small, so frequent spenders can exceed it fast. Card cashback is different: rewards paid in crypto are generally treated as income at the market value on the day you receive them, then any later rise is a separate capital gain when you sell or spend them. Cards that pay cashback in a stablecoin (or let you cash out to GBP) simplify record-keeping. This is general information, not tax advice — confirm your position with an adviser or HMRC. (Data 2026-07-24.)
- **FAQ (3–5)** : Is spending crypto with a card a taxable event in the UK? · Is crypto cashback taxed as income or capital gain? · Does the CGT allowance cover everyday card spending? · Do stablecoin-cashback cards reduce my tax admin? · Do I report this on Self Assessment? (verify current allowance/rates at publish — HMRC figures change each tax year).
- **Liens internes (≥1 money page)** : → `/en/best-crypto-card` (money), `/en/crypto-card-cashback` (money), `/en/crypto-cards-uk` (page UK cards, RUN 07-23), `/en/reviews/crypto-com-card`.
- **Données Supabase à insérer (datées 2026-07-24, à revérifier dans `cards` avant publi)** : pour l'exemple chiffré, cashback versé en token vs stable : Crypto.com 0–8 % en CRO (staking), Binance BNB (sans staking), Nexo 2 % en BTC/NEXO, Brighty 1,75 % en USDC (stable = admin fiscale simplifiée). Ajouter colonne « cashback token vs stablecoin ».
- **Localisation — ADAPTER, jamais traduire** : page **EN/UK uniquement** (droit HMRC spécifique). Ne PAS traduire vers fr/de/es/it — chaque pays a sa fiscalité (voir briefs 2 & 3, et RUN 07-23 DE/AT). hreflang self `en-GB`. À revérifier au moment de la publication : montant de la CGT allowance de l'année fiscale en cours, taux CGT, seuils Self Assessment. Disclaimer non-conseil fiscal + auteur cité (E-E-A-T).

#### BRIEF 2 — Fiscalidad de las tarjetas cripto en España — NOUVELLE PAGE
- **Query cible / buyer query mappée** : "¿Los cashbacks cripto tributan en España?" / "¿Pago impuestos al pagar con tarjeta cripto?" (es, informational). Slug proposé : `/es/fiscalidad-tarjeta-cripto-espana`.
- **Anti-doublon** : aucune page fiscale espagnole. La seule page ES fiscale (`/es/blog/fiscalidad-de-las-tarjetas-cripto-en-francia...`) porte sur la **France** traduite — ne répond PAS à la fiscalité espagnole. Gap réel.
- **Intention** : informational, territoire Koinly/Blockpit → E-E-A-T qui alimente les money pages ES.
- **2× meilleur** : théorie générale AEAT chez les concurrents ; nous ajoutons **l'exemple carte-par-carte** avec taux Supabase : pagar con cripto = *permuta/transmisión* → **ganancia patrimonial** en base del ahorro (tramos 19 %–28 %) ; cashback en token = ganancia a integrar, con doble evento a la reventa. Mención Modelo 100 y Modelo 721 (declaración de criptos en el extranjero) que los guías genéricas no ligan a la tarjeta concreta.
- **Outline (H2 = questions)** :
  - ¿Pago impuestos al pagar con una tarjeta cripto en España?
  - ¿El cashback en cripto tributa en el IRPF?
  - ¿Cómo se calcula la ganancia patrimonial (tramos del ahorro)?
  - Cashback en token volátil: los dos momentos fiscales
  - ¿Modelo 100, Modelo 721? Qué declarar y cuándo
- **Réponse clé (~100 palabras)** : En España, pagar con una tarjeta cripto se considera una transmisión de criptomonedas: la diferencia entre el valor de adquisición y el valor al gastarla es una ganancia (o pérdida) patrimonial que tributa en la base del ahorro del IRPF, por tramos (aproximadamente 19 %–28 % según el importe). El cashback recibido en cripto se valora a precio de mercado el día que lo recibes y, al venderlo o gastarlo después, genera una segunda ganancia patrimonial. Puede aplicar el Modelo 721 si tienes criptos en plataformas extranjeras por encima del umbral. Las tarjetas que pagan cashback en stablecoin simplifican el cálculo. Información general, no asesoramiento fiscal. (Datos 2026-07-24.)
- **FAQ (3–5)** : ¿Pagar con cripto genera ganancia patrimonial? · ¿El cashback tributa aunque no lo venda? · ¿Qué tramos del ahorro se aplican? · ¿Debo presentar el Modelo 721? · ¿Qué tarjetas pagan cashback en euros/stablecoin? (verificar tramos y umbrales AEAT vigentes antes de publicar).
- **Liens internes (≥1 money page)** : → `/es/mejor-tarjeta-cripto` (money), `/es/tarjeta-cripto-cashback` (money), `/es/tarjetas-crypto-espana`, `/es/opiniones/crypto-com-card`.
- **Données Supabase (datées 2026-07-24)** : mêmes taux que Brief 1 (Crypto.com CRO, Nexo BTC, Brighty USDC…) pour l'exemple chiffré en € ; ajouter colonne cashback token vs stablecoin ; revérifier dans `cards`.
- **Localisation — ADAPTER, jamais traduire** : page **ES uniquement** (droit AEAT). Ne PAS réutiliser les chiffres FR/DE/UK/IT. À revérifier au publish : tramos base del ahorro en vigueur, umbral Modelo 721, tratamiento del cashback. Disclaimer non-conseil fiscal + auteur cité. NB : Belgique (be) a SA propre fiscalité — ne pas confondre avec ES.

#### BRIEF 3 — Tassazione delle carte crypto in Italia — NOUVELLE PAGE
- **Query cible / buyer query mappée** : "Le carte crypto sono tassate in Italia?" / "Il cashback cripto è tassato in Italia?" (it, informational). Slug proposé : `/it/tasse-carte-crypto-italia`.
- **Anti-doublon** : aucune page fiscale italienne (pas même une traduction FR côté it). Gap réel et total.
- **Intention** : informational, territoire Koinly → E-E-A-T qui alimente les money pages IT.
- **2× meilleur** : théorie générale (imposta sostitutiva sulle plusvalenze cripto, quadro RW/RT) chez les concurrents ; nous lions à la **carte** : pagare in cripto = realizzo di plusvalenza ; cashback in token = componente da valorizzare al ricevimento + secondo evento alla vendita. Esempio numerico con i tassi reali Supabase, in €.
- **Outline (H2 = questions)** :
  - Pagare con una carta crypto in Italia è tassato?
  - Il cashback in cripto è una plusvalenza tassabile?
  - Come si calcola l'imposta sostitutiva sulle cripto?
  - Cashback in token volatile: i due momenti fiscali
  - Quadro RW / RT: cosa dichiarare
- **Réponse clé (~100 parole)** : In Italia, pagare con una carta crypto è un realizzo: la differenza tra il valore di acquisto e il valore al momento della spesa è una plusvalenza soggetta a imposta sostitutiva sulle cripto-attività. Il cashback ricevuto in cripto va valorizzato al prezzo di mercato del giorno in cui lo ricevi e, quando in seguito lo vendi o lo spendi, genera una seconda plusvalenza. Vanno considerati il quadro RW (monitoraggio) e il quadro RT (plusvalenze). Le carte che pagano cashback in stablecoin semplificano il calcolo. Informazioni generali, non consulenza fiscale — verifica la tua posizione con un commercialista. (Dati 2026-07-24.)
- **FAQ (3–5)** : Spendere cripto con la carta genera plusvalenza? · Il cashback è tassato anche se non lo vendo? · Qual è l'aliquota dell'imposta sostitutiva? · Devo compilare il quadro RW? · Quali carte pagano cashback in euro/stablecoin? (**verificare aliquota e soglie vigenti al momento della pubblicazione** — la normativa cripto IT è cambiata di recente: aliquota e soglia €2.000 da riverificare, non citare cifre 2026 senza conferma).
- **Liens internes (≥1 money page)** : → `/it/migliore-carta-cripto` (money), `/it/carta-cripto-cashback` (money), `/it/carte-crypto-italia`, `/it/recensioni/nexo-card`.
- **Données Supabase (datées 2026-07-24)** : mêmes taux que Brief 1/2 pour l'esempio in €, revérifier dans `cards`.
- **Localisation — ADAPTER, jamais traduire** : page **IT uniquement**. Ne PAS réutiliser chiffres FR/DE/UK/ES. À revérifier au publish : aliquota imposta sostitutiva in vigore, soglia di esenzione, obblighi RW/RT. Disclaimer non-conseil fiscal + auteur cité.

**→ Le brief n°1 à écrire cette semaine : BRIEF 1 — `/en/crypto-card-tax-uk` (comble le cluster fiscal promis à la page UK cards du RUN 07-23, zéro couverture EN, territoire Koinly, alimente 2 money pages EN/UK).**

---

### RUN 2026-07-31 (A8 /gap)

**Note anti-doublon queue** : les gaps les plus évidents (UK cards `/en/crypto-cards-uk`, UK tax, DE/AT cashback tax, ES/IT tax, Netflix/Spotify reformat) sont DÉJÀ briefés (RUN 07-23 / 07-24) — non re-proposés. Ce run cible 3 gaps NON encore briefés, révélés par les passes format + concurrent.

#### Table (triée par intention revenu)
| Sujet | Query cible | Marché | Format | Effort | Intention |
|---|---|---|---|---|---|
| Cartes crypto compatibles Apple Pay / Google Pay | "which crypto cards work with Apple Pay?" | en + fr + ADAPTER 5 | thématique (tableau filtré) | M | commercial → **BRIEF 1** |
| Carte crypto stablecoin (USDT/USDC) : dépense + cashback | "best crypto card for USDC/USDT in Europe" | en/es/it (+ fr/de reformat) | thématique (tableau) | M | commercial → **BRIEF 2** |
| Fiscalité cashback carte crypto en Belgique | "le cashback crypto est-il imposable en Belgique ?" | be | guide (page dédiée) | M | informational → **BRIEF 3** |
| Carte crypto prépayée (vs rechargeable) | "prepaid crypto card Europe" | en | thématique | S | commercial — candidat, recouvre partiellement `virtual-crypto-card` → non briefé |
| Plafonds/limites mensuelles carte crypto | "crypto card monthly spending limits" | en/fr | tableau comparatif | S | informational — demande faible → non briefé |
| UK cards + UK/DE/AT/ES/IT tax + Netflix/Spotify | (voir RUN 07-23 / 07-24) | multi | — | — | DÉJÀ EN FILE |

#### BRIEF 1 — Cartes crypto compatibles Apple Pay & Google Pay — NOUVELLE PAGE THÉMATIQUE (reformat + gap FR)
- **Query cible / buyer query mappée** : "Which crypto cards work with Apple Pay / Google Pay?" (en, commercial) — hors buyer-queries.csv mais demande pré-achat majeure ; signal interne : 8 posts blog existants sur le sujet (de/es/it/en, 2025 + 2026) → demande prouvée, mais AUCUNE page thématique et **FR totalement absent** du blog. Slug proposé : `/en/crypto-card-apple-pay`, `/fr/carte-crypto-apple-pay`, `/de/krypto-karte-apple-pay`, `/es/tarjeta-crypto-apple-pay`, `/it/carta-crypto-apple-pay` (+ be/at).
- **Anti-doublon** : aucun slug thématique ne cible Apple/Google Pay (uniquement des posts blog datés « 2025 » au mauvais format). Gap de format réel : la SERP « crypto card apple pay » veut un tableau « quelle carte marche », pas un article.
- **Intention** : commercial (comparaison avant souscription) → clics affiliés directs. Fort fit money page.
- **2× meilleur que le gagnant actuel** : nos concurrents et nos vieux posts donnent une prose « oui la plupart supportent Apple Pay ». Nous : **tableau filtré depuis Supabase** (colonne booléenne Apple Pay / Google Pay par carte) × **disponibilité par marché**, + note « tokenisation / provisioning » par émetteur, + statut au 2026-07-31. Une page vivante qui répond en 5 secondes.
- **Outline (H2 = questions)** :
  - Quelles cartes crypto sont compatibles Apple Pay en 2026 ? (tableau)
  - Quelles cartes crypto marchent avec Google Pay / Samsung Pay ?
  - Comment ajouter une carte crypto à Apple Pay / Google Pay ?
  - Y a-t-il des frais ou plafonds spécifiques en paiement mobile ?
  - Apple Pay est-il disponible avec une carte crypto virtuelle ?
- **Réponse clé (~100 mots)** : La plupart des grandes cartes crypto européennes (Crypto.com, Bybit, Nexo, Revolut, Wirex, Bitpanda) se rechargent dans Apple Pay et Google Pay via tokenisation, exactement comme une carte bancaire : tu ajoutes la carte au wallet, tu payes en NFC sans exposer le numéro. La compatibilité dépend de l'émetteur ET du marché — une carte disponible en France ne l'est pas forcément au Royaume-Uni. Les cartes purement virtuelles fonctionnent souvent dès l'émission ; les cartes physiques après activation. Vérifie les plafonds sans contact et les frais de conversion, identiques au paiement physique. Le tableau ci-dessus liste chaque carte, son statut Apple/Google Pay et sa disponibilité par pays (données 2026-07-31).
- **FAQ (3–5)** : Toutes les cartes crypto marchent-elles avec Apple Pay ? · Apple Pay ajoute-t-il des frais ? · Puis-je utiliser Apple Pay avec une carte crypto virtuelle avant réception de la physique ? · Google Pay et Samsung Pay sont-ils supportés pareillement ? · Le cashback s'applique-t-il aussi aux paiements Apple Pay ?
- **Liens internes (≥1 money page)** : → `/en/best-crypto-card` (money) / `/fr/meilleure-carte-crypto` (money), `/fr/carte-crypto-virtuelle`, `/fr/carte-crypto-cashback` (money), reviews des cartes citées (`/fr/avis/crypto-com-card`, `/fr/avis/nexo-card`).
- **Données Supabase (datées 2026-07-31)** : insérer depuis `cards` les champs de support Apple Pay / Google Pay (si présents ; sinon créer/vérifier la colonne) + disponibilité par marché. REVÉRIFIER carte par carte avant publication (la compat wallet change souvent). Ne PAS publier de tableau non vérifié.
- **Localisation — ADAPTER, jamais traduire (5 langues)** : le fait « Apple Pay via tokenisation » est universel MAIS la **liste des cartes compatibles change par marché** : fr/be, de/at, es, it, en=UK ont des sous-ensembles de cartes disponibles différents. Filtrer le tableau sur le marché de chaque variante ; ne pas recopier la liste EN en FR. hreflang self par locale. Vérifier notamment que les cartes citées sont réellement émises dans le pays.

#### BRIEF 2 — Carte crypto stablecoin (USDT/USDC) : dépenser & cashback stable — NOUVELLE PAGE THÉMATIQUE
- **Query cible / buyer query mappée** : "Best crypto card for USDC/USDT in Europe" + "carte crypto qui paye le cashback en stablecoin" (en/fr, commercial). Signal concurrent : cryptocardindex.com publie un guide dédié « spend USDT/USDC daily ». Signal interne : posts blog `fr/carte-crypto-cashback-usdt` + `de/krypto-karte-cashback-usdt` déjà écrits → demande, mais pas de page thématique et EN/ES/IT absents. Slug proposé : `/en/stablecoin-crypto-card`, `/fr/carte-crypto-stablecoin`, `/es/tarjeta-crypto-stablecoin`, `/it/carta-crypto-stablecoin` (+ de reformat).
- **Anti-doublon** : aucun slug thématique stablecoin ; les 2 posts blog FR/DE sont au mauvais format (article vs tableau/outil) et incomplets en langues. Gap réel.
- **Intention** : commercial. Angle différenciant : le cashback en stablecoin évite la volatilité et **simplifie la fiscalité** (pas de second événement de plus-value) → pont naturel vers le cluster fiscal déjà briefé.
- **2× meilleur** : les concurrents parlent stablecoins en général ; nous répondons « quelle CARTE » — tableau filtré des cartes qui (a) permettent de dépenser USDC/USDT et (b) versent le cashback en stablecoin/EUR plutôt qu'en token volatil, par marché, avec taux réels.
- **Outline (H2 = questions)** :
  - Peut-on payer en USDT / USDC avec une carte crypto ?
  - Quelles cartes versent le cashback en stablecoin (et pas en token volatil) ?
  - Stablecoin vs token natif : quel impact fiscal sur le cashback ?
  - Frais de conversion stablecoin → EUR au paiement
  - Meilleures cartes stablecoin par marché (tableau)
- **Réponse clé (~100 mots)** : Oui — de nombreuses cartes crypto européennes laissent régler en USDC ou USDT : le stablecoin est converti en euros au moment du paiement. L'intérêt d'un cashback versé en stablecoin (plutôt qu'en token natif volatil) est double : sa valeur ne fond pas entre le gain et la dépense, et il simplifie ta fiscalité, car un cashback stable évite en pratique un second calcul de plus-value à la revente. Attention aux frais de conversion et au spread appliqués à la sortie EUR, et à la disponibilité de la carte dans ton pays. Le tableau compare les cartes qui dépensent des stablecoins et celles qui paient le cashback en stablecoin (données 2026-07-31).
- **FAQ (3–5)** : Quelle est la différence entre payer en USDC et en BTC avec une carte ? · Le cashback en stablecoin est-il imposable ? (renvoi cluster fiscal) · Y a-t-il des frais pour dépenser des stablecoins ? · Quelles cartes acceptent USDT sur quels réseaux ? · Le stablecoin est-il converti en euros instantanément ?
- **Liens internes (≥1 money page)** : → `/fr/carte-crypto-cashback` (money) / `/en/crypto-card-cashback` (money), `/fr/meilleure-carte-crypto` (money), `/fr/blog/fiscalite-cashback-crypto-france` + futurs briefs fiscaux (DE/UK/ES/IT), reviews cartes citées.
- **Données Supabase (datées 2026-07-31)** : insérer depuis `cards` — support de dépense USDC/USDT, devise du cashback (token natif vs stablecoin vs EUR), taux de cashback, frais de conversion, disponibilité par marché. Revérifier avant publish.
- **Localisation — ADAPTER, jamais traduire (5 langues)** : le mécanisme est universel mais (1) la disponibilité des cartes diffère par marché, (2) le paragraphe fiscal doit pointer vers la fiscalité DU pays (be/at/es/it/UK ≠ FR — voir cluster fiscal briefé). Ne pas recopier l'exemple chiffré FR en EUR pour UK (GBP). hreflang self par locale.

#### BRIEF 3 — Fiscalité du cashback des cartes crypto en Belgique — NOUVELLE PAGE
- **Query cible / buyer query mappée** : "Le cashback crypto est-il imposable en Belgique ?" / "Dois-je déclarer ma carte crypto en Belgique ?" (be, informational). Complète le cluster fiscal : FR, UK, DE/AT, ES, IT sont briefés — **la Belgique est le seul marché fiscal jamais couvert**, alors qu'elle a une money page (`/be/carte-crypto-belgique`). Slug proposé : `/be/fiscalite-carte-crypto-belgique`.
- **Anti-doublon** : aucune page fiscale belge ; la page fiscale FR (`/fr/blog/fiscalite-cashback-crypto-france`) porte sur la France et NE couvre PAS la Belgique (régime distinct). Gap total.
- **Intention** : informational, territoire Koinly → E-E-A-T + backlinks, alimente la money page BE.
- **2× meilleur** : les concurrents traitent « la crypto en Belgique » de façon générale ; nous lions à la CARTE et au régime belge spécifique — la distinction bon père de famille (gestion normale du patrimoine privé) vs revenus divers (spéculatif, ~33 %) vs activité professionnelle, appliquée au fait de payer en crypto et de recevoir du cashback.
- **Outline (H2 = questions)** :
  - Payer avec une carte crypto est-il imposable en Belgique ?
  - Le cashback reçu en crypto est-il un revenu taxable en Belgique ?
  - « Bon père de famille » vs revenus divers : dans quelle case tombe l'usage d'une carte ?
  - Faut-il déclarer ses comptes/plateformes crypto étrangers ?
  - Comment réduire le risque de requalification en « spéculatif » ?
- **Réponse clé (~100 mots)** : En Belgique, il n'existe pas d'impôt sur les plus-values pour un particulier qui gère son patrimoine « en bon père de famille » : dans ce cas, payer avec une carte crypto n'est en principe pas taxé. Mais un usage jugé spéculatif ou fréquent peut être requalifié en « revenus divers », taxés autour de 33 %, et une activité régulière en revenus professionnels (barème progressif). Le cashback reçu en crypto peut être vu comme un avantage à valoriser à la réception ; sa revente ultérieure suit le même test de qualification. Les comptes crypto étrangers peuvent devoir être signalés. Informations générales, pas un conseil fiscal — vérifie ta situation avec un conseiller. (Cadre 2026-07-31.)
- **FAQ (3–5)** : La Belgique taxe-t-elle les plus-values crypto d'un particulier ? · Le cashback en crypto est-il un revenu divers ? · Qu'est-ce que la gestion « en bon père de famille » ? · Dois-je déclarer Binance/Crypto.com au fisc belge ? · Payer souvent avec ma carte crypto me rend-il « spéculateur » ?
- **Liens internes (≥1 money page)** : → `/be/carte-crypto-belgique` (money), `/be/meilleure-carte-crypto` (money), `/be/carte-crypto-cashback` (money), `/be/avis/...` selon dispo BE.
- **Données Supabase (datées 2026-07-31)** : cartes réellement disponibles sur le marché `be` (filtre disponibilité) + devise du cashback pour l'exemple. Revérifier.
- **Localisation — ADAPTER, jamais traduire** : page **be uniquement** (droit fiscal belge). NE PAS réutiliser les chiffres/règles FR (be ≠ fr : la France a une flat tax 30 %, la Belgique non). Contenu en français belge, marché be. À revérifier au publish : seuils/qualification « revenus divers », taux applicable, obligations de déclaration de comptes étrangers en vigueur. Disclaimer non-conseil fiscal + auteur cité (E-E-A-T).

**→ Le brief n°1 à écrire cette semaine : BRIEF 1 — `/…/crypto-card-apple-pay` (thématique Apple Pay / Google Pay). Intention commerciale la plus forte, demande prouvée par 8 posts blog au mauvais format, gap FR total, et 2× meilleur immédiat via tableau Supabase filtré par marché.)**
