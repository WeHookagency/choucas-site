import type { MetadataRoute } from 'next';

import { locales } from '@/i18n/locales';
import { siteUrl } from '@/i18n/metadata';
import { getPathname } from '@/i18n/navigation';

/**
 * Plan du site.
 *
 * N'y figurent que les pages qui portent du contenu. Les coquilles ouvertes
 * par le lot T1 sont en `noindex` tant que leur lot T2 n'est pas fait : les
 * inscrire ici reviendrait a demander leur indexation tout en la refusant
 * dans l'en-tete.
 *
 * Ajouter une route a cette liste au moment ou son contenu arrive, et retirer
 * alors la directive `noindex` de la page.
 */
const AVEC_CONTENU = [
  '/',
  '/solutions',
  '/faq',
  '/contact',
  '/mentions-legales',
  '/confidentialite',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return AVEC_CONTENU.flatMap((href) =>
    locales.map((locale) => ({
      url: new URL(getPathname({ href, locale }), siteUrl).toString(),
      lastModified: new Date(),
      priority:
        href === '/' ? 1 : ['/faq', '/solutions', '/contact'].includes(href) ? 0.7 : 0.3,
      alternates:
        locales.length > 1
          ? {
              languages: Object.fromEntries(
                locales.map((l) => [l, new URL(getPathname({ href, locale: l }), siteUrl).toString()]),
              ),
            }
          : undefined,
    })),
  );
}
