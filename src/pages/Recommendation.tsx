import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Check, RotateCcw, Sparkles, Star } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { QuizAnswers } from '../types/card';
import { scoreCards } from '../utils/recommend';
import SmartCardImage from '../components/SmartCardImage';
import { fmtEUR, fmtPct } from '../utils/format';
import { saveQuizResult } from '../lib/supabase';

type StepDef<K extends keyof QuizAnswers> = {
  key: K;
  title: string;
  description: string;
  options: { value: NonNullable<QuizAnswers[K]>; label: string; sub?: string }[];
};

const STEPS: StepDef<keyof QuizAnswers>[] = [
  {
    key: 'budget',
    title: 'Quel est votre budget mensuel sur la carte ?',
    description: 'Estimation de vos dépenses totales chaque mois.',
    options: [
      { value: 'lt200', label: 'Moins de 200 €', sub: 'Usage occasionnel' },
      { value: '200-500', label: '200 € – 500 €', sub: 'Dépenses courantes' },
      { value: '500-1500', label: '500 € – 1 500 €', sub: 'Utilisation quotidienne' },
      { value: 'gt1500', label: 'Plus de 1 500 €', sub: 'Carte principale' },
    ],
  },
  {
    key: 'priority',
    title: 'Votre priorité numéro un ?',
    description: 'Ce qui compte le plus dans votre choix.',
    options: [
      { value: 'cashback', label: 'Cashback maximum' },
      { value: 'zero_fees', label: 'Zéro frais annuels' },
      { value: 'ease', label: 'Simplicité d\'utilisation' },
      { value: 'staking_fair', label: 'Staking raisonnable' },
      { value: 'withdrawals', label: 'Retraits gratuits' },
    ],
  },
  {
    key: 'staking',
    title: 'Prêt à staker de la crypto ?',
    description: 'Le staking permet généralement d\'accéder à un meilleur cashback.',
    options: [
      { value: 'none', label: 'Non, je préfère éviter', sub: 'Aucun blocage de fonds' },
      { value: 'up_500', label: 'Oui, jusqu\'à 500 €' },
      { value: 'up_2500', label: 'Oui, jusqu\'à 2 500 €' },
      { value: 'more', label: 'Oui, plus de 2 500 €', sub: 'Investisseur confirmé' },
    ],
  },
  {
    key: 'crypto_relation',
    title: 'Votre rapport aux cryptomonnaies ?',
    description: 'Pour adapter la complexité de la carte à votre profil.',
    options: [
      { value: 'beginner', label: 'Débutant complet' },
      { value: 'basics', label: 'Quelques notions' },
      { value: 'regular', label: 'Utilisateur régulier' },
      { value: 'advanced', label: 'Investisseur avancé' },
    ],
  },
  {
    key: 'travel',
    title: 'Voyagez-vous souvent ?',
    description: 'Certaines cartes offrent des avantages voyage.',
    options: [
      { value: 'never', label: 'Jamais' },
      { value: 'few', label: 'Quelques fois par an' },
      { value: 'regular', label: 'Régulièrement' },
      { value: 'often', label: 'Très fréquemment' },
    ],
  },
  {
    key: 'geo',
    title: 'Disponibilité géographique ?',
    description: 'Où devez-vous pouvoir utiliser la carte ?',
    options: [
      { value: 'france', label: 'France uniquement' },
      { value: 'eu', label: 'Europe (UE)' },
      { value: 'international', label: 'International' },
    ],
  },
];

export default function Recommendation() {
  const cards = useAppStore((s) => s.cards);
  const answers = useAppStore((s) => s.quizAnswers);
  const setQuizAnswer = useAppStore((s) => s.setQuizAnswer);
  const resetQuiz = useAppStore((s) => s.resetQuiz);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const total = STEPS.length;

  const currentStep = STEPS[step];
  const currentValue = answers[currentStep.key];

  const results = useMemo(() => scoreCards(cards, answers).slice(0, 3), [cards, answers]);

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
          Quiz personnalisé
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Trouvez votre carte crypto idéale
        </h1>
        <p className="text-slate-400">
          6 questions rapides pour identifier les 3 cartes les mieux adaptées à votre profil.
        </p>
      </header>

      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>{showResults ? 'Résultats' : `Étape ${step + 1} sur ${total}`}</span>
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
                    {opt.sub && <div className="text-xs text-slate-500 mt-0.5">{opt.sub}</div>}
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
              Précédent
            </button>
            <button
              onClick={handleNext}
              disabled={!currentValue}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === total - 1 ? 'Voir les résultats' : 'Suivant'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-display font-semibold text-white">
              Vos 3 meilleures correspondances
            </h2>
            <button onClick={handleReset} className="btn-ghost">
              <RotateCcw className="w-4 h-4" />
              Refaire le quiz
            </button>
          </div>

          {results.length === 0 && (
            <div className="card-surface p-10 text-center">
              <p className="text-slate-400">
                Aucune carte ne correspond strictement à vos critères. Essayez d'élargir le staking ou la zone géographique.
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
                    <SmartCardImage card={r.card} size={i === 0 ? 'md' : 'sm'} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-slate-500">#{i + 1}</span>
                        {i === 0 && (
                          <span className="badge-best">
                            <Award className="w-3 h-3" /> Recommandée
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {r.card.name}
                      </h3>
                      <div className="text-sm text-slate-400">{r.card.issuer}</div>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Score</div>
                    <div className="text-3xl font-display font-bold text-cyan-accent">
                      {r.score}
                      <span className="text-base text-slate-500">/100</span>
                    </div>
                  </div>
                </div>

                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden mt-4">
                  <div
                    className={`h-full ${
                      i === 0 ? 'bg-green-accent' : 'bg-cyan-accent'
                    } transition-all duration-700`}
                    style={{ width: `${r.score}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">Cashback max</div>
                    <div className="text-white font-semibold">{fmtPct(r.card.cashbackPremium)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Frais</div>
                    <div className="text-white font-semibold">
                      {r.card.annualFees === 0 ? 'Gratuit' : fmtEUR(r.card.annualFees)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Staking</div>
                    <div className="text-white font-semibold">
                      {r.card.stakingRequired === 0 ? 'Aucun' : fmtEUR(r.card.stakingRequired)}
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
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-500">
                        <span className="w-4 h-4 shrink-0 mt-0.5 text-center">−</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(r.card.id)}
                    className={`btn-secondary text-sm ${
                      isFav ? 'border-green-accent/50 text-green-accent' : ''
                    }`}
                  >
                    <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                    {isFav ? 'Dans vos favoris' : 'Ajouter aux favoris'}
                  </button>
                  <a
                    href={r.card.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost border border-bg-border"
                  >
                    Voir l'offre
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
