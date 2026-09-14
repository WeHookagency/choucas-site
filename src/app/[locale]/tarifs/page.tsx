import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Cta } from '@/components/ui/Cta';
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

  const t = await getTranslations({ locale, namespace: 'tarifs' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: tPages('tarifs.titre'),
    description: t('intro'),
    alternates: localeAlternates('/tarifs', locale),
  };
}

/**
 * Tarifs — modele du 11 septembre 2026 : un demarrage, puis un abonnement.
 *
 * La page precedente vendait une implantation a 2 490 € puis un abonnement en
 * cinq paliers de biens actifs. Ce modele n'existe plus : le demarrage passe a
 * 2 000 €, l'abonnement devient lineaire — 20 € par bien et par mois, minimum
 * 300 € — et deux etages s'ajoutent, les options et ce qui est en
 * construction.
 *
 * Sept sections, un H1, un H2 chacune, aucun H3 : c'est la contrainte posee.
 * Les options et les briques a venir sont donc des paragraphes a intitule en
 * gras, pas des titres — un niveau de titre pour une ligne de prix
 * encombrerait la navigation au clavier sans rien structurer.
 *
 * Les fonds alternent, avec une seule bande sombre : « Pouvez-vous tester
 * avant ? » est la section qui leve l'objection la plus chere, elle prend le
 * poids que le Sapin lui donne. Suite des fonds : Neige, Panneau, Neige,
 * Sapin, Neige, Panneau, Neige.
 *
 * ⚠️ ALLER-RETOUR. Cette page a ete fusionnee dans Solutions le 13 septembre
 * 2026, puis ressortie le meme jour. La fusion tenait tant que Solutions
 * existait ; elle ne tient plus des lors que « Produit » et « Solutions » se
 * revelent etre le meme mot pour un lecteur, et que Solutions disparait.
 *
 * La page est reprise telle qu'elle etait, au commit `b97a75f^`. Elle lit les
 * memes chaines, qui portent depuis la franchise en base : plus de « HT », et
 * `htMention` dit la mention de l'article 293 B.
 *
 * ⚠️ Trois reponses de la FAQ decrivent encore l'ancien modele et le
 * contredisent. Elles ne sont pas sur cette page, mais elles parlent d'elle.
 */
/**
 * La grille de la page : le titre et son prix a gauche, l'explication a
 * droite.
 *
 * Elle etait une colonne de 529 px calee a gauche dans un conteneur de 1 360 :
 * 791 px de vide a droite, sur les six sections, sur toute la page. Mesure le
 * 14 septembre 2026.
 *
 * Plafonnee a 940 px et centree — 300 pour la colonne des titres, 64 d'ecart,
 * 529 pour la mesure de lecture. Les marges deviennent egales, et une
 * respiration se lit autrement qu'un trou. Meme traitement que les sections de
 * Produit.
 */
function Colonnes({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="mx-auto grid max-w-[940px] items-start gap-6 desktop:grid-cols-[minmax(0,300px)_minmax(0,1fr)] desktop:gap-16">
      {children}
    </Reveal>
  );
}

/**
 * Un montant, sorti de son titre.
 *
 * Les deux prix vivaient dans les titres — « Le demarrage — 2 000 € » — ou le
 * chiffre se noyait dans une phrase en serif, et ou « L'abonnement — 20 € par
 * bien et par mois » cassait sur deux lignes a toutes les largeurs. Sur une
 * page de tarifs, le montant est la premiere chose qu'on cherche.
 *
 * Il ne peut plus se couper puisqu'il n'est plus dans une phrase. `text-hero`
 * serait trop : ce n'est pas un titre de page, c'est une donnee.
 *
 * En cuivre, l'accent de la charte. Il mesure 3,52:1 sur Neige et 3,22 sur
 * Panneau : sous le seuil du texte courant, au-dessus de celui des titres de
 * 24 px et plus. Le montant fait 75 px a 1440 et 43 au plus etroit — il est
 * donc dans le seul emploi que `tokens.css` autorise pour cette couleur, et
 * c'est exactement celui-la : un chiffre qu'on veut voir avant le reste.
 */
function Prix({ montant, unite }: { montant: string; unite: string }) {
  return (
    <p className="mt-5">
      <span className="font-serif text-h2 block leading-none tabular-nums text-accent">{montant}</span>
      <span className="text-corps mt-3 block text-encre-douce">{unite}</span>
    </p>
  );
}

export default async function Page({ params }: PageProps<'/[locale]/tarifs'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('tarifs');
  const contact = await getTranslations('contact');
  // Les montants sont lus dans `tarifsHome`, la ou la section tarifs de la
  // Home les prend deja. Une seule source : l'accueil et cette page ne
  // peuvent plus annoncer des chiffres differents, ce que le commentaire de
  // `TarifsHome` signalait comme un risque depuis sa creation.
  const prix = await getTranslations('tarifsHome');

  return (
    <main>
      <Section fond="fond" aria-labelledby="tarifs-titre">
        <h1 id="tarifs-titre" className="font-serif text-h2">
          {t('titre')}
        </h1>
        <p className="text-intro mt-8 max-w-[62ch] font-semibold">{t('chapeau')}</p>
        <p className="text-intro mt-4 max-w-[62ch] text-encre-douce">{t('intro')}</p>
      </Section>

      <Section fond="fond-alt" aria-labelledby="demarrage-titre">
        <Colonnes>
          <div>
            <h2 id="demarrage-titre" className="font-serif text-h3 text-balance">
              {prix('demarrageNom')}
            </h2>
            <Prix montant={prix('demarragePrix')} unite={prix('demarrageQuoi')} />
          </div>
          <div className="max-w-[62ch]">
            {/* La phrase qui justifie le montant vient en tete : c'est la
                question posee juste apres avoir lu le chiffre. */}
            <p className="text-intro font-semibold">{prix('demarrageJustification')}</p>
            <p className="text-corps mt-5">{t('demarrageP1')}</p>
            <p className="text-corps mt-4 text-encre-douce">{t('demarrageP2')}</p>
          </div>
        </Colonnes>
      </Section>

      <Section fond="fond" aria-labelledby="abonnement-titre">
        <Colonnes>
          <div>
            <h2 id="abonnement-titre" className="font-serif text-h3 text-balance">
              {prix('abonnementNom')}
            </h2>
            <Prix montant={prix('abonnementPrix')} unite={prix('abonnementQuoi')} />
          </div>
          <div className="max-w-[62ch]">
            {/* Le plancher se detache du reste : c'est le chiffre qu'une petite
                conciergerie cherche en premier, et le seul que la formule au
                bien ne donne pas. */}
            <p className="text-intro font-semibold">{t('abonnementMinimum')}</p>
            <p className="text-corps mt-4">{t('abonnementExemples')}</p>
            <p className="text-corps mt-4 text-encre-douce">{t('abonnementSocle')}</p>
          </div>
        </Colonnes>
      </Section>

      {/* Fond Sapin : c'est la section qui leve l'objection la plus chere — on
          ne s'engage pas a l'aveugle. Elle merite d'etre vue en defilant. */}
      <Section fond="sapin" aria-labelledby="test-titre">
        <Colonnes>
          <h2 id="test-titre" className="font-serif text-h3 text-balance">
            {t('testTitre')}
          </h2>
          <div className="max-w-[62ch]">
            <p className="text-intro font-semibold">{t('testP1')}</p>
            <p className="text-corps mt-4 text-encre-inverse/85">{t('testP2')}</p>
            <p className="text-corps mt-4 text-encre-inverse/85">{t('testP3')}</p>
          </div>
        </Colonnes>
      </Section>

      <Section fond="fond" aria-labelledby="options-titre">
        <Colonnes>
          <h2 id="options-titre" className="font-serif text-h3 text-balance">
            {t('optionsTitre')}
          </h2>
          <div className="max-w-[62ch]">
          <p className="text-corps text-encre-douce">{t('optionsIntro')}</p>
          {/* Intitule en gras et non en h3 : la contrainte de la page est un
              seul niveau de titre par section. */}
          <p className="text-corps mt-titre">
            <strong className="font-bold">{t('optionsRapportNom')}</strong>{' '}
            {t('optionsRapportTexte')}
          </p>
          </div>
        </Colonnes>
      </Section>

      <Section fond="fond-alt" aria-labelledby="arrive-titre">
        <Colonnes>
          <h2 id="arrive-titre" className="font-serif text-h3 text-balance">
            {t('arriveTitre')}
          </h2>
          <div className="max-w-[62ch]">
          <p className="text-corps text-encre-douce">{t('arriveIntro')}</p>
          <p className="text-corps mt-titre">
            <strong className="font-bold">{t('arriveMemoireNom')}</strong>{' '}
            {t('arriveMemoireTexte')}
          </p>
          <p className="text-corps mt-5">
            <strong className="font-bold">{t('arriveLitigeNom')}</strong>{' '}
            {t('arriveLitigeTexte')}
          </p>
          </div>
        </Colonnes>
      </Section>

      <Section fond="fond" aria-labelledby="paiement-titre">
        <Colonnes>
          <h2 id="paiement-titre" className="font-serif text-h3 text-balance">
            {t('paiementTitre')}
          </h2>
          <div className="max-w-[62ch]">
          <p className="text-corps">{t('paiementTexte')}</p>

          {/* Le lexique des CTA est fige : « Organiser une journée sur site »
              est le libelle de la voie principale de la page Contact, et c'est
              vers elle que ce bouton mene. */}
          <Cta href={getPathname({ href: '/contact', locale })} fleche className="mt-titre">
            {contact('voies.impl.action')}
          </Cta>

          <p className="text-micro mt-titre text-encre-douce">{t('htMention')}</p>
          </div>
        </Colonnes>
      </Section>
    </main>
  );
}
