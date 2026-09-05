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
 */
export function Reserve({
  ratio,
  largeurMax,
  teinte = 'panneau',
  className,
}: {
  /** Rapport largeur/hauteur, ecrit comme dans la maquette : `340 / 640`. */
  ratio?: string;
  largeurMax?: number;
  /** `mousse` pour une capture d'ecran, `panneau` pour une photographie. */
  teinte?: 'mousse' | 'panneau';
  /** Recoit les classes `aspect-[…]` quand le rapport varie selon la vue. */
  className?: string;
}) {
  return (
    <div
      aria-hidden
      style={{ aspectRatio: ratio, maxWidth: largeurMax ? `${largeurMax}px` : undefined }}
      className={[
        'w-full rounded-carte-majeure border',
        teinte === 'mousse' ? 'border-encre/20 bg-ok' : 'border-filet bg-fond-alt',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
