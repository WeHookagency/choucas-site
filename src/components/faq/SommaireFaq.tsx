'use client';

import { useEffect, useState } from 'react';

import { creerSuiviSection } from '../ui/suiviSection';

export type EntreeSommaire = { id: string; libelle: string };

/**
 * Sommaire de la page FAQ.
 *
 * Deux rendus pour une seule logique : colonne collante a gauche en desktop,
 * rangee de pastilles au-dessus du premier groupe en mobile. Les deux
 * partagent l'observateur, donc le meme groupe actif.
 *
 * Le groupe courant est marque par un filet cuivre, pas par un fond colore —
 * c'est le seul mouvement de la page avec l'ouverture d'un accordeon. Il
 * porte aussi `aria-current` : l'information ne repose jamais sur la seule
 * couleur.
 *
 * Le suivi passe par un `IntersectionObserver` et non par un intervalle : la
 * maquette scrute la position au timer, ce qui reveille le fil principal pour
 * rien. Le groupe actif est designe par `suiviSection`, partage avec la barre
 * de section.
 */
export function SommaireFaq({
  entrees,
  titre,
  'aria-label': ariaLabel,
}: {
  entrees: EntreeSommaire[];
  titre: string;
  'aria-label': string;
}) {
  const [actif, setActif] = useState(entrees[0]?.id ?? '');

  useEffect(() => {
    const ordre = entrees.map((e) => e.id);
    const cibles = ordre
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!cibles.length) return;

    const suivi = creerSuiviSection(ordre);
    const io = new IntersectionObserver(
      (entries) => {
        const actuel = suivi.appliquer(
          entries.map((e) => ({ id: e.target.id, visible: e.isIntersecting })),
        );
        if (actuel) setActif(actuel);
      },
      { rootMargin: '-15% 0px -60% 0px' },
    );

    cibles.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      suivi.reinitialiser();
    };
  }, [entrees]);

  function allerA(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const cible = document.getElementById(id);
    if (!cible) return;
    e.preventDefault();
    const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cible.scrollIntoView({ behavior: doux ? 'smooth' : 'auto', block: 'start' });
    setActif(id);
  }

  return (
    <nav aria-label={ariaLabel} className="min-w-0">
      {/* Desktop : colonne collante. */}
      <div className="hidden desktop:block desktop:sticky desktop:top-[100px]">
        <p className="text-label font-semibold uppercase text-encre-douce">{titre}</p>
        <ul className="mt-4 flex flex-col">
          {entrees.map((entree) => {
            const courant = entree.id === actif;
            return (
              <li key={entree.id}>
                <a
                  href={`#${entree.id}`}
                  onClick={(e) => allerA(e, entree.id)}
                  aria-current={courant ? true : undefined}
                  className={[
                    'text-nav flex min-h-11 items-center border-l-2 py-2 pl-4 no-underline',
                    'transition-colors duration-200 ease-choucas',
                    courant
                      ? 'border-accent font-bold text-encre'
                      : 'border-transparent font-semibold text-encre-douce hover:text-encre',
                  ].join(' ')}
                >
                  {entree.libelle}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile et tablette : rangee de pastilles, defilement horizontal. */}
      <ul className="-mx-marge flex gap-2 overflow-x-auto px-marge desktop:hidden">
        {entrees.map((entree) => {
          const courant = entree.id === actif;
          return (
            <li key={entree.id}>
              <a
                href={`#${entree.id}`}
                onClick={(e) => allerA(e, entree.id)}
                aria-current={courant ? true : undefined}
                className={[
                  'text-nav inline-flex min-h-11 items-center whitespace-nowrap rounded-capsule border px-4 no-underline',
                  'font-semibold transition-colors duration-200 ease-choucas',
                  courant
                    ? 'border-cta bg-cta text-cta-encre'
                    : 'border-filet text-encre-douce',
                ].join(' ')}
              >
                {entree.libelle}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
