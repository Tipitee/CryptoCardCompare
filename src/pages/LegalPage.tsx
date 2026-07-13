import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';

const SUPPORTED_LANGS = ['fr', 'be', 'de', 'at', 'es', 'it', 'en'] as const;
type Lang = typeof SUPPORTED_LANGS[number];
type ContentLang = 'fr' | 'de' | 'es' | 'it' | 'en';

const CONTENT_LANG: Record<Lang, ContentLang> = {
  fr: 'fr', be: 'fr', de: 'de', at: 'de', es: 'es', it: 'it', en: 'en',
};

export const LEGAL_SLUGS: Record<Lang, string> = {
  fr: 'mentions-legales',
  be: 'mentions-legales',
  de: 'rechtliches',
  at: 'rechtliches',
  es: 'aviso-legal',
  it: 'avviso-legale',
  en: 'legal-notice',
};

export const LEGAL_NAV_LABELS: Record<Lang, string> = {
  fr: 'Mentions légales',
  be: 'Mentions légales',
  de: 'Rechtliches',
  at: 'Rechtliches',
  es: 'Aviso legal',
  it: 'Avviso legale',
  en: 'Legal Notice',
};

function useLegalLang(): Lang {
  const { lang } = useParams<{ lang?: string }>();
  return (SUPPORTED_LANGS as readonly string[]).includes(lang ?? '') ? lang as Lang : 'en';
}

interface LegalContent {
  legalTitle: string;
  privacyTitle: string;
  lastUpdated: string;
  controller: {
    label: string;
  };
  legalSections: Array<{ title: string; body: string }>;
  privacySections: Array<{ title: string; body: string }>;
  affiliateNote: string;
  affiliateLink: string;
  rights: {
    title: string;
    body: string;
  };
  contact: string;
}

const EMAIL = 'hello@cryptocardcompare.io';
const ADDRESS_DE = 'c/o flexdienst – #21201, Kurt-Schumacher-Straße 76, 67663 Kaiserslautern, Deutschland';
const ADDRESS_EN = 'c/o flexdienst – #21201, Kurt-Schumacher-Straße 76, 67663 Kaiserslautern, Germany';

const CONTENT: Record<ContentLang, LegalContent> = {
  fr: {
    legalTitle: 'Mentions légales',
    privacyTitle: 'Politique de confidentialité',
    lastUpdated: 'Dernière mise à jour : juillet 2026',
    controller: { label: 'Éditeur du site' },
    legalSections: [
      {
        title: 'Identification de l\'éditeur',
        body: `Conformément à la Loi n° 2004-575 du 21 juin 2004 (LCEN), voici les informations relatives à l'éditeur de ce site :<br/><br/>
<strong>Nom :</strong> Thomas Petit<br/>
<strong>Adresse :</strong> c/o flexdienst – #21201, Kurt-Schumacher-Straße 76, 67663 Kaiserslautern, Allemagne<br/>
<strong>E-mail :</strong> ${EMAIL}`,
      },
      {
        title: 'Nature du site',
        body: 'TopCryptoCards est un comparateur indépendant de cartes crypto. Les informations publiées sont fournies à titre informatif uniquement et ne constituent pas un conseil financier, juridique ou d\'investissement. Les données sont vérifiées régulièrement mais peuvent évoluer sans préavis.',
      },
      {
        title: 'Liens hypertextes et responsabilité',
        body: 'Ce site contient des liens vers des sites tiers. Nous n\'exerçons aucun contrôle sur ces sites et déclinons toute responsabilité quant à leur contenu ou à leur politique de confidentialité.',
      },
      {
        title: 'Propriété intellectuelle',
        body: 'L\'ensemble du contenu éditorial de ce site (textes, comparatifs, analyses) est protégé par le droit d\'auteur. Toute reproduction ou diffusion sans autorisation est interdite.',
      },
      {
        title: 'Liens d\'affiliation',
        body: 'Ce site participe à des programmes d\'affiliation. Certains liens sont rémunérés ; cette rémunération n\'influence pas nos comparatifs ni l\'ordre d\'affichage des cartes.',
      },
    ],
    privacySections: [
      {
        title: '1. Responsable du traitement',
        body: `Thomas Petit — ${ADDRESS_EN}<br/>E-mail : ${EMAIL}`,
      },
      {
        title: '2. Données collectées',
        body: `<strong>Logs d'accès :</strong> adresse IP (anonymisée), date/heure, URL consultée, navigateur et FAI. Durée de conservation : 7 jours maximum. Base légale : Art. 6(1)(f) RGPD (intérêt légitime).<br/><br/>
<strong>Cookies strictement nécessaires :</strong> préférences de filtres et sélections de comparaison (session). Choix de consentement aux cookies (12 mois). Aucun consentement requis.<br/><br/>
<strong>Cookies analytiques (optionnels) :</strong> Google Analytics via Google Tag Manager — uniquement après votre consentement via la bannière cookies. Base légale : Art. 6(1)(a) RGPD.`,
      },
      {
        title: '3. Services tiers',
        body: `<strong>Cloudflare</strong> (CDN et sécurité) — certifié EU-US Data Privacy Framework.<br/>
<strong>Supabase</strong> (base de données) — serveurs dans l'UE (eu-west-1, Irlande).<br/>
<strong>Google Tag Manager / Analytics</strong> — uniquement après consentement.<br/>
<strong>Réseaux d'affiliation</strong> (Impact Radius, Awin) — uniquement après consentement.`,
      },
      {
        title: '4. Vos droits (RGPD)',
        body: 'Vous disposez des droits suivants : accès, rectification, effacement, portabilité, limitation du traitement et opposition. Pour exercer ces droits, contactez-nous à l\'adresse indiquée ci-dessus. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).',
      },
      {
        title: '5. Transferts hors UE',
        body: 'Cloudflare et Google sont certifiés sous le cadre EU-US Data Privacy Framework. Aucun transfert n\'est effectué sans garanties appropriées au sens du RGPD.',
      },
    ],
    affiliateNote: 'Pour en savoir plus sur nos relations commerciales, consultez notre',
    affiliateLink: 'politique d\'affiliation',
    rights: {
      title: 'Vos droits',
      body: 'Pour toute question relative au traitement de vos données personnelles, contactez-nous à l\'adresse e-mail indiquée ci-dessus.',
    },
    contact: 'Contact',
  },

  de: {
    legalTitle: 'Impressum & Datenschutz',
    privacyTitle: 'Datenschutzerklärung',
    lastUpdated: 'Stand: Juli 2026',
    controller: { label: 'Verantwortlicher' },
    legalSections: [
      {
        title: 'Impressum (Angaben gemäß § 5 TMG)',
        body: `<strong>Thomas Petit</strong><br/>
c/o flexdienst – #21201<br/>
Kurt-Schumacher-Straße 76<br/>
67663 Kaiserslautern<br/>
Deutschland<br/><br/>
<strong>Kontakt:</strong> ${EMAIL}<br/><br/>
<strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong> Thomas Petit (gleiche Anschrift)`,
      },
      {
        title: 'Hinweis zur redaktionellen Tätigkeit',
        body: 'Diese Website ist ein redaktionelles Informationsangebot. Sie vergleicht Krypto-Debitkarten anhand öffentlich zugänglicher Informationen. Die Inhalte stellen keine Anlage-, Finanz- oder Rechtsberatung dar.',
      },
      {
        title: 'Haftung für Inhalte',
        body: 'Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen. Verpflichtungen zur Entfernung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.',
      },
      {
        title: 'Haftung für Links',
        body: 'Mein Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.',
      },
      {
        title: 'Affiliate-Hinweis',
        body: 'Diese Website enthält Affiliate-Links. Wenn Sie sich über einen unserer Links für eine Karte anmelden, erhalten wir möglicherweise eine Provision. Dies beeinflusst weder unsere Bewertungen noch die Reihenfolge der aufgeführten Karten.',
      },
    ],
    privacySections: [
      {
        title: '1. Verantwortlicher',
        body: `Thomas Petit — ${ADDRESS_DE}<br/>E-Mail: ${EMAIL}`,
      },
      {
        title: '2. Erhobene Daten',
        body: `<strong>Zugriffsprotokolle:</strong> IP-Adresse (anonymisiert), Datum/Uhrzeit, aufgerufene URL, Browser und ISP. Speicherdauer: max. 7 Tage. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.<br/><br/>
<strong>Notwendige Cookies:</strong> Filterpräferenzen und Vergleichsauswahlen (Session), Cookie-Einwilligung (12 Monate). Kein Einverständnis erforderlich.<br/><br/>
<strong>Analyse-Cookies (optional):</strong> Google Analytics über Google Tag Manager — nur nach Ihrer Einwilligung über das Cookie-Banner. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.`,
      },
      {
        title: '3. Drittanbieter',
        body: `<strong>Cloudflare</strong> (CDN und Sicherheit) — zertifiziert nach EU-US Data Privacy Framework.<br/>
<strong>Supabase</strong> (Datenbank) — Server in der EU (eu-west-1, Irland).<br/>
<strong>Google Tag Manager / Analytics</strong> — nur nach Einwilligung.<br/>
<strong>Affiliate-Netzwerke</strong> (Impact Radius, Awin) — nur nach Einwilligung.`,
      },
      {
        title: '4. Ihre Rechte (DSGVO)',
        body: 'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Zudem haben Sie das Recht, sich bei einer Aufsichtsbehörde zu beschweren (z. B. dem Landesbeauftragten für Datenschutz Rheinland-Pfalz).',
      },
      {
        title: '5. Datenübermittlung in Drittländer',
        body: 'Cloudflare und Google sind nach dem EU-US Data Privacy Framework zertifiziert. Weitere Übermittlungen erfolgen nur auf Grundlage geeigneter Garantien im Sinne der DSGVO.',
      },
    ],
    affiliateNote: 'Weitere Informationen zu unseren Affiliate-Beziehungen finden Sie in unserer',
    affiliateLink: 'Affiliate-Offenlegung',
    rights: {
      title: 'Ihre Rechte',
      body: 'Für Fragen zur Verarbeitung Ihrer personenbezogenen Daten wenden Sie sich bitte an die oben genannte E-Mail-Adresse.',
    },
    contact: 'Kontakt',
  },

  es: {
    legalTitle: 'Aviso Legal',
    privacyTitle: 'Política de Privacidad',
    lastUpdated: 'Última actualización: julio de 2026',
    controller: { label: 'Responsable del sitio' },
    legalSections: [
      {
        title: 'Identificación del responsable',
        body: `<strong>Thomas Petit</strong><br/>
${ADDRESS_EN}<br/>
Correo electrónico: ${EMAIL}`,
      },
      {
        title: 'Naturaleza del sitio',
        body: 'TopCryptoCards es un comparador independiente de tarjetas cripto. La información publicada tiene carácter meramente informativo y no constituye asesoramiento financiero, jurídico ni de inversión. Los datos se actualizan periódicamente pero pueden cambiar sin previo aviso.',
      },
      {
        title: 'Propiedad intelectual',
        body: 'El contenido editorial de este sitio (textos, comparativas, análisis) está protegido por los derechos de autor. Queda prohibida su reproducción total o parcial sin autorización expresa.',
      },
      {
        title: 'Responsabilidad por enlaces',
        body: 'Este sitio contiene enlaces a sitios de terceros. No controlamos dichos sitios y declinamos toda responsabilidad por su contenido o políticas de privacidad.',
      },
      {
        title: 'Enlaces de afiliación',
        body: 'Este sitio participa en programas de afiliación. Algunos enlaces pueden generar comisiones para nosotros; esto no influye en nuestras evaluaciones ni en el orden de presentación de las tarjetas.',
      },
    ],
    privacySections: [
      {
        title: '1. Responsable del tratamiento',
        body: `Thomas Petit — ${ADDRESS_EN}<br/>Correo electrónico: ${EMAIL}`,
      },
      {
        title: '2. Datos recopilados',
        body: `<strong>Registros de acceso:</strong> dirección IP (anonimizada), fecha/hora, URL visitada, navegador y proveedor de Internet. Periodo de conservación: 7 días como máximo. Base legal: Art. 6(1)(f) RGPD.<br/><br/>
<strong>Cookies estrictamente necesarias:</strong> preferencias de filtros y selecciones de comparación (sesión), consentimiento de cookies (12 meses). No requieren consentimiento.<br/><br/>
<strong>Cookies analíticas (opcionales):</strong> Google Analytics mediante Google Tag Manager — solo tras su consentimiento mediante el banner de cookies. Base legal: Art. 6(1)(a) RGPD.`,
      },
      {
        title: '3. Servicios de terceros',
        body: `<strong>Cloudflare</strong> (CDN y seguridad) — certificado bajo el EU-US Data Privacy Framework.<br/>
<strong>Supabase</strong> (base de datos) — servidores en la UE (eu-west-1, Irlanda).<br/>
<strong>Google Tag Manager / Analytics</strong> — solo previa aceptación.<br/>
<strong>Redes de afiliación</strong> (Impact Radius, Awin) — solo previa aceptación.`,
      },
      {
        title: '4. Sus derechos (RGPD)',
        body: 'Tiene derecho de acceso, rectificación, supresión, portabilidad, limitación del tratamiento y oposición. Para ejercer estos derechos, contáctenos en la dirección indicada. También puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en www.aepd.es.',
      },
      {
        title: '5. Transferencias internacionales',
        body: 'Cloudflare y Google están certificados bajo el EU-US Data Privacy Framework. Ninguna transferencia se realiza sin garantías apropiadas en virtud del RGPD.',
      },
    ],
    affiliateNote: 'Para más información sobre nuestras relaciones comerciales, consulte nuestra',
    affiliateLink: 'política de afiliación',
    rights: {
      title: 'Sus derechos',
      body: 'Para cualquier consulta sobre el tratamiento de sus datos personales, contáctenos en la dirección de correo electrónico indicada.',
    },
    contact: 'Contacto',
  },

  it: {
    legalTitle: 'Avviso Legale',
    privacyTitle: 'Informativa sulla Privacy',
    lastUpdated: 'Ultimo aggiornamento: luglio 2026',
    controller: { label: 'Titolare del sito' },
    legalSections: [
      {
        title: 'Identificazione del titolare',
        body: `<strong>Thomas Petit</strong><br/>
${ADDRESS_EN}<br/>
E-mail: ${EMAIL}`,
      },
      {
        title: 'Natura del sito',
        body: 'TopCryptoCards è un comparatore indipendente di carte cripto. Le informazioni pubblicate hanno carattere puramente informativo e non costituiscono consulenza finanziaria, legale o di investimento. I dati vengono aggiornati periodicamente ma possono cambiare senza preavviso.',
      },
      {
        title: 'Proprietà intellettuale',
        body: 'Il contenuto editoriale di questo sito (testi, comparazioni, analisi) è protetto dal diritto d\'autore. Qualsiasi riproduzione o diffusione senza autorizzazione è vietata.',
      },
      {
        title: 'Responsabilità per link',
        body: 'Questo sito contiene link a siti di terze parti. Non abbiamo alcun controllo su tali siti e decliniamo ogni responsabilità per i loro contenuti o politiche sulla privacy.',
      },
      {
        title: 'Link di affiliazione',
        body: 'Questo sito partecipa a programmi di affiliazione. Alcuni link possono generare commissioni per noi; ciò non influenza le nostre valutazioni né l\'ordine di presentazione delle carte.',
      },
    ],
    privacySections: [
      {
        title: '1. Titolare del trattamento',
        body: `Thomas Petit — ${ADDRESS_EN}<br/>E-mail: ${EMAIL}`,
      },
      {
        title: '2. Dati raccolti',
        body: `<strong>Log di accesso:</strong> indirizzo IP (anonimizzato), data/ora, URL visitata, browser e fornitore Internet. Periodo di conservazione: massimo 7 giorni. Base giuridica: Art. 6(1)(f) GDPR.<br/><br/>
<strong>Cookie strettamente necessari:</strong> preferenze di filtro e selezioni di confronto (sessione), consenso ai cookie (12 mesi). Non richiedono consenso.<br/><br/>
<strong>Cookie analitici (opzionali):</strong> Google Analytics tramite Google Tag Manager — solo dopo il vostro consenso tramite il banner dei cookie. Base giuridica: Art. 6(1)(a) GDPR.`,
      },
      {
        title: '3. Servizi di terze parti',
        body: `<strong>Cloudflare</strong> (CDN e sicurezza) — certificato EU-US Data Privacy Framework.<br/>
<strong>Supabase</strong> (database) — server nell'UE (eu-west-1, Irlanda).<br/>
<strong>Google Tag Manager / Analytics</strong> — solo previa accettazione.<br/>
<strong>Reti di affiliazione</strong> (Impact Radius, Awin) — solo previa accettazione.`,
      },
      {
        title: '4. I vostri diritti (GDPR)',
        body: 'Avete il diritto di accesso, rettifica, cancellazione, portabilità, limitazione del trattamento e opposizione. Per esercitare questi diritti, contattateci all\'indirizzo indicato. Potete inoltre presentare reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
      },
      {
        title: '5. Trasferimenti internazionali',
        body: 'Cloudflare e Google sono certificati ai sensi dell\'EU-US Data Privacy Framework. Nessun trasferimento avviene senza adeguate garanzie ai sensi del GDPR.',
      },
    ],
    affiliateNote: 'Per ulteriori informazioni sulle nostre relazioni commerciali, consultate la nostra',
    affiliateLink: 'politica di affiliazione',
    rights: {
      title: 'I vostri diritti',
      body: 'Per qualsiasi domanda relativa al trattamento dei vostri dati personali, contattateci all\'indirizzo e-mail indicato sopra.',
    },
    contact: 'Contatti',
  },

  en: {
    legalTitle: 'Legal Notice',
    privacyTitle: 'Privacy Policy',
    lastUpdated: 'Last updated: July 2026',
    controller: { label: 'Site publisher' },
    legalSections: [
      {
        title: 'Publisher identification',
        body: `<strong>Thomas Petit</strong><br/>
${ADDRESS_EN}<br/>
Email: ${EMAIL}<br/><br/>
In accordance with § 5 TMG (German Telemedia Act).`,
      },
      {
        title: 'Editorial disclaimer',
        body: 'TopCryptoCards is an independent editorial comparison site for crypto debit cards. Information is based on publicly available data and is provided for informational purposes only. Nothing on this site constitutes financial, legal or investment advice.',
      },
      {
        title: 'Liability for links',
        body: 'This site contains links to external third-party websites over whose content we have no influence. The respective provider is always responsible for the content of linked pages. Linked pages were checked for possible legal violations at the time of linking.',
      },
      {
        title: 'Copyright',
        body: 'The editorial content and works created by the site operator are subject to German copyright law. Reproduction, processing, or distribution beyond the scope of copyright law requires written consent.',
      },
      {
        title: 'Affiliate disclosure',
        body: 'This website contains affiliate links. If you sign up via one of our links, we may receive a commission from the card provider. This does not affect our editorial assessments or card rankings.',
      },
    ],
    privacySections: [
      {
        title: '1. Data Controller',
        body: `Thomas Petit — ${ADDRESS_EN}<br/>Email: ${EMAIL}`,
      },
      {
        title: '2. Data we collect',
        body: `<strong>Access logs:</strong> IP address (anonymised), date/time, requested URL, browser type, and ISP. Retention period: max 7 days. Legal basis: Art. 6(1)(f) GDPR — legitimate interest.<br/><br/>
<strong>Strictly necessary cookies:</strong> filter preferences and comparison selections (session), cookie consent preference (12 months). No consent required.<br/><br/>
<strong>Analytics cookies (optional):</strong> Google Analytics via Google Tag Manager — only after your consent via the cookie banner. Legal basis: Art. 6(1)(a) GDPR.`,
      },
      {
        title: '3. Third-party services',
        body: `<strong>Cloudflare</strong> (CDN and security) — certified under EU-US Data Privacy Framework.<br/>
<strong>Supabase</strong> (database) — EU servers (eu-west-1, Ireland).<br/>
<strong>Google Tag Manager / Analytics</strong> — only after consent.<br/>
<strong>Affiliate networks</strong> (Impact Radius, Awin) — only after consent.`,
      },
      {
        title: '4. Your rights (GDPR)',
        body: 'You have the right of access, rectification, erasure, portability, restriction of processing, and objection. To exercise these rights, contact us at the address above. You may also lodge a complaint with the supervisory authority in your country of residence.',
      },
      {
        title: '5. International transfers',
        body: 'Cloudflare and Google are certified under the EU-US Data Privacy Framework. No transfers are made without appropriate safeguards under the GDPR.',
      },
    ],
    affiliateNote: 'For full details on our commercial relationships, see our',
    affiliateLink: 'Affiliate Disclosure',
    rights: {
      title: 'Your rights',
      body: 'For any questions about the processing of your personal data, contact us at the email address above.',
    },
    contact: 'Contact',
  },
};

// ── SEO meta per lang ──────────────────────────────────────────────────────
const SEO: Record<ContentLang, { title: string; desc: string }> = {
  fr: { title: 'Mentions légales & Politique de confidentialité — TopCryptoCards', desc: 'Mentions légales, politique de confidentialité et informations RGPD de TopCryptoCards.' },
  de: { title: 'Impressum & Datenschutz — TopCryptoCards', desc: 'Impressum, Datenschutzerklärung und gesetzliche Informationen von TopCryptoCards.' },
  es: { title: 'Aviso Legal & Política de Privacidad — TopCryptoCards', desc: 'Aviso legal, política de privacidad e información sobre protección de datos de TopCryptoCards.' },
  it: { title: 'Avviso Legale & Privacy — TopCryptoCards', desc: 'Avviso legale, informativa sulla privacy e GDPR di TopCryptoCards.' },
  en: { title: 'Legal Notice & Privacy Policy — TopCryptoCards', desc: 'Legal notice, privacy policy and GDPR information for TopCryptoCards.' },
};

// ── Affiliate disclosure slug per lang (for footer link) ──────────────────
const AFFILIATE_SLUGS: Record<Lang, string> = {
  fr: 'divulgation-affilies',
  be: 'divulgation-affilies',
  de: 'affiliate-offenlegung',
  at: 'affiliate-offenlegung',
  es: 'divulgacion-afiliados',
  it: 'divulgazione-affiliati',
  en: 'affiliate-disclosure',
};

// ── Component ──────────────────────────────────────────────────────────────
export default function LegalPage() {
  const lang = useLegalLang();
  const cl = CONTENT_LANG[lang];
  const c = CONTENT[cl];
  const seo = SEO[cl];
  const affiliateSlug = AFFILIATE_SLUGS[lang];

  React.useEffect(() => {
    const el = document.createElement('meta');
    el.name = 'robots';
    el.content = 'noindex, nofollow';
    el.setAttribute('data-legal-noindex', 'true');
    document.head.appendChild(el);
    return () => { document.querySelector('meta[data-legal-noindex]')?.remove(); };
  }, []);

  useSeoMeta({ title: seo.title, description: seo.desc });
  useHreflang(l => {
    const slug = (LEGAL_SLUGS as Record<string, string>)[l];
    return slug ? `https://topcryptocards.eu/${l}/${slug}` : null;
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
        <p className="text-xs text-slate-400 mb-10">{c.lastUpdated}</p>

        {/* ── Legal Notice ───────────────────────────────────────────────── */}
        <h1 className="text-3xl font-bold text-white mb-10">{c.legalTitle}</h1>

        <div className="space-y-8 mb-16">
          {c.legalSections.map((s, i) => (
            <div key={i} className="card-surface p-6">
              <h2 className="text-base font-semibold text-white mb-3">{s.title}</h2>
              <p
                className="text-slate-400 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </div>
          ))}
          <p className="text-sm text-slate-400">
            {c.affiliateNote}{' '}
            <Link to={`/${lang}/${affiliateSlug}`} className="text-cyan-accent hover:underline">
              {c.affiliateLink}
            </Link>
            .
          </p>
        </div>

        <hr className="border-bg-border mb-16" />

        {/* ── Privacy Policy ─────────────────────────────────────────────── */}
        <h2 className="text-2xl font-bold text-white mb-10">{c.privacyTitle}</h2>

        <div className="space-y-8">
          {c.privacySections.map((s, i) => (
            <div key={i} className="card-surface p-6">
              <h3 className="text-base font-semibold text-white mb-3">{s.title}</h3>
              <p
                className="text-slate-400 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-bg-border py-6 mt-12">
        <div className="container-app flex flex-wrap gap-4 text-xs text-slate-400 justify-between items-center">
          <span>© {new Date().getFullYear()} TopCryptoCards.</span>
          <div className="flex gap-4">
            <Link to={`/${lang}/${LEGAL_SLUGS[lang]}`} className="hover:text-slate-300 transition-colors">{c.legalTitle}</Link>
            <Link to={`/${lang}/${affiliateSlug}`} className="hover:text-slate-300 transition-colors">{c.affiliateLink}</Link>
            <Link to={`/${lang}`} className="hover:text-slate-300 transition-colors">← {c.contact}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
