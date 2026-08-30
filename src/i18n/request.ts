import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

/**
 * Charge le fichier de traductions de la langue demandee.
 *
 * L'import est dynamique et indexe sur la langue : ajouter une langue au
 * registre ne demande aucune ligne ici, seulement le fichier JSON en face.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
