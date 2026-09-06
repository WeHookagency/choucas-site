import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Cta } from '@/components/ui/Cta';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { articles } from '@/content/articles';
import { localeAlternates } from '@/i18n/metadata';
import { getPathname, Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'blog' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    // Le titre d'onglet vient de la table des pages, comme partout ailleurs.
    title: tPages('blog.titre'),
    description: t('intro'),
    // Meme refus que les notes qu'elle liste : cet index ne mene qu'a des
    // pages sans corps, toutes en `noindex`. `follow` reste vrai — les liens
    // internes vers le reste du site gardent leur valeur. A lever avec le
    // `noindex` des notes, et en remettant la route au plan du site.
    robots: { index: false, follow: true },
    alternates: localeAlternates('/blog', locale),
  };
}

/**
 * Index des notes d'exploitation.
 *
 * Le blog n'entre pas dans la navigation : le backlog le conditionne a trois
 * articles reellement ecrits, et il n'en existe aujourd'hui aucun — seulement
 * des titres, des chapeaux et des dates.
 *
 * Aucun titre colore : les correctifs en font la page la moins decoree du
 * site.
 */
export default async function Page({ params }: PageProps<'/[locale]/blog'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('blog');
  const enAvant = articles.find((a) => a.enAvant);
  const suite = articles.filter((a) => !a.enAvant);

  return (
    <main>
      <Section fond="fond" aria-labelledby="blog-titre">
        <h1 id="blog-titre" className="font-serif text-h2 max-w-[12ch] text-balance">
          {t('titre')}
        </h1>
        <p className="text-intro mt-6 max-w-[62ch] text-encre-douce">{t('intro')}</p>

        {enAvant ? (
          <Reveal as="article" className="mt-titre max-w-[820px] border-t border-filet pt-8">
            <p className="text-micro text-encre-douce">
              {t(`articles.${enAvant.cle}.dateLisible`)} · {t('dureeEnAvant')}
            </p>
            <h2 className="font-serif text-h3 mt-3 text-balance">
              {/* Meme `py-2` que les titres de la liste : sur une seule ligne
                  le lien mesurait 33 px de haut, sous la cible de 44. Le
                  remplissage vertical d'un element en ligne agrandit la boite
                  sensible sans toucher a l'interligne. */}
              <Link
                  href={{ pathname: '/blog/[slug]', params: { slug: enAvant.slug } }}
                  className="py-2 no-underline hover:underline"
                >
                {t(`articles.${enAvant.cle}.titre`)}
              </Link>
            </h2>
            <p className="text-corps mt-4 max-w-[65ch] text-encre-douce">
              {t(`articles.${enAvant.cle}.chapeau`)}
            </p>
          </Reveal>
        ) : null}
      </Section>

      <Section fond="fond-alt" aria-label={t('listeAria')}>
        <Reveal as="ul" group className="max-w-[820px]">
          {suite.map((article) => (
            <li key={article.slug} className="border-t border-filet py-8">
              <p className="text-micro text-encre-douce">
                {t(`articles.${article.cle}.dateLisible`)}
              </p>
              <h2 className="font-serif text-h3 mt-3 text-balance">
                <Link
                  href={{ pathname: '/blog/[slug]', params: { slug: article.slug } }}
                  className="py-2 no-underline hover:underline"
                >
                  {t(`articles.${article.cle}.titre`)}
                </Link>
              </h2>
              <p className="text-corps mt-3 max-w-[65ch] text-encre-douce">
                {t(`articles.${article.cle}.chapeau`)}
              </p>
            </li>
          ))}
        </Reveal>

        <Cta
          href={getPathname({ href: '/contact', locale })}
          variante="secondaire"
          className="mt-titre"
        >
          {(await getTranslations('contact'))('voies.question.titre')}
        </Cta>
      </Section>
    </main>
  );
}
