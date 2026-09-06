import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Accent } from '@/components/ui/Accent';
import { Cta } from '@/components/ui/Cta';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Photo } from '@/components/ui/Photo';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { localeAlternates } from '@/i18n/metadata';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/** Les quatre refus, dans l'ordre de la maquette. */
const PARTIS = ['pms', 'personnes', 'envoi', 'reseau'] as const;

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
