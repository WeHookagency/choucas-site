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
 *
 * Sur Lichen, l'encre douce tombe a 2,34:1 : il faut alors l'encre pleine,
 * qui y mesure 6,57:1. C'est le ton `encre`.
 */
const tons = {
  /** Fond clair : Neige, Glacier, Panneau. */
  douce: 'text-encre-douce',
  /** Fond Lichen, ou l'encre douce echoue. */
  encre: 'text-encre',
  /** Fond sombre : Schiste, Sapin. */
  inverse: 'text-encre-inverse/75',
} as const;

export function Eyebrow({
  children,
  ton = 'douce',
  className,
}: {
  children: ReactNode;
  /** Le fond decide : voir la table ci-dessus. */
  ton?: keyof typeof tons;
  className?: string;
}) {
  return (
    <p className={`text-label font-semibold uppercase ${tons[ton]} ${className ?? ''}`}>
      {children}
    </p>
  );
}
