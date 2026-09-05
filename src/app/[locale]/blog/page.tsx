import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Cta } from '@/components/ui/Cta';
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

  return {
    title: t('titre'),
    description: t('intro'),
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
          <article className="mt-titre max-w-[820px] border-t border-filet pt-8">
            <p className="text-micro text-encre-douce">
              {t(`articles.${enAvant.cle}.dateLisible`)} · {t('dureeEnAvant')}
            </p>
            <h2 className="font-serif text-h3 mt-3 text-balance">
              <Link
                  href={{ pathname: '/blog/[slug]', params: { slug: enAvant.slug } }}
                  className="no-underline hover:underline"
                >
                {t(`articles.${enAvant.cle}.titre`)}
              </Link>
            </h2>
            <p className="text-corps mt-4 max-w-[65ch] text-encre-douce">
              {t(`articles.${enAvant.cle}.chapeau`)}
            </p>
          </article>
        ) : null}
      </Section>

      <Section fond="fond-alt" aria-label={t('listeAria')}>
        <ul className="max-w-[820px]">
          {suite.map((article) => (
            <li key={article.slug} className="border-t border-filet py-8">
              <p className="text-micro text-encre-douce">
                {t(`articles.${article.cle}.dateLisible`)}
              </p>
              <h2 className="font-serif text-h3 mt-3 text-balance">
                <Link
                  href={{ pathname: '/blog/[slug]', params: { slug: article.slug } }}
                  className="no-underline hover:underline"
                >
                  {t(`articles.${article.cle}.titre`)}
                </Link>
              </h2>
              <p className="text-corps mt-3 max-w-[65ch] text-encre-douce">
                {t(`articles.${article.cle}.chapeau`)}
              </p>
            </li>
          ))}
        </ul>

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
