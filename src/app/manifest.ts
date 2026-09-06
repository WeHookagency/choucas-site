import type { MetadataRoute } from 'next';

/**
 * Manifeste d'application.
 *
 * Le site n'est pas une application installable et n'ambitionne pas de
 * l'etre : le manifeste sert ici a une seule chose, donner une icone et une
 * couleur de barre corrects quand quelqu'un pose le site sur son ecran
 * d'accueil ou l'ouvre depuis un raccourci.
 *
 * Les deux tuiles sont des PNG et non le SVG : `manifest.icons` ne garantit
 * le rendu du vectoriel sur aucune plateforme, et Android attend 192 et 512.
 * Elles sont rasterisees depuis `public/choucas-icon-pwa.svg`, qui reste la
 * source.
 *
 * Les couleurs sont celles de la marque, pas les tokens du site — le §
 * « Les trois couleurs » de references/marque-choucas.md l'explique : un logo
 * qui derive avec le theme n'est plus un logo.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Choucas',
    short_name: 'Choucas',
    description: 'Logiciel opérationnel pour conciergeries alpines.',
    lang: 'fr',
    start_url: '/fr',
    display: 'standalone',
    background_color: '#263F30',
    theme_color: '#263F30',
    icons: [
      { src: '/choucas-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/choucas-icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/choucas-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
