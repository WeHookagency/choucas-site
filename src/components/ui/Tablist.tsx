'use client';

import { useRef, type ReactNode } from 'react';

import styles from './Tablist.module.css';

export type Onglet = {
  id: string;
  libelle: ReactNode;
  /** Un onglet dont la copie n'est pas encore ecrite reste visible mais
   *  inactivable : il annonce la structure sans mentir sur son contenu. */
  pret: boolean;
};

type TablistProps = {
  onglets: Onglet[];
  actif: string;
  onChange: (id: string) => void;
  /** `verticale` empile les onglets — flechs haut/bas au lieu de gauche/droite. */
  orientation?: 'horizontale' | 'verticale';
  idBase: string;
  className?: string;
  /** Classes de chaque bouton, selon son etat. */
  classeOnglet: (etat: { actif: boolean; pret: boolean }) => string;
  'aria-label'?: string;
};

/**
 * Liste d'onglets accessible — motif ARIA `tablist`.
 *
 * Activation manuelle : les fleches deplacent le focus, Entree ou Espace
 * choisit. C'est ce que demandent les specs §6.6, et cela evite qu'un
 * simple parcours au clavier ne fasse defiler quatre panneaux.
 *
 * Un onglet non pret garde le focus — le masquer le rendrait indecouvrable —
 * mais porte `aria-disabled` et ne s'active pas.
 */
export function Tablist({
  onglets,
  actif,
  onChange,
  orientation = 'horizontale',
  idBase,
  className,
  classeOnglet,
  ...props
}: TablistProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function surTouche(e: React.KeyboardEvent, index: number) {
    const suivant = orientation === 'verticale' ? 'ArrowDown' : 'ArrowRight';
    const precedent = orientation === 'verticale' ? 'ArrowUp' : 'ArrowLeft';

    let cible: number | null = null;
    if (e.key === suivant) cible = (index + 1) % onglets.length;
    else if (e.key === precedent) cible = (index - 1 + onglets.length) % onglets.length;
    else if (e.key === 'Home') cible = 0;
    else if (e.key === 'End') cible = onglets.length - 1;
    else if (e.key === 'Enter' || e.key === ' ') {
      if (onglets[index].pret) {
        e.preventDefault();
        onChange(onglets[index].id);
      }
      return;
    }

    if (cible === null) return;
    e.preventDefault();
    refs.current[onglets[cible].id]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-orientation={orientation === 'verticale' ? 'vertical' : 'horizontal'}
      className={className}
      {...props}
    >
      {onglets.map((onglet, i) => {
        const estActif = onglet.id === actif;
        return (
          <button
            key={onglet.id}
            ref={(el) => {
              refs.current[onglet.id] = el;
            }}
            type="button"
            role="tab"
            id={`${idBase}-onglet-${onglet.id}`}
            aria-controls={`${idBase}-panneau-${onglet.id}`}
            aria-selected={estActif}
            aria-disabled={onglet.pret ? undefined : true}
            // Tabulation roulante : un seul onglet dans l'ordre de tabulation,
            // les fleches parcourent les autres.
            tabIndex={estActif ? 0 : -1}
            onClick={() => onglet.pret && onChange(onglet.id)}
            onKeyDown={(e) => surTouche(e, i)}
            className={classeOnglet({ actif: estActif, pret: onglet.pret })}
          >
            {onglet.libelle}
          </button>
        );
      })}
    </div>
  );
}

/** Panneau associe a l'onglet actif. Un seul est monte a la fois. */
export function Panneau({
  idBase,
  id,
  className,
  children,
}: {
  idBase: string;
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`${idBase}-panneau-${id}`}
      aria-labelledby={`${idBase}-onglet-${id}`}
      // Le panneau peut ne contenir aucun element focalisable : on le rend
      // atteignable pour que la tabulation depuis l'onglet mene a son contenu.
      tabIndex={0}
      className={`${styles.panneau} ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
