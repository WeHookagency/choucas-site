import type messages from '@/messages/fr.json';
import type { Locale } from '@/i18n/locales';

/**
 * Rend les traductions verifiables par le compilateur.
 *
 * Le francais sert de reference : une cle absente de `fr.json` devient une
 * erreur a l'appel, et une langue dont le fichier ne couvre pas toutes les
 * cles se signale au build plutot qu'a l'execution.
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
