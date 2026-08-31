import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { Icon } from './Icon';

type Variante = 'primaire' | 'secondaire';

type CommunProps = {
  children: ReactNode;
  variante?: Variante;
  /** Fleche de fin — presente sur le CTA primaire de la maquette. */
  fleche?: boolean;
  /** Pleine largeur : les specs l'exigent des que deux actions s'empilent. */
  pleineLargeur?: boolean;
  className?: string;
};

type CtaProps = CommunProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
  );

/*
 * Specs §7. Hauteur 48 px — au-dessus de la cible tactile de 44. Rayon
 * capsule, bordure 1 px jamais 2, ombre a decalage solide de 3 px plutot
 * qu'un flou seul.
 */
const base = [
  'inline-flex items-center justify-center gap-2',
  'h-12 px-5 rounded-capsule border',
  'text-bouton font-bold leading-none',
  'transition-[transform,box-shadow] duration-200 ease-choucas',
  'disabled:opacity-45 disabled:shadow-none disabled:cursor-not-allowed',
  'disabled:hover:translate-y-0',
].join(' ');

const variantes: Record<Variante, string> = {
  // Sapin sur Glacier : 10,61:1.
  primaire: [
    'bg-cta text-cta-encre border-cta',
    'shadow-cta',
    'hover:-translate-y-px hover:shadow-[0_4px_0_0_var(--web-cta-presse),0_8px_20px_-8px_rgb(21_24_22/0.4)]',
    'active:translate-y-0.5 active:shadow-[0_1px_0_0_var(--web-cta-presse)]',
  ].join(' '),

  // Meme hauteur et meme graisse que le primaire : les specs interdisent de
  // le rendre secondaire en le rapetissant.
  secondaire: [
    'bg-surface text-encre border-filet',
    'shadow-[0_3px_0_0_var(--web-filet)]',
    'hover:-translate-y-px hover:shadow-[0_4px_0_0_var(--web-filet)]',
    'active:translate-y-0.5 active:shadow-[0_1px_0_0_var(--web-filet)]',
  ].join(' '),
};

export function Cta({
  children,
  variante = 'primaire',
  fleche = false,
  pleineLargeur = false,
  className,
  href,
  ...props
}: CtaProps) {
  const classes = [
    base,
    variantes[variante],
    pleineLargeur ? 'w-full tablette:w-auto' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const contenu = (
    <>
      {children}
      {fleche ? <Icon name="fleche" size={20} /> : null}
    </>
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {contenu}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {contenu}
    </button>
  );
}
