/*
  # Assign brand_id to new cards + fix Bleap duplicate

  New brands:
    metamask, ether-fi, bitget, kucoin, young-platform,
    bit2me, brighty, whitebit

  Bleap fix:
    - bleap-crypto-card (issuer Unlimit EU Ltd) → brand_id = 'bleap'
    - bleap-card (old duplicate) → status = 'discontinued'
*/

-- ─── BLEAP FIX ────────────────────────────────────────────────────────────────
UPDATE cards
SET brand_id = 'bleap', tier_rank = 1, tier_label = 'Bleap Card'
WHERE id = 'bleap-crypto-card' AND brand_id IS NULL;

UPDATE cards
SET status = 'discontinued'
WHERE id = 'bleap-card';

-- ─── METAMASK ─────────────────────────────────────────────────────────────────
UPDATE cards
SET brand_id = 'metamask', tier_rank = 1, tier_label = 'MetaMask Card'
WHERE id = 'metamask-card';

-- ─── ETHER.FI ─────────────────────────────────────────────────────────────────
UPDATE cards
SET brand_id = 'ether-fi', tier_rank = 1, tier_label = 'Ether.fi Cash'
WHERE id = 'ether-fi-cash';

-- ─── BITGET ───────────────────────────────────────────────────────────────────
UPDATE cards
SET brand_id = 'bitget', tier_rank = 1, tier_label = 'Bitget Card'
WHERE id = 'bitget-card';

-- ─── KUCOIN ───────────────────────────────────────────────────────────────────
UPDATE cards
SET brand_id = 'kucoin', tier_rank = 1, tier_label = 'KuCard'
WHERE id = 'kucard';

-- ─── YOUNG PLATFORM ───────────────────────────────────────────────────────────
UPDATE cards
SET brand_id = 'young-platform', tier_rank = 1, tier_label = 'Young Platform Card'
WHERE id = 'young-platform-card';

-- ─── BIT2ME ───────────────────────────────────────────────────────────────────
UPDATE cards
SET brand_id = 'bit2me', tier_rank = 1, tier_label = 'Bit2Me Card'
WHERE id = 'bit2me-card';

-- ─── BRIGHTY ──────────────────────────────────────────────────────────────────
UPDATE cards
SET brand_id = 'brighty', tier_rank = 1, tier_label = 'Brighty Card'
WHERE id = 'brighty-card';

-- ─── WHITEBIT ─────────────────────────────────────────────────────────────────
UPDATE cards
SET brand_id = 'whitebit', tier_rank = 1, tier_label = 'WhiteBIT Nóva'
WHERE id = 'whitebit-nova';
