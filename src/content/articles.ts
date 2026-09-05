/**
 * Les notes d'exploitation, source unique de l'index et des articles.
 *
 * ⚠️ Les donnees ne contiennent que des titres, des chapeaux et des dates :
 * aucun corps d'article n'existe. Le gabarit est construit, la page d'article
 * n'affiche donc que ce qui est reellement ecrit, et reste en `noindex` tant
 * qu'elle n'a rien a offrir a un lecteur venu d'un moteur.
 *
 * Le blog n'entre pas dans la navigation : le backlog le conditionne a trois
 * articles reels.
 *
 * `date` est en ISO pour les donnees structurees ; `dateLisible` est la forme
 * affichee, telle que la maquette l'ecrit.
 */

export type Article = {
  /** Segment d'URL. Stable : le renommer casse un lien. */
  slug: string;
  /** Cle sous `blog.articles`. */
  cle: string;
  date: string;
  /** En avant sur l'index. Un seul article a la fois. */
  enAvant: boolean;
};

export const articles = [
  { slug: 'samedi-de-rotation', cle: 'rotation', date: '2026-03-14', enAvant: true },
  { slug: 'termine-ne-veut-rien-dire', cle: 'termine', date: '2026-02-02', enAvant: false },
  { slug: 'brief-quatre-canaux', cle: 'canaux', date: '2026-01-12', enAvant: false },
  { slug: 'travailler-sans-reseau', cle: 'reseau', date: '2025-12-18', enAvant: false },
] as const satisfies readonly Article[];

export function trouverArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
