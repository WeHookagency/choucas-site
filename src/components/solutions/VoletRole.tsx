import type { ReactNode } from 'react';

import { Eyebrow } from '../ui/Eyebrow';
import { ReserveCapture } from '../ui/ReserveCapture';
import { Section } from '../ui/Section';

/**
 * Un volet de la page Solutions : un role, son texte, son ecran.
 *
 * La maquette pose une grille `1fr 340px` et l'inverse d'un volet a l'autre —
 * l'ecran passe a gauche pour l'exploitation. En dessous de `desktop`, tout
 * retombe en une colonne, texte d'abord.
 *
 * Sur fond Lichen, tout le texte est en encre pleine : l'encre douce y tombe
 * a 2,34:1 et le cuivre a 1,45:1. Aucun titre colore sur ces fonds.
 */
export function VoletRole({
  id,
  fond,
  eyebrow,
  titre,
  legende,
  ecranAGauche = false,
  children,
}: {
  id: string;
  fond: 'fond' | 'respiration';
  eyebrow: string;
  titre: string;
  legende: string;
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

        <div className={ecranAGauche ? 'desktop:order-1' : undefined}>
          <ReserveCapture legende={legende} />
        </div>
      </div>
    </Section>
  );
}
