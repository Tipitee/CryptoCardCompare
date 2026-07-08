-- ============================================================
-- TopCryptoCards — Corrections marché UK (juillet 2026)
-- ============================================================
-- Audit réalisé le 08 juillet 2026 : vérification carte par carte
-- de la disponibilité réelle au Royaume-Uni.
--
-- Le champ 'en' représente désormais le marché United Kingdom (🇬🇧).
-- Source des vérifications :
--   - Trade Republic : pas de FCA, retiré du UK post-Brexit
--     (investingintheweb.com, brokerchooser.com)
--   - WhiteBIT Nova : EEA only, 31 pays listés, UK absent
--     (help.whitebit.com, bestcryptocards.info)
--   - OKX Card : lancé dans l'EEA jan. 2026, UK non inclus
--     (okx.com/en-gb, neobanque.ch)
--   - Bit2Me : EEA + Argentine uniquement (support.bit2me.com, mars 2025)
--   - Bitpanda : FCA approuvé fév. 2025 via Bitpanda Broker UK Ltd ✓
--   - Brighty : licencié UK, 350K utilisateurs, £ IBAN disponible ✓
--   - Bleap : UK listé explicitement dans les pays supportés ✓
-- ============================================================


-- ============================================================
-- RETIRER 'en' DES CARTES NON DISPONIBLES AU UK
-- ============================================================

-- Trade Republic — EU only, pas de licence FCA, UK residents exclus
UPDATE cards
SET markets = array_remove(markets, 'en')
WHERE issuer = 'Trade Republic'
  AND 'en' = ANY(markets);

-- WhiteBIT Nova — EEA only (31 pays), UK non inclus
UPDATE cards
SET markets = array_remove(markets, 'en')
WHERE issuer = 'WhiteBIT'
  AND 'en' = ANY(markets);

-- OKX Card — EEA only depuis jan. 2026, UK non inclus
UPDATE cards
SET markets = array_remove(markets, 'en')
WHERE issuer = 'OKX'
  AND 'en' = ANY(markets);

-- Bit2Me — EEA + Argentine uniquement, UK non inclus
UPDATE cards
SET markets = array_remove(markets, 'en')
WHERE issuer = 'Bit2Me'
  AND 'en' = ANY(markets);


-- ============================================================
-- VÉRIFICATIONS POST-CORRECTIONS
-- ============================================================

-- A) Cartes avec 'en' dans leurs markets (= disponibles au UK)
SELECT id, name, issuer, markets
FROM cards
WHERE 'en' = ANY(markets)
  AND status != 'discontinued'
ORDER BY issuer, name;

-- B) Cartes actives SANS 'en' dans leurs markets (= UK non supporté)
SELECT id, name, issuer, markets
FROM cards
WHERE NOT ('en' = ANY(markets))
  AND status != 'discontinued'
ORDER BY issuer, name;
