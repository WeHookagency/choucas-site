import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CourbesNiveau } from '@/components/contact/CourbesNiveau';
import { DESTINATION_FORMULAIRE } from '@/components/contact/destination';
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

          <ol className="mt-titre grid gap-8 desktop:grid-cols-3">
            {ETAPES.map((cle, i) => (
              <li key={cle} className="flex flex-col gap-4 border-t border-encre-inverse/20 pt-6">
                <span
                  aria-hidden
                  className="font-serif text-[2.125rem] leading-none tabular-nums text-numero-inverse desktop:text-[3.25rem]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-intro text-encre-inverse">{t(`apres.etapes.${cle}`)}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section fond="fond">
        <Reveal className="flex flex-col gap-3 border-t border-filet pt-8 tablette:flex-row tablette:items-baseline tablette:justify-between">
          {/* Le lien est enveloppe pour rester en ligne : element de flex, il
              serait blocifie, et son rembourrage deplacerait ses voisins.
              En ligne, le rembourrage agrandit la seule zone cliquable. */}
          <p>
            <a
              href={`mailto:${DESTINATION_FORMULAIRE}`}
              className="text-corps py-3.5 text-lien underline underline-offset-4"
            >
              {DESTINATION_FORMULAIRE}
            </a>
          </p>
          <p className="text-corps text-encre-douce">{t('zone')}</p>
        </Reveal>
      </Section>
    </main>
  );
}
