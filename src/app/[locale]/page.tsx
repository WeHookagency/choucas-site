import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Hero } from '@/components/home/Hero';
import { BriefToProof } from '@/components/home/BriefToProof';
import { DayInChoucas } from '@/components/home/DayInChoucas';
import { FieldDemo } from '@/components/home/FieldDemo';
import { FinalCta } from '@/components/home/FinalCta';
import { Hospitality } from '@/components/home/Hospitality';
import { ManagerDemo } from '@/components/home/ManagerDemo';
import { OperationalTension } from '@/components/home/OperationalTension';
import { Profiles } from '@/components/home/Profiles';
import { ReadyState } from '@/components/home/ReadyState';
import { WhyChoucas } from '@/components/home/WhyChoucas';
import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/**
 * Homepage.
 *
 * L'en-tete et le pied de page vivent ici plutot que dans le layout : le site
 * n'a qu'une page pour l'instant, et le layout porte le routage, les polices
 * et les metadonnees. Ils remonteront d'un cran quand une deuxieme page
 * arrivera.
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
    <>
      <SiteHeader />

      <main>
        <Hero />
        <ManagerDemo />
        <FieldDemo />
        <OperationalTension />
        <BriefToProof />
        <ReadyState />
        <Hospitality />
        <WhyChoucas />
        <DayInChoucas />
        <Profiles />
        <FinalCta />
      </main>

      <SiteFooter />
    </>
  );
}
