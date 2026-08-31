import type { SVGProps } from 'react';

/**
 * Jeu d'icones du site — specs §7.
 *
 * SVG inline, viewBox 24, style outline, extremites et jointures arrondies,
 * epaisseur 1,7 px. Aucune dependance : quelques traces suffisent et evitent
 * une bibliotheque entiere pour huit formes.
 *
 * Decorative par defaut (`aria-hidden`). Une icone qui constitue le seul
 * contenu d'un bouton recoit un `title` : elle prend alors un nom accessible.
 */
const traces = {
  fleche: 'M5 12h14M13 6l6 6-6 6',
  coche: 'M4.5 12.5l4.8 4.8L19.5 7',
  menu: 'M4 7h16M4 12h16M4 17h16',
  fermer: 'M6 6l12 12M18 6L6 18',
  calendrier: 'M4 8h16M8 4v3M16 4v3M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  mission: 'M9 5h6M9 5a2 2 0 104 0M6 7H5a1 1 0 00-1 1v11a1 1 0 001 1h14a1 1 0 001-1V8a1 1 0 00-1-1h-1M8.5 13l2 2 4-4',
  bien: 'M4 10.5L12 4l8 6.5M6 9.5V20h12V9.5',
  equipe: 'M8 11a3 3 0 100-6 3 3 0 000 6zM3 20a5 5 0 0110 0M16 11.5a2.5 2.5 0 100-5M16.5 15c2.5 0 4.5 2 4.5 5',
  linge: 'M7 4h10l-1.5 3.5L18 20H6l2.5-12.5L7 4z',
  alerte: 'M12 8.5v5M12 17h.01M10.3 4.3L2.8 17.5A2 2 0 004.5 20.5h15a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z',
  horloge: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3.5 2',
} as const;

export type IconName = keyof typeof traces;

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  /** Taille en px. Echelle des specs : 16, 20, 24, 28, 32, 42. */
  size?: 16 | 20 | 24 | 28 | 32 | 42;
  /** Nom accessible. Sans lui l'icone est masquee aux lecteurs d'ecran. */
  title?: string;
};

export function Icon({ name, size = 24, title, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d={traces[name]} />
    </svg>
  );
}
