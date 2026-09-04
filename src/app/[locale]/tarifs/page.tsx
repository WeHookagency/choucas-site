import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageTitre } from '@/components/ui/PageTitre';
import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: t('tarifs.titre'),
    alternates: localeAlternates('/tarifs', locale),
    // Page sans contenu tant que son lot T2 n'est pas ouvert.
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }: PageProps<'/[locale]/tarifs'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('pages');

  return <PageTitre titre={t('tarifs.titre')} />;
}
