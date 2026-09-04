/**
 * Filet d'accent cuivre — motif du handoff, 40 x 2 px, 32 en mobile.
 *
 * Purement decoratif : il ouvre un titre de section sans rien dire. Le cuivre
 * y est a sa place, la regle du site ne l'interdit que pour du texte.
 */
export function FiletAccent({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block h-0.5 w-8 bg-accent tablette:w-10 ${className ?? ''}`}
    />
  );
}
