import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * Le plugin indique a next-intl ou trouver la configuration de requete —
 * celle qui charge le bon fichier de traductions. Sans lui, les APIs serveur
 * de next-intl ne savent pas quelle langue est demandee.
 */
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /**
   * Redirection de l'anglais, desactive le 3 septembre 2026.
   *
   * Sans elle, `/en` n'est plus une langue connue : le proxy le prendrait
   * pour un chemin et l'enverrait sur `/fr/en`, qui n'existe pas. Les
   * redirections de `next.config` s'appliquent avant le proxy, celle-ci
   * intercepte donc les trois URL anglaises qui ont existe.
   *
   * Temporaire, jamais permanente : l'anglais doit revenir, et un 308 mis en
   * cache par les navigateurs survivrait a sa reactivation.
   *
   * A supprimer d'un bloc le jour ou 'en' rejoint `locales`.
   */
  async redirects() {
    return [
      { source: '/en', destination: '/fr', permanent: false },
      { source: '/en/legal-notice', destination: '/fr/mentions-legales', permanent: false },
      { source: '/en/privacy-policy', destination: '/fr/confidentialite', permanent: false },
      { source: '/en/:chemin*', destination: '/fr', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
