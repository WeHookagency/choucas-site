import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

import { CaptureProduit } from '../ui/CaptureProduit';
import { Eyebrow } from '../ui/Eyebrow';
import { Reserve } from '../ui/Reserve';
import { Section } from '../ui/Section';

/** Largeur de la colonne d'ecran, et hauteur maximale, comme la maquette. */
const ECRAN = { largeur: 340, ratio: '340 / 640' };

/**
 * Un volet de la page Solutions : un role, son texte, son ecran.
 *
 * La maquette pose une grille `1fr 340px` et l'inverse d'un volet a l'autre —
 * l'ecran passe a gauche pour l'exploitation. En dessous de `desktop`, tout
 * retombe en une colonne, texte d'abord.
 *
 * Sur fond Lichen, tout le texte est en encre pleine : l'encre douce y tombe
 * a 2,34:1 et le cuivre a 1,45:1. Aucun titre colore sur ces fonds.
 *
 * L'ecran est une vraie capture quand elle existe, une reserve aux memes
 * dimensions sinon. Aucune ombre solide ici : le §0.5 des correctifs n'en
 * autorise qu'une par page, et elle revient au point de jonction.
 */
export function VoletRole({
  id,
  fond,
  eyebrow,
  titre,
  legende,
  capture,
  captureAlt,
  libelleLien,
  ecranAGauche = false,
  children,
}: {
  id: string;
  fond: 'fond' | 'respiration';
  eyebrow: string;
  titre: string;
  legende: string;
  /** Absente, la place est reservee a ses dimensions. */
  capture?: StaticImageData;
  captureAlt?: string;
  libelleLien?: string;
  /** La maquette alterne le cote de l'ecran d'un volet a l'autre. */
  ecranAGauche?: boolean;
  children: ReactNode;
}) {
  const ton = fond === 'respiration' ? 'encre' : 'douce';

  return (
    <Section
      id={id}
      fond={fond}
      surplomb="entete-barre"
      aria-labelledby={`${id}-titre`}
      className={fond === 'fond' ? 'border-t border-filet' : undefined}
    >
      <div className="grid gap-10 desktop:grid-cols-[1fr_340px] desktop:gap-24">
        <div className={ecranAGauche ? 'desktop:order-2' : undefined}>
          <Eyebrow ton={ton}>{eyebrow}</Eyebrow>
          <h2 id={`${id}-titre`} className="font-serif text-h3 mt-4 max-w-[18ch] text-balance">
            {titre}
          </h2>
          <div className="mt-8 flex max-w-[62ch] flex-col gap-4">{children}</div>
        </div>

        <figure className={`m-0 flex flex-col gap-4 ${ecranAGauche ? 'desktop:order-1' : ''}`}>
          {capture && captureAlt && libelleLien ? (
            <CaptureProduit
              src={capture}
              alt={captureAlt}
              libelleLien={libelleLien}
              largeurMax={ECRAN.largeur}
              ombre={false}
            />
          ) : (
            <Reserve ratio={ECRAN.ratio} largeurMax={ECRAN.largeur} teinte="mousse" />
          )}
          <figcaption
            style={{ maxWidth: `${ECRAN.largeur}px` }}
            className={`text-corps ${fond === 'respiration' ? 'text-encre' : 'text-encre-douce'}`}
          >
            {legende}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
