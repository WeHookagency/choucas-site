import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ListeFaq, type EntreeFaq } from '@/components/faq/ListeFaq';
import { SommaireFaq } from '@/components/faq/SommaireFaq';
import { Cta } from '@/components/ui/Cta';
import { Reveal } from '@/components/ui/Reveal';
import { Section, surplombs } from '@/components/ui/Section';
import { groupesFaq } from '@/content/faq';
import { localeAlternates } from '@/i18n/metadata';
import { versVoie } from '@/components/anchors';
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

  const t = await getTranslations({ locale, namespace: 'faq' });

  return {
    title: t('titre'),
    description: t('metaDescription'),
    alternates: localeAlternates('/faq', locale),
  };
}

/**
 * Page FAQ.
 *
 * Son travail n'est pas d'expliquer le produit mais de lever les objections
 * qui bloquent une signature : c'est la derniere page lue avant de prendre
 * rendez-vous. D'ou trois refus assumes, dont l'absence d'offre solo.
 *
 * Le contenu vient de `content/faq.ts`, partage avec la section de la Home.
 * Les donnees structurees `FAQPage` sont ici et nulle part ailleurs : les
 * dupliquer sur la Home ferait ignorer l'une des deux.
 *
 * Deux entrees de la maquette ne sont pas publiees, leur reponse n'etant pas
 * arbitree — voir `questionsNonArbitrees`.
 */
export default async function Page({ params }: PageProps<'/[locale]/faq'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('faq');

  const groupes = groupesFaq.map((groupe) => ({
    id: groupe.id,
    libelle: t(`groupes.${groupe.id}.label`),
    titre: t(`groupes.${groupe.id}.titre`),
    entrees: groupe.questions.map(
      (cle): EntreeFaq => ({
        id: cle,
        q: t(`questions.${cle}.q`),
        r: t(`questions.${cle}.r`),
      }),
    ),
  }));

  const donneesStructurees = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groupes.flatMap((groupe) =>
      groupe.entrees.map((entree) => ({
        '@type': 'Question',
        name: entree.q,
        acceptedAnswer: { '@type': 'Answer', text: entree.r },
      })),
    ),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // Chaine construite ici, sans entree utilisateur : rien a echapper
        // au-dela de ce que fait `JSON.stringify`.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
      />

      {/* Le titre, son chapeau et la grille partagent le meme axe. En centrant
          la grille seule, je l'avais decrochee de son titre : le H1 restait sur
          la marge de la section et la grille commencait 188 px plus loin. Un
          titre qui ne s'aligne plus sur ce qu'il titre est un defaut plus
          visible que le vide qu'on venait de combler.

          C'est la lecon du premier passage : cette sonde trouve des trous, elle
          ne dit pas comment les fermer, et les fermer un par un en deplace. Le
          plafond se pose donc sur le bloc entier. */}
      <Section fond="fond" aria-labelledby="faq-titre">
        <div className="mx-auto max-w-[984px]">
        <h1 id="faq-titre" className="font-serif text-h2 max-w-[16ch] text-balance">
          {t('titre')}
        </h1>
        <p className="text-intro mt-6 max-w-[60ch] text-encre-douce">{t('intro')}</p>

        {/* Le sommaire structure la page ; aucune alternance de fond entre les
            groupes ne vient s'y ajouter.

            Plafonnee a 984 et centree : 200 de sommaire, 64 d'ecart, 720 de
            questions. La piste faisait 1 360 et la grille s'arretait a 1 060 —
            296 px de vide a droite a 1440, parce que la colonne de questions
            est plafonnee a 720 et que le `1fr` lui en offrait 1 096. */}
        <div className="mt-titre grid gap-10 desktop:grid-cols-[200px_minmax(0,1fr)] desktop:gap-16">
          <SommaireFaq
            entrees={groupes.map(({ id, libelle }) => ({ id, libelle }))}
            titre={t('sommaireTitre')}
            aria-label={t('sommaireAria')}
          />

          <div className="flex max-w-[720px] flex-col gap-14">
            {groupes.map((groupe) => (
              <Reveal
                as="section"
                key={groupe.id}
                id={groupe.id}
                aria-labelledby={`faq-${groupe.id}`}
                // Meme table que les sections de plein format : une seule
                // marge d'ancre pour tout le site.
                className={surplombs.entete}
              >
                <h2 id={`faq-${groupe.id}`} className="font-serif text-h3">
                  {groupe.titre}
                </h2>
                <ListeFaq
                  entrees={groupe.entrees}
                  idBase={`faq-${groupe.id}`}
                  className="mt-6"
                />
              </Reveal>
            ))}
          </div>
        </div>
        </div>
      </Section>

      <Section fond="fond-alt" aria-labelledby="faq-cloture">
        <Reveal>
          <h2 id="faq-cloture" className="font-serif text-h3 text-balance">
          {t('clotureTitre')}
          </h2>
          <p className="text-intro mt-4 max-w-[60ch] text-encre-douce">{t('clotureTexte')}</p>
        {/* Le chemin est resolu ici : le CTA rend une ancre nue, il ne connait
            pas la langue courante. */}
          <Cta href={versVoie(getPathname({ href: '/contact', locale }), 'question')} variante="secondaire" className="mt-8">
            {t('clotureCta')}
          </Cta>
        </Reveal>
      </Section>
    </main>
  );
}
