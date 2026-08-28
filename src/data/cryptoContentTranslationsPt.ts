// ─────────────────────────────────────────────────────────────────────────────
// cryptoContentTranslationsPt.ts
// Portuguese (pt-PT) content for the 10 crypto guide pages.
// Merged into CRYPTO_CONTENT via cryptoContent.ts.
// Portugal-specific angle: crypto held < 365 days is taxed at 28% (IRS cat. G);
// held >= 365 days it is exempt (0%). Paying with crypto = a taxable disposal.
// ─────────────────────────────────────────────────────────────────────────────
import type { CryptoCopy } from './cryptoContent';

/** symbol → { pt: copy } */
export const CRYPTO_TRANSLATIONS_PT: Record<string, { pt: CryptoCopy }> = {
  // ──────────────────────────────────────────────────────────── BITCOIN ──────
  btc: {
    pt: {
      meta_title: 'Bitcoin (BTC): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre o Bitcoin em 2026: como funciona, história, vantagens, riscos e como gastá-lo com um cartão crypto em Portugal. Guia completo e atualizado.',
      h1: 'Bitcoin (BTC): O Guia Completo 2026',
      intro: `<p>O <strong>Bitcoin (BTC)</strong> é a primeira criptomoeda do mundo, criada em 2009 por um indivíduo ou grupo sob o pseudónimo <strong>Satoshi Nakamoto</strong>. Em menos de 15 anos, passou de uma experiência criptográfica confidencial a um ativo financeiro reconhecido por Estados, fundos de investimento institucionais e milhões de particulares em todo o mundo.</p>
<p>Com uma capitalização de mercado geralmente superior à de todas as outras criptomoedas juntas, o Bitcoin funciona como uma <strong>reserva de valor digital</strong>, muitas vezes apelidada de «ouro digital». A sua oferta está matematicamente limitada a <strong>21 milhões de unidades</strong>, uma escassez programada que o distingue das moedas fiduciárias, que podem ser impressas sem limite.</p>`,
      sections: [
        {
          title: 'História do Bitcoin',
          content: `<p>Tudo começa em outubro de 2008 com a publicação do <em>whitepaper</em> de Satoshi Nakamoto: <em>«Bitcoin: A Peer-to-Peer Electronic Cash System»</em>. A 3 de janeiro de 2009 é minerado o primeiro bloco, o <em>genesis block</em>, com uma referência subtil a uma manchete de jornal sobre a crise bancária. Uma mensagem sobre a razão de ser do projeto.</p>
<p>Os primeiros anos são experimentais. Em 2010, um programador gasta <strong>10 000 BTC em duas pizas</strong>, transação lendária que deu origem ao «Bitcoin Pizza Day», celebrado a 22 de maio. Em 2013, o BTC ultrapassa pela primeira vez os 1 000 $. Em 2017 chega aos 20 000 $ numa primeira euforia especulativa. Em 2021 supera os 60 000 $. Apesar de ciclos de subida e descida violentos, a tendência de fundo mantém-se ascendente no longo prazo.</p>
<p>Uma viragem institucional chega em 2024 com a aprovação, pela SEC norte-americana, dos primeiros <strong>ETF de Bitcoin à vista</strong>, abrindo caminho a milhares de milhões de dólares de investimento institucional (BlackRock, Fidelity). Empresas como a MicroStrategy e alguns Estados passam a incluir o Bitcoin nos seus balanços ou reservas.</p>`,
        },
        {
          title: 'Como funciona o Bitcoin?',
          content: `<p>O Bitcoin assenta numa <strong>blockchain</strong>, um registo distribuído e imutável onde cada transação fica gravada em blocos encadeados criptograficamente. Esse registo é mantido por milhares de nós (computadores) espalhados pelo mundo, sem qualquer autoridade central capaz de o alterar.</p>
<p>O mecanismo de validação é o <strong>Proof of Work (PoW)</strong>: os mineradores competem para resolver problemas matemáticos complexos (SHA-256). O vencedor acrescenta o bloco seguinte à cadeia e recebe uma recompensa em BTC. Essa recompensa é dividida ao meio a cada ~4 anos, num evento chamado <strong>halving</strong>. O último halving ocorreu em abril de 2024, reduzindo a recompensa para 3,125 BTC por bloco, um mecanismo deflacionista integrado no protocolo.</p>
<p>Para pagamentos rápidos de baixo valor, a <strong>Lightning Network</strong> é uma solução de camada 2 que permite transações quase instantâneas e quase gratuitas entre participantes, sem sobrecarregar a cadeia principal.</p>`,
        },
        {
          title: 'Casos de uso do Bitcoin',
          content: `<ul>
<li><strong>Reserva de valor</strong>: o uso dominante. Particulares e instituições compram BTC como proteção contra a inflação e a desvalorização monetária.</li>
<li><strong>Pagamentos internacionais</strong>: enviar fundos para o outro lado do mundo em minutos, sem intermediário bancário e por uma fração das comissões SWIFT.</li>
<li><strong>Despesas do dia a dia com cartão crypto</strong>: os cartões Nexo, Wirex, Crypto.com ou Coinbase permitem gastar BTC em qualquer sítio onde a Visa/Mastercard seja aceite, com conversão instantânea em euros.</li>
<li><strong>Colateral em DeFi</strong>: através de versões «embrulhadas» como o Wrapped BTC (wBTC) ou o cbBTC, é possível usar o Bitcoin como colateral em protocolos DeFi na Ethereum.</li>
<li><strong>Moeda legal</strong>: em El Salvador e na República Centro-Africana, o Bitcoin é reconhecido como moeda com curso legal.</li>
</ul>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Oferta limitada a 21 milhões, uma escassez garantida pelo código e não por uma promessa</li>
<li>A rede mais descentralizada e segura de toda a indústria crypto</li>
<li>Liquidez global máxima: compra-se e vende-se 24 horas por dia, 7 dias por semana</li>
<li>Adoção institucional e soberana crescente (ETF, tesourarias de empresas, Estados)</li>
<li>Nenhuma autoridade central pode alterar as regras do protocolo</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Forte volatilidade: quedas de -50% a -80% já aconteceram várias vezes</li>
<li>Consumo energético elevado (Proof of Work)</li>
<li>Escalabilidade limitada na cadeia principal (~7 transações por segundo)</li>
<li>Risco regulatório em alguns países</li>
<li>Perda irreversível em caso de perda da chave privada ou da seed phrase</li>
</ul>`,
        },
        {
          title: 'Como comprar e guardar Bitcoin?',
          content: `<p>Comprar BTC faz-se numa plataforma de troca (exchange) regulada. Em Portugal, procura prestadores registados como VASP junto do <strong>Banco de Portugal</strong> ou autorizados noutro Estado-Membro da UE ao abrigo do regime <strong>MiCA</strong>. O processo passa por uma verificação de identidade (KYC), um depósito por transferência SEPA ou cartão, e a ordem de compra.</p>
<p>Para guardar, tens duas opções. A <strong>custódia na exchange</strong> é prática mas confia as tuas chaves a um terceiro. A <strong>autocustódia</strong>, numa carteira de hardware (Ledger, Trezor) ou de software, dá-te o controlo total: «not your keys, not your coins». Para montantes significativos, uma carteira de hardware é a opção mais prudente. Guarda a tua seed phrase offline, nunca a partilhes e nunca a fotografes.</p>`,
        },
        {
          title: 'Gastar o teu Bitcoin com um cartão crypto',
          content: `<p>Um <strong>cartão crypto</strong> permite gastar BTC no dia a dia sem passar manualmente por uma exchange. No momento do pagamento, o cartão converte o Bitcoin em euros e a transação é aceite em qualquer terminal Visa ou Mastercard. Alguns cartões devolvem ainda uma percentagem de <strong>cashback</strong> em cripto.</p>
<p><strong>Especificidade portuguesa:</strong> pagar com Bitcoin é, para efeitos fiscais, uma <em>alienação</em> (venda) da cripto. A mais-valia realizada é tributada a <strong>28%</strong> (categoria G do IRS) se o BTC for detido há <strong>menos de 365 dias</strong>. Se for detido há <strong>um ano ou mais</strong>, a mais-valia está <strong>isenta</strong>. Na prática, gastar com o cartão os teus bitcoins mais antigos (≥ 365 dias) pode ser fiscalmente vantajoso. Consulta o nosso <a href="/pt/cartoes">comparativo de cartões</a> para encontrar o mais adequado.</p>`,
        },
      ],
      faq: [
        { q: 'Quantos Bitcoin existem?', a: 'A oferta está limitada a 21 milhões de BTC. Já foram minerados mais de 19,5 milhões; os restantes serão emitidos progressivamente até cerca de 2140, com as recompensas a diminuir a cada halving.' },
        { q: 'O Bitcoin é legal em Portugal?', a: 'Sim. Comprar, deter e vender Bitcoin é perfeitamente legal em Portugal. As plataformas devem estar registadas como VASP junto do Banco de Portugal ou autorizadas na UE ao abrigo do MiCA. As mais-valias em cripto detida há menos de 365 dias são tributadas a 28%.' },
        { q: 'Qual é a diferença entre Bitcoin e Ethereum?', a: 'O Bitcoin foi concebido sobretudo como reserva de valor e sistema de pagamento. A Ethereum é uma plataforma programável que executa contratos inteligentes e aplicações descentralizadas. São complementares mais do que concorrentes.' },
        { q: 'Posso perder todos os meus Bitcoin?', a: 'Sim, se perderes a tua chave privada ou seed phrase, ou se fores vítima de fraude. O Bitcoin não tem serviço de apoio que reponha o acesso. Uma carteira de hardware e uma cópia de segurança offline da seed reduzem drasticamente esse risco.' },
        { q: 'Como gastar os meus Bitcoin sem os vender numa exchange?', a: 'Um cartão crypto converte automaticamente o BTC em euros no momento do pagamento. Em Portugal, lembra-te de que esse pagamento conta como uma alienação: a mais-valia é tributada a 28% se a cripto tiver menos de 365 dias, e isenta a partir de um ano.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────── ETHEREUM ──────
  eth: {
    pt: {
      meta_title: 'Ethereum (ETH): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre a Ethereum em 2026: contratos inteligentes, staking, gas, vantagens, riscos e como gastar ETH com um cartão crypto em Portugal.',
      h1: 'Ethereum (ETH): O Guia Completo 2026',
      intro: `<p>A <strong>Ethereum (ETH)</strong> é a segunda maior criptomoeda por capitalização de mercado e, sobretudo, a plataforma de <strong>contratos inteligentes</strong> mais utilizada do mundo. Lançada em 2015 por Vitalik Buterin e vários cofundadores, transformou a blockchain de um simples livro de contas num computador mundial programável.</p>
<p>Ao contrário do Bitcoin, cujo objetivo principal é ser reserva de valor, a Ethereum permite construir <strong>aplicações descentralizadas</strong> (dApps): finança descentralizada (DeFi), NFT, jogos, identidade digital e muito mais. O ETH é a moeda que alimenta este ecossistema, usada para pagar as taxas de transação, chamadas <em>gas</em>.</p>`,
      sections: [
        {
          title: 'História da Ethereum',
          content: `<p>A ideia nasce em 2013, quando Vitalik Buterin, então com 19 anos, propõe uma blockchain capaz de executar qualquer programa. Após uma pré-venda em 2014, a rede arranca a 30 de julho de 2015. Em 2016, o ataque ao fundo «The DAO» leva a uma divisão da comunidade e ao aparecimento da Ethereum Classic.</p>
<p>O marco mais importante é <strong>The Merge</strong>, em setembro de 2022: a Ethereum abandona o Proof of Work e passa para o <strong>Proof of Stake</strong>, reduzindo o seu consumo energético em cerca de 99,9%. Seguem-se atualizações que reduzem custos e melhoram a escalabilidade através das redes de camada 2.</p>`,
        },
        {
          title: 'Como funciona a Ethereum?',
          content: `<p>A Ethereum executa <strong>contratos inteligentes</strong>: programas que correm exatamente como foram escritos, sem possibilidade de censura ou paragem. Estes contratos são executados pela <strong>Ethereum Virtual Machine (EVM)</strong>, replicada em todos os nós da rede.</p>
<p>Desde The Merge, a rede é validada por <strong>Proof of Stake</strong>: os validadores bloqueiam (fazem stake de) 32 ETH para propor e validar blocos, recebendo recompensas em troca. Cada transação paga uma taxa de <em>gas</em>, cujo valor varia conforme a procura. Para reduzir custos, a maioria da atividade migrou para redes de <strong>camada 2</strong> (Arbitrum, Optimism, Base), que agrupam transações antes de as liquidar na Ethereum.</p>`,
        },
        {
          title: 'Casos de uso da Ethereum',
          content: `<ul>
<li><strong>Finança descentralizada (DeFi)</strong>: empréstimos, trocas e rendimentos sem banco, através de protocolos como Aave, Uniswap ou Lido.</li>
<li><strong>Stablecoins</strong>: a maioria dos USDC e USDT circula em Ethereum e nas suas camadas 2.</li>
<li><strong>NFT e ativos digitais</strong>: arte, colecionáveis, bilhetes e identidade digital.</li>
<li><strong>Staking</strong>: bloquear ETH para ajudar a proteger a rede e receber um rendimento anual.</li>
<li><strong>Pagamentos com cartão crypto</strong>: gastar ETH em euros em qualquer comerciante.</li>
</ul>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Maior ecossistema de aplicações descentralizadas do mundo</li>
<li>Passagem para Proof of Stake: consumo energético reduzido em ~99,9%</li>
<li>Possibilidade de rendimento passivo via staking</li>
<li>Emissão líquida por vezes negativa (deflacionista) em períodos de forte utilização</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Taxas de gas por vezes elevadas na cadeia principal</li>
<li>Complexidade técnica superior à do Bitcoin</li>
<li>Concorrência de outras blockchains (Solana, Avalanche)</li>
<li>Risco de erro num contrato inteligente ou num protocolo</li>
</ul>`,
        },
        {
          title: 'Como comprar e guardar ETH?',
          content: `<p>O ETH compra-se numa exchange regulada, com prestadores registados como VASP junto do <strong>Banco de Portugal</strong> ou autorizados na UE ao abrigo do <strong>MiCA</strong>. Após o KYC e um depósito SEPA, colocas a tua ordem de compra.</p>
<p>Para guardar, uma carteira de software (MetaMask, Rabby) dá acesso direto a todo o ecossistema DeFi, enquanto uma carteira de hardware (Ledger, Trezor) oferece a máxima segurança para montantes elevados. Guarda a tua seed phrase offline. Se fizeres staking, compreende bem os prazos de desbloqueio antes de imobilizares o teu ETH.</p>`,
        },
        {
          title: 'Gastar o teu ETH com um cartão crypto',
          content: `<p>Um cartão crypto converte o teu ETH em euros no momento do pagamento, aceite em qualquer terminal Visa ou Mastercard, muitas vezes com cashback em cripto.</p>
<p><strong>Especificidade portuguesa:</strong> gastar ETH é uma alienação tributável. A mais-valia é tributada a <strong>28%</strong> se o ETH for detido há <strong>menos de 365 dias</strong>, e <strong>isenta</strong> a partir de um ano. Atenção: converter ETH em stablecoin também conta como alienação. Vê o nosso <a href="/pt/cartoes">comparativo de cartões</a> para escolher o teu.</p>`,
        },
      ],
      faq: [
        { q: 'O que é o gas na Ethereum?', a: 'O gas é a unidade que mede o custo de uma transação ou da execução de um contrato inteligente. Paga-se em ETH e o preço sobe quando a rede está congestionada. As camadas 2 reduzem fortemente esse custo.' },
        { q: 'Posso ganhar juros com o meu ETH?', a: 'Sim, através do staking. Ao bloquear ETH (diretamente com 32 ETH, ou via serviços de staking líquido como o Lido), recebes um rendimento anual pela participação na segurança da rede. Em Portugal, os rendimentos de staking têm o seu próprio enquadramento fiscal.' },
        { q: 'O que é uma camada 2 (layer 2)?', a: 'É uma rede construída por cima da Ethereum (Arbitrum, Optimism, Base) que agrupa muitas transações e as liquida em bloco na cadeia principal, reduzindo drasticamente as taxas mantendo a segurança da Ethereum.' },
        { q: 'Qual é a diferença entre ETH e um token ERC-20?', a: 'O ETH é a moeda nativa da rede, usada para pagar o gas. Um token ERC-20 (como o USDC) é criado por um contrato inteligente e utiliza a Ethereum como infraestrutura, mas não é a moeda nativa.' },
        { q: 'A Ethereum é deflacionista?', a: 'Pode ser. Desde a atualização EIP-1559, parte das taxas é queimada. Em períodos de forte utilização, a quantidade queimada supera a nova emissão, tornando a oferta líquida negativa.' },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────── XRP ──────
  xrp: {
    pt: {
      meta_title: 'XRP (Ripple): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre o XRP em 2026: XRP Ledger, pagamentos internacionais, o processo com a SEC, vantagens, riscos e como gastá-lo com um cartão crypto.',
      h1: 'XRP (Ripple): O Guia Completo 2026',
      intro: `<p>O <strong>XRP</strong> é uma criptomoeda concebida para pagamentos internacionais rápidos e baratos. Funciona no <strong>XRP Ledger</strong>, uma blockchain lançada em 2012, independente da empresa <strong>Ripple</strong>, que a promove junto de bancos e instituições financeiras.</p>
<p>Ao contrário do Bitcoin, o XRP não é minerado: as 100 mil milhões de unidades foram criadas de uma só vez na origem. As transações liquidam em 3 a 5 segundos por uma fração de cêntimo, o que posiciona o XRP como alternativa às redes de transferência tradicionais como o SWIFT.</p>`,
      sections: [
        {
          title: 'História do XRP e da Ripple',
          content: `<p>O XRP Ledger nasce em 2012, criado por Jed McCaleb, Arthur Britto e David Schwartz. A empresa Ripple (na altura OpenCoin) é fundada no mesmo ano para promover a tecnologia junto do setor financeiro.</p>
<p>Em dezembro de 2020, a SEC norte-americana processa a Ripple, alegando que o XRP era um título financeiro não registado. Em julho de 2023, um tribunal decide que o XRP <strong>não é um título</strong> quando vendido ao público em mercados secundários, uma vitória parcial que trouxe clareza ao ativo e relançou o seu interesse.</p>`,
        },
        {
          title: 'Como funciona o XRP Ledger?',
          content: `<p>O XRP Ledger não usa Proof of Work nem Proof of Stake, mas um <strong>mecanismo de consenso próprio</strong> baseado numa lista de validadores de confiança. Estes validadores chegam a acordo sobre o estado do registo a cada poucos segundos.</p>
<p>O resultado é uma rede muito rápida (3-5 segundos por transação), com custos ínfimos e um consumo energético muito baixo face ao Bitcoin. O XRP Ledger integra ainda uma exchange descentralizada nativa e suporta a emissão de tokens e stablecoins.</p>`,
        },
        {
          title: 'Casos de uso do XRP',
          content: `<ul>
<li><strong>Pagamentos transfronteiriços</strong>: liquidação quase instantânea entre moedas, sem pré-financiar contas no estrangeiro.</li>
<li><strong>Ativo-ponte</strong>: converter rapidamente uma moeda noutra através do XRP.</li>
<li><strong>Micropagamentos</strong>: custos ínfimos que viabilizam transações de valor muito baixo.</li>
<li><strong>Despesas do dia a dia com cartão crypto</strong>: gastar XRP em euros junto de qualquer comerciante.</li>
</ul>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Transações muito rápidas (3-5 segundos) e quase gratuitas</li>
<li>Consumo energético muito baixo</li>
<li>Clareza jurídica reforçada após a decisão de 2023 nos EUA</li>
<li>Parcerias reais com instituições financeiras</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Grande parte da oferta é detida pela Ripple, o que suscita críticas sobre a centralização</li>
<li>Descentralização dos validadores por vezes questionada</li>
<li>Dependência da adoção pelas instituições financeiras</li>
<li>Volatilidade ligada às notícias regulatórias</li>
</ul>`,
        },
        {
          title: 'Como comprar e guardar XRP?',
          content: `<p>O XRP compra-se em várias exchanges reguladas. Em Portugal, privilegia prestadores registados como VASP junto do <strong>Banco de Portugal</strong> ou autorizados na UE ao abrigo do <strong>MiCA</strong>. Após o KYC e um depósito SEPA, colocas a tua ordem.</p>
<p>Atenção: uma carteira XRP exige uma <strong>reserva mínima</strong> de alguns XRP para permanecer ativa. Para guardar, uma carteira de hardware (Ledger) suporta o XRP e oferece a melhor segurança. Guarda a tua seed phrase offline.</p>`,
        },
        {
          title: 'Gastar o teu XRP com um cartão crypto',
          content: `<p>Um cartão crypto converte o teu XRP em euros no momento do pagamento, aceite em qualquer terminal Visa ou Mastercard.</p>
<p><strong>Especificidade portuguesa:</strong> gastar XRP é uma alienação tributável. A mais-valia é tributada a <strong>28%</strong> se o XRP for detido há <strong>menos de 365 dias</strong>, e <strong>isenta</strong> a partir de um ano. Consulta o nosso <a href="/pt/cartoes">comparativo de cartões</a>.</p>`,
        },
      ],
      faq: [
        { q: 'XRP e Ripple são a mesma coisa?', a: 'Não. O XRP é a criptomoeda e o XRP Ledger é a blockchain onde circula. A Ripple é uma empresa privada que promove esta tecnologia e detém uma parte significativa dos XRP, mas a rede pode funcionar sem ela.' },
        { q: 'Qual é a quantidade máxima de XRP?', a: 'Foram criados 100 mil milhões de XRP na origem, sem qualquer nova emissão. Uma pequena quantidade é destruída a cada transação, pelo que a oferta diminui lentamente ao longo do tempo.' },
        { q: 'O que foi o processo da SEC contra a Ripple?', a: 'A SEC acusou a Ripple de ter vendido XRP como um título financeiro não registado. Em 2023, um tribunal decidiu que as vendas ao público em mercados secundários não constituíam títulos, uma vitória parcial para a Ripple.' },
        { q: 'O XRP é verdadeiramente descentralizado?', a: 'O XRP Ledger funciona com uma lista de validadores de confiança, dos quais a Ripple opera apenas uma minoria. Os críticos apontam que a Ripple detém muitos XRP, mas a rede em si é operada por validadores independentes em todo o mundo.' },
        { q: 'O XRP pode substituir o SWIFT?', a: 'O XRP foi concebido para tornar as transferências internacionais mais rápidas e baratas do que o SWIFT. Algumas instituições já o utilizam, mas a substituição total do sistema tradicional continua por concretizar.' },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────── BNB ──────
  bnb: {
    pt: {
      meta_title: 'BNB (Binance Coin): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre o BNB em 2026: BNB Chain, descontos, staking, vantagens, riscos e como gastá-lo com um cartão crypto em Portugal.',
      h1: 'BNB (Binance Coin): O Guia Completo 2026',
      intro: `<p>O <strong>BNB</strong> é a criptomoeda nativa do ecossistema da <strong>Binance</strong>, a maior exchange de criptomoedas do mundo. Lançado em 2017, começou como um simples token de desconto sobre as comissões de negociação e tornou-se a moeda de uma blockchain completa, a <strong>BNB Chain</strong>.</p>
<p>O BNB serve para pagar taxas de transação, aceder a vendas de novos tokens, fazer staking e alimentar milhares de aplicações descentralizadas. É uma das criptomoedas mais utilizadas em termos de volume de transações.</p>`,
      sections: [
        {
          title: 'História do BNB',
          content: `<p>O BNB é lançado em julho de 2017 durante uma ICO, inicialmente na Ethereum como token ERC-20. O seu objetivo era oferecer descontos nas comissões da Binance. Com o crescimento explosivo da exchange, o BNB ganha valor e utilidade.</p>
<p>Em 2019, a Binance lança a sua própria blockchain e o BNB migra para ela. Uma característica marcante é o <strong>burn trimestral</strong>: a Binance destrói regularmente BNB para reduzir a oferta, com o objetivo declarado de a fazer descer de 200 milhões para 100 milhões de unidades.</p>`,
        },
        {
          title: 'Como funciona a BNB Chain?',
          content: `<p>A <strong>BNB Chain</strong> é uma blockchain compatível com a EVM, o que significa que executa os mesmos contratos inteligentes que a Ethereum, mas com taxas mais baixas e blocos mais rápidos. Utiliza um mecanismo de consenso Proof of Stake com um número limitado de validadores, o que a torna rápida mas mais centralizada.</p>
<p>Esta compensação, mais velocidade e custos baixos em troca de menor descentralização, tornou a BNB Chain popular para DeFi, jogos e aplicações de retalho, sobretudo entre utilizadores da Binance.</p>`,
        },
        {
          title: 'Casos de uso do BNB',
          content: `<ul>
<li><strong>Redução de comissões</strong>: pagar as taxas de negociação na Binance com BNB dá desconto.</li>
<li><strong>Taxas de transação</strong>: o BNB paga o gas na BNB Chain.</li>
<li><strong>Staking e rendimento</strong>: bloquear BNB para gerar rendimento passivo.</li>
<li><strong>Launchpad</strong>: aceder a vendas de novos tokens de projetos.</li>
<li><strong>Pagamentos com cartão crypto</strong>: gastar BNB em euros no dia a dia.</li>
</ul>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Utilidade real dentro do maior ecossistema crypto do mundo</li>
<li>Taxas baixas e transações rápidas na BNB Chain</li>
<li>Burn regular que reduz a oferta ao longo do tempo</li>
<li>Ampla aceitação em plataformas e aplicações</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Forte dependência da Binance e da sua situação regulatória</li>
<li>Rede mais centralizada do que a Ethereum</li>
<li>Escrutínio regulatório sobre a Binance em vários países</li>
<li>Volatilidade ligada às notícias sobre a empresa</li>
</ul>`,
        },
        {
          title: 'Como comprar e guardar BNB?',
          content: `<p>O BNB compra-se principalmente na Binance, mas também noutras exchanges. Em Portugal, verifica que a plataforma está registada como VASP junto do <strong>Banco de Portugal</strong> ou autorizada na UE ao abrigo do <strong>MiCA</strong>. Após o KYC e um depósito SEPA, colocas a tua ordem.</p>
<p>Para guardar, uma carteira compatível com a BNB Chain (MetaMask, Trust Wallet) dá acesso às aplicações do ecossistema, enquanto uma carteira de hardware oferece maior segurança. Guarda a tua seed phrase offline.</p>`,
        },
        {
          title: 'Gastar o teu BNB com um cartão crypto',
          content: `<p>Um cartão crypto converte o teu BNB em euros no momento do pagamento, aceite em qualquer terminal Visa ou Mastercard.</p>
<p><strong>Especificidade portuguesa:</strong> gastar BNB é uma alienação tributável. A mais-valia é tributada a <strong>28%</strong> se o BNB for detido há <strong>menos de 365 dias</strong>, e <strong>isenta</strong> a partir de um ano. Vê o nosso <a href="/pt/cartoes">comparativo de cartões</a>.</p>`,
        },
      ],
      faq: [
        { q: 'O que é o burn de BNB?', a: 'A Binance destrói regularmente uma parte dos BNB em circulação, um processo chamado burn. Isto reduz gradualmente a oferta total, com o objetivo declarado de a fazer descer para 100 milhões de unidades.' },
        { q: 'O BNB está ligado apenas à Binance?', a: 'O BNB nasceu como token da Binance, mas hoje alimenta toda a BNB Chain e milhares de aplicações independentes. Ainda assim, o seu valor continua muito ligado à saúde da Binance.' },
        { q: 'O que é a BNB Chain?', a: 'É a blockchain do ecossistema Binance, compatível com a EVM da Ethereum. Oferece taxas baixas e transações rápidas, em troca de uma maior centralização dos validadores.' },
        { q: 'O BNB está disponível em Portugal?', a: 'Sim, o BNB pode ser comprado e detido em Portugal através de plataformas reguladas. As mais-valias em cripto detida há menos de 365 dias são tributadas a 28%.' },
        { q: 'Como fazer staking de BNB?', a: 'Podes fazer staking de BNB diretamente na Binance ou em protocolos DeFi da BNB Chain para gerar rendimento. Compreende sempre os prazos de bloqueio e o enquadramento fiscal dos rendimentos em Portugal.' },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────── SOL ──────
  sol: {
    pt: {
      meta_title: 'Solana (SOL): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre a Solana em 2026: velocidade, taxas baixas, staking, vantagens, riscos e como gastar SOL com um cartão crypto em Portugal.',
      h1: 'Solana (SOL): O Guia Completo 2026',
      intro: `<p>A <strong>Solana (SOL)</strong> é uma blockchain de alto desempenho, concebida para processar milhares de transações por segundo com taxas ínfimas. Lançada em 2020, posiciona-se como uma das principais alternativas à Ethereum para aplicações descentralizadas, pagamentos e NFT.</p>
<p>O SOL é a moeda nativa da rede: paga as taxas de transação, permite fazer staking e alimenta um ecossistema em rápido crescimento de aplicações de DeFi, jogos e finança de retalho.</p>`,
      sections: [
        {
          title: 'História da Solana',
          content: `<p>A Solana foi fundada por Anatoly Yakovenko, cuja ideia central, o <strong>Proof of History</strong>, procura ordenar as transações de forma muito eficiente. A rede principal arranca em 2020 e conhece um crescimento explosivo em 2021, impulsionada pelos NFT e pela DeFi.</p>
<p>A queda da FTX no final de 2022, muito ligada ao ecossistema Solana, atinge fortemente o SOL. Mas a rede recupera em 2023-2024 graças a uma comunidade de programadores ativa e a uma nova vaga de aplicações, confirmando a sua resiliência.</p>`,
        },
        {
          title: 'Como funciona a Solana?',
          content: `<p>A Solana combina o <strong>Proof of Stake</strong> com o <strong>Proof of History</strong>, uma espécie de relógio criptográfico que permite ordenar as transações sem que os validadores tenham de negociar constantemente entre si. Este método permite um débito muito elevado e taxas de uma fração de cêntimo.</p>
<p>Em contrapartida, a rede exige validadores potentes e já sofreu, no passado, algumas <strong>interrupções</strong> em períodos de congestão extrema. Melhorias sucessivas reforçaram desde então a sua estabilidade.</p>`,
        },
        {
          title: 'Casos de uso da Solana',
          content: `<ul>
<li><strong>Pagamentos rápidos e baratos</strong>: ideal para transações frequentes de baixo valor.</li>
<li><strong>DeFi</strong>: trocas, empréstimos e rendimentos com taxas mínimas.</li>
<li><strong>NFT e jogos</strong>: um dos ecossistemas mais ativos do setor.</li>
<li><strong>Staking</strong>: bloquear SOL para proteger a rede e receber rendimento.</li>
<li><strong>Pagamentos com cartão crypto</strong>: gastar SOL em euros no dia a dia.</li>
</ul>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Velocidade excecional (milhares de transações por segundo)</li>
<li>Taxas de transação ínfimas</li>
<li>Ecossistema de programadores muito dinâmico</li>
<li>Rendimento de staking atrativo</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Historial de interrupções da rede</li>
<li>Validadores mais exigentes, o que limita a descentralização</li>
<li>Concorrência intensa da Ethereum e das suas camadas 2</li>
<li>Volatilidade elevada</li>
</ul>`,
        },
        {
          title: 'Como comprar e guardar SOL?',
          content: `<p>O SOL compra-se em várias exchanges reguladas. Em Portugal, privilegia prestadores registados como VASP junto do <strong>Banco de Portugal</strong> ou autorizados na UE ao abrigo do <strong>MiCA</strong>. Após o KYC e um depósito SEPA, colocas a tua ordem.</p>
<p>Para guardar, a carteira Phantom é a mais popular no ecossistema Solana e integra-se com carteiras de hardware Ledger para maior segurança. Guarda a tua seed phrase offline.</p>`,
        },
        {
          title: 'Gastar o teu SOL com um cartão crypto',
          content: `<p>Um cartão crypto converte o teu SOL em euros no momento do pagamento, aceite em qualquer terminal Visa ou Mastercard.</p>
<p><strong>Especificidade portuguesa:</strong> gastar SOL é uma alienação tributável. A mais-valia é tributada a <strong>28%</strong> se o SOL for detido há <strong>menos de 365 dias</strong>, e <strong>isenta</strong> a partir de um ano. Consulta o nosso <a href="/pt/cartoes">comparativo de cartões</a>.</p>`,
        },
      ],
      faq: [
        { q: 'A Solana teve mesmo interrupções?', a: 'Sim. Em 2021 e 2022, a rede sofreu várias paragens ligadas a congestão extrema. Desde então, foram implementadas melhorias significativas que reforçaram bastante a sua estabilidade.' },
        { q: 'O que é o Proof of History?', a: 'É uma inovação da Solana que cria uma espécie de relógio criptográfico. Permite ordenar as transações de forma muito eficiente, sem que os validadores tenham de negociar constantemente a ordem entre si, aumentando muito a velocidade.' },
        { q: 'Como fazer staking de SOL?', a: 'Podes delegar os teus SOL a um validador através de uma carteira como a Phantom, ou fazer staking diretamente numa exchange. Recebes um rendimento anual. Em Portugal, os rendimentos de staking têm o seu próprio enquadramento fiscal.' },
        { q: 'A Solana é melhor do que a Ethereum?', a: 'São diferentes. A Solana aposta na velocidade e nos custos baixos com uma cadeia única; a Ethereum privilegia a descentralização e delega a escalabilidade às camadas 2. A escolha depende das prioridades de cada utilizador.' },
        { q: 'A carteira Phantom é segura?', a: 'A Phantom é uma carteira reputada do ecossistema Solana. Como qualquer carteira de software, a segurança depende da proteção da tua seed phrase. Para montantes elevados, associa-a a uma carteira de hardware Ledger.' },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────── ADA ──────
  ada: {
    pt: {
      meta_title: 'Cardano (ADA): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre a Cardano em 2026: abordagem científica, staking, contratos inteligentes, vantagens, riscos e como gastar ADA com um cartão crypto.',
      h1: 'Cardano (ADA): O Guia Completo 2026',
      intro: `<p>A <strong>Cardano (ADA)</strong> é uma blockchain de terceira geração, conhecida pela sua abordagem <strong>científica e revista por pares</strong>. Fundada em 2017 por Charles Hoskinson, um dos cofundadores da Ethereum, distingue-se por um desenvolvimento metódico, apoiado em investigação académica.</p>
<p>O ADA é a moeda nativa da rede: paga as taxas de transação, permite fazer staking e participar na governação. A Cardano privilegia a segurança e a sustentabilidade em detrimento da velocidade de lançamento de novas funcionalidades.</p>`,
      sections: [
        {
          title: 'História da Cardano',
          content: `<p>A Cardano é lançada em 2017 por Charles Hoskinson, com o apoio da fundação Cardano e da empresa IOHK. O projeto adota uma abordagem única: cada evolução importante é objeto de artigos científicos revistos por pares antes de ser implementada.</p>
<p>Esta metodologia rigorosa explica um ritmo de desenvolvimento mais lento. Os contratos inteligentes só chegaram em 2021, com a atualização Alonzo, vários anos após o lançamento. A comunidade valoriza esta prudência como garantia de robustez a longo prazo.</p>`,
        },
        {
          title: 'Como funciona a Cardano?',
          content: `<p>A Cardano utiliza um mecanismo de <strong>Proof of Stake</strong> chamado Ouroboros, concebido para ser seguro e eficiente em termos energéticos. Os detentores de ADA podem delegar os seus tokens a «stake pools» sem os imobilizar, mantendo a total liberdade de os movimentar.</p>
<p>A arquitetura separa a camada de liquidação (transações) da camada de cálculo (contratos inteligentes), com o objetivo de facilitar as evoluções futuras sem comprometer a estabilidade da rede.</p>`,
        },
        {
          title: 'Casos de uso da Cardano',
          content: `<ul>
<li><strong>Staking flexível</strong>: gerar rendimento sem bloquear os tokens.</li>
<li><strong>Contratos inteligentes e DeFi</strong>: aplicações descentralizadas em crescimento.</li>
<li><strong>Identidade digital</strong>: projetos de identidade, sobretudo em países em desenvolvimento.</li>
<li><strong>Governação</strong>: os detentores de ADA participam nas decisões da rede.</li>
<li><strong>Pagamentos com cartão crypto</strong>: gastar ADA em euros no dia a dia.</li>
</ul>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Abordagem científica e código revisto por pares</li>
<li>Staking flexível, sem bloqueio dos tokens</li>
<li>Consumo energético baixo (Proof of Stake)</li>
<li>Comunidade fiel e governação descentralizada</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Desenvolvimento lento face à concorrência</li>
<li>Ecossistema DeFi menos maduro do que o da Ethereum ou da Solana</li>
<li>Adoção real ainda por confirmar em vários casos de uso</li>
<li>Volatilidade elevada</li>
</ul>`,
        },
        {
          title: 'Como comprar e guardar ADA?',
          content: `<p>O ADA compra-se em várias exchanges reguladas. Em Portugal, privilegia prestadores registados como VASP junto do <strong>Banco de Portugal</strong> ou autorizados na UE ao abrigo do <strong>MiCA</strong>. Após o KYC e um depósito SEPA, colocas a tua ordem.</p>
<p>Para guardar, as carteiras Daedalus (completa) e Yoroi (leve) são oficiais do ecossistema Cardano e permitem delegar o teu ADA a uma stake pool. Uma carteira de hardware Ledger oferece a melhor segurança. Guarda a tua seed phrase offline.</p>`,
        },
        {
          title: 'Gastar o teu ADA com um cartão crypto',
          content: `<p>Um cartão crypto converte o teu ADA em euros no momento do pagamento, aceite em qualquer terminal Visa ou Mastercard.</p>
<p><strong>Especificidade portuguesa:</strong> gastar ADA é uma alienação tributável. A mais-valia é tributada a <strong>28%</strong> se o ADA for detido há <strong>menos de 365 dias</strong>, e <strong>isenta</strong> a partir de um ano. Vê o nosso <a href="/pt/cartoes">comparativo de cartões</a>.</p>`,
        },
      ],
      faq: [
        { q: 'Porque é que a Cardano demora tanto a desenvolver-se?', a: 'A Cardano adota uma abordagem científica: cada evolução importante é revista por pares antes de ser implementada. Esta metodologia é mais lenta, mas visa maximizar a segurança e a robustez a longo prazo.' },
        { q: 'Como funciona o staking na Cardano?', a: 'Delegas os teus ADA a uma stake pool sem os imobilizar nem os transferir. Continuam na tua carteira e podes movimentá-los quando quiseres, enquanto recebes um rendimento regular.' },
        { q: 'A Cardano suporta contratos inteligentes?', a: 'Sim, desde a atualização Alonzo em 2021. O ecossistema de aplicações descentralizadas está a crescer, embora ainda seja menos maduro do que o da Ethereum.' },
        { q: 'Qual é a relação entre a Cardano e Charles Hoskinson?', a: 'Charles Hoskinson é cofundador da Cardano e um dos primeiros cofundadores da Ethereum. Lidera a IOHK, uma das empresas que desenvolvem a rede Cardano.' },
        { q: 'O ADA tem uma oferta máxima?', a: 'Sim, a oferta máxima é de 45 mil milhões de ADA. Uma parte já está em circulação e o resto é distribuído progressivamente através das recompensas de staking.' },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────── AVAX ──────
  avax: {
    pt: {
      meta_title: 'Avalanche (AVAX): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre a Avalanche em 2026: subnets, velocidade, DeFi, vantagens, riscos e como gastar AVAX com um cartão crypto em Portugal.',
      h1: 'Avalanche (AVAX): O Guia Completo 2026',
      intro: `<p>A <strong>Avalanche (AVAX)</strong> é uma blockchain rápida e escalável, concebida para rivalizar com a Ethereum oferecendo transações quase instantâneas e taxas moderadas. Lançada em 2020, distingue-se pela sua arquitetura em <strong>subnets</strong>, redes personalizáveis adaptadas a cada necessidade.</p>
<p>O AVAX é a moeda nativa da rede: paga as taxas, permite fazer staking e proteger a rede. A Avalanche atraiu tanto projetos DeFi como instituições interessadas na criação de blockchains à medida.</p>`,
      sections: [
        {
          title: 'História da Avalanche',
          content: `<p>A Avalanche é desenvolvida pela Ava Labs, fundada por Emin Gün Sirer, um investigador reconhecido em sistemas distribuídos. A rede principal arranca em setembro de 2020, após uma venda de tokens muito procurada.</p>
<p>Em 2021, a Avalanche conhece um forte crescimento graças a um programa de incentivos que atrai projetos e liquidez da DeFi. Posteriormente, o foco desloca-se para as <strong>subnets</strong> e para a adoção institucional, com blockchains dedicadas a empresas e a instituições financeiras.</p>`,
        },
        {
          title: 'Como funciona a Avalanche?',
          content: `<p>A Avalanche assenta em três blockchains complementares: a <strong>X-Chain</strong> (troca de ativos), a <strong>C-Chain</strong> (contratos inteligentes, compatível com a EVM) e a <strong>P-Chain</strong> (coordenação dos validadores e das subnets).</p>
<p>A grande inovação são as <strong>subnets</strong>: qualquer entidade pode criar a sua própria blockchain, com as suas regras, mantendo a interoperabilidade com o ecossistema Avalanche. O consenso é muito rápido, com finalidade das transações em poucos segundos.</p>`,
        },
        {
          title: 'Casos de uso da Avalanche',
          content: `<ul>
<li><strong>DeFi</strong>: um ecossistema ativo de trocas, empréstimos e rendimentos.</li>
<li><strong>Subnets empresariais</strong>: blockchains à medida para empresas e instituições.</li>
<li><strong>Tokenização de ativos</strong>: ativos do mundo real representados na cadeia.</li>
<li><strong>Jogos e NFT</strong>: aplicações que beneficiam de taxas moderadas.</li>
<li><strong>Pagamentos com cartão crypto</strong>: gastar AVAX em euros no dia a dia.</li>
</ul>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Transações rápidas com finalidade em poucos segundos</li>
<li>Arquitetura flexível graças às subnets</li>
<li>Compatibilidade com a EVM da Ethereum</li>
<li>Interesse institucional crescente</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Concorrência intensa entre blockchains rápidas</li>
<li>Adoção das subnets ainda em fase inicial</li>
<li>Complexidade técnica para os principiantes</li>
<li>Volatilidade elevada</li>
</ul>`,
        },
        {
          title: 'Como comprar e guardar AVAX?',
          content: `<p>O AVAX compra-se em várias exchanges reguladas. Em Portugal, privilegia prestadores registados como VASP junto do <strong>Banco de Portugal</strong> ou autorizados na UE ao abrigo do <strong>MiCA</strong>. Após o KYC e um depósito SEPA, colocas a tua ordem.</p>
<p>Para guardar, a carteira Core (oficial da Avalanche) ou a MetaMask dão acesso à C-Chain e às aplicações DeFi. Uma carteira de hardware Ledger oferece a melhor segurança. Guarda a tua seed phrase offline.</p>`,
        },
        {
          title: 'Gastar o teu AVAX com um cartão crypto',
          content: `<p>Um cartão crypto converte o teu AVAX em euros no momento do pagamento, aceite em qualquer terminal Visa ou Mastercard.</p>
<p><strong>Especificidade portuguesa:</strong> gastar AVAX é uma alienação tributável. A mais-valia é tributada a <strong>28%</strong> se o AVAX for detido há <strong>menos de 365 dias</strong>, e <strong>isenta</strong> a partir de um ano. Consulta o nosso <a href="/pt/cartoes">comparativo de cartões</a>.</p>`,
        },
      ],
      faq: [
        { q: 'O que é uma subnet da Avalanche?', a: 'Uma subnet é uma blockchain personalizada criada dentro do ecossistema Avalanche. Permite a uma empresa ou projeto definir as suas próprias regras (validadores, taxas, confidencialidade) mantendo a interoperabilidade com a rede.' },
        { q: 'A Avalanche é mesmo mais rápida do que a Ethereum?', a: 'A Avalanche oferece a finalidade das transações em poucos segundos na sua cadeia principal, mais rápido do que a cadeia base da Ethereum. A Ethereum delega parte da escalabilidade às suas camadas 2.' },
        { q: 'Como fazer staking de AVAX?', a: 'Podes fazer staking de AVAX tornando-te validador (com um mínimo elevado) ou delegando os teus tokens a um validador existente. Recebes um rendimento anual. Em Portugal, os rendimentos de staking têm o seu próprio enquadramento fiscal.' },
        { q: 'Porque é que algumas instituições escolhem a Avalanche?', a: 'As subnets permitem criar blockchains privadas e conformes à regulação, mantendo a ligação a um ecossistema público. Isto interessa a instituições que pretendem tokenizar ativos com regras próprias.' },
        { q: 'O AVAX é usado em DeFi?', a: 'Sim, a Avalanche tem um ecossistema DeFi ativo de trocas, empréstimos e protocolos de rendimento, facilitado pela compatibilidade com a EVM da Ethereum.' },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────── DOGE ──────
  doge: {
    pt: {
      meta_title: 'Dogecoin (DOGE): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre o Dogecoin em 2026: origem meme, comunidade, pagamentos, vantagens, riscos e como gastar DOGE com um cartão crypto em Portugal.',
      h1: 'Dogecoin (DOGE): O Guia Completo 2026',
      intro: `<p>O <strong>Dogecoin (DOGE)</strong> é a criptomoeda «meme» mais conhecida do mundo. Criado em 2013 como uma paródia, a partir do famoso meme do cão Shiba Inu, tornou-se, contra todas as expectativas, um ativo com uma comunidade enorme e uma capitalização de mercado significativa.</p>
<p>Apesar das suas origens humorísticas, o Dogecoin é utilizado para pagamentos e gorjetas online, e beneficia de taxas baixas e transações rápidas. A sua notoriedade deve muito ao apoio público de figuras influentes, sobretudo Elon Musk.</p>`,
      sections: [
        {
          title: 'História do Dogecoin',
          content: `<p>O Dogecoin nasce em dezembro de 2013, criado por Billy Markus e Jackson Palmer como uma brincadeira sobre a especulação em criptomoedas. Rapidamente reúne uma comunidade calorosa, conhecida por financiar causas beneméritas e por dar «gorjetas» online.</p>
<p>Durante anos permanece um fenómeno de nicho, até que, em 2021, os tweets de Elon Musk e uma onda especulativa fazem disparar o seu valor. Desde então, o DOGE mantém-se um dos criptoativos mais reconhecidos, impulsionado pela cultura da internet.</p>`,
        },
        {
          title: 'Como funciona o Dogecoin?',
          content: `<p>O Dogecoin assenta numa tecnologia derivada do Litecoin, ele próprio derivado do Bitcoin. Utiliza o <strong>Proof of Work</strong>, mas com blocos gerados a cada minuto, o que torna as transações mais rápidas do que as do Bitcoin.</p>
<p>Ao contrário do Bitcoin, o Dogecoin <strong>não tem oferta máxima</strong>: são emitidos cerca de 5 mil milhões de DOGE por ano. Esta inflação constante é apresentada como um incentivo para usar a moeda em vez de a acumular.</p>`,
        },
        {
          title: 'Casos de uso do Dogecoin',
          content: `<ul>
<li><strong>Gorjetas e microdoações</strong>: recompensar criadores de conteúdos online.</li>
<li><strong>Pagamentos</strong>: aceite por alguns comerciantes, com taxas baixas.</li>
<li><strong>Ferramenta comunitária</strong>: financiamento de causas e ações solidárias.</li>
<li><strong>Pagamentos com cartão crypto</strong>: gastar DOGE em euros no dia a dia.</li>
</ul>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Transações rápidas e taxas muito baixas</li>
<li>Comunidade grande e ativa</li>
<li>Forte notoriedade e liquidez elevada</li>
<li>Simplicidade de utilização</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Sem oferta máxima: inflação constante</li>
<li>Valor muito dependente do sentimento e das redes sociais</li>
<li>Poucas evoluções técnicas face a outras cadeias</li>
<li>Volatilidade extrema</li>
</ul>`,
        },
        {
          title: 'Como comprar e guardar DOGE?',
          content: `<p>O DOGE compra-se na maioria das exchanges reguladas. Em Portugal, privilegia prestadores registados como VASP junto do <strong>Banco de Portugal</strong> ou autorizados na UE ao abrigo do <strong>MiCA</strong>. Após o KYC e um depósito SEPA, colocas a tua ordem.</p>
<p>Para guardar, existe uma carteira oficial Dogecoin, e as carteiras de hardware Ledger e Trezor suportam o DOGE para maior segurança. Guarda a tua seed phrase offline. Dada a volatilidade, investe apenas o que estás disposto a perder.</p>`,
        },
        {
          title: 'Gastar o teu DOGE com um cartão crypto',
          content: `<p>Um cartão crypto converte o teu DOGE em euros no momento do pagamento, aceite em qualquer terminal Visa ou Mastercard.</p>
<p><strong>Especificidade portuguesa:</strong> gastar DOGE é uma alienação tributável. A mais-valia é tributada a <strong>28%</strong> se o DOGE for detido há <strong>menos de 365 dias</strong>, e <strong>isenta</strong> a partir de um ano. Vê o nosso <a href="/pt/cartoes">comparativo de cartões</a>.</p>`,
        },
      ],
      faq: [
        { q: 'O Dogecoin é um investimento sério?', a: 'O Dogecoin nasceu como uma paródia e o seu valor depende muito do sentimento e das redes sociais. Tem uma comunidade grande e liquidez elevada, mas continua a ser um ativo altamente especulativo. Investe com prudência.' },
        { q: 'Qual é a relação entre o Dogecoin e Elon Musk?', a: 'Elon Musk apoiou publicamente o Dogecoin em várias ocasiões, e os seus tweets provocaram fortes variações no preço. Não controla o projeto, mas a sua influência sobre o valor do DOGE tem sido notória.' },
        { q: 'O Dogecoin tem uma oferta máxima?', a: 'Não. Ao contrário do Bitcoin, o Dogecoin não tem limite de oferta. São emitidos cerca de 5 mil milhões de DOGE por ano, o que gera uma inflação constante.' },
        { q: 'Pode mesmo pagar-se com DOGE?', a: 'Sim, alguns comerciantes aceitam DOGE diretamente, e um cartão crypto permite gastá-lo em euros em qualquer sítio. As taxas baixas tornam-no prático para pequenos pagamentos.' },
        { q: 'Dogecoin vs Shiba Inu: qual é a diferença?', a: 'Ambos são moedas meme, mas o Dogecoin tem a sua própria blockchain em Proof of Work, enquanto o Shiba Inu é um token construído sobre a Ethereum. O Dogecoin é o mais antigo e reconhecido dos dois.' },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────── USDT ──────
  usdt: {
    pt: {
      meta_title: 'Tether (USDT): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre o USDT em 2026: como funciona a stablecoin, reservas, MiCA, vantagens, riscos e como gastá-lo com um cartão crypto em Portugal.',
      h1: 'Tether (USDT): O Guia Completo 2026',
      intro: `<p>O <strong>Tether (USDT)</strong> é a maior <strong>stablecoin</strong> do mundo, uma criptomoeda concebida para manter um valor estável de 1 dólar americano. Lançado em 2014, tornou-se a espinha dorsal da liquidez em todo o mercado crypto, com um volume de transações que rivaliza com o do Bitcoin.</p>
<p>O USDT permite conservar valor em dólares na blockchain, sem a volatilidade das outras criptomoedas. É usado para negociar, transferir fundos e proteger-se das quedas de mercado, mantendo os ativos num ambiente crypto.</p>`,
      sections: [
        {
          title: 'História do Tether (USDT)',
          content: `<p>O Tether é lançado em 2014 com um objetivo simples: representar o dólar na blockchain. Cada USDT deveria estar coberto por reservas reais detidas pela empresa Tether Limited.</p>
<p>Ao longo dos anos, o USDT cresce muito, mas enfrenta interrogações recorrentes sobre a natureza exata das suas reservas. A empresa publica desde então relatórios regulares e afirma manter reservas maioritariamente em obrigações do Tesouro dos EUA e equivalentes de tesouraria.</p>`,
        },
        {
          title: 'Como funciona o Tether?',
          content: `<p>O USDT é uma stablecoin <strong>colateralizada</strong>: para cada token em circulação, a Tether afirma deter o equivalente em reservas. A paridade com o dólar é mantida por um mecanismo de emissão e resgate junto de clientes verificados.</p>
<p>O USDT existe em várias blockchains (Ethereum, Tron, Solana e outras), o que lhe dá uma flexibilidade enorme. Enviar USDT na Tron ou na Solana, por exemplo, custa apenas alguns cêntimos.</p>`,
        },
        {
          title: 'Casos de uso do USDT',
          content: `<ul>
<li><strong>Refúgio face à volatilidade</strong>: converter cripto em USDT para «bloquear» o valor em dólares.</li>
<li><strong>Negociação</strong>: par de referência na maioria das exchanges.</li>
<li><strong>Transferências internacionais</strong>: enviar dólares em minutos por poucos cêntimos.</li>
<li><strong>DeFi</strong>: fornecer liquidez e gerar rendimento.</li>
<li><strong>Pagamentos com cartão crypto</strong>: gastar USDT em euros no dia a dia.</li>
</ul>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Estabilidade de valor face às criptomoedas voláteis</li>
<li>Liquidez máxima, aceite em quase todo o lado</li>
<li>Disponível em muitas blockchains</li>
<li>Transferências rápidas e baratas</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Interrogações históricas sobre a transparência das reservas</li>
<li>Risco de contraparte ligado à empresa Tether</li>
<li>Risco de perda de paridade em caso de crise de confiança</li>
<li>Estatuto regulatório sob escrutínio na Europa (MiCA)</li>
</ul>`,
        },
        {
          title: 'O USDT e a regulação MiCA',
          content: `<p>O regulamento europeu <strong>MiCA</strong> impõe regras estritas às stablecoins, sobretudo em matéria de reservas e transparência. Algumas plataformas europeias ajustaram a disponibilidade do USDT para se conformarem com estas exigências.</p>
<p>Na prática, em Portugal e na UE, poderás por vezes ver o USDC (que anunciou conformidade com o MiCA) mais promovido do que o USDT em certas plataformas reguladas. Verifica sempre a disponibilidade do USDT na tua exchange antes de contares com ele.</p>`,
        },
        {
          title: 'Gastar o teu USDT com um cartão crypto',
          content: `<p>Um cartão crypto converte o teu USDT em euros no momento do pagamento, aceite em qualquer terminal Visa ou Mastercard.</p>
<p><strong>Especificidade portuguesa:</strong> como o USDT é uma stablecoin em dólares, uma mais-valia só pode surgir da variação EUR/USD. Ainda assim, gastá-lo continua a ser uma alienação, tributada a <strong>28%</strong> sobre eventual mais-valia se detido há menos de 365 dias, e <strong>isenta</strong> a partir de um ano. Consulta o nosso <a href="/pt/cartoes">comparativo de cartões</a>.</p>`,
        },
      ],
      faq: [
        { q: 'O USDT está mesmo coberto por dólares?', a: 'A Tether afirma deter reservas equivalentes ao USDT em circulação, maioritariamente em obrigações do Tesouro dos EUA e equivalentes de tesouraria. Publica relatórios regulares, embora a transparência exata tenha sido historicamente questionada.' },
        { q: 'Qual é a diferença entre USDT e USDC?', a: 'Ambos são stablecoins em dólares. O USDC, emitido pela Circle, é geralmente visto como mais transparente e regulado, e anunciou conformidade com o MiCA. O USDT tem maior liquidez e adoção global.' },
        { q: 'O USDT pode perder a sua paridade com o dólar?', a: 'Sim, pode desviar-se temporariamente de 1 dólar em momentos de stress de mercado ou de crise de confiança. Historicamente, tem recuperado a paridade, mas o risco não é nulo.' },
        { q: 'Como enviar USDT ao menor custo?', a: 'O custo depende da blockchain usada. Enviar USDT na Tron ou na Solana custa apenas alguns cêntimos, ao passo que na Ethereum as taxas podem ser mais elevadas. Confirma sempre a rede antes de enviar.' },
        { q: 'A Tether pode mesmo congelar os meus USDT?', a: 'Sim. A Tether tem a capacidade técnica de congelar endereços, geralmente a pedido das autoridades. É uma diferença face às criptomoedas descentralizadas, onde nenhuma entidade pode bloquear os teus fundos.' },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────── USDC ──────
  usdc: {
    pt: {
      meta_title: 'USD Coin (USDC): Guia Completo 2026 | TopCryptoCards',
      meta_description:
        'Tudo sobre o USDC em 2026: a stablecoin regulada, MiCA, transparência, vantagens, riscos e como gastá-la com um cartão crypto em Portugal.',
      h1: 'USD Coin (USDC): O Guia Completo 2026',
      intro: `<p>O <strong>USD Coin (USDC)</strong> é uma <strong>stablecoin</strong> em dólares emitida pela empresa <strong>Circle</strong>. Concebido para manter um valor estável de 1 dólar, distingue-se pela sua ênfase na transparência, na conformidade regulatória e na qualidade das reservas.</p>
<p>O USDC é muito usado na DeFi, nos pagamentos e como refúgio face à volatilidade. É frequentemente considerado a stablecoin de referência para quem valoriza a regulação e a segurança, sobretudo na Europa desde a entrada em vigor do MiCA.</p>`,
      sections: [
        {
          title: 'História do USDC',
          content: `<p>O USDC é lançado em 2018 pela Circle, em parceria com a Coinbase, através do consórcio Centre. O seu objetivo é oferecer uma stablecoin transparente e conforme à regulação, apoiada em reservas verificáveis.</p>
<p>Ao longo dos anos, o USDC ganha a confiança de instituições e programadores graças a auditorias regulares e a uma comunicação clara sobre as suas reservas. Torna-se uma das stablecoins mais utilizadas na DeFi e nos pagamentos.</p>`,
        },
        {
          title: 'Como funciona o USDC?',
          content: `<p>Cada USDC é coberto por um dólar ou equivalente (numerário e obrigações do Tesouro dos EUA de curto prazo), detido em reservas geridas por instituições financeiras reguladas. A Circle publica relatórios regulares sobre a composição destas reservas.</p>
<p>O USDC existe em muitas blockchains (Ethereum, Solana, Base, Avalanche e outras), o que facilita as transferências rápidas e baratas conforme a rede escolhida. A paridade com o dólar é mantida pela emissão e resgate junto de clientes verificados.</p>`,
        },
        {
          title: 'Casos de uso do USDC',
          content: `<ul>
<li><strong>Refúgio face à volatilidade</strong>: conservar valor em dólares na blockchain.</li>
<li><strong>DeFi</strong>: emprestar, fornecer liquidez e gerar rendimento com um ativo estável.</li>
<li><strong>Pagamentos e transferências</strong>: enviar dólares em minutos por poucos cêntimos.</li>
<li><strong>Tesouraria de empresas</strong>: gerir fundos em dólares na blockchain.</li>
<li><strong>Pagamentos com cartão crypto</strong>: gastar USDC em euros no dia a dia.</li>
</ul>`,
        },
        {
          title: 'O USDC e a regulação MiCA',
          content: `<p>O USDC foi uma das primeiras stablecoins a anunciar a sua <strong>conformidade com o MiCA</strong>, o regulamento europeu que enquadra os criptoativos. Isto reforçou a sua posição na Europa, onde várias plataformas o promovem como a stablecoin de referência.</p>
<p>Em Portugal e no resto da UE, esta conformidade traduz-se numa maior disponibilidade do USDC em plataformas reguladas, e num nível de confiança elevado para os utilizadores atentos ao enquadramento legal.</p>`,
        },
        {
          title: 'Vantagens e riscos',
          content: `<p><strong>Vantagens:</strong></p>
<ul>
<li>Transparência elevada e auditorias regulares</li>
<li>Conformidade com o MiCA na Europa</li>
<li>Reservas de alta qualidade (numerário e obrigações do Tesouro dos EUA)</li>
<li>Ampla adoção na DeFi e nos pagamentos</li>
</ul>
<p><strong>Riscos:</strong></p>
<ul>
<li>Risco de contraparte ligado à Circle e aos bancos depositários</li>
<li>Possível perda temporária de paridade em caso de crise bancária</li>
<li>Menor liquidez global do que o USDT</li>
<li>Capacidade de congelar endereços a pedido das autoridades</li>
</ul>`,
        },
        {
          title: 'Gastar o teu USDC com um cartão crypto',
          content: `<p>Um cartão crypto converte o teu USDC em euros no momento do pagamento, aceite em qualquer terminal Visa ou Mastercard.</p>
<p><strong>Especificidade portuguesa:</strong> como o USDC é uma stablecoin em dólares, uma mais-valia só pode surgir da variação EUR/USD. Gastá-lo continua a ser uma alienação, tributada a <strong>28%</strong> sobre eventual mais-valia se detido há menos de 365 dias, e <strong>isenta</strong> a partir de um ano. Vê o nosso <a href="/pt/cartoes">comparativo de cartões</a>.</p>`,
        },
      ],
      faq: [
        { q: 'O USDC é mais seguro do que o USDT?', a: 'O USDC é geralmente visto como mais transparente e regulado, com auditorias regulares e conformidade com o MiCA. O USDT tem maior liquidez global. A escolha depende de valorizares mais a transparência ou a adoção.' },
        { q: 'O que cobre o USDC?', a: 'Cada USDC é coberto por um dólar ou equivalente, detido em reservas de numerário e obrigações do Tesouro dos EUA de curto prazo, geridas por instituições reguladas. A Circle publica relatórios regulares sobre estas reservas.' },
        { q: 'O que acontece se o USDC perder a paridade?', a: 'Em março de 2023, o USDC desviou-se temporariamente de 1 dólar após a falência de um banco onde tinha reservas, mas recuperou rapidamente a paridade. O risco existe, ainda que a qualidade das reservas o reduza.' },
        { q: 'A Circle pode mesmo congelar os meus USDC?', a: 'Sim, a Circle pode congelar endereços, geralmente a pedido das autoridades. É uma diferença face às criptomoedas descentralizadas, onde nenhuma entidade pode bloquear os teus fundos.' },
        { q: 'O USDC está disponível em todas as blockchains?', a: 'O USDC está disponível em muitas blockchains (Ethereum, Solana, Base, Avalanche e outras). Confirma sempre a rede usada antes de uma transferência, pois um envio para a rede errada pode resultar na perda dos fundos.' },
      ],
    },
  },
};
