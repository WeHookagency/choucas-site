import type { ReactNode } from 'react';

import { Section } from '../ui/Section';

/**
 * Gabarit des pages legales.
 *
 * Une colonne de lecture etroite, des blocs titres-contenu separes d'un filet.
 * Rien d'editorial : ces pages se consultent, elles ne se parcourent pas.
 *
 * CENTREE depuis le 16 septembre 2026. La colonne de 68ch etait calee a gauche
 * d'un conteneur de 1 360 : mesure a 1440, elle occupait 45 % de la piste et
 * laissait 699 px de vide a droite. Sur une page qui n'a rien a poser a cote
 * de son texte, c'est un oubli, pas une composition.
 */
export function PageLegale({
  titre,
  children,
}: {
  titre: string;
  children: ReactNode;
}) {
  return (
    <main>
      <Section fond="fond" aria-labelledby="page-titre">
        <div className="mx-auto max-w-[68ch]">
          <h1 id="page-titre" className="font-serif text-h2 text-balance">
            {titre}
          </h1>
          <div className="mt-titre flex flex-col">{children}</div>
        </div>
      </Section>
    </main>
  );
}

/** Un bloc de la page : un titre, puis son contenu. */
export function BlocLegal({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="border-t border-filet py-8 first:border-t-0 first:pt-0">
      <h2 className="text-label font-semibold uppercase text-encre-douce">{titre}</h2>
      <div className="text-corps mt-4 flex flex-col gap-2">{children}</div>
    </section>
  );
}
