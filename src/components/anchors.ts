/**
 * Cibles de navigation de la homepage.
 *
 * Le site n'a qu'une page pour l'instant : les liens de la barre pointent
 * donc vers ses sections plutot que vers des pages qui n'existent pas. Les
 * specs §12 interdisent les liens factices en production ; ces ancres-la
 * menent toutes quelque part.
 *
 * Le jour ou les pages arrivent, ce fichier devient la liste des liens a
 * requalifier.
 */
export const ancres = {
  produit: 'produit',
  fonctionnement: 'fonctionnement',
  pourquoi: 'pourquoi-choucas',
  aPropos: 'a-propos',
  demo: 'demander-une-demo',
} as const;

export type Ancre = (typeof ancres)[keyof typeof ancres];

/** Hauteur de la barre collante, a decouvert sous une ancre. */
export const HAUTEUR_BARRE_DESKTOP = 68;
export const HAUTEUR_BARRE_MOBILE = 60;

/**
 * Destination des CTA « Demander une demo » — la prise de rendez-vous.
 *
 * Les quatre boutons de la page lisent cette seule constante.
 */
export const LIEN_DEMO = 'https://calendly.com/mathieudv/rencontre-1o1';

/**
 * Attributs du lien de demonstration. Poses a cote de l'adresse pour qu'un
 * appel ne puisse pas les oublier : la cible est externe, elle s'ouvre dans
 * un nouvel onglet et n'accorde rien a la page appelee.
 */
export const ATTRS_DEMO = { target: '_blank', rel: 'noopener' } as const;
