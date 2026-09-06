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
 *
 * Le blog entier en est absent — l'index comme les notes. Les quatre notes
 * ne portent qu'un titre, un chapeau et une date, donc elles sont en
 * `noindex` ; un index indexable qui ne mene qu'a elles envoie un moteur
 * vers du vide, et ce vide est ce qu'il retient du site. Remettre `/blog`
 * ici, et lever son `noindex`, le jour ou les articles ont un corps.
 */
const AVEC_CONTENU = [
  '/',
  '/solutions',
  '/faq',
  '/contact',
  '/a-propos',
  '/tarifs',
  '/produit',
  '/mentions-legales',
  '/confidentialite',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return AVEC_CONTENU.flatMap((href) =>
    locales.map((locale) => ({
      url: new URL(getPathname({ href, locale }), siteUrl).toString(),
      lastModified: new Date(),
      priority:
        href === '/' ? 1 : ['/faq', '/solutions', '/contact', '/a-propos', '/tarifs', '/produit'].includes(
            href,
          ) ? 0.7 : 0.3,
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
