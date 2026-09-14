/**
 * La preuve sociale du site : les conciergeries clientes, et ce qu'elles
 * disent.
 *
 * LES DEUX LISTES SONT VIDES, ET C'EST VOULU. Choucas n'a pas encore de
 * clientes. Les composants qui les affichent — `PreuveClients` et
 * `PreuveAvis` — sont poses sur la Home et ne rendent rien tant que ces
 * tableaux sont vides : la section entiere disparait, titre compris.
 *
 * L'affichage se declenche donc en remplissant ce fichier, pas en touchant au
 * JSX. C'est la seule condition qui compte, et elle est verifiable.
 *
 * ⚠️ LA REGLE QUI NE SE NEGOCIE PAS. On n'invente ni un nom de conciergerie,
 * ni un temoignage, ni un chiffre. Une rangee de logos arrangee fait plus de
 * mal que leur absence, et un faux avis est indefendable. Tant qu'il n'y a
 * rien, la preuve du site est la section « Ou en est Choucas », qui dit
 * honnetement ou en est le produit.
 *
 * ⚠️ AVANT DE PUBLIER UN AVIS. Le nom d'une personne et celui de son
 * entreprise sont des donnees personnelles : il faut son accord ecrit, et
 * pouvoir le retirer sur demande. Le logo d'une conciergerie est une marque :
 * il faut son autorisation.
 *
 * ⚠️ LES INTITULES SONT ICI ET NON AU CATALOGUE. Rien ne s'affiche, donc rien
 * n'a besoin d'etre traduit. Le jour ou la premiere ligne arrive, ils
 * deviennent des cles de `fr.json` et `en.json` comme le reste du site.
 *
 * ⚠️ LES FONDS. Les deux sections sont declarees en Panneau et en Neige. Le
 * jour ou elles apparaissent, la suite des fonds de la Home change : il
 * faudra la remesurer, aucun fond ne devant se repeter d'une section a la
 * suivante.
 */

/** Une conciergerie cliente. Le logo est facultatif — le nom suffit. */
export type ClientPreuve = {
  /** Le nom tel que la conciergerie l'ecrit elle-meme. */
  nom: string;
  /** Chemin dans `public/`, ou rien : le nom s'affiche alors en toutes lettres. */
  logo?: string;
  /** Texte alternatif du logo, obligatoire des qu'il y a un logo. */
  logoAlt?: string;
};

/** Ce qu'une personne dit, avec son nom et son role. Jamais anonyme. */
export type AvisPreuve = {
  /** La citation, telle qu'elle a ete dite ou relue et validee par elle. */
  citation: string;
  /** Prenom et initiale, comme partout ailleurs sur le site. */
  auteur: string;
  /** Son role : « Responsable d'exploitation », « Dirigeante ». */
  role: string;
  /** Sa conciergerie. */
  conciergerie: string;
};

export const intituleClients = 'Ils travaillent avec Choucas';
export const intituleAvis = 'Ce qu’elles en disent';

export const clients: ClientPreuve[] = [];

export const avis: AvisPreuve[] = [];
