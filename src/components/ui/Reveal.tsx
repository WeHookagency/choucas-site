'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

import styles from './Reveal.module.css';

type RevealProps = {
  children: ReactNode;
  /** Balise rendue. `div` par defaut ; passer `section`, `li`, `figure`… */
  as?: ElementType;
  /** Decale l'apparition des enfants directs de 90 ms chacun (brief V7). */
  group?: boolean;
  className?: string;
};

/**
 * Fait apparaitre son contenu a l'entree dans le viewport.
 *
 * Le HTML rendu par le serveur est deja visible : c'est le montage cote
 * client qui masque puis revele. Sans JavaScript, la page se lit donc
 * entierement — un reveal qui echoue ne peut pas laisser une section vide.
 *
 * Un bloc deja lisible au montage n'est jamais masque : cela evite le
 * clignotement au premier paint, et le hero du §6.2 ne doit de toute facon
 * porter aucune animation.
 *
 * A poser sur des blocs internes — un en-tete, une carte, un panneau — plutot
 * que sur une section pleine hauteur : le seuil de 25 % du brief ne peut pas
 * etre atteint par un element beaucoup plus haut que la fenetre.
 */
export function Reveal({ children, as: Tag = 'div', group, className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<'ouvert' | 'masque' | 'revele'>('ouvert');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Deja sous les yeux du visiteur : on laisse tel quel.
    const { top, height } = el.getBoundingClientRect();
    if (top < window.innerHeight * 0.9) return;

    setPhase('masque');

    // Un element plus haut que la fenetre ne peut jamais couvrir 25 % de
    // lui-meme ; on abaisse le seuil a ce qu'il peut reellement atteindre.
    const threshold = height > 0 ? Math.min(0.25, (window.innerHeight / height) * 0.5) : 0.25;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setPhase('revele');
          io.unobserve(entry.target);
        }
      },
      { threshold },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const classes = [
    styles.animated,
    phase === 'masque' ? styles.hidden : '',
    group ? styles.group : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
