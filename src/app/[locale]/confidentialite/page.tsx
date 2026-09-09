import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BlocLegal, PageLegale } from '@/components/legal/PageLegale';
import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/**
 * Les blocs de la page, dans l'ordre de lecture.
 *
 * `conservation` entre le 9 septembre 2026. Il parle des fiches de
 * l'application, pas du site : la duree de trois ans apres le dernier sejour
 * est une decision produit, arretee dans la specification des trois memoires.
 *
 * ⚠️ Les donnees que ce site collecte lui-meme — le rendez-vous Calendly, le
 * courriel de la page Contact — n'ont toujours aucune duree annoncee. Le RGPD
 * en demande une. Elle reste a arbitrer.
 */
const BLOCS = ['traitement', 'sousTraitant', 'conservation', 'droits', 'absence'] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'confidentialite' });

  return {
    title: t('titre'),
    description: t('metaDescription'),
    alternates: localeAlternates('/confidentialite', locale),
    robots: { index: false, follow: true },
  };
}

export default async function Confidentialite({
  params,
}: PageProps<'/[locale]/confidentialite'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('confidentialite');

  return (
    <PageLegale titre={t('titre')}>
      {BLOCS.map((cle) => (
        <BlocLegal key={cle} titre={t(`${cle}Titre`)}>
          <p>{t(`${cle}Texte`)}</p>
        </BlocLegal>
      ))}
    </PageLegale>
  );
}
