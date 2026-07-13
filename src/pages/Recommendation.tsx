import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Check, RotateCcw, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../hooks/useLanguage';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { useHreflang } from '../hooks/useHreflang';
import type { CryptoCard, QuizAnswers } from '../types/card';
import { scoreCards } from '../utils/recommend';
import SmartCardImage from '../components/SmartCardImage';
import CardDetailDrawer from '../components/CardDetailDrawer';
import { fmtEUR, fmtPct } from '../utils/format';
import { getAffiliateLink } from '../utils/affiliateLink';
import { trackAffiliateClick } from '../utils/analytics';
import { saveQuizResult } from '../lib/supabase';
import { ROUTE_TRANSLATIONS } from '../i18n/types';
import { THEMATIC_ROUTES } from '../config/routes';

const SLUGS: Record<string, string> = {
  fr: 'recommandation', be: 'recommandation', de: 'empfehlung', at: 'empfehlung',
  es: 'recomendacion', it: 'raccomandazione', en: 'recommendation',
};

const YEAR = new Date().getFullYear();
const REC_SEO: Record<string, { title: string; desc: string }> = {
  fr: { title: `Quiz — Quelle Carte Crypto pour Vous ? ${YEAR} | TopCryptoCards`, desc: `Répondez à 6 questions et obtenez la meilleure carte crypto pour votre profil. Cashback, frais, staking — notre algo choisit pour vous. Gratuit ✓` },
  de: { title: `Welche Krypto-Karte passt zu Ihnen? ${YEAR} | TopCryptoCards`, desc: `6 Fragen beantworten und sofort die beste Krypto-Karte für Ihr Profil erhalten. Cashback, Gebühren, Staking — unser Algorithmus wählt für Sie. Kostenlos ✓` },
  es: { title: `Quiz — ¿Qué Tarjeta Crypto es para Ti? ${YEAR} | TopCryptoCards`, desc: `Responde 6 preguntas y obtén al instante la mejor tarjeta crypto para tu perfil. Cashback, comisiones, staking — nuestro algoritmo elige por ti. Gratis ✓` },
  it: { title: `Quiz — Quale Carta Crypto fa per Te? ${YEAR} | TopCryptoCards`, desc: `Rispondi a 6 domande e ottieni subito la migliore carta crypto per il tuo profilo. Cashback, commissioni, staking — il nostro algoritmo sceglie per te. Gratuito ✓` },
  en: { title: `Which Crypto Card is Right for You? ${YEAR} | TopCryptoCards`, desc: `Answer 6 questions and instantly get the best crypto card for your profile. Cashback, fees, staking — our algorithm picks for you. Free ✓` },
};

const REC_EDITORIAL: Record<string, { h2: string; body: string; related: string; links: { key: string; emoji: string; label: string }[] }> = {
  fr: {
    h2: 'Comment fonctionne notre quiz de recommandation ?',
    body: `Notre outil de recommandation de carte crypto pose 6 questions clés sur votre profil : fréquence d'utilisation, dépenses mensuelles, tolérance au staking, priorité (cashback, voyages, no-KYC, zéro frais), marché de résidence, et niveau d'expérience en crypto. Sur la base de vos réponses, notre algorithme attribue un score pondéré à chaque carte parmi plus de 20 produits — Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty et d'autres — et affiche un classement personnalisé. Le résultat tient compte des disponibilités par pays, des exigences de staking et des taux de cashback réels. Pour aller plus loin, consultez notre simulateur de gains et nos comparatifs thématiques.`,
    related: 'Guides thématiques',
    links: [
      { key: 'best', emoji: '🏆', label: 'Meilleures cartes' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Sans frais' },
      { key: 'beginner', emoji: '🌱', label: 'Débutants' },
      { key: 'no-staking', emoji: '🔓', label: 'Sans staking' },
    ],
  },
  de: {
    h2: 'Wie funktioniert unser Empfehlungs-Quiz?',
    body: `Unser Krypto-Karten-Empfehlungstool stellt 6 Schlüsselfragen zu Ihrem Profil: Nutzungshäufigkeit, monatliche Ausgaben, Staking-Toleranz, Priorität (Cashback, Reisen, No-KYC, keine Gebühren), Wohnsitzmarkt und Krypto-Erfahrungsniveau. Basierend auf Ihren Antworten vergibt unser Algorithmus eine gewichtete Punktzahl an jede Karte aus mehr als 20 Produkten — Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty und andere — und zeigt ein personalisiertes Ranking an. Das Ergebnis berücksichtigt die Länderverfügbarkeit, Staking-Anforderungen und tatsächliche Cashback-Raten. Für weitere Details nutzen Sie unseren Gewinn-Simulator und unsere thematischen Vergleiche.`,
    related: 'Thematische Guides',
    links: [
      { key: 'best', emoji: '🏆', label: 'Beste Karten' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Keine Gebühren' },
      { key: 'beginner', emoji: '🌱', label: 'Einsteiger' },
      { key: 'no-staking', emoji: '🔓', label: 'Kein Staking' },
    ],
  },
  es: {
    h2: '¿Cómo funciona nuestro quiz de recomendación?',
    body: `Nuestra herramienta de recomendación de tarjeta crypto plantea 6 preguntas clave sobre tu perfil: frecuencia de uso, gastos mensuales, tolerancia al staking, prioridad (cashback, viajes, no-KYC, cero comisiones), mercado de residencia y nivel de experiencia en crypto. En base a tus respuestas, nuestro algoritmo asigna una puntuación ponderada a cada tarjeta entre más de 20 productos — Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty y otros — y muestra un ranking personalizado. El resultado tiene en cuenta la disponibilidad por país, los requisitos de staking y las tasas de cashback reales. Para profundizar, consulta nuestro simulador de ganancias y nuestras comparativas temáticas.`,
    related: 'Guías temáticas',
    links: [
      { key: 'best', emoji: '🏆', label: 'Mejores tarjetas' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Sin comisiones' },
      { key: 'beginner', emoji: '🌱', label: 'Principiantes' },
      { key: 'no-staking', emoji: '🔓', label: 'Sin staking' },
    ],
  },
  it: {
    h2: 'Come funziona il nostro quiz di raccomandazione?',
    body: `Il nostro strumento di raccomandazione di carte crypto pone 6 domande chiave sul tuo profilo: frequenza di utilizzo, spese mensili, tolleranza allo staking, priorità (cashback, viaggi, no-KYC, zero commissioni), mercato di residenza e livello di esperienza in crypto. In base alle tue risposte, il nostro algoritmo assegna un punteggio ponderato a ogni carta tra oltre 20 prodotti — Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty e altri — e mostra una classifica personalizzata. Il risultato tiene conto della disponibilità per paese, dei requisiti di staking e dei tassi di cashback reali. Per approfondire, consulta il nostro simulatore di guadagni e i nostri confronti tematici.`,
    related: 'Guide tematiche',
    links: [
      { key: 'best', emoji: '🏆', label: 'Migliori carte' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'Nessuna commissione' },
      { key: 'beginner', emoji: '🌱', label: 'Principianti' },
      { key: 'no-staking', emoji: '🔓', label: 'Nessuno staking' },
    ],
  },
  en: {
    h2: 'How does our recommendation quiz work?',
    body: `Our crypto card recommendation tool asks 6 key questions about your profile: usage frequency, monthly spending, staking tolerance, priority (cashback, travel, no-KYC, zero fees), residence market, and crypto experience level. Based on your answers, our algorithm assigns a weighted score to each card across more than 20 products — Crypto.com, Nexo, Bybit, Binance Card, OKX Card, Gnosis Pay, MetaMask Card, Brighty and others — and displays a personalised ranking. The result accounts for country availability, staking requirements and actual cashback rates. To go further, use our earnings simulator and our thematic comparison guides.`,
    related: 'Thematic guides',
    links: [
      { key: 'best', emoji: '🏆', label: 'Best cards' },
      { key: 'cashback', emoji: '💰', label: 'Cashback' },
      { key: 'no-fees', emoji: '🚫', label: 'No fees' },
      { key: 'beginner', emoji: '🌱', label: 'Beginners' },
      { key: 'no-staking', emoji: '🔓', label: 'No staking' },
    ],
  },
};

type StepDef<K extends keyof QuizAnswers> = {
  key: K;
  title: string;
  description: string;
  options: { value: NonNullable<QuizAnswers[K]>; label: string; sub?: string }[];
};

export default function Recommendation() {
  const { t } = useTranslation('common');
  const lang = useLanguage();
  const cardSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.cards ?? 'cards';
  const brandsSlug = ROUTE_TRANSLATIONS[lang as keyof typeof ROUTE_TRANSLATIONS]?.brands ?? 'brands';
  const recSeo = REC_SEO[lang] || REC_SEO.en;
  useSeoMeta({ title: recSeo.title, description: recSeo.desc, lang });

  useHreflang(l => `https://topcryptocards.eu/${l}/${SLUGS[l as keyof typeof SLUGS] ?? 'recommendation'}`, []);

  // ── Schema.org WebPage (Quiz) ─────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const SLUGS: Record<string, string> = { fr: 'recommandation', de: 'empfehlung', es: 'recomendacion', it: 'raccomandazione', en: 'recommendation' };
    const seg = SLUGS[lang] ?? 'recommendation';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: recSeo.title,
      description: recSeo.desc,
      url: `${BASE}/${lang}/${seg}`,
      inLanguage: lang,
      publisher: { '@type': 'Organization', name: 'TopCryptoCards', url: BASE },
    };
    document.getElementById('schema-recommendation')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-recommendation';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-recommendation')?.remove(); };
  }, [lang, recSeo]);

  // ── FAQ schema (editorial how-to bloc) ───────────────────────────────────────
  useEffect(() => {
    const ed = REC_EDITORIAL[lang] ?? REC_EDITORIAL.en;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: ed.h2, acceptedAnswer: { '@type': 'Answer', text: ed.body } }],
    };
    document.getElementById('schema-rec-faq')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-rec-faq'; el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-rec-faq')?.remove(); };
  }, [lang]);

  // ── BreadcrumbList schema ────────────────────────────────────────────────────
  useEffect(() => {
    const BASE = 'https://topcryptocards.eu';
    const SLUGS: Record<string, string> = { fr: 'recommandation', de: 'empfehlung', es: 'recomendacion', it: 'raccomandazione', en: 'recommendation' };
    const labels: Record<string, [string, string]> = {
      fr: ['Accueil', 'Recommandation'], de: ['Startseite', 'Empfehlung'], es: ['Inicio', 'Recomendación'], it: ['Home', 'Raccomandazione'], en: ['Home', 'Recommendation'],
    };
    const [homeL, pageL] = labels[lang] ?? labels.en;
    const seg = SLUGS[lang] ?? 'recommendation';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeL, item: `${BASE}/${lang}` },
        { '@type': 'ListItem', position: 2, name: pageL, item: `${BASE}/${lang}/${seg}` },
      ],
    };
    document.getElementById('schema-rec-breadcrumb')?.remove();
    const el = document.createElement('script');
    el.id = 'schema-rec-breadcrumb'; el.type = 'application/ld+json';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return () => { document.getElementById('schema-rec-breadcrumb')?.remove(); };
  }, [lang]);

  const cards = useAppStore((s) => s.cards);
  const answers = useAppStore((s) => s.quizAnswers);
  const setQuizAnswer = useAppStore((s) => s.setQuizAnswer);
  const resetQuiz = useAppStore((s) => s.resetQuiz);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const [detail, setDetail] = useState<CryptoCard | null>(null);

  const STEPS: StepDef<keyof QuizAnswers>[] = [
    {
      key: 'budget',
      title: t('quiz_q1_title'),
      description: t('quiz_q1_desc'),
      options: [
        { value: 'lt200', label: t('quiz_q1_opt1'), sub: t('quiz_q1_opt1_sub') },
        { value: '200-500', label: t('quiz_q1_opt2'), sub: t('quiz_q1_opt2_sub') },
        { value: '500-1500', label: t('quiz_q1_opt3'), sub: t('quiz_q1_opt3_sub') },
        { value: 'gt1500', label: t('quiz_q1_opt4'), sub: t('quiz_q1_opt4_sub') },
      ],
    },
    {
      key: 'priority',
      title: t('quiz_q2_title'),
      description: t('quiz_q2_desc'),
      options: [
        { value: 'cashback', label: t('quiz_q2_opt1') },
        { value: 'zero_fees', label: t('quiz_q2_opt2') },
        { value: 'ease', label: t('quiz_q2_opt3') },
        { value: 'staking_fair', label: t('quiz_q2_opt4') },
        { value: 'withdrawals', label: t('quiz_q2_opt5') },
      ],
    },
    {
      key: 'staking',
      title: t('quiz_q3_title'),
      description: t('quiz_q3_desc'),
      options: [
        { value: 'none', label: t('quiz_q3_opt1'), sub: t('quiz_q3_opt1_sub') },
        { value: 'up_500', label: t('quiz_q3_opt2') },
        { value: 'up_2500', label: t('quiz_q3_opt3') },
        { value: 'more', label: t('quiz_q3_opt4'), sub: t('quiz_q3_opt4_sub') },
      ],
    },
    {
      key: 'crypto_relation',
      title: t('quiz_q4_title'),
      description: t('quiz_q4_desc'),
      options: [
        { value: 'beginner', label: t('quiz_q4_opt1') },
        { value: 'basics', label: t('quiz_q4_opt2') },
        { value: 'regular', label: t('quiz_q4_opt3') },
        { value: 'advanced', label: t('quiz_q4_opt4') },
      ],
    },
    {
      key: 'travel',
      title: t('quiz_q5_title'),
      description: t('quiz_q5_desc'),
      options: [
        { value: 'never', label: t('quiz_q5_opt1') },
        { value: 'few', label: t('quiz_q5_opt2') },
        { value: 'regular', label: t('quiz_q5_opt3') },
        { value: 'often', label: t('quiz_q5_opt4') },
      ],
    },
    {
      key: 'geo',
      title: t('quiz_q6_title'),
      description: t('quiz_q6_desc'),
      options: [
        { value: 'france', label: t('quiz_q6_opt1') },
        { value: 'eu', label: t('quiz_q6_opt2') },
        { value: 'international', label: t('quiz_q6_opt3') },
      ],
    },
  ];

  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const total = STEPS.length;

  const currentStep = STEPS[step];
  const currentValue = answers[currentStep.key];

  const results = useMemo(() => scoreCards(cards, answers, lang).slice(0, 3), [cards, answers, lang]);

  const handleSelect = (value: string) => {
    setQuizAnswer(currentStep.key, value as never);
  };

  const handleNext = async () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
      try {
        await saveQuizResult(
          answers,
          results.map((r) => ({ cardId: r.card.id, score: r.score }))
        );
      } catch {
        // ignore
      }
    }
  };

  const handlePrev = () => {
    if (showResults) {
      setShowResults(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    resetQuiz();
    setStep(0);
    setShowResults(false);
  };

  const progressPct = showResults ? 100 : ((step + (currentValue ? 1 : 0)) / total) * 100;

  return (
    <div className="container-app py-10 max-w-3xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-accent mb-3">
          <Sparkles className="w-4 h-4" />
          {t('quiz_badge')}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {t('quiz_title')}
        </h1>
        <p className="text-slate-400">
          {t('quiz_desc')}
        </p>
      </header>

      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>
            {showResults
              ? t('quiz_results_label')
              : `${t('quiz_step')} ${step + 1} ${t('quiz_of')} ${total}`}
          </span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-accent to-green-accent transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < step || showResults
                  ? 'bg-green-accent'
                  : i === step
                  ? 'bg-cyan-accent'
                  : 'bg-bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {!showResults ? (
        <div className="card-surface p-6 md:p-8 animate-fade-in">
          <h2 className="text-xl md:text-2xl font-display font-semibold text-white mb-1">
            {currentStep.title}
          </h2>
          <p className="text-sm text-slate-400 mb-6">{currentStep.description}</p>

          <div className="space-y-2">
            {currentStep.options.map((opt) => {
              const active = currentValue === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    active
                      ? 'bg-cyan-accent/10 border-cyan-accent text-white shadow-glow'
                      : 'bg-bg-elevated border-bg-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-medium">{opt.label}</div>
                    {opt.sub && <div className="text-xs text-slate-400 mt-0.5">{opt.sub}</div>}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      active ? 'border-cyan-accent bg-cyan-accent' : 'border-bg-border'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-bg" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('quiz_prev')}
            </button>
            <button
              onClick={handleNext}
              disabled={!currentValue}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === total - 1 ? t('quiz_see_results') : t('quiz_next')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-display font-semibold text-white">
              {t('quiz_top3_title')}
            </h2>
            <button onClick={handleReset} className="btn-ghost">
              <RotateCcw className="w-4 h-4" />
              {t('quiz_redo')}
            </button>
          </div>

          {results.length === 0 && (
            <div className="card-surface p-10 text-center">
              <p className="text-slate-400">
                {t('quiz_no_results')}
              </p>
            </div>
          )}

          {results.map((r, i) => {
            const isFav = favorites.includes(r.card.id);
            return (
              <div
                key={r.card.id}
                className={`card-surface p-6 ${
                  i === 0 ? 'border-green-accent/40 shadow-glow-green' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex items-start gap-5 flex-1">
                    {/* Clickable card image */}
                    <button
                      onClick={() => setDetail(r.card)}
                      className="shrink-0 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-cyan-accent rounded-xl"
                      title={r.card.name}
                    >
                      <SmartCardImage card={r.card} size={i === 0 ? 'md' : 'sm'} />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-slate-400">#{i + 1}</span>
                        {i === 0 && (
                          <span className="badge-best">
                            <Award className="w-3 h-3" /> {t('quiz_recommended_badge')}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setDetail(r.card)}
                        className="font-display font-bold text-lg text-white hover:text-cyan-accent transition-colors text-left"
                      >
                        {r.card.name}
                      </button>
                      <div className="text-sm text-slate-400">{r.card.issuer}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5 text-sm">
                  <div>
                    <div className="text-xs text-slate-400">{t('quiz_cashback_label')}</div>
                    <div className="text-white font-semibold">{fmtPct(r.effectiveCashback)}</div>
                    {r.card.cashbackPremium > r.effectiveCashback && (
                      <div className="text-xs text-amber-400/80 mt-0.5">
                        {t('sim_potential_prefix')} {r.card.cashbackPremium}%
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">{t('quiz_fees_label')}</div>
                    <div className="text-white font-semibold">
                      {r.card.annualFees === 0 ? t('quiz_free') : fmtEUR(r.card.annualFees)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">{t('quiz_staking_label')}</div>
                    <div className="text-white font-semibold">
                      {r.card.stakingRequired === 0 ? t('quiz_none') : fmtEUR(r.card.stakingRequired)}
                    </div>
                  </div>
                </div>

                {r.reasons.length > 0 && (
                  <div className="mt-5 space-y-1.5">
                    {r.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-green-accent shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}
                {r.drawbacks.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {r.drawbacks.map((d, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="w-4 h-4 shrink-0 mt-0.5 text-center">−</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleFavorite(r.card.id)}
                    className={`btn-secondary text-sm ${
                      isFav ? 'border-green-accent/50 text-green-accent' : ''
                    }`}
                  >
                    <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                    {isFav ? t('quiz_in_fav') : t('quiz_add_fav')}
                  </button>
                  <Link
                    to={`/${lang}/${cardSlug}/${r.card.id}`}
                    className="btn-ghost border border-bg-border text-sm inline-flex items-center gap-1"
                  >
                    {t('common:card_detail_view_page')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {r.card.brandId && (
                    <Link
                      to={`/${lang}/${brandsSlug}/${r.card.brandId}`}
                      className="btn-ghost border border-bg-border text-sm"
                    >
                      {t('brand_label')}
                    </Link>
                  )}
                  <a
                    href={getAffiliateLink(r.card)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="btn-ghost border border-bg-border"
                    onClick={() => trackAffiliateClick(r.card.name, r.card.issuer, getAffiliateLink(r.card), 'recommendation', lang)}
                  >
                    {t('quiz_see_offer')}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CardDetailDrawer card={detail} onClose={() => setDetail(null)} />

      {/* Bloc éditorial — thin content fix + internal links */}
      {(() => {
        const ed = REC_EDITORIAL[lang] ?? REC_EDITORIAL.en;
        return (
          <div className="mt-14 border-t border-bg-border pt-10">
            <h2 className="text-xl font-display font-bold text-white mb-4">{ed.h2}</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-3xl mb-8">{ed.body}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{ed.related}</p>
            <div className="flex flex-wrap gap-2">
              {ed.links.map(({ key, emoji, label }) => {
                const slug = THEMATIC_ROUTES[key]?.[lang as keyof typeof THEMATIC_ROUTES['best']] ?? THEMATIC_ROUTES[key]?.en;
                if (!slug) return null;
                return (
                  <Link key={key} to={`/${lang}/${slug}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-bg-border bg-bg-elevated text-sm text-slate-300 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all">
                    <span aria-hidden="true">{emoji}</span>{label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
