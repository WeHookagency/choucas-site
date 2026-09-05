import type { ReactNode } from 'react';

/**
 * Emplacement d'une capture produit qui n'existe pas encore.
 *
 * Les dimensions sont celles de la maquette — 340 px de large, 640 de haut,
 * rayon majeur, filet, fond Mousse — de sorte que la vraie capture prenne
 * exactement la meme place le jour ou elle arrive : aucune ligne ne bougera.
 *
 * Le cadre est purement decoratif et masque aux lecteurs d'ecran. C'est la
 * legende qui porte le sens, et elle decrit l'ecran attendu, pas le vide.
 * Rien n'est dessine a l'interieur : une capture inventee vaudrait moins que
 * l'absence.
 */
export function ReserveCapture({ legende }: { legende: ReactNode }) {
  return (
    <figure className="m-0 flex flex-col gap-4">
      <div
        aria-hidden
        className="w-full max-w-[340px] rounded-carte-majeure border border-encre/20 bg-ok"
        style={{ aspectRatio: '340 / 640' }}
      />
      <figcaption className="text-corps max-w-[340px] text-encre">{legende}</figcaption>
    </figure>
  );
}
