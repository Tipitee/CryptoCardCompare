-- =============================================================================
-- refresh-top-cards.sql
-- GSC Refresh Loop — top card pages positions 8-20 (July 2026)
--
-- Priority by impressions in positions 8-20:
--   1. OKX Card EN        — pos 12,   129 imp
--   2. Deblock Card EN    — pos 14.4,  39 imp
--   3. KuCard EN          — pos 14.7,  30 imp
--   4. Bitrefill Card EN  — pos 10.4,  28 imp
--   5. Kraken Card FR     — pos 9.3,   26 imp
--   6. Kraken Card EN     — pos 15.2,  24 imp
--   7. Gnosis Pay IT      — pos 11.8,  23 imp
--   8. Crypto.com Royal Indigo EN — pos 16, 20 imp
--   9. OKX Card FR        — pos 10.2,  18 imp
--
-- HOW TO USE:
-- 1. Run STEP 0 first — verify slugs exist before updating
-- 2. Run STEP 1-9 — one at a time or all at once
-- 3. Run STEP 10 — touch updated_at for all matched posts
-- 4. Run STEP 11 — verify result
-- =============================================================================


-- =============================================================================
-- STEP 0 — VERIFY: check which card posts exist
-- =============================================================================
SELECT id, lang, slug, category,
       LEFT(title, 60)        AS title,
       LENGTH(content)        AS content_chars,
       content ILIKE '%faq%'  AS has_faq,
       updated_at::date       AS last_updated
FROM blog_posts
WHERE (
  slug ILIKE '%okx-card%'
  OR slug ILIKE '%deblock%'
  OR slug ILIKE '%kucard%' OR slug ILIKE '%ku-card%' OR slug ILIKE '%kucoin-card%'
  OR slug ILIKE '%bitrefill%'
  OR slug ILIKE '%kraken%'
  OR slug ILIKE '%gnosis%'
  OR slug ILIKE '%royal-indigo%'
)
AND lang IN ('en', 'fr', 'it')
ORDER BY lang, slug;


-- =============================================================================
-- STEP 1 — OKX Card EN (129 imp, pos 12 — biggest opportunity)
-- =============================================================================
UPDATE blog_posts
SET
  updated_at      = NOW(),
  meta_description = 'OKX Card review 2026: up to 3% cashback in OKB, no annual fees, available in Europe. Compare tiers, staking requirements and alternatives. Full independent review.',
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — OKX Card: Frequently Asked Questions (2026)</h2>

<h3>What cashback does the OKX Card offer?</h3>
<p>OKX Card offers tiered cashback in OKB: 1% at the base tier (no staking), 2% at intermediate, and up to 3% at premium with OKB staking. Cashback is credited daily in OKB to your OKX account.</p>

<h3>Is the OKX Card available in Europe?</h3>
<p>OKX Card is available across much of Europe including France, Germany, Spain, and Italy. Availability varies by country due to MiCA compliance — always check OKX''s official site for your country.</p>

<h3>Does the OKX Card require staking OKB?</h3>
<p>The base tier (1% cashback) requires no staking. To unlock 2-3%, you must stake OKB for a minimum period, exposing you to OKB price volatility. For cashback without staking, Gnosis Pay (2% in GNO) and MetaMask Card (up to 3% in ETH) are the best alternatives in Europe.</p>

<h3>What are the OKX Card annual fees?</h3>
<p>The OKX Card has no annual subscription fee. Card issuance is free for eligible OKX users. Standard FX conversion fees apply when spending outside the EUR zone.</p>

<h3>OKX Card vs Crypto.com Visa — which is better in 2026?</h3>
<p>Both offer tiered cashback requiring native token staking. OKX Card''s 3% max competes with Crypto.com Jade (3% in CRO, 50,000 CRO staked). OKX suits active OKX traders who already hold OKB; Crypto.com has a broader ecosystem with Netflix/Spotify reimbursements and lounge access at premium tiers.</p>
</section>'
WHERE slug ILIKE '%okx-card%'
  AND lang = 'en'
  AND content NOT ILIKE '%FAQ — OKX Card%';


-- =============================================================================
-- STEP 2 — OKX Card FR (18 imp, pos 10.2)
-- =============================================================================
UPDATE blog_posts
SET
  updated_at      = NOW(),
  meta_description = 'Avis OKX Card 2026 : jusqu''à 3% de cashback en OKB, sans frais annuels, disponible en Europe. Comparatif des tiers, staking requis et alternatives. Revue indépendante complète.',
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — OKX Card : Questions fréquentes (2026)</h2>

<h3>Quel cashback offre la OKX Card ?</h3>
<p>La OKX Card propose un cashback en OKB : 1% au tier de base (sans staking), 2% au tier intermédiaire, et jusqu''à 3% au tier premium avec staking d''OKB. Le cashback est crédité quotidiennement sur votre compte OKX.</p>

<h3>La OKX Card est-elle disponible en France ?</h3>
<p>Oui, la OKX Card est disponible en France et dans de nombreux pays européens. La disponibilité varie selon les pays en raison de MiCA — vérifiez la page officielle OKX pour votre pays.</p>

<h3>Faut-il staker des OKB pour obtenir le cashback ?</h3>
<p>Le tier de base (1%) ne nécessite aucun staking. Pour débloquer 2-3%, il faut staker des OKB, ce qui expose à la volatilité du cours. Pour éviter le staking : Gnosis Pay (2% en GNO) ou MetaMask Card (jusqu''à 3% en ETH).</p>

<h3>La OKX Card a-t-elle des frais annuels ?</h3>
<p>Aucun frais annuel d''abonnement. L''émission de la carte est gratuite pour les utilisateurs OKX éligibles. Des frais de conversion s''appliquent hors zone EUR.</p>

<h3>OKX Card vs Crypto.com Visa — laquelle choisir en 2026 ?</h3>
<p>Les deux offrent un cashback par paliers avec staking en token natif. OKX Card convient aux traders actifs sur OKX qui détiennent déjà des OKB. Crypto.com dispose d''un écosystème plus large (remboursements Netflix/Spotify, accès lounge). Pour un cashback sans staking : Gnosis Pay reste la référence en Europe.</p>
</section>'
WHERE slug ILIKE '%okx-card%'
  AND lang = 'fr'
  AND content NOT ILIKE '%FAQ — OKX Card%';


-- =============================================================================
-- STEP 3 — Kraken Krak Card FR (26 imp, pos 9.3 — presque page 1)
-- =============================================================================
UPDATE blog_posts
SET
  updated_at      = NOW(),
  meta_description = 'Avis Kraken Krak Card 2026 : cashback en crypto, sans frais annuels, disponible en Europe. Staking requis, comparatif des tiers et alternatives. Revue indépendante complète.',
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — Kraken Krak Card : Questions fréquentes (2026)</h2>

<h3>Quel cashback offre la Kraken Krak Card ?</h3>
<p>La Kraken Krak Card offre jusqu''à 2% de cashback en cryptomonnaies selon le tier choisi. Le cashback est directement crédité sur votre compte Kraken après chaque achat éligible.</p>

<h3>La Kraken Krak Card est-elle disponible en France ?</h3>
<p>Oui, la Kraken Krak Card est disponible en France et dans la majorité des pays de l''Union Européenne. Kraken est régulé en Europe et conforme aux exigences MiCA.</p>

<h3>Faut-il staker pour obtenir le cashback ?</h3>
<p>Un staking de KRK est requis pour accéder aux tiers supérieurs. Le tier de base propose un cashback plus faible sans staking. Pour un cashback sans exposition au KRK : Gnosis Pay (2% sans staking) ou Nexo Card (2% en BTC sans staking).</p>

<h3>La Kraken Krak Card a-t-elle des frais annuels ?</h3>
<p>Pas de frais annuels au tier de base. Des conditions de staking peuvent être requises pour maintenir les avantages premium. Vérifiez les conditions actuelles sur le site Kraken.</p>

<h3>Kraken Krak Card vs Crypto.com Visa — laquelle choisir ?</h3>
<p>La Kraken Krak Card est idéale pour les utilisateurs actifs sur l''exchange Kraken. Crypto.com propose un cashback plus élevé au niveau premium (jusqu''à 8%) mais avec des exigences de staking bien plus importantes. Pour un cashback sans staking, Gnosis Pay reste le choix de référence en 2026.</p>
</section>'
WHERE slug ILIKE '%kraken%'
  AND lang = 'fr'
  AND content NOT ILIKE '%FAQ — Kraken Krak Card%';


-- =============================================================================
-- STEP 4 — Kraken Krak Card EN (24 imp, pos 15.2)
-- =============================================================================
UPDATE blog_posts
SET
  updated_at      = NOW(),
  meta_description = 'Kraken Krak Card review 2026: crypto cashback, no annual fees, available in Europe and the UK. Staking requirements, tier comparison and alternatives. Full independent review.',
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — Kraken Krak Card: Frequently Asked Questions (2026)</h2>

<h3>What cashback does the Kraken Krak Card offer?</h3>
<p>The Kraken Krak Card offers up to 2% cashback in crypto on eligible purchases. The exact rate depends on your staking tier — higher KRK staking unlocks higher cashback. Rewards are credited directly to your Kraken account.</p>

<h3>Is the Kraken Card available in the UK?</h3>
<p>Yes, Kraken Card is available in the UK and across most of the European Economic Area. Kraken holds the necessary regulatory authorisations in Europe and complies with MiCA requirements.</p>

<h3>Does the Kraken Card require KYC?</h3>
<p>Yes, full KYC verification through Kraken is required to activate and use the card. Verification typically completes within 1-2 business days.</p>

<h3>What currencies can you spend with the Kraken Krak Card?</h3>
<p>The Kraken Krak Card automatically converts your crypto to local fiat at point of sale via Visa, accepted at 90+ million merchants worldwide. Bitcoin, ETH, and other supported Kraken assets are auto-converted at competitive rates.</p>

<h3>Kraken Card vs Revolut Metal for crypto — which is better?</h3>
<p>Kraken Card is purpose-built for crypto-native users wanting cashback in crypto with deep exchange integration. Revolut Metal is better for users who want a premium fiat card with crypto as a secondary feature. For pure cashback without staking, Gnosis Pay (2% in GNO on-chain) is also worth comparing.</p>
</section>'
WHERE slug ILIKE '%kraken%'
  AND lang = 'en'
  AND content NOT ILIKE '%FAQ — Kraken Krak Card%';


-- =============================================================================
-- STEP 5 — Deblock Card EN (39 imp, pos 14.4)
-- =============================================================================
UPDATE blog_posts
SET
  updated_at      = NOW(),
  meta_description = 'Deblock Card review 2026: up to 3% BTC/ETH cashback, French neobank, available in France and Europe. Fee structure, comparison with Revolut and alternatives.',
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — Deblock Card: Frequently Asked Questions (2026)</h2>

<h3>What is the Deblock Card?</h3>
<p>Deblock is a French crypto-native neobank. The Deblock Visa card lets you spend crypto (converted to EUR at point of sale) and earn cashback in Bitcoin or Ethereum on all eligible purchases, with a French regulated payment institution behind it.</p>

<h3>What cashback does the Deblock Card offer?</h3>
<p>Deblock offers cashback in BTC or ETH: the free tier includes a base cashback rate; premium tiers (from ~€9.99/month) offer up to 3% in BTC or ETH. Cashback is credited monthly to your Deblock crypto wallet.</p>

<h3>Is the Deblock Card available outside France?</h3>
<p>Deblock is primarily focused on the French market. Availability in other EU countries is expanding in 2026 — check Deblock''s official website for the latest supported countries.</p>

<h3>What are Deblock Card fees?</h3>
<p>Deblock has a free tier with basic features. Premium plans start from ~€9.99/month with higher cashback rates. No separate card issuance fee. Standard FX fees apply outside the Eurozone.</p>

<h3>Deblock vs Revolut for crypto — which is better in 2026?</h3>
<p>Deblock is purpose-built for crypto with BTC/ETH cashback and a French IBAN. Revolut offers broader international features but crypto cashback is not its primary strength. For French users who want crypto cashback with a local banking feel, Deblock is more relevant.</p>
</section>'
WHERE slug ILIKE '%deblock%'
  AND lang = 'en'
  AND content NOT ILIKE '%FAQ — Deblock Card%';


-- =============================================================================
-- STEP 6 — KuCard EN (30 imp, pos 14.7)
-- =============================================================================
UPDATE blog_posts
SET
  updated_at      = NOW(),
  meta_description = 'KuCard review 2026: KuCoin Visa card with up to 3% KCS cashback. Availability in Europe, staking requirements, fee structure and comparison with competitors.',
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — KuCard: Frequently Asked Questions (2026)</h2>

<h3>What is the KuCard?</h3>
<p>KuCard is the official Visa debit card from KuCoin exchange. It lets you spend crypto at 90+ million merchants worldwide with automatic crypto-to-fiat conversion. Cashback is earned in KCS (KuCoin Token), KuCoin''s native utility token.</p>

<h3>What cashback does KuCard offer?</h3>
<p>KuCard offers tiered cashback in KCS: 1% at the base tier with no staking, up to 3% at premium tiers with increasing KCS staking. The higher your KCS stake, the more cashback you earn on daily spending.</p>

<h3>Is KuCard available in Europe?</h3>
<p>KuCard''s European availability depends on KuCoin''s regulatory status under MiCA. In 2026, access may be restricted in some EU countries. Always verify current availability on KuCoin''s official website before applying.</p>

<h3>What are KuCard fees?</h3>
<p>The standard KuCard has no annual fee. Card issuance is free for eligible KuCoin users. FX conversion fees apply when spending outside your base currency. ATM fees may apply beyond monthly free limits.</p>

<h3>KuCard vs Bybit Card — which offers better crypto cashback?</h3>
<p>Both offer tiered cashback in native exchange tokens (KCS and BIT respectively) with comparable maximum rates of ~3%. The better choice depends on which exchange you primarily use. For no-staking cashback alternatives, Gnosis Pay (2% in GNO) and MetaMask Card are worth considering.</p>
</section>'
WHERE (slug ILIKE '%kucard%' OR slug ILIKE '%ku-card%' OR slug ILIKE '%kucoin-card%')
  AND lang = 'en'
  AND content NOT ILIKE '%FAQ — KuCard%';


-- =============================================================================
-- STEP 7 — Bitrefill Card EN (28 imp, pos 10.4)
-- =============================================================================
UPDATE blog_posts
SET
  updated_at      = NOW(),
  meta_description = 'Bitrefill Card review 2026: spend Bitcoin and crypto via gift cards worldwide. Lightning Network support, minimal KYC, global merchant coverage. Full independent review.',
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — Bitrefill Card: Frequently Asked Questions (2026)</h2>

<h3>What is the Bitrefill Card?</h3>
<p>Bitrefill lets you spend Bitcoin and crypto by purchasing gift cards, mobile top-ups, and digital vouchers for thousands of global merchants. Unlike traditional crypto debit cards, it is a gift card marketplace first — ideal for maximising Bitcoin spending power directly without going through an exchange.</p>

<h3>Does Bitrefill offer cashback?</h3>
<p>Bitrefill offers a 2% discount for purchases made using Bitcoin Lightning Network. Some merchants also offer promotional bonuses. The model differs from cashback cards like Gnosis Pay or Nexo — it is optimised for Bitcoin spenders wanting maximum purchasing power.</p>

<h3>What crypto can I use with Bitrefill?</h3>
<p>Bitrefill supports Bitcoin (including Lightning Network for instant low-fee payments), Ethereum, Litecoin, Dash, Dogecoin, USDT, and other major cryptocurrencies. Lightning Network integration enables instant, near-zero-fee Bitcoin transactions.</p>

<h3>Does Bitrefill require KYC?</h3>
<p>Bitrefill offers services with minimal KYC for small purchases, making it attractive for privacy-conscious users. Larger purchases may require additional verification depending on the product and jurisdiction.</p>

<h3>Bitrefill vs traditional crypto cards — what is the difference?</h3>
<p>Traditional crypto cards (Crypto.com, Gnosis Pay, MetaMask Card) convert crypto to fiat at POS for use anywhere. Bitrefill lets you buy gift cards for specific merchants using crypto directly — ideal for Amazon, Netflix, Uber, and thousands of supported brands, often with better effective rates than currency conversion but without the "spend anywhere" flexibility of Visa-backed cards.</p>
</section>'
WHERE slug ILIKE '%bitrefill%'
  AND lang = 'en'
  AND content NOT ILIKE '%FAQ — Bitrefill%';


-- =============================================================================
-- STEP 8 — Gnosis Pay IT (23 imp, pos 11.8)
-- =============================================================================
UPDATE blog_posts
SET
  updated_at      = NOW(),
  meta_description = 'Recensione Gnosis Pay 2026: 2% cashback in GNO senza staking, carta on-chain, disponibile in Italia e tutta Europa. Confronto con MetaMask Card e alternative. Recensione indipendente.',
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — Gnosis Pay: Domande frequenti (2026)</h2>

<h3>Cos''è la Gnosis Pay Card?</h3>
<p>Gnosis Pay è la prima carta di debito on-chain europea. A differenza delle carte crypto tradizionali, ogni transazione si regola direttamente sulla Gnosis Chain (xDAI), garantendo trasparenza on-chain, auto-custodia e nessuna dipendenza da una banca centralizzata. È una carta Visa accettata in oltre 90 milioni di esercenti nel mondo.</p>

<h3>Qual è il cashback di Gnosis Pay?</h3>
<p>Gnosis Pay offre il 2% di cashback in GNO su tutti gli acquisti idonei, senza alcun requisito di staking. Il cashback viene accreditato automaticamente in GNO sul tuo Safe wallet dopo ogni transazione — uno dei migliori tassi senza staking disponibili in Europa nel 2026.</p>

<h3>Gnosis Pay è disponibile in Italia?</h3>
<p>Sì, Gnosis Pay è disponibile in Italia e in tutta l''Unione Europea grazie alla sua licenza Visa europea e alla piena conformità MiCA. Non ci sono restrizioni per gli utenti italiani.</p>

<h3>Gnosis Pay richiede lo staking?</h3>
<p>No — è uno dei principali punti di forza di Gnosis Pay. Il 2% di cashback in GNO viene erogato senza bloccare capitali, a differenza di Crypto.com (staking in CRO) o Bybit (staking in BIT).</p>

<h3>Gnosis Pay vs MetaMask Card — quale scegliere nel 2026?</h3>
<p>Entrambe sono carte on-chain senza staking. Gnosis Pay offre il 2% in GNO su tutte le transazioni. MetaMask Card offre fino al 3% in ETH ma il tasso è legato al volume mensile. Se sei già nell''ecosistema Gnosis/xDAI, Gnosis Pay è la scelta naturale. Se preferisci accumulare ETH, MetaMask Card potrebbe essere più adatta.</p>
</section>'
WHERE slug ILIKE '%gnosis%'
  AND lang = 'it'
  AND content NOT ILIKE '%FAQ — Gnosis Pay%';


-- =============================================================================
-- STEP 9 — Crypto.com Royal Indigo EN (20 imp, pos 16)
-- =============================================================================
UPDATE blog_posts
SET
  updated_at      = NOW(),
  meta_description = 'Crypto.com Royal Indigo review 2026: 3% CRO cashback, lounge access, Spotify/Netflix reimbursements. 50,000 CRO staking — is it worth it? Full independent comparison.',
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — Crypto.com Royal Indigo Card: Frequently Asked Questions (2026)</h2>

<h3>What is the Crypto.com Royal Indigo card?</h3>
<p>Crypto.com Royal Indigo is a premium tier in the Crypto.com Visa card range, offering 3% cashback in CRO, airport lounge access (LoungeKey), and monthly subscription reimbursements including Spotify (€13.99) and Netflix (€13.99). It requires 50,000 CRO staked for 180 days.</p>

<h3>How much CRO is needed for Royal Indigo?</h3>
<p>You need to stake 50,000 CRO for a minimum of 180 days. At current CRO prices (~€0.06-0.08 in 2026), this represents approximately €3,000-€4,000 of capital locked. If CRO price drops during the lock-up, the effective value of your stake decreases.</p>

<h3>Is Crypto.com Royal Indigo worth it in 2026?</h3>
<p>At €1,000/month spending: 3% cashback = €360/year in CRO, plus ~€167/year in Spotify + Netflix reimbursements = ~€527/year total value, against €0 in card fees. The main risk is CRO volatility during the 180-day lock-up. For risk-averse users, Gnosis Pay (2% in GNO, no staking) or Nexo Card (2% in BTC, no staking) offer better risk-adjusted returns.</p>

<h3>What is the difference between Crypto.com Jade and Royal Indigo?</h3>
<p>Jade Green and Royal Indigo require the same amount of CRO staked (50,000 CRO) and offer identical perks and cashback rate (3%). They are colour variants of the same tier — functionally identical in 2026.</p>

<h3>What airport lounges can you access with Royal Indigo?</h3>
<p>Royal Indigo cardholders get free access to 1,000+ airport lounges worldwide through LoungeKey (formerly DragonPass). Access is complimentary for the primary cardholder. Guest visits may incur a per-visit fee.</p>
</section>'
WHERE (slug ILIKE '%royal-indigo%' OR (slug ILIKE '%crypto-com%' AND slug ILIKE '%indigo%'))
  AND lang = 'en'
  AND content NOT ILIKE '%FAQ — Crypto.com Royal Indigo%';


-- =============================================================================
-- STEP 10 — Touch updated_at for ALL matched posts (freshness signal to Google)
-- =============================================================================
UPDATE blog_posts
SET updated_at = NOW()
WHERE (
  slug ILIKE '%okx-card%'
  OR slug ILIKE '%deblock%'
  OR slug ILIKE '%kucard%' OR slug ILIKE '%ku-card%'
  OR slug ILIKE '%bitrefill%'
  OR slug ILIKE '%kraken%'
  OR slug ILIKE '%gnosis%'
  OR slug ILIKE '%royal-indigo%'
)
AND lang IN ('en', 'fr', 'it');


-- =============================================================================
-- STEP 11 — VERIFY result
-- =============================================================================
SELECT lang, slug,
       meta_description IS NOT NULL   AS has_meta_desc,
       content ILIKE '%faq%'          AS has_faq,
       updated_at::date               AS updated
FROM blog_posts
WHERE (
  slug ILIKE '%okx-card%'
  OR slug ILIKE '%deblock%'
  OR slug ILIKE '%kucard%' OR slug ILIKE '%ku-card%'
  OR slug ILIKE '%bitrefill%'
  OR slug ILIKE '%kraken%'
  OR slug ILIKE '%gnosis%'
  OR slug ILIKE '%royal-indigo%'
)
AND lang IN ('en', 'fr', 'it')
ORDER BY lang, slug;
