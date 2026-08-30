/**
 * Registre des langues du site.
 *
 * C'est le seul endroit ou l'on decide quelles langues existent. Le routage,
 * les balises hreflang, la generation statique et le futur selecteur de langue
 * lisent tous ce fichier — aucun d'eux ne redeclare sa propre liste.
 */

/** Langues servies aujourd'hui. */
export const locales = ['fr', 'en'] as const;

/**
 * Langues prevues, pas encore servies. Tant qu'une langue figure ici, elle n'a
 * ni route, ni hreflang, ni page generee : elle est documentee, pas exposee.
 *
 * Pour activer le portugais :
 *   1. deplacer 'pt' de `plannedLocales` vers `locales` ;
 *   2. creer `src/messages/pt.json`.
 *
 * Oublier l'etape 2 ne passe pas : `next build` s'arrete au prerendu de /pt
 * sur « Cannot find module '../messages/pt.json' ». Le controle est au build,
 * pas au typage — le chargeur de messages construit son chemin a l'execution.
 *
 * Si des slugs traduits ont ete ajoutes a `routing.ts` sous leur forme par
 * langue, TypeScript reclame en plus la colonne 'pt' de chacun.
 */
export const plannedLocales = ['pt'] as const;

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
