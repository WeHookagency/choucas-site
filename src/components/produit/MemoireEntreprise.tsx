import { useTranslations } from 'next-intl';

import { Reserve } from '../ui/Reserve';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/** Les trois memoires, dans l'ordre du texte. */
const FICHES = ['client', 'bien', 'proprietaire'] as const;

/**
 * Ce que l'entreprise sait, et qui ne doit pas partir avec une personne.
 *
 * Place apres le point de jonction : celui-ci clot la demonstration du double
 * controle, celle-ci ouvre le sujet suivant — la connaissance accumulee.
 *
 * Fond Neige entre le Sapin du point de jonction et le Panneau de la cloture :
 * trois fonds a la suite, aucun repete.
 *
 * ⚠️ Les trois captures de fiche n'existent pas. Ce sont des reserves
 * dimensionnees, teinte `mousse` comme toute reserve de capture d'ecran, au
 * rapport 340/480 et plafonnees a 340 px — la largeur de colonne d'ecran des
 * volets, pour que les fiches soient a la meme echelle qu'eux. La capture
 * attendue fait donc 1036 px de large, recadree a ce rapport. Le libelle sous
 * chaque reserve dit ce qu'elle montrera : une reserve muette ne se remplit
 * jamais.
 */
export function MemoireEntreprise() {
  const t = useTranslations('solutions.memoire');

  return (
    <Section fond="fond" aria-labelledby="memoire-titre">
      <Reveal>
        <h2 id="memoire-titre" className="font-serif text-h3 max-w-[24ch] text-balance">
          {t('titre')}
        </h2>
        <p className="text-intro mt-6 max-w-[62ch] text-encre-douce">{t('intro')}</p>
        <p className="text-intro mt-6 max-w-[62ch] font-semibold">{t('chapo')}</p>
        {/* La regle d'entree, avant les trois fiches : elle dit comment elles
            se remplissent, pas ce qu'elles contiennent. Sans elle, les trois
            fiches se lisent comme des depots ou l'on verse ; c'est pourtant ce
            geste de validation qui distingue Choucas d'un carnet partage. */}
        <p className="text-corps mt-4 max-w-[62ch] text-encre-douce">{t('regle')}</p>
      </Reveal>

      <Reveal as="ul" group className="mt-titre grid gap-10 desktop:grid-cols-3 desktop:gap-12">
        {FICHES.map((cle) => (
          <li key={cle} className="flex flex-col gap-4">
            <h3 className="font-serif text-intro font-semibold">{t(`fiches.${cle}.titre`)}</h3>
            <p className="text-corps max-w-[46ch] text-encre-douce">{t(`fiches.${cle}.texte`)}</p>
            {/* Centree tant que la grille est en une colonne : plafonnee a
                340 px dans une colonne de 712, la reserve occupait 48 % de sa
                ligne et laissait le reste vide a sa droite. Un trou symetrique
                se lit comme une marge, un trou d'un seul cote comme un oubli. */}
            <figure className="m-0 mt-2 flex flex-col items-center gap-2 desktop:items-start">
              <Reserve ratio="340 / 480" largeurMax={340} teinte="mousse" />
              <figcaption
                style={{ maxWidth: '340px' }}
                className="text-micro text-center text-encre-douce"
              >
                {t(`fiches.${cle}.reserve`)}
              </figcaption>
            </figure>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
