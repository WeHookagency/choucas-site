/**
 * La FAQ, source unique.
 *
 * La page `/faq` rend tous les groupes ; la section de la Home en reprend cinq
 * questions par leur identifiant. Aucune copie n'est dupliquee : les deux
 * lisent le meme fichier de traductions, sous `faq.questions`.
 *
 * Les identifiants sont stables et decorreles de l'ordre : ils servent
 * d'ancres, de cles de traduction et de selection pour la Home. Les renommer
 * casse des URL.
 */

export type GroupeFaq = {
  /** Sert d'ancre dans la page et de cle sous `faq.groupes`. */
  id: string;
  questions: readonly string[];
};

export const groupesFaq = [
  {
    id: 'produit',
    questions: [
      'definition',
      'etat-pret',
      'qui-controle',
      'hors-reseau',
      'envois-automatiques',
      'implantation',
    ],
  },
  {
    id: 'perimetre',
    questions: ['remplace-pms', 'reservations', 'connexion-pms', 'longue-duree', 'une-personne'],
  },
  {
    id: 'equipe',
    questions: [
      'surveillance',
      'aisance-numerique',
      'formation',
      'saisonniers',
      'refus-double-controle',
    ],
  },
  {
    id: 'donnees',
    questions: ['hebergement', 'photos', 'conservation', 'acces-proprietaire', 'sortie'],
  },
  {
    id: 'prix',
    questions: ['cout', 'hors-saison', 'engagement', 'implantation-facturee'],
  },
] as const satisfies readonly GroupeFaq[];

/**
 * Deux questions de la maquette ne sont pas publiees : leur reponse n'est pas
 * arbitree, et une FAQ qui repond « nous ne savons pas encore » sur une page
 * dont le travail est de lever des objections en cree une.
 *
 *  - donnees / sante — traitement des informations de sante ou d'allergie
 *    d'un voyageur ;
 *  - prix / support-samedi — le support repond-il le samedi apres-midi.
 *
 * Elles n'ont volontairement ni identifiant dans les groupes ci-dessus ni cle
 * de traduction : rien a desactiver, donc rien a publier par accident. Les
 * remettre demande une reponse arbitree, puis une entree dans le groupe et
 * dans `faq.questions`.
 */
export const questionsNonArbitrees = ['donnees/sante', 'prix/support-samedi'] as const;

/**
 * Les questions de prix reprises sur la page Tarifs, depuis la meme source
 * que `/faq`.
 *
 * `engagement` n'y figure pas : sa reponse annonce un engagement annuel avec
 * resiliation a l'echeance, et la duree n'est pas tranchee. Tant qu'elle ne
 * l'est pas, la page qui porte les montants ne l'annonce pas.
 */
export const questionsTarifs = ['cout', 'hors-saison', 'implantation-facturee'] as const;

/**
 * Les cinq questions de la Home, dans l'ordre demande. La cinquieme porte sur
 * les envois automatiques ; celle qui la precede sert de rampe vers le CTA.
 */
export const questionsHome = [
  'remplace-pms',
  'qui-controle',
  'etat-pret',
  'implantation',
  'envois-automatiques',
] as const;
