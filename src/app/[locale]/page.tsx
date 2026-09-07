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
import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/**
 * Homepage.
 *
 * `Profiles` est dereference comme l'ont ete `OperationalTension`,
 * `Hospitality`, `WhyChoucas` et `DayInChoucas` a la passe V8 : le fichier et
 * ses cles de traduction restent en place, seule la ligne de rendu disparait.
 * La FAQ retrouve ainsi la place que son brief lui donnait — avant-derniere
 * section, immediatement suivie du CTA final.
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
      <FieldDemo />
      <BriefToProof />
      {/* ReadyState et CtaIntermediaire retires le 7 septembre 2026.
          BriefToProof, juste au-dessus, mene deja du brief au PRET et a la
          preuve : la section PRET redisait son aboutissement. Les deux
          fichiers et leurs cles de traduction restent en place — les
          remonter ici suffit.

          ⚠️ Ce qui part avec ReadyState : la seule formulation de la Home qui
          enonce la regle du double controle — « la personne qui controle
          n'est pas celle qui a execute ». Elle tient toujours sur /solutions
          et dans la FAQ, plus sur la Home. */}
      <OwnerReport />
      {/* Philosophy — « Une autre façon de piloter » — retirée le 6 septembre
          2026. Le fichier et ses clés de traduction restent en place : la
          remonter ici suffit. Elle portait l'ancre `a-propos`, que rien ne
          visait. Attention à la couture : sans elle, OwnerReport, Implantation
          et FaqHome s'enchaînent sur trois fonds Neige identiques. */}
      <Implementation />
      <FaqHome />
      <FinalCta />
    </main>
  );
}
