/**
 * Cloudflare Pages Function — redirection serveur de la racine "/".
 * Sur Cloudflare Pages, le fichier statique /index.html est servi AVANT les
 * règles de _redirects. Une Function, elle, s'exécute avant les assets : elle
 * garantit un vrai 302 côté serveur (crawler-safe, sans exécution de JS),
 * avec détection de langue via l'en-tête Accept-Language.
 *
 * Route : "/" uniquement (functions/index.js ne matche que la racine).
 * x-default reste /fr : tout ce qui n'est pas de/es/it/en part sur /fr.
 */
export function onRequest(context) {
  const al = (context.request.headers.get('accept-language') || '').toLowerCase();
  const lang =
    al.startsWith('de') ? 'de' :
    al.startsWith('es') ? 'es' :
    al.startsWith('it') ? 'it' :
    al.startsWith('en') ? 'en' :
    'fr';
  const url = new URL(context.request.url);
  return Response.redirect(`${url.origin}/${lang}`, 302);
}
