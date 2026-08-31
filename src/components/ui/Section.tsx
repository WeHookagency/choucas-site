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
  className?: string;
  'aria-labelledby'?: string;
};

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
  className,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      // La barre est collante : une ancre doit se degager sous elle.
      className={`${fonds[fond]} ${id ? 'scroll-mt-[60px] desktop:scroll-mt-[68px]' : ''} ${className ?? ''}`}
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
