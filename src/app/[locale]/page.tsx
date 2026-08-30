import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/**
 * Page d'accueil — ossature seulement.
 *
 * Un titre nu, le temps de verifier que le routage, les traductions, les
 * polices et les tokens sont bien branches. Les sections de la homepage
 * arrivent dans un lot separe.
 */

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return {
    // Canonical et hreflang derives de la table des slugs : chaque langue
    // servie obtient sa balise, plus un x-default vers la langue par defaut.
    alternates: localeAlternates('/', locale),
  };
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations('home');

  return (
    <main className="mx-auto flex min-h-dvh max-w-contenu flex-col justify-center px-marge">
      <h1 className="font-serif text-hero max-w-[16ch] text-balance">{t('title')}</h1>
      <p className="text-label mt-titre uppercase text-encre-douce">{locale}</p>
    </main>
  );
}
