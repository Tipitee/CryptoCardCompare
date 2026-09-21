/**
 * Cloudflare Pages Function — redirection serveur de la racine "/".
 * Sur Cloudflare Pages, le fichier statique /index.html est servi AVANT les
 * règles de _redirects. Une Function, elle, s'exécute avant les assets : elle
 * garantit un vrai 302 côté serveur (crawler-safe, sans exécution de JS),
 * avec détection de langue via l'en-tête Accept-Language.
 *
 * x-default reste /fr : tout ce qui n'est pas de/es/it/en part sur /fr.
 *
 * IMPORTANT — ne rediriger QUE la racine exacte "/".
 * Les pages non prérendues (mentions légales, favoris, blog-admin…) sont servies
 * via une réécriture `_redirects` vers /index.html (statut 200). Cette réécriture
 * fait servir le document racine, ce qui redéclenche cette Function : sans le
 * garde ci-dessous, toutes ces pages étaient redirigées à tort vers /{lang}.
 * On passe donc la main (context.next) pour tout chemin autre que "/".
 */
export function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.pathname !== '/') {
    return context.next();
  }

  const al = (context.request.headers.get('accept-language') || '').toLowerCase();
  const lang =
    al.startsWith('de') ? 'de' :
    al.startsWith('es') ? 'es' :
    al.startsWith('it') ? 'it' :
    al.startsWith('en') ? 'en' :
    'fr';

  return Response.redirect(`${url.origin}/${lang}`, 302);
}
