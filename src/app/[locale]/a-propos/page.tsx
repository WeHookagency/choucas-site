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
 * La photographie n'existe pas. Sa place est reservee aux rapports de la
 * maquette — 1440/560 en desktop, 390/300 en mobile — sans rien inventer.
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
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 id="apropos-titre" className="font-serif text-h2 mt-4 max-w-[18ch] text-balance">
          {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
        </h1>
        <p className="text-intro mt-8 max-w-[62ch] text-encre-douce">{t('intro')}</p>
        <p className="text-intro mt-4 max-w-[62ch] font-semibold">{t('suite')}</p>
      </Section>

      <Section fond="fond" sansRythme>
        {/* Portrait au rapport 4:5, recadré sur le visage et le haut des
            épaules. Il remplace la réserve paysage du handoff : celle-ci
            attendait un matin d'exploitation, cette page montre désormais
            quelqu'un. */}
        <Reveal>
          <Photo src="/demo/mathieu.jpg" alt={t('portraitAlt')} className="max-w-[460px]" />
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
