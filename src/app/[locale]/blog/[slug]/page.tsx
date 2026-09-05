import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Section } from '@/components/ui/Section';
import { articles, trouverArticle } from '@/content/articles';
import { localeAlternates, siteUrl } from '@/i18n/metadata';
import { getPathname, Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => articles.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const article = trouverArticle(slug);
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t(`articles.${article.cle}.titre`),
    description: t(`articles.${article.cle}.chapeau`),
    alternates: localeAlternates({ pathname: '/blog/[slug]', params: { slug } }, locale),
    // ⚠️ La note n'a pas de corps : seuls son titre et son chapeau existent.
    // Une page aussi mince n'a rien a offrir a un lecteur venu d'un moteur.
    // A retirer le jour ou le texte arrive.
    robots: { index: false, follow: true },
  };
}

/**
 * Gabarit d'article.
 *
 * Il affiche ce qui existe — titre, date, chapeau — et rien de plus. Le corps
 * des notes n'est pas ecrit, et la maquette proposait a cet endroit une
 * citation attribuee a une responsable d'exploitation du Grand-Bornand que
 * personne n'a interrogee : les correctifs l'ecartent.
 *
 * Les donnees structurees `Article` sont completes de ce qu'on sait, sans
 * `articleBody` : declarer un corps absent tromperait le moteur autant que le
 * lecteur.
 */
export default async function Page({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const article = trouverArticle(slug);
  if (!article) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('blog');
  const titre = t(`articles.${article.cle}.titre`);
  const chapeau = t(`articles.${article.cle}.chapeau`);

  const donneesStructurees = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: titre,
    description: chapeau,
    datePublished: article.date,
    inLanguage: locale,
    mainEntityOfPage: new URL(
      getPathname({ href: { pathname: '/blog/[slug]', params: { slug } }, locale }),
      siteUrl,
    ).toString(),
    publisher: { '@type': 'Organization', name: 'Choucas' },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
      />

      <Section fond="fond" aria-labelledby="article-titre">
        <p className="text-micro text-encre-douce">
          <Link href="/blog" className="text-lien underline underline-offset-4">
            {t('retour')}
          </Link>
        </p>

        {/* Mesure de lecture de 720 px : c'est la contrainte du gabarit
            editorial, elle prime sur la largeur du conteneur. */}
        <article className="mt-8 max-w-[720px]">
          <p className="text-micro text-encre-douce">
            <time dateTime={article.date}>{t(`articles.${article.cle}.dateLisible`)}</time>
          </p>
          <h1 id="article-titre" className="font-serif text-h2 mt-4 text-balance">
            {titre}
          </h1>
          <p className="text-intro mt-8 text-encre-douce">{chapeau}</p>
        </article>
      </Section>
    </main>
  );
}
