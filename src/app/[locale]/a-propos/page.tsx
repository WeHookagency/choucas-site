import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Accent } from '@/components/ui/Accent';
import { Cta } from '@/components/ui/Cta';
import { Eyebrow } from '@/components/ui/Eyebrow';
import Image from 'next/image';

import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { localeAlternates } from '@/i18n/metadata';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/**
 * Les cinq refus. Les quatre premiers viennent de la maquette ; « sante »
 * entre le 9 septembre 2026, depuis la specification des trois memoires ou
 * c'est une decision arretee et non une omission.
 *
 * Il se place juste apres « on ne mesure pas les personnes » : les deux
 * refusent d'enregistrer quelque chose sur quelqu'un, et se lisent en paire.
 */
const PARTIS = ['pms', 'personnes', 'sante', 'envoi', 'reseau'] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'aPropos' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: tPages('aPropos.titre'),
    description: t('suite'),
    alternates: localeAlternates('/a-propos', locale),
  };
}

/**
 * A propos — d'ou vient Choucas, et ce qu'il refuse de faire.
 *
 * La page tient sur le §19 des contenus et sur les quatre partis pris, seuls
 * elements valides a l'iteration 2. Le reste de la maquette etait invente.
 *
 * Le bloc des refus est une liste a filets, pas une grille de cartes : les
 * correctifs le designent comme le bloc le plus credible de la page pour
 * l'audience visee, et c'est ce traitement-la qui le rend credible.
 *
 * Le portrait bascule une seule fois, au seuil `desktop` (1000 px) :
 * empile et centre sous le chapeau en dessous, colonne de droite au-dessus.
 * Entre les deux il n'existe pas de largeur ou il soit cale d'un cote avec
 * la moitie de la colonne vide — c'etait le defaut du plafond fixe.
 *
 * Il ne s'anime pas : la regle d'apparition du site (Reveal, point 1) exempte
 * le bloc qui porte le H1, et le portrait en fait desormais partie. Il est
 * `prioritaire` pour la meme raison — il est au-dessus de la ligne.
 *
 * Le bandeau qui suit reprend le rapport de la reserve d'origine — 1440/560
 * en desktop, 390/300 en mobile — et repond au surtitre : la page dit « Concu
 * dans les Alpes », le bandeau les montre. Il s'anime, lui : il est sous la
 * ligne et hors du bloc du H1.
 */
export default async function Page({ params }: PageProps<'/[locale]/a-propos'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('aPropos');
  const actions = await getTranslations('contact');

  return (
    <main>
      <Section fond="fond" aria-labelledby="apropos-titre">
        <div className="desktop:flex desktop:items-start desktop:gap-12 large:gap-16">
          <div className="desktop:min-w-0 desktop:flex-1">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <h1 id="apropos-titre" className="font-serif text-h2 mt-4 max-w-[18ch] text-balance">
              {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
            </h1>
            <p className="text-intro mt-8 max-w-[62ch] text-encre-douce">{t('intro')}</p>
            <p className="text-intro mt-4 max-w-[62ch] font-semibold">{t('suite')}</p>
          </div>

          {/* Portrait au rapport 4:5, recadré sur le visage et le haut des
              épaules. Il remplace la réserve paysage du handoff, qui attendait
              un matin d'exploitation : la page montre désormais quelqu'un.

              Empilé, il est centré et plafonné — un trou symétrique se lit
              comme une marge, un trou d'un seul côté comme un oubli. À partir
              de 1000 px il passe en colonne et le plafond tombe : la colonne
              elle-même le mesure. */}
          <Photo
            src="/demo/mathieu.jpg"
            alt={t('portraitAlt')}
            prioritaire
            className="mx-auto mt-10 max-w-[520px] desktop:mx-0 desktop:mt-0 desktop:w-[34%] desktop:max-w-[420px] desktop:shrink-0"
          />
        </div>
      </Section>

      {/* Le recit d'origine, entre le bandeau et les refus.
          Il arrive apres le lieu et avant les partis pris : le hero pose la
          these, le bandeau montre l'endroit, ce recit dit d'ou vient le
          produit, les refus disent ce qu'on a choisi de ne pas en faire, et
          « Terrain d'origine » referme. Deplacer la section, c'est deplacer
          ce bloc — il ne depend de rien autour de lui.

          Fond Sapin : le bandeau au-dessus et les refus en dessous sont en
          Neige et en Panneau. Une bande sombre evite trois fonds clairs a la
          suite, et donne au recit le poids d'un morceau a part. */}
      <Section fond="sapin" aria-labelledby="recit-titre">
        <Reveal className="mx-auto max-w-[62ch]">
          <h2 id="recit-titre" className="font-serif text-h3 text-balance">
            {t('recit.titre')}
          </h2>
          {/* Encre a 85 % pour le recit, 9,81:1 en pleine encre pour la
              chute : elle porte la raison d'etre du produit, elle ne peut pas
              etre le texte le moins lisible du bloc. */}
          <div className="text-corps mt-8 flex flex-col gap-5 text-encre-inverse/85">
            <p>{t('recit.p1')}</p>
            <p>{t('recit.p2')}</p>
            <p>{t('recit.p3')}</p>
          </div>
          <p className="text-intro mt-8 font-semibold text-encre-inverse">{t('recit.chute')}</p>
        </Reveal>
      </Section>

      {/* Second bloc d'origine, juste apres le recit. Fond Neige : le recit
          au-dessus est en Sapin, les refus en dessous en Panneau. La suite de
          la page devient Neige, Neige, Sapin, Neige, Panneau, Neige — aucun
          fond repete d'une section a la suivante. */}
      <Section fond="fond" aria-labelledby="coup-de-feu-titre">
        <Reveal className="mx-auto max-w-[62ch]">
          <h2 id="coup-de-feu-titre" className="font-serif text-h3 text-balance">
            {t('coupDeFeu.titre')}
          </h2>
          <p className="text-corps mt-8 text-encre-douce">{t('coupDeFeu.p1')}</p>
          {/* Meme traitement que la chute du recit : les deux blocs finissent
              sur ce que Choucas en a tire, et se repondent a l'oeil. */}
          <p className="text-intro mt-8 font-semibold">{t('coupDeFeu.chute')}</p>
        </Reveal>
      </Section>

      {/* Trois blocs ajoutes le 11 septembre 2026, entre les deux recits
          d'origine et les refus. Ils disent qui tient le produit, ou il en
          est, et ce sur quoi on peut compter — les trois questions qu'un
          prospect pose a un editeur qu'il ne connait pas. */}
      <Section fond="fond-alt" aria-labelledby="qui-titre">
        <Reveal className="mx-auto max-w-[62ch]">
          <h2 id="qui-titre" className="font-serif text-h3 text-balance">
            {t('qui.titre')}
          </h2>
          <p className="text-intro mt-6 font-semibold">{t('qui.lead')}</p>
          <p className="text-corps mt-5 text-encre-douce">{t('qui.p1')}</p>
          <p className="text-corps mt-4 text-encre-douce">{t('qui.p2')}</p>
        </Reveal>
      </Section>

      <Section fond="fond" aria-labelledby="etat-titre">
        <Reveal className="mx-auto max-w-[62ch]">
          <h2 id="etat-titre" className="font-serif text-h3 text-balance">
            {t('etat.titre')}
          </h2>
          <p className="text-intro mt-6 font-semibold">{t('etat.lead')}</p>
          <p className="text-corps mt-5 text-encre-douce">{t('etat.p1')}</p>
          <p className="text-corps mt-4 text-encre-douce">{t('etat.p2')}</p>
          <p className="text-corps mt-4">{t('etat.p3')}</p>
        </Reveal>
      </Section>

      {/* Fond Sapin, comme le recit : c'est un engagement, pas une
          description. Le samedi est la journee ou un outil qui lache ne se
          rattrape pas — la section doit se voir en defilant. */}
      <Section fond="sapin" aria-labelledby="samedi-titre">
        <Reveal className="mx-auto max-w-[62ch]">
          <h2 id="samedi-titre" className="font-serif text-h3 text-balance">
            {t('samedi.titre')}
          </h2>
          <p className="text-intro mt-6 font-semibold">{t('samedi.lead')}</p>
          <p className="text-corps mt-5 text-encre-inverse/85">{t('samedi.p1')}</p>
        </Reveal>
      </Section>

      <Section fond="fond-alt" aria-labelledby="partis-titre">
        <Reveal>
          <h2 id="partis-titre" className="font-serif text-h3 max-w-[20ch] text-balance">
            {t('partisTitre')}
          </h2>
        </Reveal>

        <Reveal as="ul" group className="mt-titre max-w-[820px]">
          {PARTIS.map((cle) => (
            <li key={cle} className="flex gap-4 border-t border-filet py-7">
              <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
              <div>
                <p className="text-intro font-semibold">{t(`partis.${cle}.titre`)}</p>
                <p className="text-corps mt-2 text-encre-douce">{t(`partis.${cle}.texte`)}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </Section>

      <Section fond="fond" sansRythme>
        {/* Pleine largeur, sans legende — il n'en existe pas et on n'en
            invente pas. La source fait 1026 px de large : dans la colonne a
            1440 elle est agrandie d'un tiers, ramollissement accepte plutot
            que de plafonner un bandeau qui doit traverser la colonne.

            Descendu ici le 11 septembre 2026. Entre le hero et le recit, il
            coupait la page avant son seul contenu. Il partage volontairement
            le fond Neige de « Terrain d'origine » qui le suit : l'image et la
            cloture se lisent comme un seul mouvement de fin. */}
        <Reveal className="relative aspect-[390/300] overflow-hidden rounded-carte desktop:aspect-[1440/560]">
          {/* `sizes` annonce les largeurs reellement rendues : 1280 au
              plafond de la colonne, sinon la fenetre moins ses marges.
              « 100vw » faisait demander une variante de 1920 px pour une
              source de 1026 — Next l'agrandissait avant de la servir. */}
          <Image
            src="/demo/hiver-sapins.jpg"
            alt={t('bandeauAlt')}
            fill
            sizes="(min-width: 1440px) 1280px, (min-width: 1000px) calc(100vw - 96px), calc(100vw - 36px)"
            className="object-cover"
          />
        </Reveal>
      </Section>

      <Section fond="fond" aria-labelledby="terrain-origine">
        <Reveal>
          <h2 id="terrain-origine" className="font-serif text-h3">
            {t('terrainTitre')}
          </h2>
          <p className="font-serif text-intro mt-6">{t('stations')}</p>
          <p className="font-serif text-h3 mt-titre max-w-[24ch] text-balance">{t('cloture')}</p>
          <Cta href={getPathname({ href: '/contact', locale })} variante="secondaire" className="mt-8">
            {actions('voies.question.titre')}
          </Cta>
        </Reveal>
      </Section>
    </main>
  );
}
