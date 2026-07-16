-- add-faq-gnosis-metamask-de-es.sql
-- Ajoute FAQ aux 2 posts restants has_faq=false (DE + ES)

-- ── DE ───────────────────────────────────────────────────────────────────────
UPDATE blog_posts
SET
  updated_at = NOW(),
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — Gnosis Pay vs MetaMask Card</h2>
<dl>
<dt><strong>Was ist der Hauptunterschied zwischen Gnosis Pay und MetaMask Card?</strong></dt>
<dd>Gnosis Pay wird auf der Gnosis Chain (xDAI) mit 2% GNO-Cashback abgerechnet. MetaMask Card belastet direkt Ihr Ethereum-Wallet mit 1-3% ETH-Cashback je nach Ausgabenvolumen. Beide sind Self-Custody-Karten ohne Staking-Pflicht.</dd>
<dt><strong>Welche Karte hat niedrigere Gebühren — Gnosis Pay oder MetaMask Card?</strong></dt>
<dd>Beide haben keine Jahresgebühr. Gnosis Pay berechnet eine kleine On-Chain-Gebühr pro Transaktion (~€0,01). MetaMask Card kann ETH-Gas-Kosten verursachen, abhängig von Ihrer Wallet-Konfiguration.</dd>
<dt><strong>Welche Karte ist für Anfänger einfacher zu nutzen?</strong></dt>
<dd>Gnosis Pay bietet ein einfacheres Onboarding über die Safe-Wallet-App. MetaMask Card erfordert ein bestehendes MetaMask-Wallet. Beide sind anfängerfreundlicher als andere On-Chain-Lösungen.</dd>
<dt><strong>Ist MetaMask Card in Deutschland verfügbar?</strong></dt>
<dd>Ja, MetaMask Card ist in der gesamten EU und dem EWR verfügbar. Gnosis Pay ebenfalls. Beide sind MiCA-konform und in Deutschland einsetzbar.</dd>
</dl>
</section>'
WHERE slug = 'gnosis-pay-vs-metamask-card-self-custody'
AND lang = 'de'
AND content NOT ILIKE '%FAQ — Gnosis Pay vs MetaMask%';

-- ── ES ───────────────────────────────────────────────────────────────────────
UPDATE blog_posts
SET
  updated_at = NOW(),
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — Gnosis Pay vs MetaMask Card</h2>
<dl>
<dt><strong>¿Cuál es la diferencia principal entre Gnosis Pay y MetaMask Card?</strong></dt>
<dd>Gnosis Pay se liquida en la Gnosis Chain (xDAI) con un 2% de cashback en GNO. MetaMask Card debita directamente tu wallet Ethereum con un 1-3% en ETH según el volumen de gasto. Ambas son tarjetas self-custody sin requisitos de staking.</dd>
<dt><strong>¿Qué tarjeta tiene comisiones más bajas — Gnosis Pay o MetaMask Card?</strong></dt>
<dd>Ambas tienen comisión anual cero. Gnosis Pay cobra una pequeña tarifa on-chain por transacción (~€0,01). MetaMask Card puede implicar costes de gas en ETH según la configuración de tu wallet.</dd>
<dt><strong>¿Cuál es más fácil de usar para principiantes?</strong></dt>
<dd>Gnosis Pay tiene un onboarding más sencillo a través de su app Safe wallet. MetaMask Card requiere un wallet MetaMask existente. Ambas son más accesibles que otras soluciones on-chain.</dd>
<dt><strong>¿MetaMask Card está disponible en España?</strong></dt>
<dd>Sí, MetaMask Card está disponible en toda la UE y el EEE. Gnosis Pay también. Ambas cumplen con la normativa MiCA y funcionan en España.</dd>
</dl>
</section>'
WHERE slug = 'gnosis-pay-vs-metamask-card-self-custody'
AND lang = 'es'
AND content NOT ILIKE '%FAQ — Gnosis Pay vs MetaMask%';

-- ── VÉRIFICATION ────────────────────────────────────────────────────────────
SELECT lang, slug,
  content ILIKE '%FAQ — Gnosis Pay vs MetaMask%' AS has_faq,
  updated_at::date AS updated
FROM blog_posts
WHERE slug = 'gnosis-pay-vs-metamask-card-self-custody'
ORDER BY lang;
