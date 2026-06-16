import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, FileText, RefreshCw, Mail, Star, BarChart3 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';

const YEAR = new Date().getFullYear();

const CONTENT = {
  fr: {
    title: `À propos de TopCryptoCards`,
    seoTitle: `À propos — Méthode d'évaluation des cartes crypto | TopCryptoCards`,
    seoDesc: `Découvrez qui nous sommes, comment nous évaluons les cartes crypto et notre engagement envers l'indépendance éditoriale. Comparateur fondé en 2024.`,
    who_title: `Qui sommes-nous ?`,
    who: `TopCryptoCards est un comparateur indépendant de cartes crypto fondé en 2024, basé en Europe. Notre mission : aider les utilisateurs français, allemands, espagnols, italiens et britanniques à trouver la carte crypto la plus adaptée à leur profil, en toute transparence. Nous comparons les frais, le cashback, les exigences de staking, la disponibilité par marché et la fiabilité de chaque émetteur.`,
    method_title: `Notre méthode d'évaluation`,
    method_intro: `Chaque carte est analysée sur 10 critères objectifs, pondérés selon leur impact sur l'expérience utilisateur réelle :`,
    criteria: [
      { label: `Taux de cashback (base et premium)`, desc: `Cashback effectif sans conditions extraordinaires vs. cashback maximal avec staking ou volume.` },
      { label: `Frais annuels`, desc: `Coût total de possession sur 12 mois, incluant les frais cachés éventuels.` },
      { label: `Staking requis`, desc: `Montant en cryptomonnaies à immobiliser pour accéder au cashback. Les cartes sans staking sont valorisées.` },
      { label: `Réseau de paiement`, desc: `Visa ou Mastercard — acceptation mondiale et fonctionnalités (sans contact, Google Pay, Apple Pay).` },
      { label: `Cryptomonnaies supportées`, desc: `Nombre et qualité des cryptos acceptées en dépôt et en cashback.` },
      { label: `Conformité KYC et réglementation`, desc: `Licence et régulation de l'émetteur (MiCA, VASP, e-money licence), procédure KYC.` },
      { label: `Disponibilité par marché`, desc: `Accessibilité en France, Allemagne, Espagne, Italie et reste de l'UE.` },
      { label: `Modèle de sécurité`, desc: `Custodial vs non-custodial, assurance des fonds, historique de l'émetteur.` },
      { label: `Qualité de l'application`, desc: `Ergonomie, notation App Store/Google Play, fonctionnalités (simulation, historique, 2FA).` },
      { label: `Score de confiance global`, desc: `Note composite intégrant ancienneté, transparence, incidents de sécurité et réputation communautaire.` },
    ],
    independence_title: `Indépendance et transparence`,
    independence: `TopCryptoCards est rémunéré par des commissions d'affiliation lorsqu'un utilisateur s'inscrit via nos liens partenaires. Ces commissions ne modifient en aucun cas nos classements : les cartes sont triées par score de confiance calculé objectivement, et non par niveau de rémunération. Toutes les cartes comparées sont analysées selon les mêmes critères, qu'elles soient partenaires ou non.`,
    disclosure_link: `Lire notre déclaration d'affiliation complète`,
    update_title: `Mises à jour et fraîcheur des données`,
    update: `Les données (cashback, frais, disponibilité) sont vérifiées et mises à jour régulièrement. La date de dernière révision est indiquée sur chaque article et fiche carte. En cas d'écart entre nos données et les conditions actuelles de l'émetteur, les conditions officielles de l'émetteur prévalent toujours.`,
    contact_title: `Contact`,
    contact: `Pour toute question, signalement d'erreur ou demande de partenariat :`,
    disclaimer: `Les informations présentes sur TopCryptoCards sont fournies à titre informatif uniquement. Elles ne constituent pas un conseil financier ou d'investissement. Les cryptomonnaies sont des actifs volatils. Consultez un conseiller financier avant toute décision d'investissement.`,
  },
  de: {
    title: `Über TopCryptoCards`,
    seoTitle: `Über uns — Bewertungsmethode für Krypto-Karten | TopCryptoCards`,
    seoDesc: `Erfahren Sie, wer wir sind, wie wir Krypto-Karten bewerten und unser Engagement für redaktionelle Unabhängigkeit. Vergleichsportal gegründet 2024.`,
    who_title: `Wer sind wir?`,
    who: `TopCryptoCards ist ein unabhängiges Krypto-Karten-Vergleichsportal, das 2024 gegründet wurde und in Europa ansässig ist. Unsere Mission: Franzosen, Deutschen, Spaniern, Italienern und Briten helfen, die am besten geeignete Krypto-Karte zu finden. Wir vergleichen Gebühren, Cashback, Staking-Anforderungen, Marktverfügbarkeit und die Zuverlässigkeit jedes Emittenten.`,
    method_title: `Unsere Bewertungsmethode`,
    method_intro: `Jede Karte wird nach 10 objektiven Kriterien analysiert:`,
    criteria: [
      { label: `Cashback-Rate (Basis und Premium)`, desc: `Effektives Cashback ohne außergewöhnliche Bedingungen vs. maximales Cashback mit Staking oder Volumen.` },
      { label: `Jahresgebühren`, desc: `Gesamtkosten über 12 Monate, einschließlich etwaiger versteckter Gebühren.` },
      { label: `Staking-Anforderungen`, desc: `Zu sperrende Kryptowährungen für Cashback-Zugang. Karten ohne Staking werden bevorzugt bewertet.` },
      { label: `Zahlungsnetzwerk`, desc: `Visa oder Mastercard — weltweite Akzeptanz und Funktionen (kontaktlos, Google Pay, Apple Pay).` },
      { label: `Unterstützte Kryptowährungen`, desc: `Anzahl und Qualität der akzeptierten Kryptos für Einzahlungen und Cashback.` },
      { label: `KYC-Konformität und Regulierung`, desc: `Lizenz und Regulierung des Emittenten (MiCA, VASP, E-Geld-Lizenz), KYC-Verfahren.` },
      { label: `Marktverfügbarkeit`, desc: `Zugänglichkeit in Deutschland, Frankreich, Spanien, Italien und dem übrigen EU-Raum.` },
      { label: `Sicherheitsmodell`, desc: `Custodial vs. Non-Custodial, Fondversicherung, Geschichte des Emittenten.` },
      { label: `App-Qualität`, desc: `Ergonomie, App Store/Google Play-Bewertung, Funktionen (Simulation, Verlauf, 2FA).` },
      { label: `Globaler Vertrauens-Score`, desc: `Zusammengesetzte Note aus Alter, Transparenz, Sicherheitsvorfällen und Community-Reputation.` },
    ],
    independence_title: `Unabhängigkeit und Transparenz`,
    independence: `TopCryptoCards wird durch Affiliate-Provisionen vergütet, wenn sich ein Nutzer über unsere Partnerlinks registriert. Diese Provisionen beeinflussen unsere Rankings in keiner Weise: Karten werden nach objektiv berechnetem Vertrauens-Score sortiert, nicht nach Vergütungsniveau.`,
    disclosure_link: `Vollständige Affiliate-Erklärung lesen`,
    update_title: `Aktualisierungen und Datenaktualität`,
    update: `Daten (Cashback, Gebühren, Verfügbarkeit) werden regelmäßig überprüft und aktualisiert. Das Datum der letzten Überprüfung wird auf jedem Artikel und jeder Kartenseite angegeben. Im Falle von Abweichungen gelten stets die offiziellen Bedingungen des Emittenten.`,
    contact_title: `Kontakt`,
    contact: `Bei Fragen, Fehlermeldungen oder Partnerschaftsanfragen:`,
    disclaimer: `Die Informationen auf TopCryptoCards dienen ausschließlich Informationszwecken. Sie stellen keine Finanz- oder Anlageberatung dar. Kryptowährungen sind volatile Vermögenswerte. Konsultieren Sie einen Finanzberater vor jeder Anlageentscheidung.`,
  },
  en: {
    title: `About TopCryptoCards`,
    seoTitle: `About Us — Crypto Card Evaluation Methodology | TopCryptoCards`,
    seoDesc: `Learn who we are, how we evaluate crypto cards, and our commitment to editorial independence. Comparison platform founded in 2024.`,
    who_title: `Who are we?`,
    who: `TopCryptoCards is an independent crypto card comparison platform founded in 2024, based in Europe. Our mission: help French, German, Spanish, Italian and British users find the crypto card best suited to their profile, with full transparency. We compare fees, cashback rates, staking requirements, market availability and the reliability of each card issuer.`,
    method_title: `Our evaluation methodology`,
    method_intro: `Each card is analyzed on 10 objective criteria, weighted by their impact on real user experience:`,
    criteria: [
      { label: `Cashback rate (base and premium)`, desc: `Effective cashback without extraordinary conditions vs. maximum cashback with staking or volume requirements.` },
      { label: `Annual fees`, desc: `Total cost of ownership over 12 months, including any hidden fees.` },
      { label: `Staking requirements`, desc: `Amount in crypto required to be locked up to access cashback. Cards without staking are rated higher.` },
      { label: `Payment network`, desc: `Visa or Mastercard — worldwide acceptance and features (contactless, Google Pay, Apple Pay).` },
      { label: `Supported cryptocurrencies`, desc: `Number and quality of cryptos accepted for deposits and cashback.` },
      { label: `KYC compliance and regulation`, desc: `Issuer license and regulation (MiCA, VASP, e-money licence), KYC procedure.` },
      { label: `Market availability`, desc: `Accessibility in France, Germany, Spain, Italy and the rest of the EU.` },
      { label: `Security model`, desc: `Custodial vs non-custodial, fund insurance, issuer track record.` },
      { label: `App quality`, desc: `Ergonomics, App Store/Google Play rating, features (simulator, history, 2FA).` },
      { label: `Overall trust score`, desc: `Composite score integrating age, transparency, security incidents and community reputation.` },
    ],
    independence_title: `Independence and transparency`,
    independence: `TopCryptoCards earns affiliate commissions when a user signs up via our partner links. These commissions do not influence our rankings in any way: cards are sorted by objectively calculated trust score, not compensation level. All compared cards are analyzed using the same criteria, whether they are partners or not.`,
    disclosure_link: `Read our full affiliate disclosure`,
    update_title: `Data updates and freshness`,
    update: `Data (cashback, fees, availability) is regularly verified and updated. The last review date is shown on each article and card page. In case of discrepancy between our data and the issuer's current terms, the issuer's official terms always prevail.`,
    contact_title: `Contact`,
    contact: `For any questions, error reports or partnership inquiries:`,
    disclaimer: `Information on TopCryptoCards is provided for informational purposes only. It does not constitute financial or investment advice. Cryptocurrencies are volatile assets. Consult a financial advisor before making any investment decision.`,
  },
  es: {
    title: `Sobre TopCryptoCards`,
    seoTitle: `Sobre nosotros — Metodología de evaluación de tarjetas crypto | TopCryptoCards`,
    seoDesc: `Descubre quiénes somos, cómo evaluamos las tarjetas crypto y nuestro compromiso con la independencia editorial. Comparador fundado en 2024.`,
    who_title: `¿Quiénes somos?`,
    who: `TopCryptoCards es un comparador independiente de tarjetas crypto fundado en 2024, con sede en Europa. Nuestra misión: ayudar a usuarios franceses, alemanes, españoles, italianos y británicos a encontrar la tarjeta crypto más adecuada a su perfil. Comparamos comisiones, cashback, requisitos de staking, disponibilidad por mercado y la fiabilidad de cada emisor.`,
    method_title: `Nuestra metodología de evaluación`,
    method_intro: `Cada tarjeta se analiza con 10 criterios objetivos:`,
    criteria: [
      { label: `Tasa de cashback (base y premium)`, desc: `Cashback efectivo sin condiciones extraordinarias vs. máximo cashback con staking o volumen.` },
      { label: `Comisiones anuales`, desc: `Coste total de propiedad en 12 meses, incluyendo posibles comisiones ocultas.` },
      { label: `Requisitos de staking`, desc: `Cantidad en criptomonedas a bloquear para acceder al cashback. Las tarjetas sin staking se valoran más.` },
      { label: `Red de pago`, desc: `Visa o Mastercard — aceptación mundial y funciones (sin contacto, Google Pay, Apple Pay).` },
      { label: `Criptomonedas soportadas`, desc: `Número y calidad de criptos aceptadas para depósitos y cashback.` },
      { label: `Cumplimiento KYC y regulación`, desc: `Licencia y regulación del emisor (MiCA, VASP, licencia de dinero electrónico), proceso KYC.` },
      { label: `Disponibilidad por mercado`, desc: `Accesibilidad en España, Francia, Alemania, Italia y el resto de la UE.` },
      { label: `Modelo de seguridad`, desc: `Custodial vs no-custodial, seguro de fondos, historial del emisor.` },
      { label: `Calidad de la app`, desc: `Ergonomía, valoración en App Store/Google Play, funciones (simulación, historial, 2FA).` },
      { label: `Puntuación de confianza global`, desc: `Nota compuesta que integra antigüedad, transparencia, incidentes de seguridad y reputación.` },
    ],
    independence_title: `Independencia y transparencia`,
    independence: `TopCryptoCards recibe comisiones de afiliados cuando un usuario se registra a través de nuestros enlaces de socios. Estas comisiones no modifican en ningún caso nuestras clasificaciones: las tarjetas se ordenan por puntuación de confianza calculada objetivamente, no por nivel de remuneración.`,
    disclosure_link: `Leer nuestra declaración de afiliados completa`,
    update_title: `Actualizaciones y frescura de los datos`,
    update: `Los datos (cashback, comisiones, disponibilidad) se verifican y actualizan regularmente. La fecha de última revisión se indica en cada artículo y ficha de tarjeta.`,
    contact_title: `Contacto`,
    contact: `Para cualquier pregunta, reporte de error o solicitud de colaboración:`,
    disclaimer: `La información en TopCryptoCards se proporciona únicamente con fines informativos. No constituye asesoramiento financiero ni de inversión. Las criptomonedas son activos volátiles. Consulte a un asesor financiero antes de tomar decisiones de inversión.`,
  },
  it: {
    title: `Chi siamo — TopCryptoCards`,
    seoTitle: `Chi siamo — Metodologia di valutazione delle carte crypto | TopCryptoCards`,
    seoDesc: `Scopri chi siamo, come valutiamo le carte crypto e il nostro impegno per l'indipendenza editoriale. Comparatore fondato nel 2024.`,
    who_title: `Chi siamo?`,
    who: `TopCryptoCards è un comparatore indipendente di carte crypto fondato nel 2024, con sede in Europa. La nostra missione: aiutare gli utenti francesi, tedeschi, spagnoli, italiani e britannici a trovare la carta crypto più adatta al loro profilo. Confrontiamo commissioni, cashback, requisiti di staking, disponibilità per mercato e l'affidabilità di ogni emittente.`,
    method_title: `La nostra metodologia di valutazione`,
    method_intro: `Ogni carta viene analizzata su 10 criteri oggettivi:`,
    criteria: [
      { label: `Tasso di cashback (base e premium)`, desc: `Cashback effettivo senza condizioni straordinarie vs. cashback massimo con staking o volume.` },
      { label: `Costi annuali`, desc: `Costo totale di possesso in 12 mesi, inclusi eventuali costi nascosti.` },
      { label: `Requisiti di staking`, desc: `Importo in criptovalute da bloccare per accedere al cashback. Le carte senza staking sono valorizzate.` },
      { label: `Rete di pagamento`, desc: `Visa o Mastercard — accettazione mondiale e funzioni (contactless, Google Pay, Apple Pay).` },
      { label: `Criptovalute supportate`, desc: `Numero e qualità delle cripto accettate per depositi e cashback.` },
      { label: `Conformità KYC e regolamentazione`, desc: `Licenza e regolamentazione dell'emittente (MiCA, VASP, licenza di moneta elettronica), procedura KYC.` },
      { label: `Disponibilità per mercato`, desc: `Accessibilità in Italia, Francia, Germania, Spagna e resto dell'UE.` },
      { label: `Modello di sicurezza`, desc: `Custodial vs non-custodial, assicurazione dei fondi, storico dell'emittente.` },
      { label: `Qualità dell'app`, desc: `Ergonomia, valutazione App Store/Google Play, funzioni (simulazione, storico, 2FA).` },
      { label: `Punteggio di fiducia globale`, desc: `Nota composita che integra anzianità, trasparenza, incidenti di sicurezza e reputazione.` },
    ],
    independence_title: `Indipendenza e trasparenza`,
    independence: `TopCryptoCards riceve commissioni di affiliazione quando un utente si registra tramite i nostri link partner. Queste commissioni non influenzano in alcun modo le nostre classifiche: le carte vengono ordinate per punteggio di fiducia calcolato oggettivamente, non per livello di remunerazione.`,
    disclosure_link: `Leggi la nostra dichiarazione di affiliazione completa`,
    update_title: `Aggiornamenti e freschezza dei dati`,
    update: `I dati (cashback, commissioni, disponibilità) vengono verificati e aggiornati regolarmente. La data dell'ultima revisione è indicata su ogni articolo e scheda carta.`,
    contact_title: `Contatti`,
    contact: `Per qualsiasi domanda, segnalazione di errore o richiesta di partnership:`,
    disclaimer: `Le informazioni su TopCryptoCards sono fornite esclusivamente a scopo informativo. Non costituiscono consulenza finanziaria o di investimento. Le criptovalute sono asset volatili. Consultare un consulente finanziario prima di prendere decisioni di investimento.`,
  },
};

export default function AboutPage() {
  const lang = useLanguage();
  const c = CONTENT[lang as keyof typeof CONTENT] ?? CONTENT.fr;

  useSeoMeta({ title: c.seoTitle, description: c.seoDesc });

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: c.title,
      url: `https://topcryptocards.eu/about`,
      description: c.seoDesc,
      publisher: {
        '@type': 'Organization',
        name: 'TopCryptoCards',
        url: 'https://topcryptocards.eu',
        foundingDate: '2024',
        email: 'hello@topcryptocards.eu',
        logo: { '@type': 'ImageObject', url: 'https://topcryptocards.eu/og-default.jpg' },
        areaServed: ['FR', 'DE', 'ES', 'IT', 'EU'],
        knowsAbout: ['cryptocurrency cards', 'crypto cashback', 'DeFi', 'MiCA regulation', 'crypto payments'],
      },
    };
    document.getElementById('schema-about')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-about';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-about')?.remove(); };
  }, [c.seoDesc, c.title]);

  return (
    <div className="container-app py-12 max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-white mb-2">{c.title}</h1>
      <p className="text-slate-500 text-sm mb-10">
        {lang === 'de' ? `Zuletzt aktualisiert: ${YEAR}` :
         lang === 'es' ? `Última actualización: ${YEAR}` :
         lang === 'it' ? `Ultimo aggiornamento: ${YEAR}` :
         lang === 'en' ? `Last updated: ${YEAR}` :
         `Dernière mise à jour : ${YEAR}`}
      </p>

      {/* Who we are */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-cyan-accent" />
          {c.who_title}
        </h2>
        <p className="text-slate-300 leading-relaxed">{c.who}</p>
      </section>

      {/* Methodology */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-accent" />
          {c.method_title}
        </h2>
        <p className="text-slate-300 mb-6 leading-relaxed">{c.method_intro}</p>
        <div className="space-y-3">
          {c.criteria.map((cr, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-bg-elevated border border-bg-border">
              <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center shrink-0 text-cyan-accent font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <div className="font-semibold text-white text-sm mb-1">{cr.label}</div>
                <div className="text-slate-400 text-xs leading-relaxed">{cr.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Independence */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-accent" />
          {c.independence_title}
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">{c.independence}</p>
        <Link
          to="/affiliate-disclosure"
          className="inline-flex items-center gap-2 text-sm text-cyan-accent hover:underline"
        >
          <FileText className="w-4 h-4" />
          {c.disclosure_link}
        </Link>
      </section>

      {/* Updates */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-cyan-accent" />
          {c.update_title}
        </h2>
        <p className="text-slate-300 leading-relaxed">{c.update}</p>
      </section>

      {/* Contact */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-cyan-accent" />
          {c.contact_title}
        </h2>
        <p className="text-slate-400 mb-3">{c.contact}</p>
        <a
          href="mailto:hello@topcryptocards.eu"
          className="inline-flex items-center gap-2 text-cyan-accent hover:underline font-medium"
        >
          <Mail className="w-4 h-4" />
          hello@topcryptocards.eu
        </a>
      </section>

      {/* Disclaimer */}
      <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-slate-400 text-sm leading-relaxed">{c.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
