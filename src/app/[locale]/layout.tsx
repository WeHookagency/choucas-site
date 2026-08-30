import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { manrope, newsreader } from '@/fonts';
import { siteUrl } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';
import '@/styles/globals.css';

/**
 * Layout racine. Il vit sous `[locale]` : la langue est donc un « root
 * parameter » au sens de Next 16, lisible depuis n'importe quel composant
 * serveur via `next/root-params` sans la faire descendre en props.
 */

/** Pre-rend une page par langue servie. Le registre fournit la liste. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    // Rend absolues les URL relatives des canonical et des hreflang.
    metadataBase: siteUrl,
    title: {
      default: t('title'),
      // Le gabarit est traduit lui aussi : l'ordre des mots et le tiret ne
      // sont pas les memes dans toutes les langues. `%s` traverse ICU comme
      // un texte ordinaire et Next le remplace ensuite par le titre de page.
      template: t('titleTemplate', { page: '%s' }),
    },
    description: t('description'),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  // Une langue hors registre — /de, /pt tant qu'il n'est pas active — n'a pas
  // de traductions : mieux vaut un 404 qu'un rendu a moitie vide.
  if (!hasLocale(routing.locales, locale)) notFound();

  // Autorise le rendu statique : sans cela la page bascule en dynamique des
  // qu'une traduction est lue.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${newsreader.variable} ${manrope.variable}`}>
      <body className="bg-fond text-encre">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
