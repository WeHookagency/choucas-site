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
 * Plus aucun refus. Le blog a ete supprime le 14 septembre 2026 : ses quatre
 * notes n'ont jamais eu de corps, et une page orpheline qui n'existe plus n'a
 * pas besoin d'etre interdite.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: new URL(siteUrl).host,
  };
}
