/**
 * Compose le brouillon et rend l'URL `mailto:`.
 *
 * La destination est un parametre et non un import : la fonction reste pure,
 * et le banc peut la verifier sans embarquer la configuration.
 *
 * Ce que `mailto:` implique, et qu'aucune ligne de code ne rattrape :
 *
 * - il n'envoie rien. Il ouvre le client de messagerie du visiteur, qui doit
 *   appuyer sur Envoyer lui-meme. Celui qui ferme le brouillon est perdu, et
 *   nous ne saurons jamais qu'il est passe ;
 * - sans client configure — un navigateur de bureau sans gestionnaire par
 *   defaut, un poste partage — le clic ne fait rien du tout ;
 * - tout passe par une URL. Au-dela d'environ 2 000 caracteres, certains
 *   clients tronquent sans prevenir. Seule la voie « question » peut s'en
 *   approcher, par son champ libre ;
 * - on ne peut donc pas afficher « Demande recue » : nous n'en savons rien.
 *   La page ne feint aucune confirmation.
 *
 * Deux details d'encodage. Les sauts de ligne sont des CRLF, que la RFC 6068
 * impose. Et l'espace doit sortir en `%20` : `URLSearchParams` l'encode en
 * `+`, que les clients de messagerie affichent tel quel dans le corps.
 */
export function composerMailto(destination: string, sujet: string, lignes: readonly string[]) {
  const params = new URLSearchParams({ subject: sujet, body: lignes.join('\r\n') });
  return `mailto:${destination}?${params.toString().replace(/\+/g, '%20')}`;
}
