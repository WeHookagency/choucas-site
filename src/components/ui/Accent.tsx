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
 */
export function Accent({
  children,
  /** Sur fond sombre. */
  inverse = false,
  className,
}: {
  children: ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <em className={`${inverse ? 'text-accent-inverse' : 'text-accent'} ${className ?? ''}`}>
      {children}
    </em>
  );
}
