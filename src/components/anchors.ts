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
 * Destination des CTA « Demander une demo ».
 *
 * Une adresse de courrier, en attendant un vrai mecanisme de prise de
 * rendez-vous — les specs §6.11 et §11 le rangent parmi les elements a
 * arreter avant production. Les quatre boutons de la page lisent cette seule
 * constante : la remplacer par une URL de reservation suffira.
 *
 * Pas de `target="_blank"` : un `mailto:` ouvre le client de messagerie, pas
 * une page. Le nouvel onglet resterait vide derriere lui.
 */
export const LIEN_DEMO = 'mailto:mathieudv@wehookagency.com';
