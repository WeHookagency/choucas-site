import { defineRouting } from 'next-intl/routing';

import { defaultLocale, locales } from './locales';

/**
 * Slugs traduits.
 *
 * La cle est le chemin interne — le nom du dossier sous `app/[locale]/`. La
 * valeur est ce que voit le visiteur, une entree par langue servie. Une page
 * n'existe qu'une fois dans `app/` : c'est cette table, et elle seule, qui la
 * fait apparaitre sous une URL differente selon la langue.
 *
 * Une chaine unique au lieu d'un objet signifie « meme slug partout », ce qui
 * convient a la racine.
 *
 * Exemple, quand la page tarifs arrivera :
 *   '/tarifs': { fr: '/tarifs', en: '/pricing' }
 */
export const pathnames = {
  '/': '/',
} as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  pathnames,

  // Toutes les URL portent leur langue, y compris la langue par defaut :
  // /fr/... et /en/..., jamais de racine implicite. Une seule forme d'URL par
  // page, donc pas de contenu dupliquable aux yeux d'un moteur de recherche.
  localePrefix: 'always',

  // « / » mene toujours a la langue par defaut, sans consulter l'en-tete
  // Accept-Language ni le cookie. Passer a `true` pour rediriger le visiteur
  // vers la langue de son navigateur quand elle fait partie de `locales`.
  localeDetection: false,

  // next-intl sait annoncer les langues dans un en-tete HTTP `Link`. On s'en
  // passe : les hreflang sont emises dans le <head> par `localeAlternates`,
  // et deux sources pour la meme information finiraient par diverger.
  alternateLinks: false,
});
