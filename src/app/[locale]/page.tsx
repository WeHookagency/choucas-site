import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/home/Hero';
import { Implementation } from '@/components/home/Implementation';
import { BriefIntake } from '@/components/home/BriefIntake';
import { BriefToProof } from '@/components/home/BriefToProof';
import { LIEN_LINKEDIN } from '@/components/anchors';
import { DemoLive } from '@/components/home/DemoLive';
import { FaqHome } from '@/components/home/FaqHome';
import { OperationalTension } from '@/components/home/OperationalTension';
import { PreuveAvis } from '@/components/home/PreuveAvis';
import { PreuveClients } from '@/components/home/PreuveClients';
import { QuiEstDerriere } from '@/components/home/QuiEstDerriere';
import { TarifsHome } from '@/components/home/TarifsHome';
import { FieldDemo } from '@/components/home/FieldDemo';
import { FinalCta } from '@/components/home/FinalCta';
import { ManagerDemo } from '@/components/home/ManagerDemo';
import { OwnerReport } from '@/components/home/OwnerReport';
import { localeAlternates, siteUrl } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

/**
 * Homepage.
 *
 * `Profiles` est dereference comme l'ont ete `OperationalTension`,
 * `Hospitality`, `WhyChoucas` et `DayInChoucas` a la passe V8 : le fichier et
 * ses cles de traduction restent en place, seule la ligne de rendu disparait.
 * La FAQ retrouve ainsi la place que son brief lui donnait — avant-derniere
 * section, immediatement suivie du CTA final.
 */

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return {
    // Canonical et hreflang derives de la table des slugs : chaque langue
    // servie obtient sa balise, plus un x-default vers la langue par defaut.
    alternates: localeAlternates('/', locale),
  };
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  // L'editeur, la zone et les coordonnees viennent des mentions legales et de
  // la page contact : une seule source dans le depot, et les donnees
  // structurees ne peuvent pas diverger de ce qui est affiche.
  const mentions = await getTranslations('mentions');
  const contact = await getTranslations('contact');
  const meta = await getTranslations('metadata');

  /**
   * Fiche d'organisation, posee sur l'accueil et nulle part ailleurs.
   *
   * `Organization` et non `LocalBusiness` : Choucas se deplace chez ses
   * clientes, il n'y a pas d'adresse ou l'on vient. Declarer un commerce local
   * ferait promettre au moteur une vitrine qui n'existe pas.
   *
   * `areaServed` porte les cinq stations, qui sont deja ecrites sur la page
   * contact — c'est l'information la plus utile pour une recherche locale, et
   * la seule chose que ce balisage apporte vraiment ici.
   *
   * Aucun prix n'est balise. `Offer` sur un abonnement au bien produit des
   * resultats enrichis trompeurs — un prix affiche « a partir de » pour une
   * formule qui depend du parc. A rediscuter si le besoin se presente.
   */
  const organisation = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Choucas',
    legalName: mentions('editeurNom'),
    url: siteUrl,
    logo: new URL('/choucas-mark.svg', siteUrl).toString(),
    description: meta('description'),
    email: mentions('editeurEmail'),
    telephone: mentions('editeurTelephone'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: '98 Impasse de la Planchette',
      postalCode: '74450',
      addressLocality: 'Saint-Jean-de-Sixt',
      addressCountry: 'FR',
    },
    areaServed: contact('zone')
      .replace(/^[^:]*:\s*/, '')
      .split('·')
      .map((nom) => ({ '@type': 'Place', name: nom.trim() })),
    founder: { '@type': 'Person', name: mentions('directeurNom') },
    sameAs: [LIEN_LINKEDIN],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // Chaine construite ici, sans entree utilisateur : rien a echapper
        // au-dela de ce que fait `JSON.stringify`.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
      />

      <Hero />
      {/* Le probleme, avant la premiere demonstration. La page ouvrait sur la
          solution et enchainait sur le fonctionnement : le lecteur devait
          reconnaitre sa propre journee avant d'entendre la reponse, et rien ne
          la lui montrait. `OperationalTension` existait dans le depot,
          deference — il est remis le 14 septembre 2026. Son fond Panneau coupe
          au passage les deux Neige du hero et de ManagerDemo. */}
      <OperationalTension />
      {/* Les deux preuves sociales. Elles ne rendent rien tant que
          `content/preuves.ts` est vide, ce qu'il est : Choucas n'a pas encore
          de clientes. Elles s'allument en remplissant ce fichier, pas en
          touchant a cette page — la condition qui compte est verifiable par le
          code au lieu d'etre une intention.

          ⚠️ Le jour ou elles apparaissent, la suite des fonds de la Home
          change : a remesurer, aucun fond ne devant se repeter d'une section a
          la suivante. */}
      <PreuveClients />
      <ManagerDemo />
      <BriefIntake />
      <FieldDemo />
      <BriefToProof />
      {/* ReadyState et CtaIntermediaire retires le 7 septembre 2026.
          BriefToProof, juste au-dessus, mene deja du brief au PRET et a la
          preuve : la section PRET redisait son aboutissement. Les deux
          fichiers et leurs cles de traduction restent en place — les
          remonter ici suffit.

          ⚠️ Ce qui part avec ReadyState : la seule formulation de la Home qui
          enonce la regle du double controle — « la personne qui controle
          n'est pas celle qui a execute ». Elle tient toujours sur /solutions
          et dans la FAQ, plus sur la Home. */}
      {/* La demonstration publique, dans la page, juste apres la chaine
          Brief → PRÊT : on vient de lire le parcours, on peut l'essayer.

          ⚠️ SEULE IFRAME DU SITE. Le reste ne charge aucune origine tierce —
          propriete mesuree, pas intention — et elle ne cede qu'ici. Elle ne
          se cree qu'au clic : traverser la page sans s'arreter ne coute rien.
          Sous 1 000 px, le bouton n'est pas rendu et un lien vers un nouvel
          onglet prend sa place. */}
      <DemoLive />
      <OwnerReport />
      {/* Philosophy — « Une autre façon de piloter » — retirée le 6 septembre
          2026. Le fichier et ses clés de traduction restent en place : la
          remonter ici suffit. Elle portait l'ancre `a-propos`, que rien ne
          visait.

          ⚠️ La note sur « trois fonds Neige » qui vivait ici était périmée :
          l'implantation est passée en Panneau depuis. Suite mesurée le
          13 septembre 2026 — Neige, Neige, Sapin, Neige, Schiste, Neige,
          Panneau, Panneau, Neige, Schiste. */}
      <Implementation />
      {/* Les deux montants, apres la journee d'implantation qui vient d'etre
          racontee : le demarrage est le prix de cette journee-la, la question
          se pose ici. Elle partage volontairement le fond Panneau de
          l'implantation : voir la note du composant. */}
      <PreuveAvis />
      <TarifsHome />
      {/* Qui vend, et ou en est le produit. Le site n'avait plus personne
          derriere lui depuis la suppression d'A propos. Arrive apres le prix
          et avant les objections : on voit le montant, on voit a qui on le
          verse, puis on pose ses questions. */}
      <QuiEstDerriere />
      <FaqHome />
      <FinalCta />
    </main>
  );
}
