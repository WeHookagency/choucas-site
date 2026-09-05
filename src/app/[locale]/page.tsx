import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/home/Hero';
import { Implementation } from '@/components/home/Implementation';
import { BriefIntake } from '@/components/home/BriefIntake';
import { BriefToProof } from '@/components/home/BriefToProof';
import { FaqHome } from '@/components/home/FaqHome';
import { FieldDemo } from '@/components/home/FieldDemo';
import { FinalCta } from '@/components/home/FinalCta';
import { ManagerDemo } from '@/components/home/ManagerDemo';
import { OwnerReport } from '@/components/home/OwnerReport';
import { Philosophy } from '@/components/home/Philosophy';
import { Profiles } from '@/components/home/Profiles';
import { ReadyState } from '@/components/home/ReadyState';
import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/**
 * Homepage.
 *
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

  return (
    <main>
      <Hero />
      <ManagerDemo />
      <BriefIntake />
      <BriefToProof />
      <FieldDemo />
      <ReadyState />
      <OwnerReport />
      <Philosophy />
      <Implementation />
      <FaqHome />
      <Profiles />
      <FinalCta />
    </main>
  );
}
