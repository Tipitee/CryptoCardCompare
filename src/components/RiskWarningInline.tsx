import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import type { Language } from '../i18n/types';

const content: Record<Language, { text: string; link: string }> = {
  de: {
    text: 'Krypto-Assets sind hochspekulative Investments. Sie können die gesamte investierte Summe verlieren. Krypto-Produkte sind nicht durch Einlagensicherungssysteme geschützt. Dies ist keine Anlageberatung.',
    link: 'Vollständiger Risikohinweis',
  },
  fr: {
    text: "Les crypto-actifs sont des produits spéculatifs à haut risque. Vous pouvez perdre la totalité de votre investissement. Les crypto-actifs ne sont pas couverts par les systèmes de garantie des dépôts. Ceci ne constitue pas un conseil financier.",
    link: 'Résumé complet des risques',
  },
  es: {
    text: 'Los criptoactivos son productos altamente especulativos. Puede perder la totalidad del capital invertido. Los criptoactivos no están cubiertos por sistemas de garantía de depósitos. Esto no es asesoramiento financiero.',
    link: 'Resumen completo de riesgos',
  },
  it: {
    text: "I cripto-asset sono prodotti altamente speculativi. Potresti perdere l'intero capitale investito. I cripto-asset non sono coperti da sistemi di garanzia dei depositi. Questo non costituisce consulenza finanziaria.",
    link: 'Riepilogo completo dei rischi',
  },
  en: {
    text: "Don't invest unless you're prepared to lose all the money you invest. Crypto is a high-risk investment and you are unlikely to be protected if something goes wrong.",
    link: 'Take 2 mins to learn more',
  },
};

export default function RiskWarningInline({ lang = 'en' }: { lang?: Language }) {
  const t = content[lang] ?? content.en;
  return (
    <div className="flex items-start gap-3 text-xs border border-amber-500/20 rounded-lg px-4 py-3 mb-6 bg-amber-500/5">
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-slate-400 leading-relaxed">
        <span className="font-semibold text-amber-400">
          {lang === 'de' ? 'Risikohinweis' :
           lang === 'fr' ? 'Avertissement sur les risques' :
           lang === 'es' ? 'Advertencia de riesgo' :
           lang === 'it' ? 'Avvertenza sul rischio' : 'FCA Risk warning'}:{' '}
        </span>
        {t.text}{' '}
        <Link to="/risk-summary" className="underline hover:text-slate-300 transition-colors">
          {t.link} →
        </Link>
      </p>
    </div>
  );
}
