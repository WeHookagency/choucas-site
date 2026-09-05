/**
 * Emplacement d'une image qui n'existe pas encore.
 *
 * Les dimensions sont celles de la maquette, de sorte que la vraie image
 * prenne exactement la meme place le jour ou elle arrive : aucune ligne ne
 * bougera. Rien n'est dessine a l'interieur — une image inventee vaudrait
 * moins que l'absence — et le cadre est masque aux lecteurs d'ecran, la
 * legende portant le sens.
 */
export function Reserve({
  ratio,
  largeurMax,
  teinte = 'panneau',
  className,
}: {
  /** Rapport largeur/hauteur, ecrit comme dans la maquette : `340 / 640`. */
  ratio: string;
  largeurMax: number;
  /** `mousse` pour une capture d'ecran, `panneau` pour une photographie. */
  teinte?: 'mousse' | 'panneau';
  className?: string;
}) {
  return (
    <div
      aria-hidden
      style={{ aspectRatio: ratio, maxWidth: `${largeurMax}px` }}
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
