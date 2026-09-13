import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import accueilResponsable from '../../../../public/demo/accueil-responsable.png';
import blocExceptions from '../../../../public/demo/bloc-exceptions.png';

import { ATTRS_DEMO, LIEN_DEMO } from '@/components/anchors';
import { MemoireEntreprise } from '@/components/solutions/MemoireEntreprise';
import { PointJonction } from '@/components/solutions/PointJonction';
import { TroisMetiers } from '@/components/solutions/TroisMetiers';
import { VoletRole } from '@/components/solutions/VoletRole';
import { Cta } from '@/components/ui/Cta';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
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
/** Les trois blocs ajoutes au volet Exploitation, dans l'ordre du texte. */
const BLOCS_EXPLOITATION = ['entraide', 'mission', 'verification'] as const;

/**
 * Un point developpe a l'interieur d'un volet : son intitule, puis ce qu'il
 * change. Le titre du volet est un `h2`, ceux-ci sont donc des `h3` — la
 * hierarchie se lit au clavier autant qu'a l'oeil.
 *
 * Le bloc herite de l'encre du volet : sur Lichen tout est en encre pleine,
 * l'encre douce y tombe a 2,34:1.
 */
function BlocVolet({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="mt-2">
      <h3 className="font-serif text-intro font-semibold">{titre}</h3>
      <p className="text-corps mt-2">{texte}</p>
    </div>
  );
}

export default async function Page({ params }: PageProps<'/[locale]/solutions'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('solutions');
  const actions = await getTranslations('actions');
  // La capture du responsable existe deja sur la Home ; sa description aussi.
  // On la relit plutot que de la recopier. `terrain` partait avec le volet du
  // meme nom, retire le 13 septembre 2026.
  const manager = await getTranslations('manager');

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

      {/* Barre de section retiree le 13 septembre 2026. Elle listait les trois
          volets de role, et depuis la fusion des tarifs elle restait collee en
          haut sur huit sections qui ne la concernaient pas : le lecteur arrive
          au prix avec un sommaire qui designe trois blocs situes 4 000 px plus
          haut. Le composant `BarreSection` vit toujours dans le depot, ainsi
          que `solutions.barreAria` et les trois `label` au catalogue. */}
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
        {/* En tete de volet : le comptage avant l'analyse. Registre du
            benefice, comme l'exige la regle produit pour ce role — on dit ce
            que le dirigeant obtient, jamais ce qu'il fait dans l'application. */}
        <p className="font-serif text-intro">{t('dirigeants.leadTitre')}</p>
        <p className="text-corps">{t('dirigeants.leadTexte')}</p>
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
        {BLOCS_EXPLOITATION.map((cle) => (
          <BlocVolet
            key={cle}
            titre={t(`exploitation.blocs.${cle}.titre`)}
            texte={t(`exploitation.blocs.${cle}.texte`)}
          />
        ))}
      </VoletRole>

      {/* Volet Terrain retire le 13 septembre 2026. Il redisait ce que Produit
          decrit mieux, dans l'ordre : sa deuxieme phrase — « Une mission a la
          fois, en grand. » — etait mot pour mot `produit.mission.lead`.

          La repartition qui en decoule : Produit dit ce que le produit fait,
          etape par etape ; Solutions dit pour qui, quelle garantie, quel prix.

          Rien n'est supprime. `VoletRole` sert encore aux deux autres volets,
          `carte-maintenant.png` reste dans public/, et les chaines
          `solutions.terrain.*` restent au catalogue — les remettre ici suffit.

          ⚠️ « Trois metiers, une meme journee » nomme toujours trois roles et
          n'en detaille plus que deux. C'est assume : la colonne Terrain de
          cette section dit l'essentiel en une ligne, et le detail vit sur
          Produit. */}
      <PointJonction />

      <MemoireEntreprise />


      {/* Centree, comme la bande de cloture de la Home et celle de Produit.
          Elle etait calee a gauche : trois pages fermaient sur le meme geste
          et l'une des trois le posait ailleurs. */}
      <Section fond="fond-alt" aria-labelledby="solutions-cloture">
        <Reveal className="flex flex-col items-center text-center">
          <h2 id="solutions-cloture" className="font-serif text-h3 text-balance">
            {t('cloture.titre')}
          </h2>
          <p className="text-intro mt-4 max-w-[62ch] text-encre-douce">{t('cloture.texte')}</p>
          <Cta href={LIEN_DEMO} {...ATTRS_DEMO} fleche className="mt-8">
            {actions('demo')}
          </Cta>
        </Reveal>
      </Section>
    </main>
  );
}
