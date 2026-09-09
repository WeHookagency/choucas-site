/**
 * Ou part une soumission du formulaire de contact.
 *
 * Passee de mathieudv@wehookagency.com a mathieudv@choucas.app le 9 septembre
 * 2026, le domaine ayant recu ses enregistrements MX — verifie avant le
 * changement, ils pointent vers Google. Une adresse qui rebondit ne se voit
 * pas : le visiteur croit avoir ecrit.
 *
 * La maquette affiche `contact@choucas.app` en pied de page ; ce n'est pas
 * cette adresse-la. Un seul endroit a changer si elle doit le devenir.
 *
 * `mailto:` n'envoie rien : il ouvre le client de messagerie du visiteur avec
 * un brouillon pre-rempli, que celui-ci doit envoyer lui-meme. Les
 * consequences sont ecrites dans `FormulaireContact.tsx`, au-dessus de
 * `composerMailto`.
 */
export const DESTINATION_FORMULAIRE = 'mathieudv@choucas.app';
