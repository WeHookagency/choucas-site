import type { CSSProperties, ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  /** `forte` = carte de transformation ou de profil : bordure 2 px, §7.
   *  `aucun` = la carte ne pose ni fond ni bordure : c'est l'appelant qui les
   *  porte, quand une section fait varier ses tuiles au lieu de les repeter. */
  accent?: 'standard' | 'forte' | 'sapin' | 'lichen' | 'aucun';
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
  // Le Lichen n'accepte qu'une encre : la pleine, a 6,57:1. L'encre douce y
  // tombe a 2,34:1 et le cuivre a 1,45:1 — ni l'une ni l'autre n'y ont leur
  // place. La bordure est en encre a 20 % : 3,43:1 contre la Neige de la
  // section, au-dessus du seuil des objets graphiques, la ou le filet du site
  // n'aurait donne que 1,93:1 sur le Lichen lui-meme.
  lichen: 'bg-respiration text-encre border border-encre/20',
  aucun: '',
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
