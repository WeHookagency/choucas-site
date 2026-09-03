/**
 * Registre des langues du site.
 *
 * C'est le seul endroit ou l'on decide quelles langues existent. Le routage,
 * les balises hreflang, la generation statique et le futur selecteur de langue
 * lisent tous ce fichier — aucun d'eux ne redeclare sa propre liste.
 */

/** Langues servies aujourd'hui. */
export const locales = ['fr'] as const;

/**
 * Langues prevues, pas encore servies. Tant qu'une langue figure ici, elle n'a
 * ni route, ni hreflang, ni page generee : elle est documentee, pas exposee.
 *
 * L'anglais a ete desactive le 3 septembre 2026. Tout ce qu'il faut pour le
 * remettre est reste en place : `src/messages/en.json`, ses slugs traduits
 * dans `routing.ts`, et le composant `LanguageSwitcher`. La reactivation
 * tient en quatre gestes, tous des inversions :
 *
 *   1. redeplacer 'en' de `plannedLocales` vers `locales` ;
 *   2. remettre les deux `<LanguageSwitcher />` dans `SiteHeader.tsx` ;
 *   3. retirer la redirection /en de `next.config.ts` ;
 *   4. rien a faire pour les hreflang : `localeAlternates` les remet des
 *      qu'une deuxieme langue est servie.
 *
 * Pour activer le portugais :
 *   1. deplacer 'pt' de `plannedLocales` vers `locales` ;
 *   2. creer `src/messages/pt.json` ;
 *   3. completer la colonne 'pt' des slugs traduits de `routing.ts`.
 *
 * Oublier le fichier de messages ne passe pas : `next build` s'arrete au
 * prerendu sur « Cannot find module ». Le controle est au build, pas au
 * typage — le chargeur construit son chemin a l'execution.
 */
export const plannedLocales = ['en', 'pt'] as const;

export type Locale = (typeof locales)[number];
export type PlannedLocale = (typeof plannedLocales)[number];

/** Langue par defaut : celle vers laquelle « / » redirige. */
export const defaultLocale: Locale = 'fr';

/**
 * Libelle natif et code hreflang de chaque langue, servie ou seulement prevue.
 * Le libelle est volontairement dans sa propre langue : un visiteur cherchant
 * le portugais reconnait « Portugues », pas « Portugais ».
 */
export const localeMetadata = {
  fr: { label: 'Français', hreflang: 'fr' },
  en: { label: 'English', hreflang: 'en' },
  pt: { label: 'Português', hreflang: 'pt' },
} as const satisfies Record<
  Locale | PlannedLocale,
  { label: string; hreflang: string }
>;
