import type { ReactNode } from 'react';

type Fond = 'fond' | 'fond-alt' | 'surface' | 'sombre' | 'respiration';

type SectionProps = {
  children: ReactNode;
  id?: string;
  fond?: Fond;
  /** `scene` (1440) pour le hero et les demos produit, `contenu` (1360) sinon. */
  largeur?: 'contenu' | 'scene';
  /** Retire le rythme vertical, pour une section qui gere ses propres bords. */
  sansRythme?: boolean;
  /**
   * Ce qui surplombe l'ancre. `entete` seule par defaut ; `entete-barre`
   * quand une barre de section collante s'ajoute dessous, sinon le titre
   * vise se gare derriere elle.
   */
  surplomb?: 'entete' | 'entete-barre';
  className?: string;
  'aria-labelledby'?: string;
};

const surplombs = {
  entete: 'scroll-mt-[60px] desktop:scroll-mt-[68px]',
  'entete-barre': 'scroll-mt-[112px] desktop:scroll-mt-[122px]',
} as const;

const fonds: Record<Fond, string> = {
  fond: 'bg-fond text-encre',
  'fond-alt': 'bg-fond-alt text-encre',
  surface: 'bg-surface text-encre',
  // Schiste sur Neige inverse : 15,98:1.
  sombre: 'bg-fond-sombre text-encre-inverse',
  // Le Lichen est une surface, jamais une encre : le texte pose dessus est
  // du Schiste (6,57:1), jamais l'inverse.
  respiration: 'bg-respiration text-encre',
};

/**
 * Enveloppe commune des sections : fond pleine largeur, contenu plafonne et
 * centre, marges laterales et rythme vertical des specs §3 et §4.
 */
export function Section({
  children,
  id,
  fond = 'fond',
  largeur = 'contenu',
  sansRythme = false,
  surplomb = 'entete',
  className,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      // L'en-tete est collante : une ancre doit se degager sous elle.
      className={`${fonds[fond]} ${id ? surplombs[surplomb] : ''} ${className ?? ''}`}
      {...props}
    >
      <div
        className={[
          'mx-auto px-marge',
          largeur === 'scene' ? 'max-w-scene' : 'max-w-contenu',
          sansRythme ? '' : 'py-section',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </section>
  );
}
