import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BlocLegal, PageLegale } from '@/components/legal/PageLegale';
import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'mentions' });

  return {
    title: t('titre'),
    description: t('metaDescription'),
    alternates: localeAlternates('/mentions-legales', locale),
    // Une page legale n'a rien a faire dans les resultats de recherche.
    robots: { index: false, follow: true },
  };
}

export default async function MentionsLegales({
  params,
}: PageProps<'/[locale]/mentions-legales'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('mentions');

  return (
    <PageLegale titre={t('titre')}>
      <BlocLegal titre={t('editeurTitre')}>
        <p>{t('editeurNom')}</p>
        <p>{t('editeurAdresse')}</p>
        <p>{t('editeurSiret')}</p>
        {/* Mention obligatoire en franchise en base : l'editeur ne facture pas
            de TVA. Elle est aussi affichee sous les prix, dans `tarifs`. */}
        <p>{t('editeurTva')}</p>
        {/* Le telephone et le courriel sont les deux seules cibles cliquables
            de la page, et ce sont celles qu'on touche sur un telephone. Elles
            mesuraient 19 px de haut. Le remplissage vertical d'un element en
            ligne agrandit la boite sensible sans toucher a l'interligne :
            c'est le remede employe partout ailleurs sur le site. */}
        <p>
          <a
            href={`tel:${t('editeurTelephone').replace(/\s/g, '')}`}
            className="inline-flex min-h-11 items-center"
          >
            {t('editeurTelephone')}
          </a>
        </p>
        <p>
          <a href={`mailto:${t('editeurEmail')}`} className="inline-flex min-h-11 items-center">
            {t('editeurEmail')}
          </a>
        </p>
        <p className="pt-2">
          {t('directeurLabel')} : {t('directeurNom')}
        </p>
      </BlocLegal>

      {/* ---------------------------------------------------------------
          PROPRIETE INTELLECTUELLE, ajoutee le 19 septembre 2026 a la demande
          du fondateur. Elle n'est pas imposee par la LCEN — c'est un ajout
          volontaire — et elle est ecrite en trois temps parce qu'une clause
          d'un seul tenant aurait ete fausse.

          ⚠️ LE SITE NE POSSEDE PAS TOUT CE QU'IL AFFICHE. La formule courante
          — « l'ensemble des contenus de ce site est la propriete de… » — ne
          tient pas ici : un des fichiers du depot s'appelle litteralement
          `Unsplash.jpg`. Revendiquer la propriete d'une photographie sous
          licence tierce, dans le document ou l'on engage son nom, est
          exactement le genre d'affirmation qu'on ne veut pas y mettre.

          Le second paragraphe le dit donc, sans nommer les fichiers : ce qui
          est vrai aujourd'hui doit rester vrai quand les images changeront.

          LE TROISIEME N'EST PAS DE LA POLITESSE. Phosphor est sous licence
          MIT, qui demande que la mention de droit d'auteur accompagne le
          logiciel ; Newsreader et Manrope sont sous SIL Open Font License.
          Les citer est la facon la plus simple d'honorer ces licences sur un
          site qui les embarque.
          --------------------------------------------------------------- */}
      <BlocLegal titre={t('proprieteTitre')}>
        <p>{t('proprieteMarque')}</p>
        <p className="pt-2">{t('proprietePhotos')}</p>
        <p className="pt-2">{t('proprieteLibre')}</p>
      </BlocLegal>

      <BlocLegal titre={t('hebergeurTitre')}>
        <p>{t('hebergeurNom')}</p>
        <p>{t('hebergeurAdresse')}</p>
        {/* La LCEN demande le telephone de l'hebergeur. Netlify n'en publie
            aucun — verifie sur ses pages /contact, /legal et /dpa — on donne
            donc le moyen de le joindre qui existe, et on dit pourquoi. */}
        <p className="pt-2">{t('hebergeurContact')}</p>
      </BlocLegal>
    </PageLegale>
  );
}
