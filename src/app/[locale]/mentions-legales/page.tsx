import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BlocLegal, PageLegale } from '@/components/legal/PageLegale';
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

  const t = await getTranslations({ locale, namespace: 'mentions' });

  return {
    title: t('titre'),
    description: t('metaDescription'),
    alternates: localeAlternates('/mentions-legales', locale),
    // Une page legale n'a rien a faire dans les resultats de recherche.
    robots: { index: false, follow: true },
  };
}

export default async function MentionsLegales({
  params,
}: PageProps<'/[locale]/mentions-legales'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('mentions');

  return (
    <PageLegale titre={t('titre')}>
      <BlocLegal titre={t('editeurTitre')}>
        <p>{t('editeurNom')}</p>
        <p>{t('editeurAdresse')}</p>
        <p>{t('editeurSiret')}</p>
        <p>
          <a href={`tel:${t('editeurTelephone').replace(/\s/g, '')}`}>
            {t('editeurTelephone')}
          </a>
        </p>
        <p>
          <a href={`mailto:${t('editeurEmail')}`}>{t('editeurEmail')}</a>
        </p>
        <p className="pt-2">
          {t('directeurLabel')} : {t('directeurNom')}
        </p>
      </BlocLegal>

      <BlocLegal titre={t('hebergeurTitre')}>
        <p>{t('hebergeurNom')}</p>
        <p>{t('hebergeurAdresse')}</p>
      </BlocLegal>
    </PageLegale>
  );
}
