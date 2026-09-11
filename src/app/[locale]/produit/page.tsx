import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Cta } from '@/components/ui/Cta';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reserve } from '@/components/ui/Reserve';
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

  const t = await getTranslations({ locale, namespace: 'produit' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: tPages('produit.titre'),
    description: t('metaDescription'),
    alternates: localeAlternates('/produit', locale),
  };
}

/**
 * Les cinq sections illustrees, dans l'ordre d'une journee, puis le parcours
 * de l'imprevu. Le fond alterne et la bande sombre revient a l'etat PRET :
 * c'est la regle produit la plus dure a faire entendre, elle prend le poids
 * que le Sapin lui donne.
 *
 * Suite des fonds : Neige, Panneau, Neige, Panneau, Sapin, Neige, Panneau,
 * Neige — aucun repete d'une section a la suivante.
 */
const SECTIONS = [
  { cle: 'brief', fond: 'fond-alt', paras: ['brief.p1', 'brief.p2', 'brief.p3'] },
  { cle: 'mission', fond: 'fond', paras: ['mission.p1', 'mission.p2'] },
  { cle: 'controle', fond: 'fond-alt', paras: ['controle.p1', 'controle.p2'] },
  { cle: 'pret', fond: 'sapin', paras: ['pret.p1'] },
  {
    cle: 'imprevu',
    fond: 'fond',
    paras: ['imprevu.p1', 'imprevu.p2', 'imprevu.p3', 'imprevu.p4', 'imprevu.p5'],
  },
] as const;

// Les cles sont ecrites en entier, pas composees a la volee. Un produit
// cartesien `${cle}.${para}` fabriquerait `brief.p4`, qui n'existe pas — le
// typage des messages de next-intl l'a refuse, et il avait raison.

/**
 * Produit — reecriture du 11 septembre 2026.
 *
 * La page precedente ne couvrait qu'un seul parcours, le signalement
 * d'incident, sous un titre qui annoncait le produit entier. Elle couvre
 * maintenant les quatre piliers — le brief, la mission terrain, le double
 * controle, l'etat PRET — puis l'imprevu, puis ce que Choucas refuse de faire.
 *
 * Un H1, un H2 par section, aucun H3 : les phrases d'attaque de chaque section
 * sont donc des paragraphes en tete, pas des titres. Elles se lisent comme des
 * chapeaux, ce qu'elles sont.
 *
 * ⚠️ Les cinq ecrans n'existent pas. Ce sont des reserves dimensionnees, au
 * meme rapport et a la meme largeur que celles de la section memoire de
 * Solutions — 340/480, plafonnees a 340 px, teinte mousse. La capture attendue
 * fait donc 1036 px de large, recadree a ce rapport. Chaque reserve porte en
 * legende ce qu'elle montrera : une reserve muette ne se remplit jamais.
 *
 * Traitement visuel volontairement sobre : la passe UI viendra page par page.
 * La grille texte/ecran est celle que `VoletRole` emploie deja sur Solutions —
 * ce n'est pas un dessin neuf, c'est l'idiome du site, et il evite qu'une
 * reserve de 340 px reste seule sur une ligne de 1360.
 */
export default async function Page({ params }: PageProps<'/[locale]/produit'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('produit');

  return (
    <main>
      <Section fond="fond" aria-labelledby="produit-titre">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 id="produit-titre" className="font-serif text-h2 mt-4 max-w-[20ch] text-balance">
          {t('titre')}
        </h1>
        <p className="text-intro mt-8 max-w-[62ch] text-encre-douce">{t('intro')}</p>
      </Section>

      {SECTIONS.map(({ cle, fond, paras }) => {
        const sombre = fond === 'sapin';
        return (
          <Section key={cle} fond={fond} aria-labelledby={`${cle}-titre`}>
            <Reveal className="grid gap-10 desktop:grid-cols-[1fr_340px] desktop:gap-16">
              <div className="max-w-[62ch]">
                <h2 id={`${cle}-titre`} className="font-serif text-h3 text-balance">
                  {t(`${cle}.titre`)}
                </h2>
                {/* Phrase d'attaque en tete : c'est un chapeau, pas un titre —
                    la page n'autorise qu'un niveau de titre par section. */}
                <p className="text-intro mt-6 font-semibold">{t(`${cle}.lead`)}</p>
                {paras.map((para) => (
                  <p
                    key={para}
                    className={`text-corps mt-4 ${sombre ? 'text-encre-inverse/85' : 'text-encre-douce'}`}
                  >
                    {t(para)}
                  </p>
                ))}
              </div>

              <figure className="m-0 flex flex-col items-center gap-2 desktop:items-start">
                <Reserve ratio="340 / 480" largeurMax={340} teinte="mousse" />
                <figcaption
                  style={{ maxWidth: '340px' }}
                  className={`text-micro text-center ${sombre ? 'text-encre-inverse/85' : 'text-encre-douce'}`}
                >
                  {t(`${cle}.reserve`)}
                </figcaption>
              </figure>
            </Reveal>
          </Section>
        );
      })}

      <Section fond="fond-alt" aria-labelledby="refus-titre">
        <Reveal className="max-w-[62ch]">
          <h2 id="refus-titre" className="font-serif text-h3 text-balance">
            {t('refus.titre')}
          </h2>
          <p className="text-intro mt-6">{t('refus.texte')}</p>
        </Reveal>
      </Section>

      {/* Libelle propre a cette page. `actions.demo` sert la barre, le hero et
          le CTA final de la Home : le changer ici les aurait renommes tous. */}
      <Section fond="fond" aria-label={t('cta')}>
        <Reveal>
          <Cta href={getPathname({ href: '/contact', locale })} fleche>
            {t('cta')}
          </Cta>
        </Reveal>
      </Section>
    </main>
  );
}
