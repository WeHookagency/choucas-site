/**
 * Les deux jeux de champs du formulaire, et ce qui les valide.
 *
 * La table est la seule source : le rendu, la validation et le corps du
 * courriel la parcourent tous les trois. Ajouter un champ, c'est ajouter une
 * ligne ici.
 */

export type Voie = 'impl' | 'question';

/** Les champs de saisie libre : eux seuls ont un exemple sous leur cle. */
type CleSaisie = 'nom' | 'conciergerie' | 'station' | 'biens' | 'terrain' | 'email' | 'tel';

type Commun = {
  /** Un champ vide bloque l'envoi. */
  requis: boolean;
  /** Occupe toute la largeur, meme quand la grille en a deux. */
  large?: boolean;
};

/**
 * Union discriminee par le type : le compilateur sait alors quelles cles de
 * traduction existent pour chaque branche, sans qu'on ait a le lui promettre.
 */
export type Champ =
  | ({ cle: CleSaisie; type: 'texte' | 'email' | 'tel' | 'nombre' } & Commun)
  | ({ cle: 'dispo'; type: 'choix' } & Commun)
  | ({ cle: 'message'; type: 'zone' } & Commun);

export const JEUX: Record<Voie, readonly Champ[]> = {
  // Quatre champs seulement sont obligatoires : le nom, la conciergerie,
  // l'email et le telephone. La station, les deux volumes et la periode se
  // demandent pendant l'appel de vingt minutes — huit champs obligatoires
  // font abandonner avant l'envoi. Ils restent dans le formulaire, et un
  // libelle « facultatif » le dit a l'oeil autant qu'au lecteur d'ecran.
  //
  // L'ordre est celui de la grille a deux colonnes, par paires qui vont
  // ensemble : qui vous etes, comment vous joindre, puis les deux volumes.
  // Sept demi-champs laissaient le dernier seul sur sa rangee, avec la moitie
  // de la grille vide a cote ; « station » passe en pleine largeur, ou une
  // conciergerie peut nommer plusieurs vallees sans etre a l'etroit.
  impl: [
    { cle: 'nom', type: 'texte', requis: true },
    { cle: 'conciergerie', type: 'texte', requis: true },
    { cle: 'email', type: 'email', requis: true },
    { cle: 'tel', type: 'tel', requis: true },
    { cle: 'station', type: 'texte', requis: false, large: true },
    { cle: 'biens', type: 'nombre', requis: false },
    { cle: 'terrain', type: 'nombre', requis: false },
    { cle: 'dispo', type: 'choix', requis: false, large: true },
  ],
  question: [
    { cle: 'nom', type: 'texte', requis: true },
    { cle: 'email', type: 'email', requis: true },
    { cle: 'message', type: 'zone', requis: true, large: true },
  ],
};

/** Les trois periodes proposees, dans l'ordre de la maquette. */
export const PERIODES = ['horsSaison', 'intersaison', 'aDiscuter'] as const;

/**
 * Verifie un champ et rend la cle du message a afficher, ou null.
 *
 * Volontairement peu severe : le formulaire refuse ce qui est manifestement
 * inutilisable — un email sans domaine, un telephone qui n'a pas dix
 * chiffres — et laisse passer le reste. Une validation zelee coute plus de
 * prospects qu'elle n'en sauve.
 */
export function verifier(champ: Champ, valeur: string): 'erreur' | 'erreurDomaine' | null {
  const v = valeur.trim();
  if (champ.requis && !v) return 'erreur';
  if (!v) return null;

  if (champ.type === 'email') {
    // Une arobase, quelque chose avant, un domaine pointe apres.
    return /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(v) ? null : 'erreurDomaine';
  }
  if (champ.type === 'nombre') {
    return /^\d+$/.test(v) ? null : 'erreur';
  }
  if (champ.type === 'tel') {
    return v.replace(/\D/g, '').length === 10 ? null : 'erreur';
  }
  return null;
}
