import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ATTRS_DEMO, LIEN_DEMO } from '@/components/anchors';
import { Accent } from '@/components/ui/Accent';
import { Cta } from '@/components/ui/Cta';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { localeAlternates } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/** Les quatre temps de l'implantation, partages avec la section de la Home. */
const ETAPES = ['observer', 'structurer', 'configurer', 'tester'] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'tarifs' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: tPages('tarifs.titre'),
    description: t('intro'),
    alternates: localeAlternates('/tarifs', locale),
  };
}

/**
 * Tarifs — la structure, sans les montants.
 *
 * ⚠️ Aucun prix n'est affiche. Le backlog les reserve au retour du fondateur,
 * et rien ici n'en invente : chaque bloc porte un emplacement dimensionne,
 * muet, a la place ou le montant viendra.
 *
 * Vocabulaire tenu : on configure un produit commun, on ne developpe pas du
 * sur-mesure. La ligne de cloture le dit, c'est celle de la Home.
 *
 * Les quatre temps de l'implantation sont lus dans l'espace `implantation`,
 * celui de la section de la Home : une seule source, aucune copie.
 */
export default async function Page({ params }: PageProps<'/[locale]/tarifs'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('tarifs');
  const implantation = await getTranslations('implantation');
  const actions = await getTranslations('actions');

  return (
    <main>
      <Section fond="fond" aria-labelledby="tarifs-titre">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 id="tarifs-titre" className="font-serif text-h2 mt-4 max-w-[18ch] text-balance">
          {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
        </h1>
        <p className="text-intro mt-8 max-w-[62ch] text-encre-douce">{t('intro')}</p>
      </Section>

      <Section fond="fond-alt" aria-label={t('eyebrow')}>
        <div className="grid gap-6 desktop:grid-cols-3">
          {(['configuration', 'abonnement', 'support'] as const).map((cle) => (
            <section
              key={cle}
              aria-labelledby={`tarif-${cle}`}
              className="flex flex-col rounded-carte-majeure border border-filet bg-surface p-6 desktop:p-8"
            >
              <h2 id={`tarif-${cle}`} className="font-serif text-h3 text-balance">
                {t(`blocs.${cle}.titre`)}
              </h2>

              {/* L'emplacement du montant. Muet et masque aux lecteurs
                  d'ecran : une etiquette y serait une phrase inventee, et un
                  prix y serait un mensonge. */}
              <div
                aria-hidden
                className="mt-6 h-16 rounded-carte border border-dashed border-filet bg-fond-alt"
              />

              {cle === 'configuration' ? (
                <>
                  <p className="text-corps mt-6 text-encre-douce">{t('blocs.configuration.texte')}</p>
                  <ol className="mt-6 flex flex-col gap-3">
                    {ETAPES.map((etape, i) => (
                      <li key={etape} className="text-corps flex gap-3">
                        <span aria-hidden className="tabular-nums text-encre-douce">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {implantation(`etapes.${etape}.titre`)}
                      </li>
                    ))}
                  </ol>
                </>
              ) : null}

              {cle === 'abonnement' ? (
                <p className="text-corps mt-6 text-encre-douce">{t('blocs.abonnement.texte')}</p>
              ) : null}
            </section>
          ))}
        </div>
      </Section>

      <Section fond="fond" aria-labelledby="tarifs-cloture">
        <h2 id="tarifs-cloture" className="font-serif text-h3 max-w-[24ch] text-balance">
          {t('cloture')}
        </h2>
        <Cta href={LIEN_DEMO} {...ATTRS_DEMO} fleche className="mt-8">
          {actions('demo')}
        </Cta>
      </Section>
    </main>
  );
}
