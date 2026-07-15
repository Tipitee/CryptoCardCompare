/**
 * ToolsPage — Hub of all free tools on TopCryptoCards
 * URL: /:lang/outils-carte-crypto (fr/be), /krypto-karte-tools (de/at), etc.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BarChart2, Zap, Star, GitCompare, Globe, Copy, Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import { THEMATIC_ROUTES } from '../config/routes';
import Breadcrumb from '../components/Breadcrumb';

const YEAR = new Date().getFullYear();
const BASE = 'https://topcryptocards.eu';

const COPY: Record<string, {
  title: string; h1: string; desc: string; intro: string;
  tools: { icon: string; name: string; tagline: string; cta: string }[];
  widgetTitle: string; widgetDesc: string; widgetCopy: string; widgetCopied: string;
  breadcrumbHome: string;
}> = {
  fr: {
    title:   `Outils Gratuits Cartes Crypto ${YEAR} — Calculateurs & Comparateurs | TopCryptoCards`,
    h1:      `Outils gratuits pour choisir votre carte crypto`,
    desc:    `Calculateurs, simulateurs et comparateurs de cartes crypto gratuits. Estimez votre cashback annuel, comparez les frais et trouvez la meilleure carte pour votre profil.`,
    intro:   `Tous nos outils sont 100 % gratuits, sans inscription. Ils sont également intégrables sur votre site via un simple code iframe.`,
    tools: [
      { icon: '💳', name: `Calculateur Cashback ${YEAR}`,    tagline: 'Entrez vos dépenses mensuelles → classement instantané des cartes par cashback annuel', cta: 'Calculer mon cashback →' },
      { icon: '📊', name: `Calculateur de Frais ${YEAR}`,    tagline: 'Comparez les frais annuels réels de chaque carte (abonnement, retrait, conversion)', cta: 'Comparer les frais →' },
      { icon: '🎯', name: 'Simulateur par catégories',        tagline: 'Répartissez vos dépenses (voyage, resto, courses…) pour un résultat personnalisé', cta: 'Simuler mes dépenses →' },
      { icon: '⚡', name: 'Recommandation en 30 secondes',   tagline: 'Répondez à 5 questions : notre algorithme identifie votre carte idéale', cta: 'Trouver ma carte →' },
      { icon: '⚖️', name: 'Comparateur côte à côte',         tagline: 'Comparez jusqu\'à 4 cartes simultanément sur tous les critères', cta: 'Comparer les cartes →' },
      { icon: '📋', name: `Index des frais ${YEAR}`,          tagline: 'Tableau complet des frais de toutes les cartes crypto disponibles en Europe', cta: 'Voir les frais →' },
    ],
    widgetTitle: 'Intégrer le widget sur votre site',
    widgetDesc:  'Collez ce code sur n\'importe quelle page pour afficher un calculateur cashback interactif avec backlink automatique.',
    widgetCopy:   'Copier le code',
    widgetCopied: 'Copié !',
    breadcrumbHome: 'Accueil',
  },
  de: {
    title:   `Kostenlose Krypto-Karten Tools ${YEAR} — Rechner & Vergleiche | TopCryptoCards`,
    h1:      `Kostenlose Tools für Ihre Krypto-Karte`,
    desc:    `Kostenlose Cashback-Rechner, Gebührenvergleiche und Simulatoren für Krypto-Karten. Finden Sie die beste Karte für Ihr Profil.`,
    intro:   `Alle Tools sind 100 % kostenlos und ohne Anmeldung nutzbar. Sie können auch über einen einfachen iframe-Code in Ihre Website eingebettet werden.`,
    tools: [
      { icon: '💳', name: `Cashback-Rechner ${YEAR}`,        tagline: 'Monatliche Ausgaben eingeben → sofortiges Ranking der Karten nach Jahrescashback', cta: 'Cashback berechnen →' },
      { icon: '📊', name: `Gebührenrechner ${YEAR}`,         tagline: 'Vergleichen Sie die tatsächlichen Jahresgebühren jeder Karte', cta: 'Gebühren vergleichen →' },
      { icon: '🎯', name: 'Simulator nach Kategorien',        tagline: 'Verteilen Sie Ihre Ausgaben (Reisen, Restaurant, Lebensmittel…) für ein personalisiertes Ergebnis', cta: 'Ausgaben simulieren →' },
      { icon: '⚡', name: 'Empfehlung in 30 Sekunden',       tagline: '5 Fragen beantworten: unser Algorithmus findet Ihre ideale Karte', cta: 'Meine Karte finden →' },
      { icon: '⚖️', name: 'Nebeneinandervergleich',          tagline: 'Vergleichen Sie bis zu 4 Karten gleichzeitig nach allen Kriterien', cta: 'Karten vergleichen →' },
      { icon: '📋', name: `Gebührenindex ${YEAR}`,           tagline: 'Vollständige Gebührentabelle aller in Europa verfügbaren Krypto-Karten', cta: 'Gebühren anzeigen →' },
    ],
    widgetTitle: 'Widget in Ihre Website einbetten',
    widgetDesc:  'Fügen Sie diesen Code in eine beliebige Seite ein, um einen interaktiven Cashback-Rechner mit automatischem Backlink anzuzeigen.',
    widgetCopy:   'Code kopieren',
    widgetCopied: 'Kopiert!',
    breadcrumbHome: 'Startseite',
  },
  es: {
    title:   `Herramientas Gratuitas Tarjetas Crypto ${YEAR} — Calculadoras | TopCryptoCards`,
    h1:      `Herramientas gratuitas para elegir tu tarjeta crypto`,
    desc:    `Calculadoras de cashback, comparadores de tarifas y simuladores gratuitos para tarjetas crypto. Encuentra la mejor tarjeta para tu perfil.`,
    intro:   `Todas nuestras herramientas son 100 % gratuitas, sin registro. También se pueden integrar en tu web con un simple código iframe.`,
    tools: [
      { icon: '💳', name: `Calculadora de Cashback ${YEAR}`, tagline: 'Introduce tus gastos mensuales → clasificación instantánea por cashback anual', cta: 'Calcular mi cashback →' },
      { icon: '📊', name: `Calculadora de Tarifas ${YEAR}`,  tagline: 'Compara las tarifas anuales reales de cada tarjeta', cta: 'Comparar tarifas →' },
      { icon: '🎯', name: 'Simulador por categorías',         tagline: 'Distribuye tus gastos (viajes, restaurantes, compras…) para un resultado personalizado', cta: 'Simular mis gastos →' },
      { icon: '⚡', name: 'Recomendación en 30 segundos',    tagline: 'Responde 5 preguntas: nuestro algoritmo identifica tu tarjeta ideal', cta: 'Encontrar mi tarjeta →' },
      { icon: '⚖️', name: 'Comparador en paralelo',          tagline: 'Compara hasta 4 tarjetas simultáneamente en todos los criterios', cta: 'Comparar tarjetas →' },
      { icon: '📋', name: `Índice de tarifas ${YEAR}`,        tagline: 'Tabla completa de tarifas de todas las tarjetas crypto disponibles en Europa', cta: 'Ver tarifas →' },
    ],
    widgetTitle: 'Integrar el widget en tu web',
    widgetDesc:  'Pega este código en cualquier página para mostrar una calculadora de cashback interactiva con backlink automático.',
    widgetCopy:   'Copiar código',
    widgetCopied: '¡Copiado!',
    breadcrumbHome: 'Inicio',
  },
  it: {
    title:   `Strumenti Gratuiti Carte Crypto ${YEAR} — Calcolatori | TopCryptoCards`,
    h1:      `Strumenti gratuiti per scegliere la tua carta crypto`,
    desc:    `Calcolatori cashback, comparatori di tariffe e simulatori gratuiti per carte crypto. Trova la migliore carta per il tuo profilo.`,
    intro:   `Tutti i nostri strumenti sono 100 % gratuiti, senza registrazione. Sono anche integrabili sul tuo sito con un semplice codice iframe.`,
    tools: [
      { icon: '💳', name: `Calcolatore Cashback ${YEAR}`,    tagline: 'Inserisci le spese mensili → classifica istantanea delle carte per cashback annuale', cta: 'Calcola il mio cashback →' },
      { icon: '📊', name: `Calcolatore Costi ${YEAR}`,       tagline: 'Confronta i costi annuali reali di ogni carta', cta: 'Confronta i costi →' },
      { icon: '🎯', name: 'Simulatore per categorie',         tagline: 'Distribuisci le tue spese (viaggi, ristoranti, spesa…) per un risultato personalizzato', cta: 'Simula le mie spese →' },
      { icon: '⚡', name: 'Raccomandazione in 30 secondi',   tagline: 'Rispondi a 5 domande: il nostro algoritmo identifica la tua carta ideale', cta: 'Trova la mia carta →' },
      { icon: '⚖️', name: 'Confronto affiancato',            tagline: 'Confronta fino a 4 carte simultaneamente su tutti i criteri', cta: 'Confronta le carte →' },
      { icon: '📋', name: `Indice delle tariffe ${YEAR}`,    tagline: 'Tabella completa delle tariffe di tutte le carte crypto disponibili in Europa', cta: 'Vedi le tariffe →' },
    ],
    widgetTitle: 'Integrare il widget sul tuo sito',
    widgetDesc:  'Incolla questo codice in qualsiasi pagina per mostrare un calcolatore cashback interattivo con backlink automatico.',
    widgetCopy:   'Copia il codice',
    widgetCopied: 'Copiato!',
    breadcrumbHome: 'Home',
  },
  en: {
    title:   `Free Crypto Card Tools ${YEAR} — Calculators & Comparators | TopCryptoCards`,
    h1:      `Free tools to choose your crypto card`,
    desc:    `Free cashback calculators, fee comparators and simulators for crypto cards. Find the best card for your profile in minutes.`,
    intro:   `All tools are 100 % free, no sign-up required. They can also be embedded on your website via a simple iframe code.`,
    tools: [
      { icon: '💳', name: `Cashback Calculator ${YEAR}`,     tagline: 'Enter your monthly spend → instant ranking of cards by annual cashback', cta: 'Calculate my cashback →' },
      { icon: '📊', name: `Fee Calculator ${YEAR}`,          tagline: 'Compare the real annual costs of each crypto card', cta: 'Compare fees →' },
      { icon: '🎯', name: 'Category-based Simulator',         tagline: 'Split your spending (travel, dining, groceries…) for a personalised result', cta: 'Simulate my spend →' },
      { icon: '⚡', name: 'Recommendation in 30 seconds',    tagline: 'Answer 5 questions: our algorithm pinpoints your ideal card', cta: 'Find my card →' },
      { icon: '⚖️', name: 'Side-by-side Comparator',         tagline: 'Compare up to 4 cards simultaneously across all criteria', cta: 'Compare cards →' },
      { icon: '📋', name: `Fee Index ${YEAR}`,               tagline: 'Full fee table for all crypto cards available in Europe', cta: 'View fees →' },
    ],
    widgetTitle: 'Embed the widget on your site',
    widgetDesc:  'Paste this code into any page to display an interactive cashback calculator with an automatic backlink.',
    widgetCopy:   'Copy code',
    widgetCopied: 'Copied!',
    breadcrumbHome: 'Home',
  },
};
COPY.be = COPY.fr;
COPY.at = COPY.de;

export default function ToolsPage() {
  const lang = useLanguage();
  const copy = COPY[lang] ?? COPY.en;
  const rt = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.fr;
  const [copied, setCopied] = useState(false);

  const WIDGET_CODE = `<iframe src="${BASE}/widget-cashback.html?lang=${lang}" width="100%" height="500" frameborder="0" loading="lazy" title="Crypto Card Cashback Calculator — TopCryptoCards"></iframe>`;

  function handleCopy() {
    navigator.clipboard.writeText(WIDGET_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const toolLinks = [
    rt.cashbackCalculator,
    rt.feeCalculator,
    rt.simulator,
    rt.recommendation,
    rt.compare,
    rt.feeIndex,
  ];

  useSeoMeta({
    title: copy.title,
    description: copy.desc,
    lang,
    canonical: `${BASE}/${lang}/${rt.tools}`,
    ogType: 'website',
  });

  useHreflang(
    Object.fromEntries(
      ['fr','de','es','it','en','be','at'].map((l) => [
        l,
        `${BASE}/${l}/${(ROUTE_TRANSLATIONS[l as keyof typeof ROUTE_TRANSLATIONS] ?? ROUTE_TRANSLATIONS.fr).tools}`,
      ])
    )
  );

  const bestSlug = THEMATIC_ROUTES.best?.[lang as keyof typeof THEMATIC_ROUTES.best] ?? 'best-crypto-card';

  const breadcrumbItems = [
    { label: copy.breadcrumbHome, href: `/${lang}` },
    { label: copy.h1 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-8 h-8 text-cyan-500 flex-shrink-0" />
        <h1 className="text-2xl md:text-3xl font-bold">{copy.h1}</h1>
      </div>
      <p className="text-gray-500 mb-10 text-sm">{copy.intro}</p>

      {/* Tool cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {copy.tools.map((tool, i) => (
          <Link
            key={i}
            to={toolLinks[i] ? `/${lang}/${toolLinks[i]}` : `/${lang}`}
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-cyan-400 hover:shadow-md transition-all flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{tool.icon}</span>
              <span className="font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors">{tool.name}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{tool.tagline}</p>
            <span className="mt-auto text-xs font-medium text-cyan-600">{tool.cta}</span>
          </Link>
        ))}
      </div>

      {/* Widget embed section */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-500" />
          {copy.widgetTitle}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{copy.widgetDesc}</p>

        {/* Live preview */}
        <div className="rounded-lg overflow-hidden border border-gray-200 mb-4 bg-white">
          <iframe
            src={`/widget-cashback.html?lang=${lang}`}
            width="100%"
            height="460"
            frameBorder="0"
            loading="lazy"
            title="Widget preview"
          />
        </div>

        {/* Embed code */}
        <div className="relative">
          <pre className="bg-white border border-gray-200 rounded-lg p-4 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap break-all">
            {WIDGET_CODE}
          </pre>
          <button
            onClick={handleCopy}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? copy.widgetCopied : copy.widgetCopy}
          </button>
        </div>
      </div>

      {/* CTA to comparison */}
      <div className="flex gap-3 flex-wrap">
        <Link
          to={`/${lang}/${bestSlug}`}
          className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <Star className="w-4 h-4" />
          {lang === 'de' || lang === 'at' ? 'Beste Krypto-Karten' : lang === 'es' ? 'Mejores tarjetas crypto' : lang === 'it' ? 'Migliori carte crypto' : lang === 'en' ? 'Best crypto cards' : 'Meilleures cartes crypto'}
        </Link>
        <Link
          to={`/${lang}/${rt.compare}`}
          className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          <GitCompare className="w-4 h-4" />
          {lang === 'de' || lang === 'at' ? 'Karten vergleichen' : lang === 'es' ? 'Comparar tarjetas' : lang === 'it' ? 'Confronta le carte' : lang === 'en' ? 'Compare cards' : 'Comparer les cartes'}
        </Link>
      </div>

      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: copy.h1,
        description: copy.desc,
        url: `${BASE}/${lang}/${rt.tools}`,
        publisher: { '@type': 'Organization', name: 'TopCryptoCards', url: BASE },
        hasPart: copy.tools.map((t, i) => ({
          '@type': 'SoftwareApplication',
          name: t.name,
          applicationCategory: 'FinanceApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
          url: toolLinks[i] ? `${BASE}/${lang}/${toolLinks[i]}` : BASE,
        })),
      })}} />
    </div>
  );
}
