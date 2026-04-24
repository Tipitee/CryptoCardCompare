export const fmtEUR = (n: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export const fmtPct = (n: number): string =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(n) + ' %';
