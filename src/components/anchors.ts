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
  implantation: 'implantation',
  aPropos: 'a-propos',
  demo: 'demander-une-demo',

  // Plus aucune section de la Home ne porte cette ancre depuis la refonte V8 :
  // `WhyChoucas` en est sorti. La cle reste parce que ce composant vit encore
  // dans le depot et que Next type-verifie tous les fichiers, rendus ou non.
  // A retirer le jour ou les quatre composants ecartes seront supprimes.
  pourquoi: 'pourquoi-choucas',
} as const;

export type Ancre = (typeof ancres)[keyof typeof ancres];

/** Hauteur de la barre collante, a decouvert sous une ancre. */
export const HAUTEUR_BARRE_DESKTOP = 68;
export const HAUTEUR_BARRE_MOBILE = 60;

/**
 * Destination des CTA « Demander une demo » — la prise de rendez-vous.
 *
 * Tous les boutons du site lisent cette seule constante : quinze points
 * d'usage dans huit fichiers, une seule adresse. Changer de prestataire est
 * donc une ligne — mais elle ne se change jamais seule : la politique de
 * confidentialite nomme le prestataire, et les deux doivent rester coherentes
 * a tout instant. Voir `confidentialite.traitementTexte` et
 * `confidentialite.sousTraitantTexte` dans les deux fichiers de traduction.
 *
 * Calendly remplace par Google Calendar le 9 septembre 2026.
 */
export const LIEN_DEMO = 'https://calendar.app.google/ffM5wc8tXhutVs477';

/**
 * Attributs du lien de demonstration. Poses a cote de l'adresse pour qu'un
 * appel ne puisse pas les oublier : la cible est externe, elle s'ouvre dans
 * un nouvel onglet et n'accorde rien a la page appelee.
 */
export const ATTRS_DEMO = { target: '_blank', rel: 'noopener' } as const;

/**
 * Le chemin vers une voie precise du formulaire de contact.
 *
 * `FormulaireContact` ouvre sur la voie principale par defaut. Un lien qui
 * promet « Poser une question » doit donc le dire dans son adresse, sinon il
 * livre le formulaire d'implantation a huit champs et demande un second clic.
 *
 * Le chemin traduit se resout chez l'appelant — `getPathname` a besoin de la
 * langue courante, que cette table ne connait pas.
 */
export function versVoie(chemin: string, voie: 'impl' | 'question'): string {
  return voie === 'impl' ? chemin : `${chemin}?voie=${voie}`;
}
