// ─────────────────────────────────────────────────────────────────────────────
// alternativesContentPt.ts
// Portuguese (pt-PT) slug + copy overlay for the 16 "X alternatives" pages.
// Merged into ALT_BRANDS by alternativesContent.ts (before ALT_ROUTES is built).
// Portugal angle: cards available in PT via MiCA/Banco de Portugal-registered
// providers; paying with crypto held < 365 days = 28% capital-gains tax.
// ─────────────────────────────────────────────────────────────────────────────
import type { AltCopy } from './alternativesContent';

const YEAR = 2026;

/** brandId → { slug (pt), copy (pt) } */
export const ALT_PT: Record<string, { slug: string; copy: AltCopy }> = {
  revolut: {
    slug: 'alternativas-revolut',
    copy: {
      title: `Alternativas ao Revolut ${YEAR}, Melhores Cartões Crypto`,
      h1: `As Melhores Alternativas ao Revolut em ${YEAR}`,
      description: `O Revolut não dá cashback em cripto. Descobre as 5 melhores alternativas com recompensas em BTC/ETH, sem staking obrigatório.`,
      intro: `O Revolut é um neobanco versátil, mas não oferece cashback em criptomoeda nas compras do dia a dia. Se procuras um cartão que recompense cada despesa em BTC ou ETH, existem em ${YEAR} várias alternativas crypto-nativas disponíveis em Portugal.`,
      reason: `O Revolut não dá cashback em cripto e as suas vantagens premium exigem uma subscrição mensal cara.`,
      faq: [
        ['Porquê procurar uma alternativa ao Revolut?', `O Revolut não paga cashback em criptomoeda nas compras diárias. Cartões crypto como o Gnosis Pay, o MetaMask Card ou o Nexo dão cashback direto em BTC, ETH ou GNO em cada transação.`],
        ['Qual é a melhor alternativa ao Revolut para cashback em cripto?', `O Gnosis Pay dá 2% em GNO sem staking. O MetaMask Card dá 1% em ETH. O Nexo Card dá até 2% em BTC consoante o rácio de NEXO na tua carteira.`],
        ['As alternativas ao Revolut estão disponíveis em Portugal?', `Sim, todos os cartões listados aqui estão disponíveis para residentes em Portugal através de prestadores registados junto do Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  'crypto-com': {
    slug: 'alternativas-crypto-com',
    copy: {
      title: `Alternativas ao Crypto.com ${YEAR}, Sem Staking de CRO`,
      h1: `As Melhores Alternativas ao Crypto.com em ${YEAR}`,
      description: `O Crypto.com exige staking de CRO para as melhores taxas. Encontra cartões crypto com cashback e sem imobilização de capital.`,
      intro: `O Crypto.com oferece um bom cashback, mas os níveis mais interessantes exigem imobilizar CRO durante 180 dias. Se preferes um cartão sem staking, várias alternativas em ${YEAR} dão cashback em cripto sem bloquear o teu capital.`,
      reason: `O Crypto.com reserva as melhores taxas de cashback a quem faz staking de montantes elevados de CRO durante 180 dias.`,
      faq: [
        ['Porquê procurar uma alternativa ao Crypto.com?', `As melhores taxas do Crypto.com exigem imobilizar CRO, um token volátil, durante 180 dias. Cartões como o Nexo, o Gnosis Pay ou o Bybit dão cashback sem esse bloqueio, ou com condições mais flexíveis.`],
        ['Qual é a melhor alternativa ao Crypto.com sem staking?', `O Gnosis Pay dá 2% em GNO sem staking. O Nexo Card dá até 2% em BTC sem imobilizar capital dedicado. O Brighty dá 1,75% em USDC sem staking.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  binance: {
    slug: 'alternativas-binance',
    copy: {
      title: `Alternativas ao Binance Card ${YEAR}, Cartões Crypto UE`,
      h1: `As Melhores Alternativas ao Binance Card em ${YEAR}`,
      description: `A Binance encerrou o seu Visa Card na Europa. Descobre as 5 melhores alternativas de cartão crypto disponíveis na UE com cashback.`,
      intro: `A Binance descontinuou o seu cartão Visa na Europa, deixando muitos utilizadores sem cashback em cripto no dia a dia. Em ${YEAR}, várias alternativas crypto-nativas disponíveis em Portugal oferecem recompensas em BTC, ETH ou stablecoins.`,
      reason: `A Binance deixou de oferecer o seu Visa Card na Europa, pelo que já não é possível obter cashback em cripto com este cartão na UE.`,
      faq: [
        ['Porque é que o Binance Card já não está disponível na Europa?', `A Binance encerrou o seu programa de cartão Visa no Espaço Económico Europeu. Os utilizadores europeus têm de recorrer a outros cartões crypto para continuar a receber cashback em cripto.`],
        ['Qual é a melhor alternativa ao Binance Card?', `O Nexo Card, o Gnosis Pay e o Bybit Card estão entre as melhores alternativas com cashback em cripto disponíveis na UE, sem depender da Binance.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  bybit: {
    slug: 'alternativas-bybit',
    copy: {
      title: `Alternativas ao Bybit Card ${YEAR}, Cartões Crypto Europa`,
      h1: `As Melhores Alternativas ao Bybit Card em ${YEAR}`,
      description: `O Bybit Card só está disponível em alguns países. Compara alternativas crypto com cashback disponíveis em toda a Europa.`,
      intro: `O Bybit Card oferece um dos melhores cashbacks do mercado, mas a sua disponibilidade é limitada a alguns países. Se não tens acesso, várias alternativas em ${YEAR} dão cashback em cripto e estão disponíveis em Portugal.`,
      reason: `O Bybit Card não está disponível em todos os países europeus, o que limita o acesso a muitos utilizadores.`,
      faq: [
        ['Porquê procurar uma alternativa ao Bybit Card?', `A disponibilidade do Bybit Card é limitada a alguns países. Cartões como o Nexo, o Gnosis Pay ou o Crypto.com oferecem cashback em cripto com cobertura europeia mais ampla.`],
        ['Qual é a melhor alternativa ao Bybit Card para cashback?', `O Nexo Card dá até 2% em BTC. O Gnosis Pay dá 2% em GNO sem staking. O Crypto.com oferece taxas elevadas mediante staking de CRO.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  nexo: {
    slug: 'alternativas-nexo',
    copy: {
      title: `Alternativas ao Nexo Card ${YEAR}, Sem Token NEXO`,
      h1: `As Melhores Alternativas ao Nexo Card em ${YEAR}`,
      description: `O Nexo Card exige um rácio de NEXO para o melhor cashback em BTC. Encontra cartões crypto com cashback e sem token obrigatório.`,
      intro: `O Nexo Card é atrativo, mas o melhor cashback em BTC exige manter um rácio elevado de token NEXO na carteira. Se preferes evitar isso, várias alternativas em ${YEAR} dão cashback sem token proprietário, disponíveis em Portugal.`,
      reason: `O melhor cashback do Nexo Card depende de manter um rácio elevado de token NEXO, um ativo volátil, na tua carteira.`,
      faq: [
        ['Porquê procurar uma alternativa ao Nexo Card?', `O melhor cashback do Nexo exige um rácio elevado de token NEXO. Cartões como o Gnosis Pay ou o Brighty dão cashback sem qualquer token proprietário obrigatório.`],
        ['Qual é a melhor alternativa ao Nexo Card sem token?', `O Gnosis Pay dá 2% em GNO sem staking. O Brighty dá 1,75% em USDC. O MetaMask Card dá 1% em ETH, todos sem exigir um token proprietário.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  bitpanda: {
    slug: 'alternativas-bitpanda',
    copy: {
      title: `Alternativas ao Bitpanda ${YEAR}, Cartões Crypto Europa`,
      h1: `As Melhores Alternativas ao Bitpanda em ${YEAR}`,
      description: `O Bitpanda está sobretudo disponível na Áustria e na Alemanha. Alternativas de cartão crypto com cashback disponíveis em toda a Europa.`,
      intro: `O cartão Bitpanda está principalmente disponível na Áustria e na Alemanha. Se procuras um cartão crypto com boa cobertura em Portugal, várias alternativas em ${YEAR} dão cashback em cripto em toda a Europa.`,
      reason: `A disponibilidade do cartão Bitpanda está concentrada na Áustria e na Alemanha, com cobertura limitada noutros mercados.`,
      faq: [
        ['Porquê procurar uma alternativa ao Bitpanda?', `O cartão Bitpanda está sobretudo focado na Áustria e na Alemanha. Cartões como o Nexo, o Gnosis Pay ou o Crypto.com oferecem cashback em cripto com melhor disponibilidade em Portugal.`],
        ['Qual é a melhor alternativa ao Bitpanda?', `O Nexo Card dá até 2% em BTC. O Gnosis Pay dá 2% em GNO sem staking. O Crypto.com oferece taxas elevadas mediante staking.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  wirex: {
    slug: 'alternativas-wirex',
    copy: {
      title: `Alternativas ao Wirex ${YEAR}, Melhores Cartões Crypto`,
      h1: `As Melhores Alternativas ao Wirex em ${YEAR}`,
      description: `O Wirex encerrou a vertente crypto na UE. Descobre as melhores alternativas com mais cashback disponíveis em ${YEAR}.`,
      intro: `O Wirex foi um dos primeiros cartões crypto, mas encerrou a sua vertente cripto no Espaço Económico Europeu. Em ${YEAR}, cartões mais recentes oferecem mais cashback e estão disponíveis em Portugal.`,
      reason: `Desde 2026, o Wirex encerrou a componente cripto (despesa e Cryptoback) no EEE, deixando de estar disponível na UE.`,
      faq: [
        ['Porquê procurar uma alternativa ao Wirex?', `O Wirex encerrou a sua vertente cripto na UE. Cartões como o Gnosis Pay, o Nexo ou o Brighty oferecem cashback em cripto e continuam disponíveis em Portugal.`],
        ['Qual é a melhor alternativa ao Wirex?', `O Gnosis Pay dá 2% em GNO sem staking. O Nexo Card dá até 2% em BTC. O Brighty dá 1,75% em USDC sem staking.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  coinbase: {
    slug: 'alternativas-coinbase',
    copy: {
      title: `Alternativas ao Coinbase Card ${YEAR}, Cartões Crypto UE`,
      h1: `As Melhores Alternativas ao Coinbase Card em ${YEAR}`,
      description: `O Coinbase Card quase não está disponível na Europa. Encontra alternativas crypto-nativas com cashback disponíveis na UE.`,
      intro: `O Coinbase Card tem disponibilidade muito reduzida na Europa. Se resides em Portugal, várias alternativas crypto-nativas em ${YEAR} oferecem cashback em cripto e cobertura europeia.`,
      reason: `O Coinbase Card praticamente não está disponível para os utilizadores europeus, ao contrário dos EUA.`,
      faq: [
        ['Porquê procurar uma alternativa ao Coinbase Card?', `O Coinbase Card quase não está disponível na Europa. Cartões como o Nexo, o Gnosis Pay ou o Crypto.com oferecem cashback em cripto disponível em Portugal.`],
        ['Qual é a melhor alternativa ao Coinbase Card na UE?', `O Nexo Card dá até 2% em BTC. O Gnosis Pay dá 2% em GNO sem staking. O Crypto.com oferece taxas elevadas mediante staking de CRO.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  kraken: {
    slug: 'alternativas-kraken',
    copy: {
      title: `Alternativas ao Kraken Card ${YEAR}, Cartões Crypto Europa`,
      h1: `As Melhores Alternativas ao Kraken Card em ${YEAR}`,
      description: `O Kraken Card ainda é recente e tem disponibilidade limitada. Descobre alternativas com mais cashback e cobertura europeia completa.`,
      intro: `O Kraken Card é recente e a sua disponibilidade ainda é limitada. Em ${YEAR}, várias alternativas maduras oferecem mais cashback em cripto e estão disponíveis em Portugal.`,
      reason: `O Kraken Card é um produto novo, com disponibilidade e funcionalidades ainda limitadas.`,
      faq: [
        ['Porquê procurar uma alternativa ao Kraken Card?', `O Kraken Card é recente e limitado. Cartões como o Nexo, o Gnosis Pay ou o Crypto.com oferecem cashback em cripto já consolidado e disponível em Portugal.`],
        ['Qual é a melhor alternativa ao Kraken Card?', `O Nexo Card dá até 2% em BTC. O Gnosis Pay dá 2% em GNO sem staking. O Crypto.com oferece taxas elevadas mediante staking.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  metamask: {
    slug: 'alternativas-metamask',
    copy: {
      title: `Alternativas ao MetaMask Card ${YEAR}, Mais de 1% Cashback`,
      h1: `As Melhores Alternativas ao MetaMask Card em ${YEAR}`,
      description: `O MetaMask Card está fixo em 1% de cashback em ETH. Compara cartões com mais cashback ou outras recompensas em cripto.`,
      intro: `O MetaMask Card oferece 1% de cashback em ETH, uma taxa fixa. Se procuras mais cashback ou recompensas noutras criptos, várias alternativas em ${YEAR} estão disponíveis em Portugal.`,
      reason: `O MetaMask Card está limitado a 1% de cashback em ETH, sem níveis superiores.`,
      faq: [
        ['Porquê procurar uma alternativa ao MetaMask Card?', `O MetaMask Card está fixo em 1% em ETH. Cartões como o Gnosis Pay (2% em GNO) ou o Nexo (até 2% em BTC) podem oferecer mais cashback.`],
        ['Qual é a melhor alternativa ao MetaMask Card para mais cashback?', `O Gnosis Pay dá 2% em GNO sem staking. O Nexo Card dá até 2% em BTC. O Brighty dá 1,75% em USDC.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  okx: {
    slug: 'alternativas-okx',
    copy: {
      title: `Alternativas ao OKX Card ${YEAR}, Sem Staking de OKB`,
      h1: `As Melhores Alternativas ao OKX Card em ${YEAR}`,
      description: `O OKX Card exige staking de OKB para as melhores taxas. Descobre 5 alternativas com cashback em cripto e sem imobilizar capital.`,
      intro: `O OKX Card reserva o melhor cashback a quem faz staking de OKB. Se preferes evitar essa imobilização, várias alternativas em ${YEAR} dão cashback em cripto sem staking e estão disponíveis em Portugal.`,
      reason: `As melhores taxas de cashback do OKX Card exigem staking de OKB, um token volátil.`,
      faq: [
        ['Porquê procurar uma alternativa ao OKX Card?', `O OKX Card exige staking de OKB para as taxas mais altas. Cartões como o Gnosis Pay, o Brighty ou o Nexo dão cashback sem essa exigência.`],
        ['Qual é a melhor alternativa ao OKX Card sem staking?', `O Gnosis Pay dá 2% em GNO sem staking. O Brighty dá 1,75% em USDC. O Nexo Card dá até 2% em BTC.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  'gnosis-pay': {
    slug: 'alternativas-gnosis-pay',
    copy: {
      title: `Alternativas ao Gnosis Pay ${YEAR}, Cartões On-Chain`,
      h1: `As Melhores Alternativas ao Gnosis Pay em ${YEAR}`,
      description: `O Gnosis Pay é o único cartão on-chain da Europa. Descobre alternativas com cashback em cripto e diferentes abordagens à custódia de ativos.`,
      intro: `O Gnosis Pay distingue-se por ser um cartão totalmente on-chain, com autocustódia. Se preferes outra abordagem à custódia ou outro tipo de cashback, várias alternativas em ${YEAR} estão disponíveis em Portugal.`,
      reason: `O Gnosis Pay é um cartão on-chain com autocustódia, um modelo que não agrada a todos os perfis de utilizador.`,
      faq: [
        ['Porquê procurar uma alternativa ao Gnosis Pay?', `O Gnosis Pay é totalmente on-chain e exige gerir a autocustódia. Cartões como o Nexo ou o Crypto.com oferecem uma experiência mais tradicional com cashback em cripto.`],
        ['Qual é a melhor alternativa ao Gnosis Pay?', `O Nexo Card dá até 2% em BTC com custódia gerida. O Brighty dá 1,75% em USDC. O Crypto.com oferece taxas elevadas mediante staking.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  deblock: {
    slug: 'alternativas-deblock',
    copy: {
      title: `Alternativas ao Deblock ${YEAR}, Cartões Crypto Europeus`,
      h1: `As Melhores Alternativas ao Deblock em ${YEAR}`,
      description: `O Deblock está focado em França. Descobre alternativas com cashback em BTC/ETH disponíveis em toda a Europa, sem subscrição mensal.`,
      intro: `O Deblock está sobretudo focado no mercado francês. Se resides em Portugal, várias alternativas em ${YEAR} oferecem cashback em BTC ou ETH com cobertura europeia e sem mensalidade.`,
      reason: `O Deblock concentra-se no mercado francês, com disponibilidade limitada noutros países.`,
      faq: [
        ['Porquê procurar uma alternativa ao Deblock?', `O Deblock está focado em França. Cartões como o Nexo, o Gnosis Pay ou o Brighty oferecem cashback em cripto com melhor disponibilidade em Portugal.`],
        ['Qual é a melhor alternativa ao Deblock?', `O Gnosis Pay dá 2% em GNO sem staking. O Nexo Card dá até 2% em BTC. O Brighty dá 1,75% em USDC.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  plutus: {
    slug: 'alternativas-plutus',
    copy: {
      title: `Alternativas ao Plutus ${YEAR}, Cartões Crypto UE`,
      h1: `As Melhores Alternativas ao Plutus em ${YEAR}`,
      description: `O Plutus dá cashback em PLU com exigência de staking e foca-se no Reino Unido. Descobre alternativas europeias sem staking.`,
      intro: `O Plutus oferece cashback em token PLU com condições de staking e está centrado no Reino Unido. Em ${YEAR}, várias alternativas europeias dão cashback sem staking e estão disponíveis em Portugal.`,
      reason: `O Plutus dá cashback no seu token PLU mediante staking e está sobretudo focado no Reino Unido.`,
      faq: [
        ['Porquê procurar uma alternativa ao Plutus?', `O Plutus exige staking de PLU e foca-se no Reino Unido. Cartões como o Gnosis Pay, o Brighty ou o Nexo oferecem cashback sem staking e disponibilidade em Portugal.`],
        ['Qual é a melhor alternativa ao Plutus sem staking?', `O Gnosis Pay dá 2% em GNO sem staking. O Brighty dá 1,75% em USDC. O Nexo Card dá até 2% em BTC.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  brighty: {
    slug: 'alternativas-brighty',
    copy: {
      title: `Alternativas ao Brighty ${YEAR}, Cartões Crypto UE`,
      h1: `As Melhores Alternativas ao Brighty em ${YEAR}`,
      description: `O Brighty dá 1,75% de cashback em USDC sem staking. Descobre alternativas com taxas superiores ou cashback em BTC e ETH.`,
      intro: `O Brighty oferece 1,75% de cashback em USDC sem staking, uma proposta sólida. Se procuras taxas ainda mais altas ou recompensas em BTC/ETH, várias alternativas em ${YEAR} estão disponíveis em Portugal.`,
      reason: `O Brighty dá cashback em USDC; quem prefira recompensas em BTC ou ETH pode procurar outras opções.`,
      faq: [
        ['Porquê procurar uma alternativa ao Brighty?', `O Brighty dá cashback em USDC. Cartões como o Nexo (BTC) ou o MetaMask (ETH) oferecem recompensas noutras criptos, e o Gnosis Pay dá 2% em GNO.`],
        ['Qual é a melhor alternativa ao Brighty?', `O Gnosis Pay dá 2% em GNO sem staking. O Nexo Card dá até 2% em BTC. O MetaMask Card dá 1% em ETH.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
  bleap: {
    slug: 'alternativas-bleap',
    copy: {
      title: `Alternativas ao Bleap ${YEAR}, Cartões Crypto UE`,
      h1: `As Melhores Alternativas ao Bleap em ${YEAR}`,
      description: `O Bleap é um neobanco crypto emergente. Descobre alternativas mais estabelecidas com cashback em cripto disponíveis em toda a Europa em ${YEAR}.`,
      intro: `O Bleap é um neobanco crypto emergente com uma proposta interessante em autocustódia. Se preferes soluções mais consolidadas, várias alternativas em ${YEAR} oferecem cashback em cripto e estão disponíveis em Portugal.`,
      reason: `O Bleap é um produto emergente; alguns utilizadores preferem cartões com um historial mais longo.`,
      faq: [
        ['Porquê procurar uma alternativa ao Bleap?', `O Bleap é recente. Cartões como o Nexo, o Gnosis Pay ou o Brighty oferecem cashback em cripto já consolidado e disponível em Portugal.`],
        ['Qual é a melhor alternativa ao Bleap?', `O Gnosis Pay dá 2% em GNO sem staking. O Nexo Card dá até 2% em BTC. O Brighty dá 1,75% em USDC.`],
        ['Estas alternativas estão disponíveis em Portugal?', `Sim, todos os cartões listados estão disponíveis em Portugal através de prestadores registados no Banco de Portugal ou autorizados na UE ao abrigo do MiCA.`],
      ],
    },
  },
};
