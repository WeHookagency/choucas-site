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
/**
 * L'ordre des sections, et il n'est pas decoratif : qui traite, sur quelle
 * base, par quels moyens, avec quels prestataires, combien de temps, quels
 * droits, et ce que le site ne fait pas.
 *
 * `responsable`, `base` et `cookies` ont ete ajoutees le 15 septembre 2026.
 * Les deux premieres sont exigees par l'article 13 du RGPD et manquaient ; la
 * troisieme repond a la question que tout le monde cherche sur cette page, et
 * la reponse est qu'il n'y a rien a chercher.
 */
/*
 * Trois blocs ajoutes ou repris le 19 septembre 2026.
 *
 * `perimetre` ouvre la page, avant meme le responsable : une politique qui
 * parle de deux traitements — les visiteurs du site d'un cote, les donnees du
 * produit de l'autre — doit dire lequel elle regit AVANT de dire qui en
 * repond. Elle melangeait les deux depuis le debut, et une conciergerie qui la
 * lisait pouvait croire que Choucas etait responsable de ses biens.
 *
 * `demonstration` suit `cookies`, parce qu'il repond a la question que
 * `cookies` laisse ouverte : le site ne charge aucun script tiers, SAUF si
 * vous cliquez pour lancer la demonstration. C'est la seule connexion
 * exterieure du site, mesuree — zero origine tierce sur les sept pages, une
 * apres ce clic — et elle ne figurait nulle part.
 *
 * `sousTraitant` est reecrit : il decrivait l'architecture d'avant
 * l'arbitrage du 19, ou les donnees du produit vivaient chez l'editeur. La FAQ
 * disait deja l'inverse. Deux documents publics qui se contredisent sur
 * l'hebergement, c'est ce qu'un acheteur prudent remarque en premier.
 */
const BLOCS = [
  'perimetre',
  'responsable',
  'base',
  'rendezVous',
  'traitement',
  'sousTraitant',
  'conservation',
  'cookies',
  'demonstration',
  'droits',
  'absence',
] as const;

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
