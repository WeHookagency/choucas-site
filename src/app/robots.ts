import type { MetadataRoute } from 'next';

import { siteUrl } from '@/i18n/metadata';

/**
 * robots.txt.
 *
 * Ecrit pour la production, pas pour le pre-lancement. Ce n'est pas une
 * negligence : robots.txt n'est pas un mecanisme de protection. Il demande
 * poliment aux robots bien eleves de s'abstenir, et ne cache rien a personne
 * — le fichier lui-meme est public et designe justement ce qu'on voulait
 * taire. Ce qui garde le site hors des index aujourd'hui, c'est le 401 de
 * Netlify et l'en-tete `X-Robots-Tag: noindex, nofollow, noarchive` pose sur
 * `/*` dans netlify.toml. Les deux tiennent sans lui, et tiendront encore si
 * le mot de passe tombe avant l'ouverture.
 *
 * Le blog est le seul refus : ses quatre notes n'ont qu'un titre, un chapeau
 * et une date. Elles sont deja en `noindex` et hors du plan du site — le
 * `disallow` dit la meme chose une troisieme fois, a ceux qui ne lisent que
 * ce fichier. A lever le jour ou les articles ont un corps, en meme temps que
 * les deux autres.
 *
 * `/_next/` et les routes d'images n'ont pas a etre interdits : Google a
 * besoin des ressources d'une page pour la rendre, et les lui refuser degrade
 * l'evaluation de la page elle-meme.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/fr/blog', '/en/blog'],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: new URL(siteUrl).host,
  };
}
