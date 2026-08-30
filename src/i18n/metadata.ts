import type { Metadata } from 'next';

import { defaultLocale, locales, localeMetadata, type Locale } from './locales';
import { getPathname } from './navigation';

/** Origine canonique du site. Rend absolues les URL relatives des metadonnees. */
export const siteUrl = new URL('https://choucas.app');

type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * Construit le canonical et les hreflang d'une page.
 *
 * On passe le chemin interne — celui de la table `pathnames` — et la fonction
 * en derive l'URL de chaque langue servie. Quand un slug est traduit, les
 * hreflang suivent sans intervention ; quand une langue est activee dans le
 * registre, sa balise apparait ici toute seule.
 *
 * `x-default` pointe vers la langue par defaut : c'est la page servie a un
 * moteur qui ne sait pas quelle langue proposer, et la cible de « / ».
 */
export function localeAlternates(href: Href, locale: Locale): Metadata['alternates'] {
  const languages: Record<string, string> = {};

  for (const served of locales) {
    languages[localeMetadata[served].hreflang] = getPathname({ href, locale: served });
  }
  languages['x-default'] = getPathname({ href, locale: defaultLocale });

  return {
    canonical: getPathname({ href, locale }),
    languages,
  };
}
