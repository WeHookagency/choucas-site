import localFont from 'next/font/local';

/**
 * Polices du site, auto-hebergees.
 *
 * Les WOFF2 viennent de Google Fonts mais sont servis depuis notre domaine :
 * aucune requete vers un tiers au chargement d'une page, et un preload que
 * l'on maitrise. Chaque fichier est reduit au sous-ensemble latin, qui couvre
 * le francais, l'anglais et le portugais.
 *
 * Ce sont des fichiers variables, avec deux reglages qui pesent sur le poids :
 *
 * - l'axe optique de Newsreader (`opsz`) est fige a 16. Laisse variable, il
 *   faisait passer le fichier de 57 a 129 Ko pour un reglage que la charte
 *   n'utilise pas ;
 * - les plages de graisses sont limitees a celles de la charte — Newsreader
 *   400-500, Manrope 400-800. Toute graisse de cette plage est disponible sans
 *   un octet de plus ; en sortir demande de regenerer le fichier.
 *
 * Preload : les trois fichiers, soit 116 Ko. Le hero (§6.2 des specs web) pose
 * son titre en Newsreader romain et sa ligne d'accent en italique cuivre, la
 * navigation et le CTA sont en Manrope — tout est au-dessus de la ligne de
 * flottaison. Si le hero perd son italique, passer ce fichier dans une seconde
 * instance `localFont` en `preload: false` : le preload se regle par instance,
 * pas par fichier.
 */

export const newsreader = localFont({
  src: [
    { path: './Newsreader-latin.woff2', weight: '400 500', style: 'normal' },
    { path: './Newsreader-Italic-latin.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-newsreader',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});

export const manrope = localFont({
  src: [{ path: './Manrope-latin.woff2', weight: '400 800', style: 'normal' }],
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
