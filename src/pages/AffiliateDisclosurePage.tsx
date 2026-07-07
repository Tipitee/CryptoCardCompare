import React from 'react';
import { useHreflang } from '../hooks/useHreflang';
import { Link, useParams } from 'react-router-dom';
import { Coins, ExternalLink } from 'lucide-react';

const SUPPORTED_LANGS = ['fr', 'de', 'es', 'it', 'en'] as const;
type Lang = typeof SUPPORTED_LANGS[number];

function useDisclosureLang(): Lang {
  const { lang } = useParams<{ lang?: string }>();
  return (SUPPORTED_LANGS as readonly string[]).includes(lang ?? '') ? lang as Lang : 'en';
}

/* ── Slugs ───────────────────────────────────────────────────────────────── */
const SLUGS: Record<Lang, string> = {
  fr: 'divulgation-affilies',
  de: 'affiliate-offenlegung',
  es: 'divulgacion-afiliados',
  it: 'divulgazione-affiliati',
  en: 'affiliate-disclosure',
};

/* ── Content ─────────────────────────────────────────────────────────────── */
interface Content {
  h1: string;
  lastUpdated: string;
  sections: {
    commercial: { title: string; p1: string; p2: string; p3: string };
    notAffected: { title: string; rankings: { title: string; body: string }; inclusion: { title: string; body: string }; editorial: { title: string; body: string } };
    identify: { title: string; p1: string; p2: string };
    networks: { title: string };
    price: { title: string; body: string };
    questions: { title: string; body: string };
  };
}

const CONTENT: Record<Lang, Content> = {
  fr: {
    h1: "Divulgation des liens d'affiliation",
    lastUpdated: 'Dernière mise à jour : juillet 2026',
    sections: {
      commercial: {
        title: 'Nos relations commerciales',
        p1: `TopCryptoCards perçoit des commissions d'affiliation sur certaines cartes référencées sur ce site. Lorsque vous souscrivez à une carte via un lien contenant <code>/go/</code> dans l'URL, nous pouvons recevoir un paiement de l'émetteur de la carte ou de son réseau d'affiliation. Le montant varie selon le prestataire et correspond généralement à un forfait fixe par inscription validée.`,
        p2: `Les cartes pour lesquelles nous avons une relation d'affiliation sont accessibles via <code>/go/&lt;card-slug&gt;/</code>.`,
        p3: `Les cartes sans relation d'affiliation renvoient directement vers le site de l'émetteur. Il s'agit notamment (au juillet 2026) de : Coinbase, Binance, Gemini, MetaMask, EtherFi, et d'autres. Elles apparaissent sur ce site parce qu'elles sont pertinentes pour les utilisateurs — pas parce que nous en tirons un revenu.`,
      },
      notAffected: {
        title: "Ce que les relations d'affiliation n'influencent PAS",
        rankings: { title: 'Classements', body: "Les cartes sont classées selon notre méthodologie publiée (cashback réaliste, frais, disponibilité régionale). Aucune carte ne bénéficie d'un meilleur classement parce que nous en percevons une commission." },
        inclusion: { title: 'Inclusion', body: "Les cartes sans relation d'affiliation sont incluses et évaluées de la même manière." },
        editorial: { title: 'Évaluations éditoriales', body: "Les faiblesses, restrictions et limitations sont signalées quelle que soit la relation commerciale." },
      },
      identify: {
        title: 'Comment identifier les liens affiliés',
        p1: `Tous les liens sortants affiliés passent par <code>/go/&lt;card-name&gt;/</code>. Les liens directs (non affiliés) pointent directement vers l'URL de l'émetteur. Vous pouvez vérifier cela en survolant n'importe quel bouton "Visiter le site".`,
        p2: `Dans le HTML, les liens affiliés comportent <code>rel="sponsored"</code> conformément à la convention recommandée par Google pour la transparence.`,
      },
      networks: { title: "Réseaux d'affiliation avec lesquels nous travaillons" },
      price: {
        title: "Votre prix n'est jamais affecté",
        body: "L'utilisation de nos liens affiliés <strong>n'augmente jamais le prix que vous payez</strong> ni ne modifie les conditions de la carte. La commission est versée par l'émetteur, pas par vous.",
      },
      questions: {
        title: 'Questions',
        body: "Si vous avez des questions sur nos relations commerciales, contactez-nous à l'adresse",
      },
    },
  },
  de: {
    h1: 'Affiliate-Offenlegung',
    lastUpdated: 'Zuletzt aktualisiert: Juli 2026',
    sections: {
      commercial: {
        title: 'Unsere Geschäftsbeziehungen',
        p1: `TopCryptoCards verdient Affiliate-Provisionen von einigen der auf dieser Website gelisteten Karten. Wenn Sie sich über einen Link mit <code>/go/</code> in der URL für eine Karte anmelden, erhalten wir möglicherweise eine Zahlung vom Kartenemittenten oder dessen Affiliate-Netzwerk. Der Betrag variiert je nach Anbieter und ist in der Regel eine feste Gebühr pro verifizierter Anmeldung.`,
        p2: `Karten, mit denen wir eine Affiliate-Beziehung haben, sind über <code>/go/&lt;card-slug&gt;/</code> verlinkt.`,
        p3: `Karten ohne Affiliate-Beziehung verlinken direkt auf die Website des Emittenten. Dazu gehören (Stand Juli 2026): Coinbase, Binance, Gemini, MetaMask, EtherFi und andere. Sie erscheinen auf dieser Website, weil sie für Nutzer relevant sind — nicht weil wir davon profitieren.`,
      },
      notAffected: {
        title: 'Was Affiliate-Beziehungen NICHT beeinflussen',
        rankings: { title: 'Rankings', body: 'Karten werden nach unserer veröffentlichten Methodik (realistisches Cashback, Gebühren, regionale Verfügbarkeit) bewertet. Keine Karte erhält ein besseres Ranking, weil wir davon profitieren.' },
        inclusion: { title: 'Aufnahme', body: 'Karten ohne Affiliate-Beziehungen werden gleichermaßen aufgenommen und bewertet.' },
        editorial: { title: 'Redaktionelle Bewertungen', body: 'Schwächen, Einschränkungen und Limitierungen werden unabhängig von der Geschäftsbeziehung berichtet.' },
      },
      identify: {
        title: 'Wie man Affiliate-Links erkennt',
        p1: `Alle ausgehenden Affiliate-Links führen über <code>/go/&lt;card-name&gt;/</code>. Direkte (Nicht-Affiliate-)Links führen direkt zur URL des Emittenten. Sie können dies überprüfen, indem Sie über eine Schaltfläche „Website besuchen" fahren.`,
        p2: `Im HTML tragen Affiliate-Links <code>rel="sponsored"</code> gemäß Googles empfohlener Konvention für transparente Offenlegung.`,
      },
      networks: { title: 'Affiliate-Netzwerke, mit denen wir zusammenarbeiten' },
      price: {
        title: 'Ihr Preis wird niemals beeinflusst',
        body: 'Die Nutzung unserer Affiliate-Links <strong>erhöht niemals den Preis, den Sie zahlen</strong>, noch ändert sie die Kartenbedingungen. Die Provision wird vom Kartenemittenten bezahlt, nicht von Ihnen.',
      },
      questions: {
        title: 'Fragen',
        body: 'Bei Fragen zu unseren Geschäftsbeziehungen wenden Sie sich bitte an',
      },
    },
  },
  es: {
    h1: 'Divulgación de afiliados',
    lastUpdated: 'Última actualización: julio 2026',
    sections: {
      commercial: {
        title: 'Nuestras relaciones comerciales',
        p1: `TopCryptoCards gana comisiones de afiliación de algunas de las tarjetas listadas en este sitio. Cuando te registras para una tarjeta a través de un enlace con <code>/go/</code> en la URL, podemos recibir un pago del emisor de la tarjeta o su red de afiliados. El importe varía según el proveedor y suele ser una tarifa fija por registro verificado.`,
        p2: `Las tarjetas con las que tenemos una relación de afiliación están enlazadas a través de <code>/go/&lt;card-slug&gt;/</code>.`,
        p3: `Las tarjetas sin relación de afiliación enlazan directamente al sitio web del emisor. Estas incluyen (a julio de 2026): Coinbase, Binance, Gemini, MetaMask, EtherFi y otras. Aparecen en este sitio porque son relevantes para los usuarios, no porque obtengamos ingresos de ellas.`,
      },
      notAffected: {
        title: 'Lo que las relaciones de afiliación NO afectan',
        rankings: { title: 'Rankings', body: 'Las tarjetas se clasifican según nuestra metodología publicada (cashback realista, comisiones, disponibilidad regional). Ninguna tarjeta recibe una mejora en el ranking porque obtengamos ingresos de ella.' },
        inclusion: { title: 'Inclusión', body: 'Las tarjetas sin relaciones de afiliación se incluyen y revisan por igual.' },
        editorial: { title: 'Evaluaciones editoriales', body: 'Las debilidades, restricciones y limitaciones se informan independientemente de la relación comercial.' },
      },
      identify: {
        title: 'Cómo identificar los enlaces de afiliados',
        p1: `Todos los enlaces salientes de afiliados se enrutan a través de <code>/go/&lt;card-name&gt;/</code>. Los enlaces directos (no de afiliados) van directamente a la URL del emisor. Puedes verificarlo pasando el cursor sobre cualquier botón "Visitar sitio".`,
        p2: `En el HTML, los enlaces de afiliados llevan <code>rel="sponsored"</code> según la convención recomendada por Google para la divulgación transparente.`,
      },
      networks: { title: 'Redes de afiliados con las que trabajamos' },
      price: {
        title: 'Tu precio nunca se ve afectado',
        body: 'El uso de nuestros enlaces de afiliados <strong>nunca aumenta el precio que pagas</strong> ni cambia las condiciones de ninguna tarjeta. La comisión la paga el emisor de la tarjeta, no tú.',
      },
      questions: {
        title: 'Preguntas',
        body: 'Si tienes alguna pregunta sobre nuestras relaciones comerciales, escríbenos a',
      },
    },
  },
  it: {
    h1: 'Divulgazione affiliati',
    lastUpdated: 'Ultimo aggiornamento: luglio 2026',
    sections: {
      commercial: {
        title: 'Le nostre relazioni commerciali',
        p1: `TopCryptoCards guadagna commissioni di affiliazione da alcune delle carte elencate su questo sito. Quando ti iscrivi a una carta tramite un link con <code>/go/</code> nell'URL, potremmo ricevere un pagamento dall'emittente della carta o dalla sua rete di affiliazione. L'importo varia in base al fornitore ed è solitamente una tariffa fissa per registrazione verificata.`,
        p2: `Le carte con cui abbiamo una relazione di affiliazione sono collegate tramite <code>/go/&lt;card-slug&gt;/</code>.`,
        p3: `Le carte senza relazione di affiliazione rimandano direttamente al sito web dell'emittente. Queste includono (a luglio 2026): Coinbase, Binance, Gemini, MetaMask, EtherFi e altri. Appaiono su questo sito perché sono rilevanti per gli utenti, non perché ne ricaviamo entrate.`,
      },
      notAffected: {
        title: 'Cosa le relazioni di affiliazione NON influenzano',
        rankings: { title: 'Classifiche', body: 'Le carte sono classificate secondo la nostra metodologia pubblicata (cashback realistico, commissioni, disponibilità regionale). Nessuna carta riceve un posizionamento migliore perché ne ricaviamo entrate.' },
        inclusion: { title: 'Inclusione', body: 'Le carte senza relazioni di affiliazione sono incluse e recensite allo stesso modo.' },
        editorial: { title: 'Valutazioni editoriali', body: 'Punti deboli, restrizioni e limitazioni vengono segnalati indipendentemente dalla relazione commerciale.' },
      },
      identify: {
        title: 'Come identificare i link di affiliazione',
        p1: `Tutti i link in uscita di affiliazione passano attraverso <code>/go/&lt;card-name&gt;/</code>. I link diretti (non di affiliazione) portano direttamente all'URL dell'emittente. Puoi verificarlo passando il mouse su qualsiasi pulsante "Visita il sito".`,
        p2: `Nell'HTML, i link di affiliazione portano <code>rel="sponsored"</code> secondo la convenzione raccomandata da Google per la divulgazione trasparente.`,
      },
      networks: { title: 'Reti di affiliazione con cui lavoriamo' },
      price: {
        title: 'Il tuo prezzo non viene mai influenzato',
        body: "L'utilizzo dei nostri link di affiliazione <strong>non aumenta mai il prezzo che paghi</strong> né modifica i termini di alcuna carta. La commissione viene pagata dall'emittente della carta, non da te.",
      },
      questions: {
        title: 'Domande',
        body: 'Per qualsiasi domanda sulle nostre relazioni commerciali, scrivi a',
      },
    },
  },
  en: {
    h1: 'Affiliate Disclosure',
    lastUpdated: 'Last updated: July 2026',
    sections: {
      commercial: {
        title: 'Our commercial relationships',
        p1: `TopCryptoCards earns affiliate commission from some of the cards listed on this site. When you sign up for a card via a link marked with <code>/go/</code> in the URL, we may receive a payment from the card issuer or its affiliate network. The amount varies by provider and is typically a fixed fee per verified sign-up.`,
        p2: `Cards we currently have an affiliate relationship with are linked via <code>/go/&lt;card-slug&gt;/</code>.`,
        p3: `Cards we do not have an affiliate relationship with are linked directly to the issuer's website. These include (as of July 2026): Coinbase, Binance, Gemini, MetaMask, EtherFi, and several others. They appear on this site because they are relevant to users — not because we earn from them.`,
      },
      notAffected: {
        title: 'What affiliate relationships do NOT affect',
        rankings: { title: 'Rankings', body: 'Cards are ranked by our published methodology (realistic cashback, fees, regional availability). No card receives a ranking boost because we earn from it.' },
        inclusion: { title: 'Inclusion', body: 'Cards without affiliate relationships are included and reviewed equally.' },
        editorial: { title: 'Editorial assessments', body: 'Weaknesses, restrictions, and limitations are reported regardless of commercial relationship.' },
      },
      identify: {
        title: 'How to identify affiliate links',
        p1: `All affiliate outbound links route through <code>/go/&lt;card-name&gt;/</code>. All direct (non-affiliate) links go directly to the issuer's URL. You can verify this by hovering over any "Visit site" button.`,
        p2: `In the HTML, affiliate links carry <code>rel="sponsored"</code> as per Google's recommended convention for transparent disclosure.`,
      },
      networks: { title: 'Affiliate networks we work with' },
      price: {
        title: 'The price you pay is never affected',
        body: 'Using our affiliate links <strong>never increases the price you pay</strong> or changes the terms of any card. The commission is paid by the card issuer, not by you.',
      },
      questions: {
        title: 'Questions',
        body: 'If you have any questions about our commercial relationships, email us at',
      },
    },
  },
};

const FOOTER_LABELS: Record<Lang, { copyright: string; impressum: string; privacy: string; affiliate: string; risk: string }> = {
  fr: { copyright: 'Pas de conseil financier.', impressum: 'Mentions légales', privacy: 'Confidentialité', affiliate: 'Liens affiliés', risk: 'Avertissement risques' },
  de: { copyright: 'Kein Finanzberatung.', impressum: 'Impressum', privacy: 'Datenschutz', affiliate: 'Affiliate-Offenlegung', risk: 'Risikohinweis' },
  es: { copyright: 'Sin asesoramiento financiero.', impressum: 'Aviso legal', privacy: 'Privacidad', affiliate: 'Afiliados', risk: 'Resumen de riesgos' },
  it: { copyright: 'Nessun consiglio finanziario.', impressum: 'Note legali', privacy: 'Privacy', affiliate: 'Affiliati', risk: 'Riepilogo rischi' },
  en: { copyright: 'No financial advice.', impressum: 'Impressum', privacy: 'Privacy', affiliate: 'Affiliate Disclosure', risk: 'Risk Summary' },
};

export default function AffiliateDisclosurePage() {
  const lang = useDisclosureLang();
  const c = CONTENT[lang];
  const f = FOOTER_LABELS[lang];
  const slug = SLUGS[lang];

  React.useEffect(() => {
    const el = document.createElement('meta');
    el.name = 'robots';
    el.content = 'noindex, nofollow';
    el.setAttribute('data-legal-noindex', 'true');
    document.head.appendChild(el);
    return () => { document.querySelector('meta[data-legal-noindex]')?.remove(); };
  }, []);

  // Hreflang
  useHreflang(
    Object.entries(SLUGS).map(([l, s]) => ({ lang: l, href: `https://topcryptocards.eu/${l}/${s}` })),
    [],
    { noXDefault: true },
  );

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
        <h1 className="text-3xl font-bold text-white mb-2">{c.h1}</h1>
        <p className="text-slate-500 text-sm mb-10">{c.lastUpdated}</p>

        <div className="space-y-10 text-slate-400 text-sm leading-relaxed">

          {/* Commercial relationships */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{c.sections.commercial.title}</h2>
            <p className="mb-4"
              dangerouslySetInnerHTML={{ __html: c.sections.commercial.p1.replace(/<code>/g, '<code class="px-1.5 py-0.5 rounded bg-bg-elevated text-cyan-accent text-xs">') }}
            />
            <p className="mb-4">
              <span className="text-slate-300 font-medium"
                dangerouslySetInnerHTML={{ __html: c.sections.commercial.p2.replace(/<code>/g, '<code class="px-1.5 py-0.5 rounded bg-bg-elevated text-cyan-accent text-xs">') }}
              />
            </p>
            <p dangerouslySetInnerHTML={{ __html: c.sections.commercial.p3.replace(/<code>/g, '<code class="px-1.5 py-0.5 rounded bg-bg-elevated text-cyan-accent text-xs">') }} />
          </section>

          {/* Not affected */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{c.sections.notAffected.title}</h2>
            <div className="space-y-3">
              {[c.sections.notAffected.rankings, c.sections.notAffected.inclusion, c.sections.notAffected.editorial].map((item) => (
                <div key={item.title} className="card-surface p-4">
                  <p className="text-slate-300 font-semibold mb-1">{item.title}</p>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Identify */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{c.sections.identify.title}</h2>
            <p className="mb-3"
              dangerouslySetInnerHTML={{ __html: c.sections.identify.p1.replace(/<code>/g, '<code class="px-1.5 py-0.5 rounded bg-bg-elevated text-cyan-accent text-xs">') }}
            />
            <p dangerouslySetInnerHTML={{ __html: c.sections.identify.p2.replace(/<code>/g, '<code class="px-1.5 py-0.5 rounded bg-bg-elevated text-cyan-accent text-xs">') }} />
          </section>

          {/* Networks */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{c.sections.networks.title}</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span><span className="text-slate-300">Impact Radius</span> — Impact Tech, Inc., Santa Barbara, CA, USA</span>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span><span className="text-slate-300">Awin</span> — Awin AG, Eichhornstraße 3, 10785 Berlin, Germany</span>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{lang === 'fr' ? 'Accords directs avec des prestataires de cartes' : lang === 'de' ? 'Direkte Vereinbarungen mit einzelnen Kartenanbietern' : lang === 'es' ? 'Acuerdos directos con proveedores de tarjetas' : lang === 'it' ? 'Accordi diretti con singoli fornitori di carte' : 'Direct arrangements with individual card providers'}</span>
              </li>
            </ul>
          </section>

          {/* Price */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{c.sections.price.title}</h2>
            <div className="card-surface p-5 border-green-accent/20 bg-green-accent/5">
              <p className="text-slate-300" dangerouslySetInnerHTML={{ __html: c.sections.price.body }} />
            </div>
          </section>

          {/* Questions */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">{c.sections.questions.title}</h2>
            <p>{c.sections.questions.body} <a href="mailto:contact@topcryptocards.eu" className="text-cyan-accent hover:underline">contact@topcryptocards.eu</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-bg-border py-6">
        <div className="container-app flex flex-wrap gap-4 text-xs text-slate-500 justify-between items-center">
          <span>© {new Date().getFullYear()} TopCryptoCards. {f.copyright}</span>
          <div className="flex gap-4">
            <Link to="/impressum" className="hover:text-slate-300 transition-colors">{f.impressum}</Link>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">{f.privacy}</Link>
            <Link to={`/${lang}/${slug}`} className="hover:text-slate-300 transition-colors">{f.affiliate}</Link>
            <Link to="/risk-summary" className="hover:text-slate-300 transition-colors">{f.risk}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
