import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageTitre } from '@/components/ui/PageTitre';
import { routing } from '@/i18n/routing';

/**
 * Gabarit d'article — route declaree, contenu au lot T2.5.
 *
 * `generateStaticParams` ne rend rien : aucune source d'articles n'existe
 * encore. La route reste donc rendue a la demande, et le blog n'est pas
 * expose dans la navigation tant qu'il n'a pas de contenu reel.
 */
export function generateStaticParams(): { locale: string; slug: string }[] {
  return [];
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: t('article.titre'),
    robots: { index: false, follow: true },
  };
}

export default async function Article({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('pages');

  return <PageTitre titre={t('article.titre')} />;
}
