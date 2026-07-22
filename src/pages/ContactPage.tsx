import { Mail, Twitter, MessageCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang, HREFLANG_BASE } from '../hooks/useHreflang';

const BASE = HREFLANG_BASE;
const CONTACT_EMAIL = 'contact@topcryptocards.eu';
const TWITTER_URL   = 'https://x.com/cryptocards_eu';

const CONTACT_SLUGS: Record<string, string> = {
  fr: 'contact', be: 'contact',
  de: 'kontakt', at: 'kontakt',
  es: 'contacto', it: 'contatti', en: 'contact',
};

const SEO: Record<string, { title: string; desc: string }> = {
  fr: {
    title: 'Contact, TopCryptoCards',
    desc: 'Une question sur notre comparatif de cartes crypto ? Contactez-nous par email ou sur X/Twitter. Réponse sous 48 h.',
  },
  de: {
    title: 'Kontakt, TopCryptoCards',
    desc: 'Fragen zu unserem Krypto-Karten-Vergleich? Kontaktieren Sie uns per E-Mail oder auf X/Twitter. Antwort innerhalb von 48 Stunden.',
  },
  es: {
    title: 'Contacto, TopCryptoCards',
    desc: '¿Tienes preguntas sobre nuestro comparador de tarjetas crypto? Escríbenos por email o en X/Twitter. Respuesta en 48 h.',
  },
  it: {
    title: 'Contatti, TopCryptoCards',
    desc: 'Hai domande sul nostro comparatore di carte crypto? Contattaci via email o su X/Twitter. Risposta entro 48 ore.',
  },
  en: {
    title: 'Contact, TopCryptoCards',
    desc: 'Questions about our crypto card comparison tool? Reach us by email or on X/Twitter. We reply within 48 hours.',
  },
};

const COPY: Record<string, {
  hero: string;
  heroSub: string;
  emailLabel: string;
  emailDesc: string;
  twitterLabel: string;
  twitterDesc: string;
  reasonsTitle: string;
  reasons: { title: string; body: string }[];
  responseTime: string;
  disclaimer: string;
}> = {
  fr: {
    hero: 'Contactez-nous',
    heroSub: 'Une question, une correction, un partenariat ? Nous vous répondons sous 48 heures.',
    emailLabel: 'Email',
    emailDesc: 'Pour toute question générale, signalement d\'erreur ou proposition de partenariat.',
    twitterLabel: 'X / Twitter',
    twitterDesc: 'Suivez-nous et envoyez-nous un message pour des réponses rapides.',
    reasonsTitle: 'Quand nous contacter ?',
    reasons: [
      { title: 'Signaler une erreur', body: 'Les données de cartes changent vite. Si vous constatez une information incorrecte (cashback, frais, disponibilité), contactez-nous.' },
      { title: 'Proposer une carte manquante', body: 'Vous connaissez une carte crypto disponible en Europe que nous n\'avons pas encore listée ? Partagez-la-nous.' },
      { title: 'Partenariats & presse', body: 'Pour toute demande de partenariat, affiliation ou contact presse, utilisez l\'adresse email ci-dessous.' },
      { title: 'Questions générales', body: 'Vous avez une question sur notre méthode de comparaison, nos sources ou notre indépendance éditoriale ? On vous répond.' },
    ],
    responseTime: 'Délai de réponse habituel : sous 48 heures (jours ouvrés).',
    disclaimer: 'TopCryptoCards est un comparatif indépendant. Nous ne sommes pas affiliés aux émetteurs de cartes présentés, sauf mention contraire dans nos pages de divulgation.',
  },
  de: {
    hero: 'Kontakt',
    heroSub: 'Eine Frage, eine Korrektur, eine Partnerschaft? Wir antworten innerhalb von 48 Stunden.',
    emailLabel: 'E-Mail',
    emailDesc: 'Für allgemeine Fragen, Fehlermeldungen oder Partnerschaftsanfragen.',
    twitterLabel: 'X / Twitter',
    twitterDesc: 'Folgen Sie uns und senden Sie uns eine Nachricht für schnelle Antworten.',
    reasonsTitle: 'Wann sollten Sie uns kontaktieren?',
    reasons: [
      { title: 'Fehler melden', body: 'Kartendaten ändern sich schnell. Wenn Sie eine falsche Information finden (Cashback, Gebühren, Verfügbarkeit), kontaktieren Sie uns.' },
      { title: 'Fehlende Karte vorschlagen', body: 'Kennen Sie eine in Europa verfügbare Kryptokarte, die wir noch nicht gelistet haben? Teilen Sie sie uns mit.' },
      { title: 'Partnerschaften & Presse', body: 'Für Partnerschafts-, Affiliate- oder Presseanfragen nutzen Sie bitte die E-Mail-Adresse unten.' },
      { title: 'Allgemeine Fragen', body: 'Haben Sie Fragen zu unserer Vergleichsmethode, unseren Quellen oder unserer redaktionellen Unabhängigkeit? Wir antworten gerne.' },
    ],
    responseTime: 'Übliche Antwortzeit: innerhalb von 48 Stunden (Werktage).',
    disclaimer: 'TopCryptoCards ist ein unabhängiger Vergleich. Wir sind nicht mit den aufgeführten Kartenherausgebern verbunden, sofern nicht auf unseren Offenlegungsseiten angegeben.',
  },
  es: {
    hero: 'Contacto',
    heroSub: '¿Una pregunta, una corrección, una propuesta de colaboración? Te respondemos en 48 horas.',
    emailLabel: 'Email',
    emailDesc: 'Para preguntas generales, errores o propuestas de colaboración.',
    twitterLabel: 'X / Twitter',
    twitterDesc: 'Síguenos y envíanos un mensaje para respuestas rápidas.',
    reasonsTitle: '¿Cuándo contactarnos?',
    reasons: [
      { title: 'Reportar un error', body: 'Los datos de tarjetas cambian rápido. Si encuentras información incorrecta (cashback, comisiones, disponibilidad), avísanos.' },
      { title: 'Proponer una tarjeta', body: '¿Conoces una tarjeta crypto disponible en Europa que aún no hemos listado? Compártela con nosotros.' },
      { title: 'Colaboraciones y prensa', body: 'Para propuestas de colaboración, afiliación o prensa, usa el correo electrónico de abajo.' },
      { title: 'Preguntas generales', body: '¿Tienes dudas sobre nuestra metodología, fuentes o independencia editorial? Te respondemos.' },
    ],
    responseTime: 'Tiempo de respuesta habitual: menos de 48 horas (días laborables).',
    disclaimer: 'TopCryptoCards es un comparador independiente. No tenemos afiliación con los emisores de tarjetas listados, salvo indicación en nuestras páginas de divulgación.',
  },
  it: {
    hero: 'Contatti',
    heroSub: 'Una domanda, una correzione, una proposta di collaborazione? Ti rispondiamo entro 48 ore.',
    emailLabel: 'Email',
    emailDesc: 'Per domande generali, segnalazione di errori o proposte di collaborazione.',
    twitterLabel: 'X / Twitter',
    twitterDesc: 'Seguici e inviaci un messaggio per risposte rapide.',
    reasonsTitle: 'Quando contattarci?',
    reasons: [
      { title: 'Segnalare un errore', body: 'I dati delle carte cambiano rapidamente. Se trovi un\'informazione errata (cashback, commissioni, disponibilità), contattaci.' },
      { title: 'Proporre una carta mancante', body: 'Conosci una carta crypto disponibile in Europa che non abbiamo ancora elencato? Segnalacela.' },
      { title: 'Partnership e stampa', body: 'Per richieste di partnership, affiliazione o stampa, utilizza l\'indirizzo email qui sotto.' },
      { title: 'Domande generali', body: 'Hai domande sulla nostra metodologia, le nostre fonti o la nostra indipendenza editoriale? Siamo qui per risponderti.' },
    ],
    responseTime: 'Tempo di risposta abituale: entro 48 ore (giorni lavorativi).',
    disclaimer: 'TopCryptoCards è un comparatore indipendente. Non siamo affiliati agli emittenti di carte elencati, salvo indicazione nelle nostre pagine di divulgazione.',
  },
  en: {
    hero: 'Contact Us',
    heroSub: 'A question, a correction, a partnership proposal? We reply within 48 hours.',
    emailLabel: 'Email',
    emailDesc: 'For general questions, data errors, or partnership enquiries.',
    twitterLabel: 'X / Twitter',
    twitterDesc: 'Follow us and send a message for quick replies.',
    reasonsTitle: 'When to contact us?',
    reasons: [
      { title: 'Report an error', body: 'Card data changes fast. If you spot incorrect information (cashback, fees, availability), let us know.' },
      { title: 'Suggest a missing card', body: 'Know a crypto card available in Europe that we haven\'t listed yet? Share it with us.' },
      { title: 'Partnerships & press', body: 'For partnership, affiliate, or press enquiries, use the email address below.' },
      { title: 'General questions', body: 'Questions about our comparison methodology, sources, or editorial independence? We\'re happy to answer.' },
    ],
    responseTime: 'Typical response time: within 48 hours (business days).',
    disclaimer: 'TopCryptoCards is an independent comparison site. We are not affiliated with any card issuer listed, except where disclosed on our affiliate disclosure pages.',
  },
};

export default function ContactPage() {
  const lang = useLanguage();
  const displayLang = (lang === 'be' ? 'fr' : lang === 'at' ? 'de' : lang) as keyof typeof SEO;
  const seo  = SEO[displayLang]  ?? SEO.en;
  const copy = COPY[displayLang] ?? COPY.en;

  const contactSlug = CONTACT_SLUGS[lang] ?? 'contact';

  useSeoMeta({
    title: seo.title,
    description: seo.desc,
    lang,
    canonical: `${BASE}/${lang}/${contactSlug}`,
  });

  useHreflang(
    l => `${BASE}/${l}/${CONTACT_SLUGS[l] ?? 'contact'}`,
    [lang],
  );

  // Schema.org ContactPage
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: seo.title,
    description: seo.desc,
    url: `${BASE}/${lang}/${contactSlug}`,
    inLanguage: lang,
    publisher: {
      '@type': 'Organization',
      name: 'TopCryptoCards',
      url: BASE,
      email: CONTACT_EMAIL,
      sameAs: [TWITTER_URL],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="container-app py-12 max-w-3xl">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            {copy.hero}
          </h1>
          <p className="text-lg text-slate-400">{copy.heroSub}</p>
        </div>

        {/* Contact channels */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {/* Email */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group flex flex-col gap-3 p-6 rounded-xl bg-bg-card border border-bg-border hover:border-cyan-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-cyan-accent" />
              </div>
              <span className="font-semibold text-white">{copy.emailLabel}</span>
              <ExternalLink className="w-4 h-4 text-slate-400 ml-auto group-hover:text-cyan-accent transition-colors" />
            </div>
            <p className="text-sm text-slate-400">{copy.emailDesc}</p>
            <span className="text-sm font-medium text-cyan-accent">{CONTACT_EMAIL}</span>
          </a>

          {/* Twitter/X */}
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 p-6 rounded-xl bg-bg-card border border-bg-border hover:border-cyan-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-accent/10 flex items-center justify-center">
                <Twitter className="w-5 h-5 text-cyan-accent" />
              </div>
              <span className="font-semibold text-white">{copy.twitterLabel}</span>
              <ExternalLink className="w-4 h-4 text-slate-400 ml-auto group-hover:text-cyan-accent transition-colors" />
            </div>
            <p className="text-sm text-slate-400">{copy.twitterDesc}</p>
            <span className="text-sm font-medium text-cyan-accent">@cryptocards_eu</span>
          </a>
        </div>

        {/* Reasons to contact */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-bold text-white mb-5 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-cyan-accent" />
            {copy.reasonsTitle}
          </h2>
          <div className="space-y-4">
            {copy.reasons.map((r, i) => (
              <div key={i} className="p-5 rounded-xl bg-bg-card border border-bg-border">
                <h3 className="font-semibold text-white mb-1">{r.title}</h3>
                <p className="text-sm text-slate-400">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Response time + disclaimer */}
        <div className="space-y-4 text-sm text-slate-400 border-t border-bg-border pt-6">
          <p>⏱ {copy.responseTime}</p>
          <p>{copy.disclaimer}</p>
        </div>

      </div>
    </>
  );
}
