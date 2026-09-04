'use client';

import { useState } from 'react';

import { Accordeon, type ElementAccordeon } from '../ui/Accordeon';

export type EntreeFaq = { id: string; q: string; r: string };

/**
 * Liste de questions repliees, partagee par la page FAQ et la section de la
 * Home.
 *
 * Elle n'est faite que de lignes et de vide : pas de carte, pas de rayon, pas
 * de fond par entree. Une FAQ chargee visuellement est une FAQ qu'on ne lit
 * pas.
 *
 * Tout est ferme au depart, et plusieurs entrees peuvent etre ouvertes a la
 * fois — c'est une page de verification, on y compare des reponses.
 *
 * La semantique et le clavier viennent de `Accordeon` ; ici on ne decide que
 * de l'apparence.
 */
export function ListeFaq({
  entrees,
  idBase,
  niveau = 'h3',
  className,
}: {
  entrees: EntreeFaq[];
  idBase: string;
  niveau?: 'h2' | 'h3' | 'h4';
  className?: string;
}) {
  const [ouverts, setOuverts] = useState<string[]>([]);

  const elements: ElementAccordeon[] = entrees.map((entree) => ({
    id: entree.id,
    entete: (
      <>
        <span className="min-w-0 flex-1">{entree.q}</span>
        <Indicateur ouvert={ouverts.includes(entree.id)} />
      </>
    ),
    contenu: (
      // 65 caracteres environ : la mesure de lecture prime sur la largeur du
      // conteneur.
      <p className="text-corps max-w-[65ch] pb-6 text-encre-douce">{entree.r}</p>
    ),
  }));

  return (
    <Accordeon
      elements={elements}
      idBase={idBase}
      ouverts={ouverts}
      onChange={setOuverts}
      multiple
      niveau={niveau}
      className={className}
      classeElement={() => 'border-t border-filet last:border-b'}
      classeEntete={() =>
        [
          'text-intro flex w-full min-h-16 items-center gap-4 py-4 text-left font-semibold',
          'transition-colors duration-200 ease-choucas hover:text-encre-douce',
        ].join(' ')
      }
    />
  );
}

/**
 * Un plus dont la barre verticale pivote pour devenir un moins.
 *
 * Construit en deux traits plutot que pris dans un jeu d'icones : c'est un
 * signe geometrique, pas un chevron.
 */
function Indicateur({ ouvert }: { ouvert: boolean }) {
  return (
    <span aria-hidden className="relative block size-3 shrink-0">
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
      <span
        className={[
          'absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current',
          'transition-transform duration-200 ease-choucas motion-reduce:transition-none',
          ouvert ? 'rotate-90' : '',
        ].join(' ')}
      />
    </span>
  );
}
