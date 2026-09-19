/**
 * Emplacement d'une image qui n'existe pas encore.
 *
 * Les dimensions sont celles de la maquette, de sorte que la vraie image
 * prenne exactement la meme place le jour ou elle arrive : aucune ligne ne
 * bougera. Rien n'est dessine a l'interieur — une image inventee vaudrait
 * moins que l'absence — et le cadre est masque aux lecteurs d'ecran.
 *
 * Le rapport se donne soit en valeur, quand il est unique, soit en classes
 * utilitaires quand il change a la rupture : une propriete en ligne ne sait
 * pas repondre a une media query.
 *
 * ELLE DOIT RESSEMBLER A UNE RESERVE. Elle etait un aplat plein de Mousse :
 * l'element le plus visible de l'ecran, plus visible que le texte a cote, et
 * elle se lisait comme un bloc de couleur voulu plutot que comme une image a
 * venir. Sur un staging qu'on relit, dix aplats verts inquietent.
 *
 * Elle est donc un contour en tirets sur un lavis a peine pose. Memes
 * dimensions, meme place : la vraie capture atterrira exactement au meme
 * endroit, aucune ligne ne bougera.
 *
 * Aucune couleur neuve — l'encre de la charte et le Mousse, avec des
 * opacites. Mesures pour le contour, seuil de 3:1 des objets graphiques :
 *
 *   Neige    encre/50          3,03:1 a 47 %
 *   Panneau  encre/50          3,05:1 a 48 %
 *   Sapin    encre-inverse/45  3,02:1 a 41 %
 *   Schiste  encre-inverse/45  3,00:1 a 35 %
 *
 * Le lavis, lui, ne porte rien : il distingue une capture d'ecran d'une
 * photographie, a 1,13:1 du fond. C'est voulu — s'il se voyait, on serait
 * revenu a l'aplat.
 *
 * ---------------------------------------------------------------------------
 * ELLE A ETE MASQUEE SOUS 1 000 PX, PUIS REMISE. 19 septembre 2026, dans la
 * journee. La trace est gardee pour que personne ne refasse le trajet.
 *
 * L'argument du masquage tenait : empilee sur un telephone, une reserve
 * devient un rectangle vide de 264 a 480 px au milieu du parcours, et le
 * visiteur ne voit pas une capture a venir — il voit un trou.
 *
 * CE QUI L'A ANNULE : les captures arrivent. Le front-end de la PWA est en
 * cours, la liste est ecrite dans `references/captures-attendues.md`, et ces
 * cadres seront remplis avant la mise en ligne. Masquer pendant quelques
 * semaines un emplacement qu'on s'apprete a remplir, c'est se priver du seul
 * signal qui rappelle qu'il est vide — et prendre le risque de livrer en
 * oubliant d'en remplir un.
 *
 * ⚠️ SI LE MASQUAGE DOIT REVENIR : il tenait en `hidden … desktop:block` sur
 * ce `div`, PLUS un masquage de la figure entiere chez chacun des quatre
 * appelants. Sans ce second geste, la legende reste seule a legender du vide —
 * « Le brief consolide » sous une section qui n'illustre plus rien.
 * ---------------------------------------------------------------------------
 */
export function Reserve({
  ratio,
  largeurMax,
  teinte = 'panneau',
  sombre = false,
  className,
}: {
  /** Rapport largeur/hauteur, ecrit comme dans la maquette : `340 / 640`. */
  ratio?: string;
  largeurMax?: number;
  /** `mousse` pour une capture d'ecran, `panneau` pour une photographie. */
  teinte?: 'mousse' | 'panneau';
  /** Sur Sapin ou Schiste : le contour passe a l'encre inversee. */
  sombre?: boolean;
  /** Recoit les classes `aspect-[…]` quand le rapport varie selon la vue. */
  className?: string;
}) {
  return (
    <div
      aria-hidden
      style={{ aspectRatio: ratio, maxWidth: largeurMax ? `${largeurMax}px` : undefined }}
      className={[
        'w-full rounded-carte-majeure border-2 border-dashed',
        sombre ? 'border-encre-inverse/45' : 'border-encre/50',
        teinte === 'mousse' ? (sombre ? 'bg-ok/15' : 'bg-ok/10') : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
