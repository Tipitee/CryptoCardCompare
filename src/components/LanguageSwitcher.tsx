import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { LANGUAGES, type Language } from '../i18n/types';
import { getEquivalentRoute, getSupportedLanguages } from '../i18n/utils';

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = useLanguage();
  const { i18n } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (newLang: Language) => {
    localStorage.setItem('preferredLang', newLang);
    await i18n.changeLanguage(newLang);

    const newPath = getEquivalentRoute(location.pathname, newLang);
    navigate(newPath);
    setOpen(false);
  };

  const languages = getSupportedLanguages();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-bg-elevated transition-colors"
        title="Change language"
      >
        <span>{LANGUAGES[currentLang].flag}</span>
        <span className="hidden sm:inline">{LANGUAGES[currentLang].nativeName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-bg-border rounded-lg shadow-lg z-50 py-1">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors ${
                currentLang === lang
                  ? 'bg-cyan-accent/10 text-cyan-accent'
                  : 'text-slate-400 hover:text-white hover:bg-bg-border'
              }`}
            >
              <span className="text-lg">{LANGUAGES[lang].flag}</span>
              <span>{LANGUAGES[lang].nativeName}</span>
              {currentLang === lang && (
                <span className="ml-auto text-cyan-accent">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
