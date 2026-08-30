import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * Le plugin indique a next-intl ou trouver la configuration de requete —
 * celle qui charge le bon fichier de traductions. Sans lui, les APIs serveur
 * de next-intl ne savent pas quelle langue est demandee.
 */
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
