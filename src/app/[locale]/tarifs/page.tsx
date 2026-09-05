import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ATTRS_DEMO, LIEN_DEMO } from '@/components/anchors';
import { ListeFaq, type EntreeFaq } from '@/components/faq/ListeFaq';
import { Accent } from '@/components/ui/Accent';
import { Cta } from '@/components/ui/Cta';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { questionsTarifs } from '@/content/faq';
import { localeAlternates } from '@/i18n/metadata';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/** Les quatre paliers d'abonnement, seuils du §16 des contenus. */
const PALIERS = ['p1', 'p2', 'p3', 'p4'] as const;

/** Les trois lignes de ce qui est facture, et les trois du positionnement. */
const FACTURE = ['implantation', 'abonnement', 'utilisateurs'] as const;
const POSITION = ['intervalle', 'controle', 'contexte'] as const;

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
 * Tarifs — les montants du §16, et ce qu'ils couvrent.
 *
 * Une implantation payee une fois, puis un abonnement lie au parc. Les seuils
 * de biens sont ceux du fichier de contenus, au caractere pres : les inventer
 * reviendrait a inventer un prix.
 *
 * Ni duree d'engagement ni delai de support n'est annonce : rien n'est
 * tranche, et une page de prix est le pire endroit ou creer une attente.
 *
 * La section de positionnement dit ce que Choucas couvre. Elle ne nomme ni
 * n'evoque aucun autre produit, ne compare rien et n'oppose rien : un site
 * qui se definit par ce qu'il n'est pas laisse le lecteur avec le nom de
 * l'autre en tete.
 *
 * Les questions de prix viennent de la meme source que `/faq`, pas d'une
 * copie. Le balisage `FAQPage` reste sur `/faq` seule.
 */
export default async function Page({ params }: PageProps<'/[locale]/tarifs'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('tarifs');
  const faq = await getTranslations('faq');
  const actions = await getTranslations('actions');

  const questions: EntreeFaq[] = questionsTarifs.map((cle) => ({
    id: cle,
    q: faq(`questions.${cle}.q`),
    r: faq(`questions.${cle}.r`),
  }));

  return (
    <main>
      <Section fond="fond" aria-labelledby="tarifs-titre">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 id="tarifs-titre" className="font-serif text-h2 mt-4 max-w-[18ch] text-balance">
          {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
        </h1>
        <p className="text-intro mt-8 max-w-[62ch] text-encre-douce">{t('intro')}</p>
      </Section>

      <Section fond="fond" aria-labelledby="facture-titre" sansRythme className="pb-section">
        <h2 id="facture-titre" className="font-serif text-h3">
          {t('factureTitre')}
        </h2>
        <ul className="mt-titre max-w-[720px]">
          {FACTURE.map((cle) => (
            <li key={cle} className="text-intro flex gap-4 border-t border-filet py-5">
              <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
              {t(`facture.${cle}`)}
            </li>
          ))}
        </ul>
      </Section>

      <Section fond="fond-alt" aria-labelledby="grille-titre">
        <h2 id="grille-titre" className="font-serif text-h3">
          {t('grilleTitre')}
        </h2>

        {/* L'implantation d'abord, et seule : elle se paie une fois, elle ne
            se compare pas aux paliers mensuels. */}
        <div className="mt-titre max-w-[720px] rounded-carte-majeure border border-filet bg-surface p-6 desktop:p-8">
          <h3 className="font-serif text-h3">{t('implantation.titre')}</h3>
          <p className="mt-4 flex flex-wrap items-baseline gap-2">
            <span className="font-serif text-[2.125rem] leading-none tabular-nums desktop:text-[3.25rem]">
              {t('implantation.montant')}
            </span>
            <span className="text-corps text-encre-douce">{t('implantation.unite')}</span>
          </p>
          <p className="text-corps mt-6 max-w-[62ch] text-encre-douce">{t('implantation.texte')}</p>
        </div>

        <h3 className="font-serif text-h3 mt-titre">{t('abonnementTitre')}</h3>
        <div className="mt-6 max-w-[720px] overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{t('abonnementTitre')}</caption>
            <thead>
              <tr className="border-b border-filet">
                <th scope="col" className="text-label py-3 font-semibold uppercase text-encre-douce">
                  {t('colonneBiens')}
                </th>
                <th
                  scope="col"
                  className="text-label py-3 text-right font-semibold uppercase text-encre-douce"
                >
                  {t('colonneMontant')}
                </th>
              </tr>
            </thead>
            <tbody>
              {PALIERS.map((cle) => (
                <tr key={cle} className="border-b border-filet">
                  <th scope="row" className="text-intro py-4 font-normal">
                    {t(`paliers.${cle}.biens`)}
                  </th>
                  <td className="text-intro py-4 text-right font-semibold tabular-nums">
                    {t(`paliers.${cle}.montant`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-corps mt-6 text-encre-douce">{t('htMention')}</p>
      </Section>

      <Section fond="fond" aria-labelledby="position-titre">
        <h2 id="position-titre" className="font-serif text-h3 max-w-[20ch] text-balance">
          {t('positionTitre')}
        </h2>
        <ul className="mt-titre grid gap-8 desktop:grid-cols-3">
          {POSITION.map((cle) => (
            <li key={cle} className="border-t border-filet pt-6">
              <h3 className="font-serif text-h3 text-balance">{t(`position.${cle}.titre`)}</h3>
              <p className="text-corps mt-3 text-encre-douce">{t(`position.${cle}.texte`)}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section fond="fond-alt" aria-labelledby="tarifs-faq">
        <div className="max-w-[720px]">
          <h2 id="tarifs-faq" className="font-serif text-h3">
            {t('faqTitre')}
          </h2>
          <ListeFaq entrees={questions} idBase="tarifs-faq" className="mt-titre" />
          <p className="mt-8">
            <Link
              href="/faq"
              className="text-intro font-semibold text-lien underline underline-offset-4"
            >
              {t('faqLien')}
            </Link>
          </p>
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
