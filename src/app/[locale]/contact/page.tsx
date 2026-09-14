import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CourbesNiveau } from '@/components/contact/CourbesNiveau';
import { Suspense } from 'react';

import { FormulaireContact } from '@/components/contact/FormulaireContact';
import { Accent } from '@/components/ui/Accent';
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
      {/* PAGE CENTREE, 15 septembre 2026. Tout y etait cale a gauche : le
          titre tenait dans 16ch et l'intro dans 62ch, sur une colonne de
          1 200 — le reste, plus de la moitie de la page, etait du vide d'un
          seul cote. Le formulaire, lui, etait plafonne a 720 px SANS `mx-auto`,
          donc colle au bord gauche.

          C'est le meme defaut que « Qui est derriere » et le point de
          jonction : une mesure de texte dans une piste qui ne la connait pas.
          Ici il se corrige en centrant, parce qu'une page de contact n'a rien
          a poser a cote de son formulaire. */}
      <Section fond="fond" aria-labelledby="contact-titre">
        <h1
          id="contact-titre"
          className="font-serif text-h2 mx-auto max-w-[16ch] text-center text-balance"
        >
          {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
        </h1>
        <p className="text-intro mx-auto mt-6 max-w-[62ch] text-center text-encre-douce">
          {t('intro')}
        </p>

        {/* Les deux voies annoncees avant le formulaire — « Voie principale,
            une journee sur site » et « Voie secondaire, poser une question » —
            sont retirees le 14 septembre 2026. Le formulaire porte deja sa
            bascule de voie : les annoncer au-dessus les disait deux fois.

            Les chaines `contact.voies.*` restent, et elles servent ailleurs :
            `voies.impl.action` libelle des boutons sur trois pages, et
            `voies.impl.texte` ferme la page Produit. */}
      </Section>

      <Section fond="fond-alt">
        <Reveal className="mx-auto max-w-[720px]">
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

      {/* Neige et non Sapin. La section touchait le pied de page, lui aussi en
          Sapin : les deux se lisaient comme un seul pave sombre, sans couture
          visible. Schiste n'aurait rien change — il ne differe du Sapin que de
          1,63:1, et le fichier du pied documente deja ce probleme.

          Passer en clair est la seule vraie rupture. Les chiffres reprennent
          le cuivre standard, 3,52:1 sur Neige et 34 px au minimum, donc au
          dessus du seuil des titres ; le texte revient en encre pleine. */}
      <Section fond="fond" className="relative overflow-hidden" aria-labelledby="apres-titre">
        <CourbesNiveau />
        <Reveal className="relative flex flex-col items-center">
          <FiletAccent />
          <h2
            id="apres-titre"
            className="font-serif text-h3 mt-6 max-w-[20ch] text-center text-balance"
          >
            {t('apres.titre')}
          </h2>

          {/* Le chiffre a cote du texte, sur sa ligne de base — pas au-dessus.
              Empiles, les trois etapes se lisaient comme trois piles lachees
              dans des colonnes de 405 px pour une a deux lignes de texte : le
              chiffre et sa phrase ne formaient pas une unite. C'est le
              traitement que Produit et BriefIntake emploient deja pour un
              chiffre suivi de son libelle. */}
          {/* La liste se centre en bloc ; chaque temps garde son alignement a
              gauche. Un chiffre de 52 px centre au-dessus d'une phrase de deux
              lignes ne forme plus une unite avec elle — c'est precisement le
              defaut corrige ici le 13 septembre en posant le chiffre sur la
              ligne de base du texte. */}
          <ol className="mt-titre mx-auto grid w-full max-w-[1000px] gap-8 desktop:grid-cols-3">
            {ETAPES.map((cle, i) => (
              <li
                key={cle}
                className="flex items-baseline gap-4 border-t border-filet pt-6"
              >
                <span
                  aria-hidden
                  className="font-serif shrink-0 text-[2.125rem] leading-none tabular-nums text-accent desktop:text-[3.25rem]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-intro">{t(`apres.etapes.${cle}`)}</p>
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
