import { useTranslations } from 'next-intl';

import { FiletAccent } from '../ui/FiletAccent';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Les trois metiers de la conciergerie, avant les volets qui les detaillent.
 *
 * Le titre ne parle pas d'ecrans, contrairement a la maquette : seuls le
 * Manager et le Terrain ouvrent Choucas. Le dirigeant garde sa place — c'est
 * un metier de la journee — mais sa ligne est au registre du benefice, ce que
 * le service devient, jamais ce qu'il ferait dans l'outil.
 *
 * Aucune illustration : les photographies de la maquette n'existent pas, et
 * trois aplats vides en haut de page valaient moins que trois colonnes de
 * texte.
 */
const METIERS = ['dirigeant', 'exploitation', 'terrain'] as const;

export function TroisMetiers() {
  const t = useTranslations('solutions.metiers');

  // Panneau et non Neige : le hero qui precede est deja en Neige, et la regle
  // de la page veut qu'aucun fond ne se repete d'une section a la suivante.
  // Les deux se lisaient comme un seul bloc, separes par un filet. Suite des
  // fonds : Neige, Panneau, Lichen, Neige, Lichen, Sapin, Neige, Panneau.
  return (
    <Section fond="fond-alt" aria-labelledby="metiers-titre">
      <Reveal>
        <FiletAccent />
        <h2 id="metiers-titre" className="font-serif text-h3 mt-6 max-w-[20ch] text-balance">
          {t('titre')}
        </h2>
      </Reveal>

      {/* Deux rangees declarees sur la grille, et chaque colonne les reprend
          en sous-grille : les trois noms de metier partagent une rangee, les
          trois phrases une autre. Sans cela « Terrain » tient sur une ligne
          quand les deux autres en prennent deux, et son texte demarrait
          41 px plus haut que ses voisins — visible, puisque les colonnes sont
          cote a cote et alignees en haut par un filet.

          Si la sous-grille n'est pas comprise, la mise en page retombe sur le
          comportement actuel : le decalage revient, rien ne casse. */}
      <Reveal
        as="ul"
        group
        className="mt-titre grid gap-8 tablette:grid-cols-3 tablette:grid-rows-[auto_auto]"
      >
        {METIERS.map((cle) => (
          <li
            key={cle}
            className="border-t border-filet pt-6 tablette:row-span-2 tablette:grid tablette:grid-rows-subgrid"
          >
            {/* 24 px, pas 40. Le nom de metier etait a `text-h3`, exactement
                la taille du titre de la section juste au-dessus : quatre
                titres de meme rang se disputaient la page et aucun ne menait.
                Il descend d'un cran et redevient ce qu'il est, l'intitule
                d'une colonne. */}
            <h3 className="font-serif text-[1.5rem] leading-[1.15] text-balance">
              {t(`${cle}.role`)}
            </h3>
            <p className="text-corps mt-3 text-encre-douce">{t(`${cle}.phrase`)}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
