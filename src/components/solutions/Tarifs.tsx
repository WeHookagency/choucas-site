import { getTranslations } from 'next-intl/server';

import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Les tarifs, depuis le 13 septembre 2026 a l'interieur de la page Solutions.
 *
 * Ils avaient leur page, `/tarifs`, supprimee ce jour-la : la question du prix
 * arrive quand on vient de lire ce que le produit fait, pas dans un onglet a
 * part. L'adresse survit et redirige vers l'ancre `#tarifs` de cette page.
 *
 * Le modele, arrete le 11 septembre 2026 : un demarrage a 2 000 €, puis un
 * abonnement lineaire — 20 € par bien et par mois, minimum 300 € — et deux
 * etages en plus, les options et ce qui est en construction.
 *
 * ⚠️ UN CRAN DE TITRE EN MOINS QUE SUR L'ANCIENNE PAGE.
 *
 * Elle portait un H1 « Tarifs » et six H2, sans aucun H3 : c'etait la
 * contrainte posee pour une page qui tenait seule. Dans une page qui en
 * contient deja sept, garder six H2 de plus aplatirait le tout en une liste
 * de treize, ou le lecteur perdrait le groupe. Le bloc ouvre donc sur un H2 et
 * ses six parties sont des H3 — le seul niveau qui dise « ceci est un chapitre
 * du prix », et celui que `VoletRole` emploie deja sur cette page.
 *
 * Les H3 sont a 24 px et non a `text-h3`. A 40 ils auraient la taille exacte
 * du H2 qui les chapeaute, et plus rien ne menerait : c'est le defaut releve
 * et corrige dans `TroisMetiers` le 13 septembre.
 *
 * Les fonds alternent, avec une seule bande sombre : « Pouvez-vous tester
 * avant ? » leve l'objection la plus chere, elle prend le poids que le Sapin
 * lui donne. Suite : Neige, Panneau, Neige, Sapin, Neige, Panneau, Neige — et
 * elle s'accroche a la memoire d'entreprise qui precede, en Neige, d'ou le
 * Panneau en ouverture.
 *
 * Le bouton « Organiser une journee sur site » qui fermait la section
 * paiement est retire : la bande de cloture de la page suit immediatement, et
 * deux appels a l'action a 400 px l'un de l'autre se neutralisent. La chaine
 * qui le libellait vit ailleurs, dans `contact.voies.impl.action`.
 *
 * ⚠️ Trois reponses de la FAQ decrivent encore l'ancien modele et le
 * contredisent. Elles ne sont pas ici, mais elles parlent de ce bloc.
 */
export async function Tarifs() {
  const t = await getTranslations('tarifs');

  return (
    <>
      <Section fond="fond-alt" id="tarifs" aria-labelledby="tarifs-titre">
        <Reveal className="max-w-[62ch]">
          <h2 id="tarifs-titre" className="font-serif text-h3">
            {t('titre')}
          </h2>
          <p className="text-intro mt-8 font-semibold">{t('chapeau')}</p>
          <p className="text-intro mt-4 text-encre-douce">{t('intro')}</p>
        </Reveal>
      </Section>

      <Section fond="fond" aria-labelledby="demarrage-titre">
        <Reveal className="max-w-[62ch]">
          <h3 id="demarrage-titre" className="font-serif text-[1.5rem] leading-[1.15] text-balance">
            {t('demarrageTitre')}
          </h3>
          <p className="text-corps mt-6">{t('demarrageP1')}</p>
          <p className="text-corps mt-4 text-encre-douce">{t('demarrageP2')}</p>
        </Reveal>
      </Section>

      <Section fond="fond-alt" aria-labelledby="abonnement-titre">
        <Reveal className="max-w-[62ch]">
          <h3
            id="abonnement-titre"
            className="font-serif text-[1.5rem] leading-[1.15] text-balance"
          >
            {t('abonnementTitre')}
          </h3>
          {/* Le plancher se detache du reste : c'est le chiffre qu'une petite
              conciergerie cherche en premier, et le seul que la formule au
              bien ne donne pas. */}
          <p className="text-intro mt-6 font-semibold">{t('abonnementMinimum')}</p>
          <p className="text-corps mt-4">{t('abonnementExemples')}</p>
          <p className="text-corps mt-4 text-encre-douce">{t('abonnementSocle')}</p>
        </Reveal>
      </Section>

      {/* Fond Sapin : c'est la section qui leve l'objection la plus chere — on
          ne s'engage pas a l'aveugle. Elle merite d'etre vue en defilant. */}
      <Section fond="sapin" aria-labelledby="test-titre">
        <Reveal className="max-w-[62ch]">
          <h3 id="test-titre" className="font-serif text-[1.5rem] leading-[1.15] text-balance">
            {t('testTitre')}
          </h3>
          <p className="text-intro mt-6 font-semibold">{t('testP1')}</p>
          <p className="text-corps mt-4 text-encre-inverse/85">{t('testP2')}</p>
          <p className="text-corps mt-4 text-encre-inverse/85">{t('testP3')}</p>
        </Reveal>
      </Section>

      <Section fond="fond" aria-labelledby="options-titre">
        <Reveal className="max-w-[62ch]">
          <h3 id="options-titre" className="font-serif text-[1.5rem] leading-[1.15] text-balance">
            {t('optionsTitre')}
          </h3>
          <p className="text-corps mt-6 text-encre-douce">{t('optionsIntro')}</p>
          {/* Intitule en gras et non en titre : ajouter un quatrieme niveau
              pour une ligne de prix encombrerait la navigation au clavier sans
              rien structurer. */}
          <p className="text-corps mt-titre">
            <strong className="font-bold">{t('optionsRapportNom')}</strong>{' '}
            {t('optionsRapportTexte')}
          </p>
        </Reveal>
      </Section>

      <Section fond="fond-alt" aria-labelledby="arrive-titre">
        <Reveal className="max-w-[62ch]">
          <h3 id="arrive-titre" className="font-serif text-[1.5rem] leading-[1.15] text-balance">
            {t('arriveTitre')}
          </h3>
          <p className="text-corps mt-6 text-encre-douce">{t('arriveIntro')}</p>
          <p className="text-corps mt-titre">
            <strong className="font-bold">{t('arriveMemoireNom')}</strong>{' '}
            {t('arriveMemoireTexte')}
          </p>
          <p className="text-corps mt-5">
            <strong className="font-bold">{t('arriveLitigeNom')}</strong>{' '}
            {t('arriveLitigeTexte')}
          </p>
        </Reveal>
      </Section>

      <Section fond="fond" aria-labelledby="paiement-titre">
        <Reveal className="max-w-[62ch]">
          <h3 id="paiement-titre" className="font-serif text-[1.5rem] leading-[1.15] text-balance">
            {t('paiementTitre')}
          </h3>
          <p className="text-corps mt-6">{t('paiementTexte')}</p>
          <p className="text-micro mt-titre text-encre-douce">{t('htMention')}</p>
        </Reveal>
      </Section>
    </>
  );
}
