import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

/* ── Translations ─────────────────────────────────────────────────────────── */
const CONTENT: Record<string, {
  title: string;
  readTime: string;
  euTitle: string;
  warningTitle: string;
  warningText: string;
  sections: { h: string; p: string | string[] }[];
  ukTitle: string;
  ukWarningTitle: string;
  ukWarningText: string;
  ukSections: { h: string; p: string | string[] }[];
  noAdvice: string;
}> = {
  fr: {
    title: 'Résumé des risques crypto',
    readTime: 'Temps de lecture estimé : 2 minutes',
    euTitle: 'Version EU / France / Allemagne',
    warningTitle: 'Avertissement sur les risques (MiCA / UE)',
    warningText: 'Les crypto-actifs sont des produits hautement spéculatifs. Leur valeur peut fluctuer considérablement et vous pourriez perdre la totalité du capital investi. Les crypto-actifs ne bénéficient généralement pas des protections offertes aux produits financiers réglementés.',
    sections: [
      { h: 'Vous pouvez perdre la totalité de votre investissement', p: ['Les crypto-actifs sont extrêmement volatils. La valeur des tokens peut chuter brutalement et rapidement. Les performances passées ne préjugent pas des performances futures.', 'Cela s\'applique également aux crypto-actifs perçus en cashback sur une carte crypto. Si vous recevez des récompenses en tokens (CRO, GNO, BNB, PLU ou autres), leur valeur peut diminuer significativement avant que vous puissiez les utiliser ou les convertir.'] },
      { h: 'Vous n\'êtes généralement pas protégé par les garanties bancaires', p: ['Les produits crypto ne bénéficient pas de la protection des dépôts offerte par les banques réglementées dans l\'UE (directive 2014/49/UE, jusqu\'à 100 000 €). Certains émetteurs détiennent une licence d\'établissement de monnaie électronique, mais ces protections ne s\'étendent pas aux crypto-actifs.', 'En France, l\'AMF supervise les PSAN. Sous MiCA (Règlement (UE) 2023/1114), les prestataires de services sur crypto-actifs doivent être agréés. Registre public : www.amf-france.org'] },
      { h: 'Vous pourriez ne pas pouvoir vendre ou convertir quand vous le souhaitez', p: ['Certains tokens présentent un faible volume d\'échange ou une liquidité limitée. Les cartes nécessitant un staking bloquent votre capital pendant une durée déterminée.'] },
      { h: 'Les produits crypto sont complexes', p: 'Les cartes crypto combinent une carte de paiement (régulée), un crypto-actif (partiellement réglementé sous MiCA), un programme de récompenses, et dans certains cas un mécanisme de staking. Ne souscrivez pas à un produit que vous ne comprenez pas entièrement.' },
      { h: 'Ne mettez pas tous vos œufs dans le même panier', p: 'N\'engagez que des fonds dont vous pouvez vous permettre la perte totale. Les autorités financières européennes recommandent de ne pas investir une part significative de votre épargne dans des crypto-actifs.' },
      { h: 'Ce site ne constitue pas un conseil financier', p: 'TopCryptoCards est une publication éditoriale indépendante. Nos contenus ne constituent pas un conseil financier personnalisé. Nous ne sommes pas agréés par l\'AMF ou toute autre autorité de régulation financière. Consultez un conseiller financier agréé si nécessaire.' },
    ],
    ukTitle: 'Version UK (FCA)',
    ukWarningTitle: 'FCA Risk warning',
    ukWarningText: 'Don\'t invest unless you\'re prepared to lose all the money you invest. Crypto is a high-risk investment and you are unlikely to be protected if something goes wrong.',
    ukSections: [
      { h: 'You could lose all the money you invest', p: ['Cryptoassets are highly volatile. The value of crypto tokens can fall sharply, and you may lose all of the money you put in. Past performance does not predict future returns.', 'This applies equally to cryptoassets you receive as cashback on a crypto card. Your real return may be significantly lower than the headline cashback rate suggests.'] },
      { h: 'You are unlikely to get your money back if something goes wrong', p: ['Most crypto products are not regulated in the UK in the same way as banks. The FSCS does not protect cryptoasset investments. Some issuers hold an FCA EMI registration, which covers fiat balances only — not cryptoasset cashback or staking.'] },
      { h: 'You may not be able to sell or convert when you want to', p: 'Some cashback tokens have low trading volume or limited liquidity. Cards requiring staking lock your capital for a fixed period.' },
      { h: 'Crypto products are complex', p: 'Crypto cards combine a payment card, a cryptoasset, a rewards programme, and sometimes a staking arrangement. Don\'t apply for a product you don\'t fully understand.' },
      { h: 'Don\'t put all your eggs in one basket', p: 'Only commit money you can afford to lose entirely. The FCA recommends holding no more than 10% of your investable assets in cryptoassets.' },
      { h: 'This site is not financial advice', p: 'TopCryptoCards is an editorial publication. Our content is not personal financial advice. We are not authorised by the FCA to give regulated financial advice.' },
    ],
    noAdvice: 'Aucun conseil financier.',
  },
  de: {
    title: 'Krypto-Risikohinweis',
    readTime: 'Geschätzte Lesezeit: 2 Minuten',
    euTitle: 'Version EU / Deutschland',
    warningTitle: 'Risikohinweis (MiCA / EU)',
    warningText: 'Krypto-Assets sind hochspekulative Produkte. Ihr Wert kann erheblich schwanken, und Sie könnten Ihr gesamtes investiertes Kapital verlieren. Krypto-Assets genießen in der Regel nicht den Schutz regulierter Finanzprodukte.',
    sections: [
      { h: 'Sie können Ihr gesamtes Investment verlieren', p: ['Krypto-Assets sind äußerst volatil. Der Wert von Token kann schnell und stark fallen. Vergangene Wertentwicklungen sind kein verlässlicher Indikator für zukünftige Ergebnisse.', 'Dies gilt auch für Krypto-Assets, die Sie als Cashback auf einer Krypto-Karte erhalten. Wenn Sie Belohnungen in Token (CRO, GNO, BNB, PLU usw.) erhalten, kann deren Wert erheblich sinken, bevor Sie sie nutzen oder umtauschen können.'] },
      { h: 'Sie sind in der Regel nicht durch Bankgarantien geschützt', p: ['Krypto-Produkte profitieren nicht vom Einlagenschutz regulierter EU-Banken (Richtlinie 2014/49/EU, bis zu 100.000 €). Einige Emittenten halten eine E-Geld-Lizenz, diese Schutzmaßnahmen erstrecken sich jedoch nicht auf Krypto-Assets.', 'In Deutschland überwacht die BaFin Finanzdienstleister. Unter MiCA (VO (EU) 2023/1114, seit Dezember 2024) müssen Krypto-Dienstleister (CASP) zugelassen sein. Öffentliches Register: www.bafin.de'] },
      { h: 'Sie könnten nicht verkaufen oder umtauschen können, wenn Sie es möchten', p: 'Einige Token haben ein geringes Handelsvolumen oder begrenzte Liquidität. Karten, die Staking erfordern, sperren Ihr Kapital für einen bestimmten Zeitraum.' },
      { h: 'Krypto-Produkte sind komplex', p: 'Krypto-Karten kombinieren eine Zahlungskarte (reguliert), einen Krypto-Asset (teilweise unter MiCA geregelt), ein Belohnungsprogramm und in einigen Fällen ein Staking-Arrangement. Beantragen Sie kein Produkt, das Sie nicht vollständig verstehen.' },
      { h: 'Setzen Sie nicht alles auf eine Karte', p: 'Setzen Sie nur Mittel ein, deren vollständigen Verlust Sie sich leisten können. Die europäischen Finanzaufsichtsbehörden empfehlen, keinen erheblichen Teil Ihrer Ersparnisse in Krypto-Assets zu investieren.' },
      { h: 'Diese Website ist keine Finanzberatung', p: 'TopCryptoCards ist eine unabhängige redaktionelle Publikation. Unsere Inhalte sind keine persönliche Finanzberatung. Wir sind von der BaFin oder einer anderen Finanzaufsichtsbehörde nicht zugelassen. Wenden Sie sich bei Bedarf an einen zugelassenen Finanzberater.' },
    ],
    ukTitle: 'UK-Version (FCA)',
    ukWarningTitle: 'FCA-Risikohinweis',
    ukWarningText: 'Investieren Sie nicht, wenn Sie nicht bereit sind, Ihr gesamtes investiertes Geld zu verlieren. Krypto ist eine hochriskante Investition.',
    ukSections: [
      { h: 'Sie könnten Ihr gesamtes Geld verlieren', p: 'Krypto-Assets sind äußerst volatil. Vergangene Wertentwicklungen sind kein verlässlicher Indikator.' },
      { h: 'Sie sind im Schadensfall wahrscheinlich nicht geschützt', p: 'Das FSCS schützt keine Krypto-Asset-Investitionen. Einige Emittenten halten eine FCA-EMI-Zulassung, die nur Fiat-Guthaben abdeckt.' },
      { h: 'Sie könnten nicht verkaufen können, wann Sie möchten', p: 'Einige Cashback-Token haben ein geringes Handelsvolumen. Staking sperrt Ihr Kapital für einen festen Zeitraum.' },
      { h: 'Krypto-Produkte sind komplex', p: 'Beantragen Sie kein Produkt, das Sie nicht vollständig verstehen.' },
      { h: 'Streuen Sie Ihre Investitionen', p: 'Die FCA empfiehlt, nicht mehr als 10% Ihres Anlagekapitals in Krypto-Assets zu halten.' },
      { h: 'Diese Website ist keine Finanzberatung', p: 'TopCryptoCards ist eine redaktionelle Publikation, keine regulierte Finanzberatung.' },
    ],
    noAdvice: 'Keine Finanzberatung.',
  },
  es: {
    title: 'Resumen de riesgos cripto',
    readTime: 'Tiempo de lectura estimado: 2 minutos',
    euTitle: 'Versión UE / España',
    warningTitle: 'Advertencia de riesgo (MiCA / UE)',
    warningText: 'Los criptoactivos son productos altamente especulativos. Su valor puede fluctuar considerablemente y podría perder la totalidad del capital invertido. Los criptoactivos generalmente no gozan de las protecciones ofrecidas a los productos financieros regulados.',
    sections: [
      { h: 'Puede perder la totalidad de su inversión', p: ['Los criptoactivos son extremadamente volátiles. El valor de los tokens puede caer de forma brusca y rápida. Los resultados pasados no garantizan resultados futuros.', 'Esto se aplica también a los criptoactivos que recibe como cashback en una tarjeta crypto. Si recibe recompensas en tokens (CRO, GNO, BNB, PLU u otros), su valor puede disminuir significativamente antes de que pueda utilizarlos o convertirlos.'] },
      { h: 'Generalmente no está protegido por garantías bancarias', p: ['Los productos crypto no se benefician de la protección de depósitos ofrecida por los bancos regulados en la UE (directiva 2014/49/UE, hasta 100.000 €). Algunos emisores tienen licencia de entidad de dinero electrónico, pero estas protecciones no se extienden a los criptoactivos.', 'En España, la CNMV supervisa los proveedores de servicios de criptoactivos. Bajo MiCA (Reglamento (UE) 2023/1114), los CASP deben estar autorizados. Registro público: www.cnmv.es'] },
      { h: 'Es posible que no pueda vender o convertir cuando lo desee', p: 'Algunos tokens tienen bajo volumen de negociación o liquidez limitada. Las tarjetas que requieren staking bloquean su capital durante un período determinado.' },
      { h: 'Los productos crypto son complejos', p: 'Las tarjetas crypto combinan una tarjeta de pago (regulada), un criptoactivo (parcialmente regulado bajo MiCA), un programa de recompensas y, en algunos casos, un mecanismo de staking. No solicite un producto que no entienda completamente.' },
      { h: 'No ponga todos los huevos en la misma cesta', p: 'Solo comprometa fondos cuya pérdida total pueda permitirse. Las autoridades financieras europeas recomiendan no invertir una parte significativa de sus ahorros en criptoactivos.' },
      { h: 'Este sitio no constituye asesoramiento financiero', p: 'TopCryptoCards es una publicación editorial independiente. Nuestros contenidos no constituyen asesoramiento financiero personalizado. No estamos autorizados por la CNMV ni por ninguna autoridad reguladora financiera. Consulte a un asesor financiero autorizado si lo necesita.' },
    ],
    ukTitle: 'Versión UK (FCA)',
    ukWarningTitle: 'Advertencia de riesgo FCA',
    ukWarningText: 'No invierta a menos que esté dispuesto a perder todo el dinero que invierta. Las criptomonedas son una inversión de alto riesgo.',
    ukSections: [
      { h: 'Podría perder todo el dinero que invierta', p: 'Los criptoactivos son muy volátiles. Los resultados pasados no predicen rendimientos futuros.' },
      { h: 'Es poco probable que recupere su dinero si algo sale mal', p: 'El FSCS no protege las inversiones en criptoactivos. Algunos emisores tienen registro FCA como EMI, que solo cubre saldos en moneda fiat.' },
      { h: 'Es posible que no pueda vender o convertir cuando lo desee', p: 'Algunos tokens de cashback tienen poco volumen. El staking bloquea su capital por un período fijo.' },
      { h: 'Los productos crypto son complejos', p: 'No solicite un producto que no entienda completamente.' },
      { h: 'Diversifique sus inversiones', p: 'La FCA recomienda no mantener más del 10% de sus activos invertibles en criptoactivos.' },
      { h: 'Este sitio no es asesoramiento financiero', p: 'TopCryptoCards es una publicación editorial, no asesoramiento financiero regulado.' },
    ],
    noAdvice: 'Sin asesoramiento financiero.',
  },
  it: {
    title: 'Riepilogo dei rischi crypto',
    readTime: 'Tempo di lettura stimato: 2 minuti',
    euTitle: 'Versione UE / Italia',
    warningTitle: 'Avvertenza sui rischi (MiCA / UE)',
    warningText: 'I cripto-asset sono prodotti altamente speculativi. Il loro valore può fluttuare notevolmente e potreste perdere l\'intero capitale investito. I cripto-asset generalmente non beneficiano delle protezioni offerte ai prodotti finanziari regolamentati.',
    sections: [
      { h: 'Potreste perdere l\'intero investimento', p: ['I cripto-asset sono estremamente volatili. Il valore dei token può scendere bruscamente e rapidamente. Le performance passate non sono indicative di risultati futuri.', 'Questo vale anche per i cripto-asset ricevuti come cashback su una carta crypto. Se ricevete ricompense in token (CRO, GNO, BNB, PLU o altri), il loro valore può diminuire significativamente prima che possiate utilizzarli o convertirli.'] },
      { h: 'Non siete generalmente protetti dalle garanzie bancarie', p: ['I prodotti crypto non beneficiano della protezione dei depositi offerta dalle banche regolamentate nell\'UE (direttiva 2014/49/UE, fino a 100.000 €). Alcuni emittenti detengono una licenza di istituto di moneta elettronica, ma tali protezioni non si estendono ai cripto-asset.', 'In Italia, la Consob e la Banca d\'Italia supervisionano i fornitori di servizi su cripto-asset. Sotto MiCA (Regolamento (UE) 2023/1114), i CASP devono essere autorizzati. Registro pubblico: www.consob.it'] },
      { h: 'Potreste non poter vendere o convertire quando lo desiderate', p: 'Alcuni token hanno un basso volume di scambi o liquidità limitata. Le carte che richiedono staking bloccano il vostro capitale per un periodo determinato.' },
      { h: 'I prodotti crypto sono complessi', p: 'Le carte crypto combinano una carta di pagamento (regolamentata), un cripto-asset (parzialmente regolamentato sotto MiCA), un programma di ricompense e, in alcuni casi, un meccanismo di staking. Non richiedete un prodotto che non comprendete appieno.' },
      { h: 'Non mettete tutte le uova nello stesso paniere', p: 'Impegnate solo fondi di cui potete permettervi la perdita totale. Le autorità finanziarie europee raccomandano di non investire una quota significativa dei propri risparmi in cripto-asset.' },
      { h: 'Questo sito non costituisce consulenza finanziaria', p: 'TopCryptoCards è una pubblicazione editoriale indipendente. I nostri contenuti non costituiscono consulenza finanziaria personalizzata. Non siamo autorizzati dalla Consob o da altra autorità di vigilanza finanziaria. Consultate un consulente finanziario autorizzato se necessario.' },
    ],
    ukTitle: 'Versione UK (FCA)',
    ukWarningTitle: 'Avvertenza di rischio FCA',
    ukWarningText: 'Non investite a meno che non siate disposti a perdere tutto il denaro investito. Le criptovalute sono un investimento ad alto rischio.',
    ukSections: [
      { h: 'Potreste perdere tutto il denaro investito', p: 'I cripto-asset sono molto volatili. Le performance passate non predicono rendimenti futuri.' },
      { h: 'È improbabile che recuperiate il denaro se qualcosa va storto', p: 'Il FSCS non protegge gli investimenti in cripto-asset. Alcuni emittenti hanno una registrazione FCA come EMI, che copre solo i saldi in valuta fiat.' },
      { h: 'Potreste non poter vendere o convertire quando lo desiderate', p: 'Alcuni token cashback hanno poco volume. Lo staking blocca il vostro capitale per un periodo fisso.' },
      { h: 'I prodotti crypto sono complessi', p: 'Non richiedete un prodotto che non comprendete appieno.' },
      { h: 'Diversificate i vostri investimenti', p: 'La FCA raccomanda di non detenere più del 10% dei propri asset investibili in cripto-asset.' },
      { h: 'Questo sito non è consulenza finanziaria', p: 'TopCryptoCards è una pubblicazione editoriale, non consulenza finanziaria regolamentata.' },
    ],
    noAdvice: 'Nessuna consulenza finanziaria.',
  },
  en: {
    title: 'Crypto risk summary',
    readTime: 'Estimated reading time: 2 minutes',
    euTitle: 'EU Version (MiCA)',
    warningTitle: 'Risk warning (MiCA / EU)',
    warningText: 'Cryptoassets are highly speculative products. Their value can fluctuate significantly and you could lose the entirety of your invested capital. Cryptoassets do not generally benefit from the protections offered to regulated financial products.',
    sections: [
      { h: 'You could lose all the money you invest', p: ['Cryptoassets are extremely volatile. The value of tokens can fall sharply and rapidly. Past performance does not predict future returns.', 'This applies equally to cryptoassets you receive as cashback on a crypto card. If you receive rewards in tokens (CRO, GNO, BNB, PLU or others), their value can fall significantly before you spend or convert them.'] },
      { h: 'You are generally not protected by banking guarantees', p: ['Crypto products do not benefit from the deposit protection offered by regulated EU banks (Directive 2014/49/EU, up to €100,000). Some issuers hold an e-money institution licence, but these protections do not extend to cryptoassets.', 'Under MiCA (Regulation (EU) 2023/1114), crypto-asset service providers (CASPs) must be authorised. Check your local regulator\'s public register.'] },
      { h: 'You may not be able to sell or convert when you want to', p: 'Some tokens have low trading volume or limited liquidity. Cards requiring staking lock your capital for a fixed period.' },
      { h: 'Crypto products are complex', p: 'Crypto cards combine a payment card (regulated as e-money), a cryptoasset (partially regulated under MiCA), a rewards programme, and in some cases a staking arrangement. Don\'t apply for a product you don\'t fully understand.' },
      { h: 'Don\'t put all your eggs in one basket', p: 'Only commit money you can afford to lose entirely. European financial authorities generally recommend not investing a significant share of your savings in cryptoassets.' },
      { h: 'This site is not financial advice', p: 'TopCryptoCards is an independent editorial publication. Our content does not constitute personalised financial advice. We are not authorised by any financial regulatory authority. Consult a qualified financial adviser if needed.' },
    ],
    ukTitle: 'UK Version (FCA)',
    ukWarningTitle: 'FCA Risk warning',
    ukWarningText: 'Don\'t invest unless you\'re prepared to lose all the money you invest. Crypto is a high-risk investment and you are unlikely to be protected if something goes wrong.',
    ukSections: [
      { h: 'You could lose all the money you invest', p: ['Cryptoassets are highly volatile. The value of crypto tokens can fall sharply, and you may lose all of the money you put in.', 'This applies equally to cashback received on a crypto card. Your real return may be significantly lower than the headline cashback rate suggests.'] },
      { h: 'You are unlikely to get your money back if something goes wrong', p: 'The FSCS does not protect cryptoasset investments. Some issuers hold an FCA EMI registration which covers fiat balances only — not cryptoasset cashback or staking.' },
      { h: 'You may not be able to sell or convert when you want to', p: 'Some cashback tokens have low trading volume. Cards requiring staking lock your capital for a fixed period.' },
      { h: 'Crypto products are complex', p: 'Don\'t apply for a product you don\'t fully understand.' },
      { h: 'Don\'t put all your eggs in one basket', p: 'The FCA recommends holding no more than 10% of your investable assets in cryptoassets.' },
      { h: 'This site is not financial advice', p: 'TopCryptoCards is an editorial publication. Our content is not personal financial advice. We are not authorised by the FCA to give regulated financial advice.' },
    ],
    noAdvice: 'No financial advice.',
  },
};

/* ── Section renderer ─────────────────────────────────────────────────────── */
function Section({ h, p }: { h: string; p: string | string[] }) {
  const paras = Array.isArray(p) ? p : [p];
  return (
    <section>
      <h3 className="text-lg font-semibold text-white mb-3">{h}</h3>
      {paras.map((para, i) => (
        <p key={i} className={i < paras.length - 1 ? 'mb-3' : ''}>{para}</p>
      ))}
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function RiskSummary() {
  const lang = useLanguage();
  const c = CONTENT[lang] ?? CONTENT.en;

  React.useEffect(() => {
    const el = document.createElement('meta');
    el.name = 'robots';
    el.content = 'noindex, nofollow';
    el.setAttribute('data-legal-noindex', 'true');
    document.head.appendChild(el);
    return () => { document.querySelector('meta[data-legal-noindex]')?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="border-b border-bg-border bg-bg/80 backdrop-blur-lg">
        <div className="container-app h-16 flex items-center">
          <Link to={`/${lang}`} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-accent to-green-accent flex items-center justify-center shadow-glow">
              <Coins className="w-5 h-5 text-bg" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              TopCrypto<span className="text-cyan-accent">Cards</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container-app py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">{c.title}</h1>
        <p className="text-slate-500 text-sm mb-8">{c.readTime}</p>

        <div className="flex gap-2 mb-10">
          <a href="#eu" className="px-3 py-1.5 text-xs rounded-lg bg-bg-elevated border border-bg-border text-slate-300 hover:border-cyan-accent/50 hover:text-white transition-colors">EU / DE / FR / ES / IT</a>
          <a href="#uk" className="px-3 py-1.5 text-xs rounded-lg bg-bg-elevated border border-bg-border text-slate-300 hover:border-cyan-accent/50 hover:text-white transition-colors">UK (FCA)</a>
        </div>

        {/* EU Version */}
        <div id="eu" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🇪🇺</span>
            <h2 className="text-2xl font-bold text-white">{c.euTitle}</h2>
          </div>
          <div className="flex items-start gap-3 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-10">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-semibold text-sm mb-1">{c.warningTitle}</p>
              <p className="text-amber-200/80 text-sm leading-relaxed">{c.warningText}</p>
            </div>
          </div>
          <div className="space-y-8 text-slate-400 text-sm leading-relaxed">
            {c.sections.map((s, i) => <Section key={i} h={s.h} p={s.p} />)}
          </div>
        </div>

        <hr className="border-bg-border mb-16" />

        {/* UK Version */}
        <div id="uk">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🇬🇧</span>
            <h2 className="text-2xl font-bold text-white">{c.ukTitle}</h2>
          </div>
          <div className="flex items-start gap-3 p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-10">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-semibold text-sm mb-1">{c.ukWarningTitle}</p>
              <p className="text-amber-200/80 text-sm leading-relaxed">{c.ukWarningText}</p>
            </div>
          </div>
          <div className="space-y-8 text-slate-400 text-sm leading-relaxed">
            {c.ukSections.map((s, i) => <Section key={i} h={s.h} p={s.p} />)}
          </div>
        </div>
      </main>

      <footer className="border-t border-bg-border py-6">
        <div className="container-app flex flex-wrap gap-4 text-xs text-slate-500 justify-between items-center">
          <span>© {new Date().getFullYear()} TopCryptoCards. {c.noAdvice}</span>
          <div className="flex gap-4">
            <Link to="/impressum" className="hover:text-slate-300 transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-slate-300 transition-colors">Datenschutz</Link>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/affiliate-disclosure" className="hover:text-slate-300 transition-colors">Affiliate Disclosure</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
