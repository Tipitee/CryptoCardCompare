import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import type { Language } from '../i18n/types';
import { getEquivalentRoute, getSupportedLanguages } from '../i18n/utils';
import { useAppStore } from '../store/useAppStore';

/* ── Country definitions ────────────────────────────────────────────────────── */
interface CountryEntry {
  flag: string;
  label: string;
  lang: Language;
  market: string | undefined; // undefined = show all cards
}

const COUNTRIES: CountryEntry[] = [
  { flag: '🇫🇷', label: 'France',       lang: 'fr', market: 'fr' },
  { flag: '🇧🇪', label: 'Belgique',     lang: 'be', market: 'be' },
  { flag: '🇩🇪', label: 'Deutschland',  lang: 'de', market: 'de' },
  { flag: '🇦🇹', label: 'Österreich',   lang: 'at', market: 'at' },
  { flag: '🇪🇸', label: 'España',       lang: 'es', market: 'es' },
  { flag: '🇮🇹', label: 'Italia',       lang: 'it', market: 'it' },
  { flag: '🇬🇧', label: 'United Kingdom', lang: 'en', market: 'en' },
];

/** Map market key → country entry (for lookup on init) */
const MARKET_TO_COUNTRY: Record<string, CountryEntry> = Object.fromEntries(
  COUNTRIES.filter(c => c.market).map(c => [c.market!, c])
);

function loadStoredMarket(): string | undefined {
  try { return localStorage.getItem('ccc_market') || undefined; } catch { return undefined; }
}

export default function CountrySwitcher() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = useLanguage();
  const { i18n } = useTranslation();
  const setSelectedMarket = useAppStore((s) => s.setSelectedMarket);
  const selectedMarket = useAppStore((s) => s.selectedMarket);

  /* Derive current country from market + lang */
  const current: CountryEntry =
    (selectedMarket ? MARKET_TO_COUNTRY[selectedMarket] : null) ??
    COUNTRIES.find(c => c.lang === currentLang && !c.market) ??   // fallback: same lang, no extra market
    COUNTRIES.find(c => c.lang === currentLang) ??
    COUNTRIES[0];

  /* Close on outside click */
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  /* Restore saved market on mount */
  useEffect(() => {
    const saved = loadStoredMarket();
    if (saved !== undefined) setSelectedMarket(saved === '' ? undefined : saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = async (entry: CountryEntry) => {
    // 1. Persist market choice
    const mkt = entry.market ?? '';
    localStorage.setItem('ccc_market', mkt);
    setSelectedMarket(entry.market);

    // 2. Switch language if needed
    if (entry.lang !== currentLang) {
      localStorage.setItem('preferredLang', entry.lang);
      await i18n.changeLanguage(entry.lang);
      const newPath = getEquivalentRoute(location.pathname, entry.lang);
      navigate(newPath);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${current.label} — changer de pays`}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors"
      >
        <span className="text-base">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-bg-elevated border border-bg-border rounded-lg shadow-lg z-50 py-1">
          {COUNTRIES.map((entry) => {
            const isActive = current.flag === entry.flag && current.label === entry.label;
            return (
              <button
                key={`${entry.lang}-${entry.market ?? 'all'}`}
                onClick={() => handleSelect(entry)}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-cyan-accent/10 text-cyan-accent'
                    : 'text-slate-400 hover:text-white hover:bg-bg-border'
                }`}
              >
                <span className="text-base">{entry.flag}</span>
                <span className="text-sm">{entry.label}</span>
                {isActive && <span className="ml-auto text-cyan-accent text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
