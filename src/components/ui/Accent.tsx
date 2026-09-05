import type { ReactNode } from 'react';

/**
 * Fragment de titre en cuivre italique — la signature editoriale de la marque.
 *
 * Deux cuivres, selon le fond, et ils ne sont pas interchangeables :
 *
 * - fond clair : le Cuivre de la charte, 3,52:1 sur Neige. Conforme au seuil
 *   du texte large (24 px, ou 19 px en gras), pas a celui du texte courant.
 * - fond sombre : le cuivre eclairci, 7,56:1 sur Schiste et 4,64:1 sur Sapin,
 *   la ou le Cuivre standard tombe a 2,79 et disparait.
 *
 * L'inverse ne vaut jamais : l'eclairci mesure 2,11:1 sur Neige. Voir la
 * regle complete dans tokens.css.
 *
 * Sur Lichen, aucun des deux ne passe : le Cuivre y tombe a 1,45:1 et le
 * blanc que propose le handoff a 2,43:1. Le ton `encre` s'y emploie donc —
 * 6,57:1 — et l'accent ne tient plus que par l'italique. C'est la regle des
 * correctifs §0.6 : jamais de cuivre sur un fond mousse.
 */
const tons = {
  /** Fond clair : Neige, Glacier, Panneau. */
  accent: 'text-accent',
  /** Fond sombre : Schiste, Sapin. */
  inverse: 'text-accent-inverse',
  /** Fond Lichen : l'italique porte seul, sans couleur d'accent. */
  encre: 'text-encre',
} as const;

export function Accent({
  children,
  ton = 'accent',
  className,
}: {
  children: ReactNode;
  /** Le fond decide : voir la table ci-dessus. */
  ton?: keyof typeof tons;
  className?: string;
}) {
  return <em className={`${tons[ton]} ${className ?? ''}`}>{children}</em>;
}
