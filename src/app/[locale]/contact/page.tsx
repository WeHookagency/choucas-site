import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CourbesNiveau } from '@/components/contact/CourbesNiveau';
import { Suspense } from 'react';

import { FormulaireContact } from '@/components/contact/FormulaireContact';
import { Accent } from '@/components/ui/Accent';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { FiletAccent } from '@/components/ui/FiletAccent';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/** Les trois temps qui suivent l'envoi, dans l'ordre de la maquette. */
const ETAPES = ['reponse', 'appel', 'date'] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'contact' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: tPages('contact.titre'),
    description: t('intro'),
    alternates: localeAlternates('/contact', locale),
  };
}

/**
 * Contact — deux voies, un formulaire, et ce qui se passe ensuite.
 *
 * La soumission ouvre un brouillon dans le client de messagerie du visiteur.
 * Elle n'envoie rien : les consequences sont ecrites au-dessus de
 * `composerMailto`, et la page ne feint aucune confirmation.
 */
export default async function Page({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('contact');

  return (
    <main>
      <Section fond="fond" aria-labelledby="contact-titre">
        <h1 id="contact-titre" className="font-serif text-h2 max-w-[16ch] text-balance">
          {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
        </h1>
        <p className="text-intro mt-6 max-w-[62ch] text-encre-douce">{t('intro')}</p>

        {/* Les deux voies, annoncees avant le formulaire : le visiteur sait
            ce qu'il choisit avant de lire des champs. */}
        <Reveal as="ul" group className="mt-titre grid gap-6 tablette:grid-cols-2 desktop:max-w-[820px]">
          {(['impl', 'question'] as const).map((voie) => (
            <li key={voie} className="border-t border-filet pt-6">
              <Eyebrow>{t(`voies.${voie}.eyebrow`)}</Eyebrow>
              <h2 className="font-serif text-h3 mt-3">{t(`voies.${voie}.titre`)}</h2>
              <p className="text-corps mt-2 text-encre-douce">{t(`voies.${voie}.texte`)}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      <Section fond="fond-alt">
        <Reveal className="max-w-[720px]">
          {/* Le formulaire lit la voie dans l'URL, donc il rend cote client.
              La `Suspense` limite cette bascule a lui seul : le reste de la
              page reste prerendu et part dans le HTML initial. Le repli est
              vide — un squelette de formulaire clignoterait pour rien, il
              s'affiche en quelques millisecondes. */}
          <Suspense fallback={null}>
            <FormulaireContact />
          </Suspense>
        </Reveal>
      </Section>

      <Section fond="sapin" className="relative overflow-hidden" aria-labelledby="apres-titre">
        <CourbesNiveau />
        <Reveal className="relative">
          <FiletAccent />
          <h2 id="apres-titre" className="font-serif text-h3 mt-6 max-w-[20ch] text-balance">
            {t('apres.titre')}
          </h2>

          {/* Le chiffre a cote du texte, sur sa ligne de base — pas au-dessus.
              Empiles, les trois etapes se lisaient comme trois piles lachees
              dans des colonnes de 405 px pour une a deux lignes de texte : le
              chiffre et sa phrase ne formaient pas une unite. C'est le
              traitement que Produit et BriefIntake emploient deja pour un
              chiffre suivi de son libelle. */}
          <ol className="mt-titre grid gap-8 desktop:grid-cols-3">
            {ETAPES.map((cle, i) => (
              <li
                key={cle}
                className="flex items-baseline gap-4 border-t border-encre-inverse/20 pt-6"
              >
                <span
                  aria-hidden
                  className="font-serif shrink-0 text-[2.125rem] leading-none tabular-nums text-numero-inverse desktop:text-[3.25rem]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-intro text-encre-inverse">{t(`apres.etapes.${cle}`)}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* Bande adresse + zone d'intervention retiree le 13 septembre 2026, a
          la demande du fondateur. La page finit desormais sur « Ce qui se
          passe apres l'envoi », qui est sa derniere promesse.

          Rien n'est perdu : l'adresse reste servie par le formulaire lui-meme,
          en clair dans l'etat d'echec, et la chaine `contact.zone` reste au
          catalogue. */}
    </main>
  );
}
