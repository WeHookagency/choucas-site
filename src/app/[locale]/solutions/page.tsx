import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import accueilResponsable from '../../../../public/demo/accueil-responsable.png';
import blocExceptions from '../../../../public/demo/bloc-exceptions.png';
import carteMaintenant from '../../../../public/demo/carte-maintenant.png';

import { ATTRS_DEMO, LIEN_DEMO } from '@/components/anchors';
import { PointJonction } from '@/components/solutions/PointJonction';
import { TroisMetiers } from '@/components/solutions/TroisMetiers';
import { VoletRole } from '@/components/solutions/VoletRole';
import { BarreSection } from '@/components/ui/BarreSection';
import { Cta } from '@/components/ui/Cta';
import { Section } from '@/components/ui/Section';
import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/** L'ordre des volets, et celui des pastilles de la barre. */
const ROLES = ['dirigeants', 'exploitation', 'terrain'] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'solutions' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: tPages('solutions.titre'),
    description: t('intro'),
    alternates: localeAlternates('/solutions', locale),
  };
}

/**
 * Solutions — le produit vu par trois roles metier.
 *
 * Une regle produit gouverne toute la page : seuls le Manager et le Terrain
 * ouvrent l'application. Le dirigeant de conciergerie en est un
 * beneficiaire — son volet s'ecrit donc au registre du benefice, jamais de
 * l'usage. Aucune phrase ne lui attribue une action dans l'outil.
 *
 * Le proprietaire du bien n'apparait nulle part : il n'utilise pas Choucas,
 * il recoit un rapport.
 *
 * Les trois captures produit n'existent pas encore. Leur place est reservee
 * aux dimensions de la maquette, sans rien dessiner dedans.
 */
export default async function Page({ params }: PageProps<'/[locale]/solutions'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('solutions');
  const actions = await getTranslations('actions');
  // Les deux captures existent deja sur la Home ; leur description aussi. On
  // la relit plutot que de la recopier.
  const manager = await getTranslations('manager');
  const terrain = await getTranslations('terrain');

  return (
    <main>
      <Section fond="fond" aria-labelledby="solutions-titre">
        <h1 id="solutions-titre" className="font-serif text-h2 max-w-[16ch] text-balance">
          {/* Sans accent : le §0.4 des correctifs n'autorise qu'un titre
              colore par page, et sur Solutions il revient au point de
              jonction. */}
          {t.rich('titre', { accent: (chunks) => <>{chunks}</> })}
        </h1>
        <p className="text-intro mt-6 max-w-[62ch] text-encre-douce">{t('intro')}</p>
      </Section>

      <BarreSection
        entrees={ROLES.map((role) => ({ id: role, libelle: t(`${role}.label`) }))}
        aria-label={t('barreAria')}
      />

      <TroisMetiers />

      {/* Fond Lichen. Le titre y reste en encre pleine : le cuivre mesure
          1,45:1 sur ce fond, la moitie du titre y disparaitrait. */}
      <VoletRole
        id="dirigeants"
        fond="respiration"
        eyebrow={t('dirigeants.eyebrow')}
        titre={t('dirigeants.titre')}
        legende={t('dirigeants.legende')}
        capture={blocExceptions}
        captureAlt={manager('captureAlt')}
        libelleLien={manager('lienDemo')}
      >
        <p className="text-corps">{t('dirigeants.corps')}</p>
        <p className="text-corps">
          <strong className="font-bold">{t('dirigeants.eviteLabel')} : </strong>
          {t('dirigeants.evite')}
        </p>
      </VoletRole>

      <VoletRole
        id="exploitation"
        fond="fond"
        ecranAGauche
        eyebrow={t('exploitation.eyebrow')}
        titre={t('exploitation.titre')}
        legende={t('exploitation.legende')}
        capture={accueilResponsable}
        captureAlt={t('exploitation.captureAlt')}
        libelleLien={manager('lienDemo')}
      >
        <p className="text-corps text-encre-douce">{t('exploitation.lead')}</p>
        <p className="text-corps">{t('exploitation.liste')}</p>
      </VoletRole>

      <VoletRole
        id="terrain"
        fond="respiration"
        eyebrow={t('terrain.eyebrow')}
        titre={t('terrain.titre')}
        legende={t('terrain.legende')}
        capture={carteMaintenant}
        captureAlt={terrain('captureAlt')}
        libelleLien={manager('lienDemo')}
      >
        <p className="text-corps">{t('terrain.lead')}</p>
        <p className="text-corps">{t('terrain.suite')}</p>
      </VoletRole>

      <PointJonction />

      <Section fond="fond-alt" aria-labelledby="solutions-cloture">
        <h2 id="solutions-cloture" className="font-serif text-h3 text-balance">
          {t('cloture.titre')}
        </h2>
        <p className="text-intro mt-4 max-w-[62ch] text-encre-douce">{t('cloture.texte')}</p>
        <Cta href={LIEN_DEMO} {...ATTRS_DEMO} fleche className="mt-8">
          {actions('demo')}
        </Cta>
      </Section>
    </main>
  );
}
