import type { ReactNode } from 'react';

/**
 * Surtitre de section.
 *
 * Le motif existait deja, disperse dans `SectionHeader` et dans plusieurs
 * sections de la Home. Il est rassemble ici pour que les pages du site le
 * partagent.
 *
 * En encre douce et non en cuivre : le handoff pose ses eyebrows en cuivre,
 * mais a 11-12 px le cuivre mesure 3,52:1 sur Neige — sous le seuil du texte
 * courant. Le handoff le reconnait d'ailleurs lui-meme : « jamais sur un
 * eyebrow ». Voir CORRESPONDANCE-TOKENS-HANDOFF.md.
 */
export function Eyebrow({
  children,
  inverse = false,
  className,
}: {
  children: ReactNode;
  /** Sur fond sombre, l'encre s'inverse. */
  inverse?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-label font-semibold uppercase ${
        inverse ? 'text-encre-inverse/75' : 'text-encre-douce'
      } ${className ?? ''}`}
    >
      {children}
    </p>
  );
}
