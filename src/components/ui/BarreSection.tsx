'use client';

import { useEffect, useState } from 'react';

export type EntreeBarre = { id: string; libelle: string };

/**
 * Barre de navigation de section, collante sous l'en-tete.
 *
 * Motif du handoff : des pastilles qui mènent aux sections de la page et
 * suivent le defilement. L'etat actif est un soulignement cuivre de 2 px, pas
 * un changement de fond — et il est double par `aria-current`, de sorte que
 * l'information ne repose pas sur la seule couleur.
 *
 * Le handoff suit le defilement par un intervalle ; on emploie un
 * `IntersectionObserver`, comme le demande son propre §5.
 *
 * `prefers-reduced-motion` supprime le defilement anime : le saut est alors
 * sec, ce que les specs §8 prescrivent.
 */
export function BarreSection({
  entrees,
  'aria-label': ariaLabel,
  className,
}: {
  entrees: EntreeBarre[];
  'aria-label': string;
  className?: string;
}) {
  const [actif, setActif] = useState(entrees[0]?.id ?? '');

  useEffect(() => {
    const cibles = entrees
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!cibles.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // La section active est la plus haute de celles qui touchent la
        // moitie superieure de la fenetre.
        const visibles = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibles[0]) setActif(visibles[0].target.id);
      },
      { rootMargin: '-20% 0px -55% 0px' },
    );

    cibles.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
    <nav
      aria-label={ariaLabel}
      className={`sticky top-[60px] z-40 border-y border-filet bg-fond/93 backdrop-blur-[18px] desktop:top-[68px] ${className ?? ''}`}
    >
      <ul className="mx-auto flex max-w-contenu gap-6 overflow-x-auto px-marge">
        {entrees.map((entree) => {
          const courant = entree.id === actif;
          return (
            <li key={entree.id}>
              <a
                href={`#${entree.id}`}
                onClick={(e) => allerA(e, entree.id)}
                aria-current={courant ? true : undefined}
                className={[
                  'text-nav inline-flex min-h-11 items-center whitespace-nowrap border-b-2 no-underline',
                  'transition-colors duration-200 ease-choucas',
                  courant
                    ? 'border-accent font-semibold text-encre'
                    : 'border-transparent text-encre-douce hover:text-encre',
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
