export const fmtEUR = (n: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export const fmtPct = (n: number): string =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(n) + ' %';

// ── Badge labels (translated) ─────────────────────────────────────────────────
// be→fr, at→de : les marchés régionaux affichent le contenu de leur langue.
const CONTENT_LANG: Record<string, string> = { be: 'fr', at: 'de' };

const BADGE_TRANSLATIONS: Record<string, Record<string, string>> = {
  // Badges sémantiques (clés)
  popular:       { fr: 'Populaire',         de: 'Beliebt',          es: 'Popular',        it: 'Popolare',        en: 'Popular',       pt: 'Popular'        },
  new:           { fr: 'Nouveau',           de: 'Neu',              es: 'Nuevo',          it: 'Nuovo',           en: 'New',           pt: 'Novo'           },
  premium:       { fr: 'Premium',           de: 'Premium',          es: 'Premium',        it: 'Premium',         en: 'Premium',       pt: 'Premium'        },
  virtual_only:  { fr: 'Virtuelle uniq.',   de: 'Nur virtuell',     es: 'Solo virtual',   it: 'Solo virtuale',   en: 'Virtual only',  pt: 'Apenas virtual' },
  'self-custody':{ fr: 'Self-custody',      de: 'Self-Custody',     es: 'Self-custody',   it: 'Self-custody',    en: 'Self-custody',  pt: 'Auto-custódia'  },
  zero_fees:     { fr: 'Zéro frais',        de: 'Keine Gebühren',   es: 'Sin comisiones', it: 'Zero commissioni',en: 'Zero fees',     pt: 'Zero taxas'     },
  best_value:    { fr: 'Meilleur rapport',  de: 'Bestes Preis-L.',  es: 'Mejor relación', it: 'Miglior rapporto',en: 'Best value',    pt: 'Melhor relação' },
  best_cashback: { fr: 'Meilleur cashback', de: 'Bestes Cashback',  es: 'Mejor cashback', it: 'Miglior cashback',en: 'Best cashback', pt: 'Melhor cashback'},
  discontinued:  { fr: 'Arrêté',            de: 'Eingestellt',      es: 'Cerrado',        it: 'Chiuso',          en: 'Discontinued',  pt: 'Descontinuado'  },
  // Badges texte libre stockés en base (marketing) — traduits ici pour tous les marchés
  'MiCA FR':                    { fr: 'Agréé MiCA',            de: 'MiCA-lizenziert',      es: 'Regulado MiCA',        it: 'Autorizzato MiCA',      en: 'MiCA licensed',        pt: 'Licenciado MiCA'      },
  'FCA Licensed':               { fr: 'Agréé FCA',             de: 'FCA-lizenziert',       es: 'Regulado FCA',         it: 'Autorizzato FCA',       en: 'FCA licensed',         pt: 'Licenciado FCA'       },
  'Exchange historique':        { fr: 'Exchange historique',   de: 'Etablierte Börse',     es: 'Exchange veterano',    it: 'Exchange storico',      en: 'Established exchange',  pt: 'Exchange histórica'   },
  'Spain #1':                   { fr: 'N°1 en Espagne',        de: 'Nr. 1 in Spanien',     es: 'N.º 1 en España',      it: 'N°1 in Spagna',         en: 'Spain #1',             pt: 'N.º 1 em Espanha'     },
  'Virtuelle · Cashback USDT':  { fr: 'Virtuelle · Cashback USDT', de: 'Virtuell · USDT-Cashback', es: 'Virtual · Cashback USDT', it: 'Virtuale · Cashback USDT', en: 'Virtual · USDT cashback', pt: 'Virtual · Cashback USDT' },
  'Metal · 5 % en USDT':        { fr: 'Metal · 5 % en USDT',   de: 'Metal · 5 % in USDT',  es: 'Metal · 5 % en USDT',  it: 'Metal · 5 % in USDT',   en: 'Metal · 5% in USDT',   pt: 'Metal · 5 % em USDT'  },
};

/** Returns a translated badge label, or the raw value if no translation found.
 *  Accepts a market (be/at map to their content language fr/de). */
export function translateBadge(badge: string, lang: string): string {
  const cl = CONTENT_LANG[lang] ?? lang;
  return BADGE_TRANSLATIONS[badge]?.[cl] ?? BADGE_TRANSLATIONS[badge]?.en ?? badge;
}

// ── Market restriction text translations (values stored in FR in DB) ──────────
const RESTRICTION_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Non disponible':                    { de: 'Nicht verfügbar',              es: 'No disponible',               it: 'Non disponibile',           en: 'Not available',                 pt: 'Não disponível' },
  'Non disponible, restrictions AMF': { de: 'Nicht verfügbar, AMF-Auflagen', es: 'No disponible, normativa AMF', it: 'Non disponibile, restrizioni AMF', en: 'Not available, AMF restrictions', pt: 'Não disponível, restrições AMF' },
  'Service limité':                    { de: 'Eingeschränkter Service',       es: 'Servicio limitado',           it: 'Servizio limitato',         en: 'Limited service',               pt: 'Serviço limitado' },
  'Cashback réduit':                   { de: 'Reduzierter Cashback',          es: 'Cashback reducido',           it: 'Cashback ridotto',          en: 'Reduced cashback',              pt: 'Cashback reduzido' },
  'Pas de cashback':                   { de: 'Kein Cashback',                 es: 'Sin cashback',                it: 'Nessun cashback',           en: 'No cashback',                   pt: 'Sem cashback' },
  'Disponible avec restrictions':      { de: 'Mit Einschränkungen verfügbar', es: 'Disponible con restricciones', it: 'Disponibile con restrizioni', en: 'Available with restrictions',  pt: 'Disponível com restrições' },
  'En attente d\'agrément':            { de: 'Genehmigung ausstehend',        es: 'Aprobación pendiente',        it: 'Approvazione in attesa',    en: 'Pending approval',              pt: 'Aprovação pendente' },
  'Carte physique non disponible':     { de: 'Physische Karte nicht verfügbar', es: 'Tarjeta física no disponible', it: 'Carta fisica non disponibile', en: 'Physical card not available',  pt: 'Cartão físico não disponível' },
};

/**
 * Translate a market restriction reason (stored in French in DB) to the given lang.
 * Falls back to the original text if no translation is found.
 */
export function translateRestriction(text: string, lang: string): string {
  const cl = CONTENT_LANG[lang] ?? lang; // be→fr, at→de
  if (cl === 'fr') return text;
  // Exact match
  if (RESTRICTION_TRANSLATIONS[text]?.[cl]) return RESTRICTION_TRANSLATIONS[text][cl];
  // Partial match: replace known French substrings
  let result = text;
  for (const [fr, translations] of Object.entries(RESTRICTION_TRANSLATIONS)) {
    if (text.includes(fr) && translations[cl]) {
      result = result.replace(fr, translations[cl]);
    }
  }
  return result;
}
