import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ancres, ATTRS_DEMO, LIEN_DEMO } from '@/components/anchors';
import { Accent } from '@/components/ui/Accent';
import { Cta } from '@/components/ui/Cta';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { localeAlternates } from '@/i18n/metadata';
import { getPathname, Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/** Les quatre temps de l'incident, dans l'ordre du §10 des contenus. */
const ETAPES = ['signaler', 'remonter', 'transmettre', 'controle'] as const;

/** Les quatre autres moments du parcours, nommes et renvoyes, jamais redits. */
const PILIERS = ['brief', 'controle', 'pret', 'rapport'] as const;

/** Les pages qui portent le reste du produit. */
const AILLEURS = ['solutions', 'faq', 'tarifs'] as const;

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
    // `absolute` : le titre du §5 nomme deja Choucas, le gabarit
    // « {page} — Choucas » le repeterait.
    title: { absolute: tPages('produit.titre') },
    description: t('metaDescription'),
    alternates: localeAlternates('/produit', locale),
  };
}

/**
 * Produit — l'incident, et des renvois pour le reste.
 *
 * Le §5 des contenus decrit cinq etapes ; quatre sont deja racontees sur la
 * Home, souvent au mot pres. Cette page ne les redit pas : elle porte la
 * cinquieme, l'incident, qui n'existe nulle part ailleurs sur le site, et
 * elle renvoie pour les autres.
 *
 * Le bloc de renvoi ne nomme que les quatre piliers et pointe vers le
 * parcours de la Home. Aucune de leurs phrases n'est reprise ici : nommer
 * n'est pas redire.
 */
export default async function Page({ params }: PageProps<'/[locale]/produit'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('produit');
  const brief = await getTranslations('brief');
  const actions = await getTranslations('actions');
  const pages = await getTranslations('pages');

  return (
    <main>
      <Section fond="fond" aria-labelledby="produit-titre">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 id="produit-titre" className="font-serif text-h2 mt-4 max-w-[16ch] text-balance">
          {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
        </h1>
        <p className="text-intro mt-8 max-w-[62ch] text-encre-douce">{t('intro')}</p>
      </Section>

      <Section fond="fond-alt" aria-labelledby="produit-etapes">
        <h2 id="produit-etapes" className="sr-only">
          {t('eyebrow')}
        </h2>
        <ol className="grid gap-8 desktop:grid-cols-2 desktop:gap-12">
          {ETAPES.map((cle, i) => (
            <li key={cle} className="flex gap-5 border-t border-filet pt-6">
              <span
                aria-hidden
                className="font-serif text-[2.125rem] leading-none tabular-nums text-accent desktop:text-[3.25rem]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-serif text-h3 text-balance">{t(`etapes.${cle}.titre`)}</h3>
                <p className="text-corps mt-3 max-w-[52ch] text-encre-douce">
                  {t(`etapes.${cle}.texte`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Renvois. Les quatre autres moments sont nommes, pas racontes : ils le
          sont deja sur la Home, et les redire ici ferait lire deux fois la
          meme chose a deux clics d'ecart. */}
      <Section fond="fond" aria-labelledby="produit-ailleurs">
        <h2 id="produit-ailleurs" className="font-serif text-h3">
          {brief('label')}
        </h2>
        <ul className="text-intro mt-titre flex flex-wrap gap-x-6 gap-y-3 text-encre-douce">
          {PILIERS.map((cle) => (
            <li key={cle}>{brief(`onglets.${cle}`)}</li>
          ))}
        </ul>
        <p className="mt-8">
          <a
            href={`${getPathname({ href: '/', locale })}#${ancres.fonctionnement}`}
            className="text-intro font-semibold text-lien underline underline-offset-4"
          >
            {actions('fonctionnement')}
          </a>
        </p>

        <ul
          aria-label={t('ailleursAria')}
          className="text-intro mt-titre flex flex-wrap gap-x-6 gap-y-3"
        >
          {AILLEURS.map((page) => (
            <li key={page}>
              <Link
                href={`/${page}`}
                className="font-semibold text-lien underline underline-offset-4"
              >
                {pages(`${page}.titre`)}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Pas de titre ici : la seule phrase qui conviendrait est celle du
          hero, et la redire deux ecrans plus bas ne dirait rien de plus. */}
      <Section fond="fond-alt" aria-label={actions('demo')}>
        <Cta href={LIEN_DEMO} {...ATTRS_DEMO} fleche>
          {actions('demo')}
        </Cta>
      </Section>
    </main>
  );
}
