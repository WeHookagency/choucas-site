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
 * Provisoire : ramene a la section de conversion, faute de mecanisme de prise
 * de rendez-vous. Les specs §6.11 et §11 listent l'adresse de contact et le
 * systeme de reservation parmi les elements a arreter avant production.
 * Une seule constante a changer le jour venu.
 */
export const LIEN_DEMO = `#${ancres.demo}`;
