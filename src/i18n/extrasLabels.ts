/**
 * Localized labels for card `extras` keys.
 * Stored here (not in JSON) so a single file update covers all languages.
 * Falls back to formatExtra() for any unknown key.
 */

type Lang = 'fr' | 'de' | 'es' | 'it' | 'en';

const EXTRAS: Record<string, Record<Lang, string>> = {
  apple_pay:           { fr: 'Apple Pay',                      de: 'Apple Pay',                      es: 'Apple Pay',                       it: 'Apple Pay',                       en: 'Apple Pay' },
  google_pay:          { fr: 'Google Pay',                     de: 'Google Pay',                     es: 'Google Pay',                      it: 'Google Pay',                      en: 'Google Pay' },
  self_custody:        { fr: 'Auto-garde',                     de: 'Selbstverwaltung',               es: 'Auto-custodia',                   it: 'Auto-custodia',                   en: 'Self-custody' },
  hybrid_custody:      { fr: 'Garde hybride',                  de: 'Hybride Verwahrung',             es: 'Custodia híbrida',                it: 'Custodia ibrida',                 en: 'Hybrid custody' },
  no_fees:             { fr: 'Sans frais annuels',             de: 'Ohne Jahresgebühr',              es: 'Sin cuota anual',                 it: 'Senza costi annuali',             en: 'No annual fees' },
  no_fx_fees:          { fr: 'Sans frais de change',           de: 'Ohne Wechselgebühren',           es: 'Sin comisiones de cambio',        it: 'Senza commissioni di cambio',     en: 'No FX fees' },
  high_cashback:       { fr: 'Cashback élevé',                 de: 'Hohes Cashback',                es: 'Alto cashback',                   it: 'Alto cashback',                   en: 'High cashback' },
  cashback:            { fr: 'Cashback',                       de: 'Cashback',                       es: 'Cashback',                        it: 'Cashback',                        en: 'Cashback' },
  cashback_in_eth:     { fr: 'Cashback en ETH',                de: 'Cashback in ETH',                es: 'Cashback en ETH',                 it: 'Cashback in ETH',                 en: 'Cashback in ETH' },
  cashback_in_strk:    { fr: 'Cashback en STRK',               de: 'Cashback in STRK',               es: 'Cashback en STRK',                it: 'Cashback in STRK',                en: 'Cashback in STRK' },
  web3:                { fr: 'Compatible Web3',                de: 'Web3-kompatibel',                es: 'Compatible Web3',                 it: 'Compatibile Web3',                en: 'Web3 compatible' },
  web3_native:         { fr: 'Natif Web3',                     de: 'Web3-nativ',                     es: 'Nativo Web3',                     it: 'Nativo Web3',                     en: 'Web3 native' },
  defi_native:         { fr: 'Natif DeFi',                     de: 'DeFi-nativ',                     es: 'Nativo DeFi',                     it: 'Compatibile DeFi',                en: 'DeFi native' },
  on_chain_payments:   { fr: 'Paiements on-chain',             de: 'On-Chain-Zahlungen',             es: 'Pagos on-chain',                  it: 'Pagamenti on-chain',              en: 'On-chain payments' },
  multi_chain:         { fr: 'Multi-chaîne',                   de: 'Multi-Chain',                    es: 'Multi-cadena',                    it: 'Multi-catena',                    en: 'Multi-chain' },
  stablecoin_focus:    { fr: 'Axé stablecoins',                de: 'Stablecoin-fokussiert',          es: 'Enfocado en stablecoins',         it: 'Orientato a stablecoin',          en: 'Stablecoin focus' },
  solana_native:       { fr: 'Natif Solana',                   de: 'Solana-nativ',                   es: 'Nativo Solana',                   it: 'Nativo Solana',                   en: 'Solana native' },
  multiversx_native:   { fr: 'Natif MultiversX',               de: 'MultiversX-nativ',               es: 'Nativo MultiversX',               it: 'Nativo MultiversX',               en: 'MultiversX native' },
  thorchain_native:    { fr: 'Natif THORChain',                de: 'THORChain-nativ',                es: 'Nativo THORChain',                it: 'Nativo THORChain',                en: 'THORChain native' },
  gnosis_chain:        { fr: 'Gnosis Chain',                   de: 'Gnosis Chain',                   es: 'Gnosis Chain',                    it: 'Gnosis Chain',                    en: 'Gnosis Chain' },
  fuse_network:        { fr: 'Fuse Network',                   de: 'Fuse Network',                   es: 'Fuse Network',                    it: 'Fuse Network',                    en: 'Fuse Network' },
  exodus_wallet:       { fr: 'Exodus Wallet',                  de: 'Exodus Wallet',                  es: 'Exodus Wallet',                   it: 'Exodus Wallet',                   en: 'Exodus Wallet' },
  french_iban:         { fr: 'IBAN français',                  de: 'Französische IBAN',              es: 'IBAN francés',                    it: 'IBAN francese',                   en: 'French IBAN' },
  french_company:      { fr: 'Entreprise française',           de: 'Französisches Unternehmen',      es: 'Empresa francesa',                it: 'Azienda francese',                en: 'French company' },
  mica_compliant:      { fr: 'Conforme MiCA',                  de: 'MiCA-konform',                   es: 'Compatible MiCA',                 it: 'Conforme MiCA',                   en: 'MiCA compliant' },
  sepa_free:           { fr: 'Virements SEPA gratuits',        de: 'Kostenlose SEPA-Überweisungen',  es: 'Transferencias SEPA gratuitas',   it: 'Bonifici SEPA gratuiti',          en: 'Free SEPA transfers' },
  bill_pay:            { fr: 'Paiement de factures',           de: 'Rechnungszahlung',               es: 'Pago de facturas',                it: 'Pagamento bollette',              en: 'Bill pay' },
  streaming_payments:  { fr: 'Paiements en flux',              de: 'Streaming-Zahlungen',            es: 'Pagos streaming',                 it: 'Pagamenti streaming',             en: 'Streaming payments' },
  cexio_integration:   { fr: 'Intégration CEX.IO',             de: 'CEX.IO-Integration',             es: 'Integración CEX.IO',              it: 'Integrazione CEX.IO',             en: 'CEX.IO integration' },
  instant_conversion:  { fr: 'Conversion instantanée',         de: 'Sofortige Konvertierung',        es: 'Conversión instantánea',          it: 'Conversione istantanea',          en: 'Instant conversion' },
  eea_latam:           { fr: 'Disponible EEE & Amérique latine', de: 'Verfügbar EWR & LATAM',       es: 'Disponible EEE & LATAM',          it: 'Disponibile SEE & LATAM',         en: 'Available EEA & LATAM' },
  no_staking_required: { fr: 'Sans staking requis',            de: 'Kein Staking erforderlich',      es: 'Sin staking requerido',           it: 'Nessuno staking richiesto',       en: 'No staking required' },
  new_2025:            { fr: 'Nouveau en 2025',                de: 'Neu 2025',                       es: 'Nuevo en 2025',                   it: 'Nuovo nel 2025',                  en: 'New in 2025' },
  fca_licensed:        { fr: 'Agréé FCA (UK)',                 de: 'FCA-lizenziert (UK)',            es: 'Con licencia FCA (UK)',           it: 'Licenza FCA (UK)',                en: 'FCA Licensed (UK)' },
  stablecoin_only:     { fr: 'Uniquement stablecoins',         de: 'Nur Stablecoins',                es: 'Solo stablecoins',                it: 'Solo stablecoin',                 en: 'Stablecoin spending only' },
};

/** Converts an unknown key to readable text: self_custody → Self custody */
export function formatExtra(key: string): string {
  return key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

/** Returns the localized label for an extras key, with formatExtra() as fallback */
export function getExtraLabel(key: string, lang: string): string {
  const entry = EXTRAS[key];
  if (!entry) return formatExtra(key);
  return entry[lang as Lang] ?? entry.en ?? formatExtra(key);
}