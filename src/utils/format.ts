export const fmtEUR = (n: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export const fmtPct = (n: number): string =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(n) + ' %';

// ── Badge labels (translated) ─────────────────────────────────────────────────
const BADGE_TRANSLATIONS: Record<string, Record<string, string>> = {
  popular:       { fr: 'Populaire',         de: 'Beliebt',          es: 'Popular',        it: 'Popolare',       en: 'Popular'       },
  new:           { fr: 'Nouveau',           de: 'Neu',              es: 'Nuevo',          it: 'Nuovo',          en: 'New'           },
  premium:       { fr: 'Premium',           de: 'Premium',          es: 'Premium',        it: 'Premium',        en: 'Premium'       },
  virtual_only:  { fr: 'Virtuelle uniq.',   de: 'Nur virtuell',     es: 'Solo virtual',   it: 'Solo virtuale',  en: 'Virtual only'  },
  'self-custody':{ fr: 'Self-custody',      de: 'Self-Custody',     es: 'Self-custody',   it: 'Self-custody',   en: 'Self-custody'  },
  zero_fees:     { fr: 'Zéro frais',        de: 'Keine Gebühren',   es: 'Sin comisiones', it: 'Zero commissioni',en: 'Zero fees'    },
  best_value:    { fr: 'Meilleur rapport',  de: 'Bestes Preis-L.',  es: 'Mejor relación', it: 'Miglior rapporto',en: 'Best value'   },
  discontinued:  { fr: 'Arrêté',            de: 'Eingestellt',      es: 'Cerrado',        it: 'Chiuso',         en: 'Discontinued'  },
};

/** Returns a translated badge label, or the raw value if no translation found. */
export function translateBadge(badge: string, lang: string): string {
  return BADGE_TRANSLATIONS[badge]?.[lang] ?? BADGE_TRANSLATIONS[badge]?.en ?? badge;
}

// ── Market restriction text translations (values stored in FR in DB) ──────────
const RESTRICTION_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Non disponible':                    { de: 'Nicht verfügbar',              es: 'No disponible',               it: 'Non disponibile',           en: 'Not available' },
  'Non disponible — restrictions AMF': { de: 'Nicht verfügbar — AMF-Auflagen', es: 'No disponible — normativa AMF', it: 'Non disponibile — restrizioni AMF', en: 'Not available — AMF restrictions' },
  'Service limité':                    { de: 'Eingeschränkter Service',       es: 'Servicio limitado',           it: 'Servizio limitato',         en: 'Limited service' },
  'Cashback réduit':                   { de: 'Reduzierter Cashback',          es: 'Cashback reducido',           it: 'Cashback ridotto',          en: 'Reduced cashback' },
  'Pas de cashback':                   { de: 'Kein Cashback',                 es: 'Sin cashback',                it: 'Nessun cashback',           en: 'No cashback' },
  'Disponible avec restrictions':      { de: 'Mit Einschränkungen verfügbar', es: 'Disponible con restricciones', it: 'Disponibile con restrizioni', en: 'Available with restrictions' },
  'En attente d\'agrément':            { de: 'Genehmigung ausstehend',        es: 'Aprobación pendiente',        it: 'Approvazione in attesa',    en: 'Pending approval' },
  'Carte physique non disponible':     { de: 'Physische Karte nicht verfügbar', es: 'Tarjeta física no disponible', it: 'Carta fisica non disponibile', en: 'Physical card not available' },
};

/**
 * Translate a market restriction reason (stored in French in DB) to the given lang.
 * Falls back to the original text if no translation is found.
 */
export function translateRestriction(text: string, lang: string): string {
  if (lang === 'fr') return text;
  // Exact match
  if (RESTRICTION_TRANSLATIONS[text]?.[lang]) return RESTRICTION_TRANSLATIONS[text][lang];
  // Partial match: replace known French substrings
  let result = text;
  for (const [fr, translations] of Object.entries(RESTRICTION_TRANSLATIONS)) {
    if (text.includes(fr) && translations[lang]) {
      result = result.replace(fr, translations[lang]);
    }
  }
  return result;
}
