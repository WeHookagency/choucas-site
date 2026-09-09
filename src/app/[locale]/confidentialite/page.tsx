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
 * `rendezVous` et `traitement` sont separes le 9 septembre 2026. Un seul bloc
 * portait les deux, et sa premiere phrase disait desormais « le site ne
 * recueille aucune donnee par lui-meme » alors que son titre annoncait « la
 * seule donnee que ce site collecte ». Deux traitements distincts, deux blocs :
 * la prise de rendez-vous passe par Google Calendar et y recueille quelque
 * chose ; le formulaire, lui, n'envoie rien depuis ce site.
 *
 * `conservation` entre le 9 septembre 2026 et couvre les deux traitements,
 * chacun avec sa duree et sa raison :
 *
 *   - ce que le site collecte — le rendez-vous, les messages de la page
 *     Contact — trois ans a compter du dernier echange. C'est de la
 *     prospection, et trois ans en est la duree retenue.
 *   - les fiches de l'application — trois ans apres le dernier sejour. Meme
 *     chiffre, autre raison : la finalite n'est pas de prospecter mais de
 *     mieux servir quelqu'un qui revient.
 *
 * Le meme chiffre pour deux raisons differentes se defend ; le meme
 * raisonnement pour deux finalites differentes, non. D'ou les deux phrases.
 */
const BLOCS = ['rendezVous', 'traitement', 'sousTraitant', 'conservation', 'droits', 'absence'] as const;

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
