import type { Language } from '../i18n/types';

/**
 * Contenu spécifique par marché (régulateur, devise, fiscalité crypto locale).
 * Sert à DIFFÉRENCIER les pages be/at (contenu fr/de) de leurs jumelles, et à
 * renforcer la pertinence locale (hreflang légitime) sur fiches / comparatifs / avis.
 * Le texte est rédigé dans la langue de contenu du marché (be→FR, at→DE).
 */

export interface MarketInfo {
  /** Titre de la section (langue du marché). */
  heading: string;
  /** Libellés des trois faits. */
  labels: { regulator: string; currency: string; tax: string };
  /** Régulateur financier local. */
  regulator: string;
  /** Devise. */
  currency: string;
  /** Résumé fiscalité crypto (langue du marché, spécifique au pays). */
  tax: string;
  /** Paragraphe d'intro, interpolé avec le nom de la carte. */
  intro: (cardName: string) => string;
  /** Avertissement fiscal (langue du marché). */
  disclaimer: string;
}

export const MARKET_INFO: Record<Language, MarketInfo> = {
  fr: {
    heading: 'Disponibilité et fiscalité en France',
    labels: { regulator: 'Régulateur', currency: 'Devise', tax: 'Fiscalité crypto' },
    regulator: 'AMF / ACPR',
    currency: 'Euro (€)',
    tax: 'Plus-values imposées au PFU (flat tax) de 30 %. Déclaration annuelle des comptes crypto étrangers obligatoire.',
    intro: (c) => `En France, la ${c} s'utilise partout où le réseau de la carte est accepté, avec règlement en euros. Les plus-values réalisées lors de la conversion crypto → euro relèvent du prélèvement forfaitaire unique de 30 %.`,
    disclaimer: 'Information fiscale générale (France) — ne constitue pas un conseil fiscal personnalisé.',
  },
  be: {
    heading: 'Disponibilité et fiscalité en Belgique',
    labels: { regulator: 'Régulateur', currency: 'Devise', tax: 'Fiscalité crypto' },
    regulator: 'FSMA',
    currency: 'Euro (€)',
    tax: "En gestion « en bon père de famille », les plus-values ne sont pas imposées ; les gains jugés spéculatifs sont taxés à 33 % (revenus divers) et l'activité professionnelle au barème progressif.",
    intro: (c) => `En Belgique, la ${c} est régie par la FSMA et se règle en euros. Le traitement fiscal dépend de votre profil : une gestion normale de patrimoine est exonérée, tandis que des opérations spéculatives peuvent être taxées à 33 %.`,
    disclaimer: 'Information fiscale générale (Belgique) — ne constitue pas un conseil fiscal personnalisé.',
  },
  de: {
    heading: 'Verfügbarkeit und Steuern in Deutschland',
    labels: { regulator: 'Regulierung', currency: 'Währung', tax: 'Krypto-Steuer' },
    regulator: 'BaFin',
    currency: 'Euro (€)',
    tax: 'Nach § 23 EStG sind Krypto-Gewinne nach 1 Jahr Haltefrist steuerfrei; darunter gilt eine Freigrenze von 1.000 € pro Jahr.',
    intro: (c) => `In Deutschland unterliegt die ${c} der BaFin-Aufsicht und rechnet in Euro ab. Gewinne aus dem Verkauf oder Umtausch von Krypto sind nach einem Jahr Haltefrist steuerfrei, darunter greift die Freigrenze von 1.000 €.`,
    disclaimer: 'Allgemeine Steuerinformation (Deutschland) — keine individuelle Steuerberatung.',
  },
  at: {
    heading: 'Verfügbarkeit und Steuern in Österreich',
    labels: { regulator: 'Regulierung', currency: 'Währung', tax: 'Krypto-Steuer' },
    regulator: 'FMA',
    currency: 'Euro (€)',
    tax: 'Seit März 2022 gilt eine pauschale Kapitalertragsteuer (KESt) von 27,5 % auf Krypto-Gewinne, ohne Haltefrist.',
    intro: (c) => `In Österreich wird die ${c} von der FMA beaufsichtigt und rechnet in Euro ab. Krypto-Gewinne werden pauschal mit 27,5 % KESt besteuert, unabhängig von der Haltedauer.`,
    disclaimer: 'Allgemeine Steuerinformation (Österreich) — keine individuelle Steuerberatung.',
  },
  es: {
    heading: 'Disponibilidad y fiscalidad en España',
    labels: { regulator: 'Regulador', currency: 'Divisa', tax: 'Fiscalidad cripto' },
    regulator: 'CNMV',
    currency: 'Euro (€)',
    tax: 'Las ganancias tributan en la base del ahorro del IRPF (19 %–28 %). Los saldos en el extranjero pueden requerir el modelo 721.',
    intro: (c) => `En España, la ${c} opera bajo la supervisión de la CNMV y liquida en euros. Las plusvalías por convertir cripto a euros tributan en la base del ahorro del IRPF, entre el 19 % y el 28 %.`,
    disclaimer: 'Información fiscal general (España) — no constituye asesoramiento fiscal personalizado.',
  },
  it: {
    heading: 'Disponibilità e fiscalità in Italia',
    labels: { regulator: 'Regolatore', currency: 'Valuta', tax: 'Fiscalità cripto' },
    regulator: 'OAM / CONSOB',
    currency: 'Euro (€)',
    tax: 'Le plusvalenze sono soggette a un’imposta sostitutiva del 26 %; le giacenze estere vanno indicate nel quadro RW.',
    intro: (c) => `In Italia la ${c} è regolata da OAM/CONSOB e regola i pagamenti in euro. Le plusvalenze da conversione cripto → euro scontano l'imposta sostitutiva del 26 %.`,
    disclaimer: 'Informazione fiscale generale (Italia) — non costituisce consulenza fiscale personalizzata.',
  },
  en: {
    heading: 'Availability and tax in the United Kingdom',
    labels: { regulator: 'Regulator', currency: 'Currency', tax: 'Crypto tax' },
    regulator: 'FCA',
    currency: 'Pound sterling (£)',
    tax: 'Disposals are subject to UK Capital Gains Tax above the annual exempt amount; spending crypto counts as a disposal.',
    intro: (c) => `In the United Kingdom the ${c} works wherever its card network is accepted, settling in pounds. Converting or spending crypto is a disposal for Capital Gains Tax purposes above the annual allowance.`,
    disclaimer: 'General tax information (UK) — not personalised tax advice.',
  },
  pt: {
    heading: 'Disponibilidade e fiscalidade em Portugal',
    labels: { regulator: 'Regulador', currency: 'Moeda', tax: 'Fiscalidade cripto' },
    regulator: 'Banco de Portugal / MiCA',
    currency: 'Euro (€)',
    tax: 'As mais-valias são tributadas a 28 % se a cripto for detida há menos de 365 dias, e ficam isentas a partir de um ano; pagar com cripto é uma alienação tributável.',
    intro: (c) => `Em Portugal, o ${c} opera ao abrigo do Banco de Portugal e do quadro MiCA, liquidando em euros. As mais-valias são tributadas a 28 % abaixo de um ano de detenção e isentas a partir de um ano.`,
    disclaimer: 'Informação fiscal geral (Portugal) — não constitui aconselhamento fiscal personalizado.',
  },
};
