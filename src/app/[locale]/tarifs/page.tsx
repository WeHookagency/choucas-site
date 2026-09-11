import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Cta } from '@/components/ui/Cta';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { localeAlternates } from '@/i18n/metadata';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'tarifs' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: tPages('tarifs.titre'),
    description: t('intro'),
    alternates: localeAlternates('/tarifs', locale),
  };
}

/**
 * Tarifs — modele du 11 septembre 2026 : un demarrage, puis un abonnement.
 *
 * La page precedente vendait une implantation a 2 490 € puis un abonnement en
 * cinq paliers de biens actifs. Ce modele n'existe plus : le demarrage passe a
 * 2 000 €, l'abonnement devient lineaire — 20 € par bien et par mois, minimum
 * 300 € — et deux etages s'ajoutent, les options et ce qui est en
 * construction.
 *
 * Sept sections, un H1, un H2 chacune, aucun H3 : c'est la contrainte posee.
 * Les options et les briques a venir sont donc des paragraphes a intitule en
 * gras, pas des titres — un niveau de titre pour une ligne de prix
 * encombrerait la navigation au clavier sans rien structurer.
 *
 * Les fonds alternent, avec une seule bande sombre : « Pouvez-vous tester
 * avant ? » est la section qui leve l'objection la plus chere, elle prend le
 * poids que le Sapin lui donne. Suite des fonds : Neige, Panneau, Neige,
 * Sapin, Neige, Panneau, Neige.
 *
 * ⚠️ Trois reponses de la FAQ decrivent encore l'ancien modele et le
 * contredisent — voir le message du commit. Elles ne sont pas sur cette page,
 * mais elles parlent d'elle.
 */
export default async function Page({ params }: PageProps<'/[locale]/tarifs'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('tarifs');
  const contact = await getTranslations('contact');

  return (
    <main>
      <Section fond="fond" aria-labelledby="tarifs-titre">
        <h1 id="tarifs-titre" className="font-serif text-h2">
          {t('titre')}
        </h1>
        <p className="text-intro mt-8 max-w-[62ch] font-semibold">{t('chapeau')}</p>
        <p className="text-intro mt-4 max-w-[62ch] text-encre-douce">{t('intro')}</p>
      </Section>

      <Section fond="fond-alt" aria-labelledby="demarrage-titre">
        <Reveal className="max-w-[62ch]">
          <h2 id="demarrage-titre" className="font-serif text-h3 text-balance">
            {t('demarrageTitre')}
          </h2>
          <p className="text-corps mt-6">{t('demarrageP1')}</p>
          <p className="text-corps mt-4 text-encre-douce">{t('demarrageP2')}</p>
        </Reveal>
      </Section>

      <Section fond="fond" aria-labelledby="abonnement-titre">
        <Reveal className="max-w-[62ch]">
          <h2 id="abonnement-titre" className="font-serif text-h3 text-balance">
            {t('abonnementTitre')}
          </h2>
          {/* Le plancher se detache du reste : c'est le chiffre qu'une petite
              conciergerie cherche en premier, et le seul que la formule au
              bien ne donne pas. */}
          <p className="text-intro mt-6 font-semibold">{t('abonnementMinimum')}</p>
          <p className="text-corps mt-4">{t('abonnementExemples')}</p>
          <p className="text-corps mt-4 text-encre-douce">{t('abonnementSocle')}</p>
        </Reveal>
      </Section>

      {/* Fond Sapin : c'est la section qui leve l'objection la plus chere — on
          ne s'engage pas a l'aveugle. Elle merite d'etre vue en defilant. */}
      <Section fond="sapin" aria-labelledby="test-titre">
        <Reveal className="max-w-[62ch]">
          <h2 id="test-titre" className="font-serif text-h3 text-balance">
            {t('testTitre')}
          </h2>
          <p className="text-intro mt-6 font-semibold">{t('testP1')}</p>
          <p className="text-corps mt-4 text-encre-inverse/85">{t('testP2')}</p>
          <p className="text-corps mt-4 text-encre-inverse/85">{t('testP3')}</p>
        </Reveal>
      </Section>

      <Section fond="fond" aria-labelledby="options-titre">
        <Reveal className="max-w-[62ch]">
          <h2 id="options-titre" className="font-serif text-h3 text-balance">
            {t('optionsTitre')}
          </h2>
          <p className="text-corps mt-6 text-encre-douce">{t('optionsIntro')}</p>
          {/* Intitule en gras et non en h3 : la contrainte de la page est un
              seul niveau de titre par section. */}
          <p className="text-corps mt-titre">
            <strong className="font-bold">{t('optionsRapportNom')}</strong>{' '}
            {t('optionsRapportTexte')}
          </p>
        </Reveal>
      </Section>

      <Section fond="fond-alt" aria-labelledby="arrive-titre">
        <Reveal className="max-w-[62ch]">
          <h2 id="arrive-titre" className="font-serif text-h3 text-balance">
            {t('arriveTitre')}
          </h2>
          <p className="text-corps mt-6 text-encre-douce">{t('arriveIntro')}</p>
          <p className="text-corps mt-titre">
            <strong className="font-bold">{t('arriveMemoireNom')}</strong>{' '}
            {t('arriveMemoireTexte')}
          </p>
          <p className="text-corps mt-5">
            <strong className="font-bold">{t('arriveLitigeNom')}</strong>{' '}
            {t('arriveLitigeTexte')}
          </p>
        </Reveal>
      </Section>

      <Section fond="fond" aria-labelledby="paiement-titre">
        <Reveal className="max-w-[62ch]">
          <h2 id="paiement-titre" className="font-serif text-h3 text-balance">
            {t('paiementTitre')}
          </h2>
          <p className="text-corps mt-6">{t('paiementTexte')}</p>

          {/* Le lexique des CTA est fige : « Organiser une journée sur site »
              est le libelle de la voie principale de la page Contact, et c'est
              vers elle que ce bouton mene. */}
          <Cta href={getPathname({ href: '/contact', locale })} fleche className="mt-titre">
            {contact('voies.impl.action')}
          </Cta>

          <p className="text-micro mt-titre text-encre-douce">{t('htMention')}</p>
        </Reveal>
      </Section>
    </main>
  );
}
