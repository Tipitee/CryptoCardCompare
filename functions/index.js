/**
 * Cloudflare Pages Function — pass-through (désactivée).
 *
 * Historique : cette Function redirigeait "/" vers /{lang} selon Accept-Language.
 * Problème : avec `_routes.json` incluant "/", CHAQUE service du shell SPA
 * (réécritures `_redirects` /xxx -> /index.html 200 pour les pages non
 * prérendues : mentions légales, favoris, comparatifs non-allowlistés…) était
 * routé par cette Function, qui les redirigeait alors toutes vers /{lang}.
 * Résultat : toutes les pages servies en SPA renvoyaient vers /en au lieu de
 * s'afficher. Impossible de distinguer un vrai hit racine d'un service de shell.
 *
 * Solution : la Function ne fait plus AUCUNE redirection (context.next()).
 * La redirection de la racine "/" est assurée par `_redirects` (/ -> /fr 302,
 * crawler-safe) et, en repli, par le composant RootRedirect du SPA
 * (redirection vers la langue détectée). Le shell SPA est donc servi tel quel
 * pour toutes les routes non prérendues, qui s'affichent enfin correctement.
 */
export async function onRequest(context) {
  return context.next();
}
