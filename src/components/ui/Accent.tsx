import type { ReactNode } from 'react';

/**
 * Fragment de titre en cuivre italique — la signature editoriale de la marque.
 *
 * Reserve aux titres : le Cuivre mesure 3,52:1 sur Neige, conforme au seuil du
 * texte large (24 px, ou 19 px en gras) mais pas a celui du texte courant.
 * Les titres du site partent de 32 px, la limite est donc respectee.
 * Les specs le rappellent : jamais de cuivre sur un long paragraphe.
 */
export function Accent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <em className={`text-accent ${className ?? ''}`}>{children}</em>;
}
