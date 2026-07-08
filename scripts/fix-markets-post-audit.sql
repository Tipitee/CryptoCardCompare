-- ============================================================
-- TopCryptoCards — Corrections marchés post-audit MiCA (juillet 2026)
-- ============================================================
-- Audit complet réalisé le 07-08 juillet 2026 sur toutes les cartes du site.
-- Sources : ESMA CASP register, FMA Austria, AMF France, pages support officielles,
--           annonces officielles des émetteurs, presse spécialisée.
--
-- 3 OPÉRATIONS :
--   A) Marquer discontinued les cartes non conformes MiCA / indisponibles EU
--   B) Corriger Deblock → FR uniquement (expansion BE/NL non encore déployée)
--   C) Ajouter 'en' (site international) à toutes les cartes EU-wide actives
-- ============================================================


-- ============================================================
-- A) DISCONTINUED — cartes non disponibles en EU post-juillet 2026
-- ============================================================

-- BINANCE
-- Aucune licence MiCA. Arrêt total des services EU le 1er juillet 2026.
-- Sources : Euronews (30/06/2026), CoinDesk, Zyphe
UPDATE cards
SET status = 'discontinued',
    markets = ARRAY[]::text[]
WHERE issuer = 'Binance';

-- BITGET
-- Aucune licence MiCA. Suspension France le 31 mars 2026.
-- Compte rendu officiel Bitget support : "service suspended"
UPDATE cards
SET status = 'discontinued',
    markets = ARRAY[]::text[]
WHERE issuer = 'Bitget';

-- COINBASE CARD
-- La carte Coinbase (Visa) est un produit US uniquement.
-- La licence MiCA de Coinbase couvre l'exchange, pas le produit carte EU.
-- Source : CoinCodeCap best crypto cards Europe 2026
UPDATE cards
SET status = 'discontinued',
    markets = ARRAY[]::text[]
WHERE issuer = 'Coinbase';

-- KUCOIN (KuCard)
-- Licence MiCA obtenue (FMA Autriche, nov. 2025) MAIS décision administrative du
-- 18 février 2026 : "commencement of business operations remains prohibited".
-- Levée du ban sur nouveaux clients (18/05/2026), mais les opérations restent
-- interdites. KuCard non utilisable.
-- Source : FMA officiel — fma.gv.at/en/fma-lifts-ban-on-new-business-for-kucoin-eu
UPDATE cards
SET status = 'discontinued',
    markets = ARRAY[]::text[]
WHERE issuer = 'KuCoin';

-- WIREX CARD
-- Depuis le 30 juin 2026 : dépôts/retraits crypto, échanges crypto↔fiat et
-- paiements carte depuis solde crypto sont désactivés dans toute l'EEA (app classique).
-- Wirex ne figure PAS au registre ESMA des CASP. L'Italie (pays de sa demande)
-- n'a émis AUCUNE autorisation MiCA CASP à ce jour.
-- Source : Wirex help center, ESMA register, spaziocrypto.com
UPDATE cards
SET status = 'discontinued',
    markets = ARRAY[]::text[]
WHERE issuer = 'Wirex';

-- LEDGER / BAANX (CL Card)
-- Baanx dispose d'une licence EMI via Monavate (Lituanie) pour la partie paiement,
-- mais AUCUNE autorisation CASP pour la jambe crypto depuis le 1er juillet 2026.
-- Sans CASP, la conversion crypto→fiat (cœur du produit) est illégale en EU.
-- Sources : Ledger support FAQ, ESMA CASP register (Baanx absent)
UPDATE cards
SET status = 'discontinued',
    markets = ARRAY[]::text[]
WHERE issuer = 'Ledger (Baanx)';

-- YOUNG PLATFORM CARD
-- Carte en bêta fermée uniquement (family & friends) — aucun accès public.
-- Pas encore de CASP MiCA accordé (demande en cours, situation mai 2026).
-- Sources : The Block, Skrumble review, Young Platform blog
UPDATE cards
SET status = 'discontinued',
    markets = ARRAY[]::text[]
WHERE issuer = 'Young Platform';


-- ============================================================
-- B) DEBLOCK — France uniquement
-- ============================================================
-- Deblock est opérationnel en France uniquement (lancé avril 2024).
-- Expansion Belgique + Pays-Bas annoncée pour 2026 mais NON encore déployée.
-- Sources : Delano.lu article, Deblock blog officiel
-- Note : retirer 'be' ajouté par erreur via add-be-at-markets.sql
UPDATE cards
SET markets = ARRAY['fr']
WHERE issuer = 'Deblock';


-- ============================================================
-- C) AJOUTER 'en' À TOUTES LES CARTES EU-WIDE ACTIVES
-- ============================================================
-- 'en' = version internationale du site (pas UK-spécifique).
-- Toute carte non-discontinued disponible en FR ou DE est MiCA-conforme
-- et doit apparaître sur les pages thématiques EN + homepage EN.
-- Cartes concernées : Crypto.com, Bybit, OKX, Revolut, Trade Republic,
--   Bitpanda, Gnosis Pay, Plutus, Nexo, Kraken, MetaMask (ConsenSys),
--   Ether.fi Cash, Brighty, Bleap, Bit2Me, WhiteBIT Nova
-- Exception : Deblock (déjà corrigé en step B → markets=['fr'] uniquement)

UPDATE cards
SET markets = array_append(markets, 'en')
WHERE status != 'discontinued'
  AND NOT ('en' = ANY(markets))
  AND ('fr' = ANY(markets) OR 'de' = ANY(markets));


-- ============================================================
-- VÉRIFICATIONS POST-CORRECTIONS
-- ============================================================

-- A) Cartes discontinued (doivent être absentes du site)
SELECT id, name, issuer, status, markets
FROM cards
WHERE status = 'discontinued'
ORDER BY issuer;

-- B) État final de toutes les cartes actives
SELECT id, name, issuer, status, markets
FROM cards
WHERE status != 'discontinued'
ORDER BY issuer, name;

-- C) Vérifier qu'aucune carte active n'a un markets vide
SELECT id, name, issuer, markets
FROM cards
WHERE status != 'discontinued'
  AND (markets IS NULL OR array_length(markets, 1) = 0);

-- D) Vérifier que 'en' est présent sur toutes les cartes EU-wide
SELECT id, name, issuer, markets
FROM cards
WHERE status != 'discontinued'
  AND NOT ('en' = ANY(markets))
ORDER BY issuer;
