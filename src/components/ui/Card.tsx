import type { CSSProperties, ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  /** `forte` = carte de transformation ou de profil : bordure 2 px, §7. */
  accent?: 'standard' | 'forte' | 'sapin';
  /** Rayon : `majeure` (24) pour les cartes de tete, `standard` (16) sinon. */
  rayon?: 'standard' | 'majeure';
  ombre?: boolean;
  className?: string;
  /** Sert au decalage `--i` d'un groupe anime. */
  style?: CSSProperties;
};

const accents: Record<NonNullable<CardProps['accent']>, string> = {
  standard: 'bg-surface text-encre border border-filet',
  forte: 'bg-surface text-encre border-2 border-encre',
  // Glacier sur Sapin : 10,61:1.
  sapin: 'bg-cta text-cta-encre border-2 border-cta',
};

export function Card({
  children,
  accent = 'standard',
  rayon = 'standard',
  ombre = false,
  className,
  style,
}: CardProps) {
  return (
    <div
      style={style}
      className={[
        accents[accent],
        rayon === 'majeure' ? 'rounded-carte-majeure' : 'rounded-carte',
        // Padding : 20 px au minimum sur mobile, 24 a 34 sur desktop.
        'p-5 desktop:p-8',
        ombre ? 'shadow-carte' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
