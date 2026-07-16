-- add-faq-gnosis-metamask-it.sql

UPDATE blog_posts
SET
  updated_at = NOW(),
  content = content || '
<section style="margin-top:2rem">
<h2>FAQ — Gnosis Pay vs MetaMask Card</h2>
<dl>
<dt><strong>Qual è la differenza principale tra Gnosis Pay e MetaMask Card?</strong></dt>
<dd>Gnosis Pay si regola sulla Gnosis Chain (xDAI) con il 2% di cashback in GNO. MetaMask Card addebita direttamente il tuo wallet Ethereum con 1-3% in ETH in base al volume di spesa. Entrambe sono carte self-custody senza requisiti di staking.</dd>
<dt><strong>Quale carta ha commissioni più basse — Gnosis Pay o MetaMask Card?</strong></dt>
<dd>Entrambe non hanno commissioni annuali. Gnosis Pay applica una piccola tariffa on-chain per transazione (~€0,01). MetaMask Card può comportare costi di gas in ETH a seconda della configurazione del wallet.</dd>
<dt><strong>Quale carta è più adatta ai principianti?</strong></dt>
<dd>Gnosis Pay ha un onboarding più semplice tramite la sua app Safe wallet. MetaMask Card richiede un wallet MetaMask esistente. Entrambe sono più accessibili rispetto ad altre soluzioni on-chain.</dd>
<dt><strong>MetaMask Card è disponibile in Italia?</strong></dt>
<dd>Sì, MetaMask Card è disponibile in tutta l''UE e il SEE. Anche Gnosis Pay è disponibile in Italia. Entrambe sono conformi alla normativa MiCA.</dd>
</dl>
</section>'
WHERE slug = 'gnosis-pay-vs-metamask-card-self-custody'
AND lang = 'it'
AND content NOT ILIKE '%FAQ — Gnosis Pay vs MetaMask%';

SELECT lang, slug,
  content ILIKE '%FAQ — Gnosis Pay vs MetaMask%' AS has_faq,
  updated_at::date AS updated
FROM blog_posts
WHERE slug = 'gnosis-pay-vs-metamask-card-self-custody'
ORDER BY lang;
