/**
 * Suivi de la section courante pendant le defilement.
 *
 * Deux composants s'en servent : la barre de section et le sommaire de la
 * FAQ. Ils partagent le meme piege, d'ou ce module plutot que deux copies.
 *
 * `IntersectionObserver` ne livre que les cibles dont l'etat a change. Quand
 * deux sections touchent la bande d'observation en meme temps — ce qui arrive
 * des que la bande est plus haute que l'espace entre deux titres — regarder
 * la seule livraison fait designer la derniere annoncee, pas la plus haute.
 * Le marqueur saute alors un cran, en avant ou en arriere selon la vitesse du
 * defilement.
 *
 * On tient donc l'etat de toutes les sections, et on designe toujours la
 * premiere dans l'ordre du document.
 */

export type ChangementSection = { id: string; visible: boolean };

export type SuiviSection = {
  /**
   * Applique une livraison d'observateur et rend la section active.
   *
   * `null` signifie qu'aucune section ne touche la bande : l'appelant garde
   * alors la precedente, sinon le marqueur clignoterait entre deux sections.
   */
  appliquer(changements: readonly ChangementSection[]): string | null;
  reinitialiser(): void;
};

export function creerSuiviSection(ordre: readonly string[]): SuiviSection {
  const vues = new Set<string>();

  return {
    appliquer(changements) {
      for (const changement of changements) {
        if (changement.visible) vues.add(changement.id);
        else vues.delete(changement.id);
      }
      return ordre.find((id) => vues.has(id)) ?? null;
    },
    reinitialiser() {
      vues.clear();
    },
  };
}
