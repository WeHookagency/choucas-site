import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

/**
 * Aiguillage de langue, execute avant le rendu.
 *
 * En Next 16 ce fichier s'appelle `proxy` — l'ancien nom `middleware` est
 * deprecie. next-intl exporte toujours sa fabrique sous le nom historique,
 * mais elle retourne bien `(request: NextRequest) => NextResponse`, la
 * signature attendue ici.
 *
 * Deux roles : rediriger « / » vers la langue par defaut, et resoudre les
 * slugs traduits vers la page correspondante de `app/[locale]/`.
 */
export default createMiddleware(routing);

export const config = {
  /*
   * Toutes les routes sauf : les routes d'API, les fichiers statiques et
   * l'optimisation d'images de Next, et tout chemin portant une extension
   * (favicon.ico, robots.txt, sitemap.xml, polices, images de `public/`).
   */
  matcher: '/((?!api|_next/static|_next/image|.*\\..*).*)',
};
