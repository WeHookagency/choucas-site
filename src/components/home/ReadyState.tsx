import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * Les trois etats d'une mission, dans l'ordre, et le ton de chacun.
 *
 * Le fond fonce a mesure qu'on avance : c'est ce qui fait lire une
 * transformation la ou trois capsules identiques faisaient lire trois
 * options. L'ecart de fond entre « A controler » et « PRET » vaut 4,03:1,
 * le plus fort de la sequence — il tombe la ou le titre l'annonce.
 *
 * Aucune couleur semantique : le Lichen est une surface neutre, pas un
 * avertissement. Choucas ne juge pas un etat, il le nomme.
 */
const ETATS = [
  { cle: 'etape1', panneau: 'border-filet bg-surface text-encre', numero: 'text-encre-douce' },
  { cle: 'etape2', panneau: 'border-encre/25 bg-respiration text-encre', numero: 'text-encre/80' },
  { cle: 'etape3', panneau: 'border-cta bg-cta text-cta-encre', numero: 'text-cta-encre/70' },
] as const;

/**
 * Double controle et PRET — brief V8 §9.
 *
 * La regle produit avant le decor : la personne qui controle n'est pas celle
 * qui a execute. Le bien ne passe en PRET qu'apres validation.
 *
 * La frise nomme ses trois etats en toutes lettres et les numerote : aucune
 * information n'y est portee par la seule couleur, et l'ordre se lit meme
 * sans voir les fleches, qui sont decoratives.
 *
 * Pas de pourcentage, pas de compteur de personnes — le §9 les exclut, et le
 * §3 rappelle que Choucas mesure les biens, jamais les gens.
 *
 * ---------------------------------------------------------------------------
 * POURQUOI UNE PISTE ET NON TROIS PASTILLES
 *
 * La sequence est la demonstration du titre : c'est elle qui montre que
 * « termine » et « PRET » sont deux etats differents. Elle n'occupait que
 * 39 % de la colonne, en capsules de 43 px, et ses deux premiers etats
 * etaient strictement identiques — meme fond, meme filet, meme encre. On y
 * lisait trois options, pas une mission qui change de statut.
 *
 * Trois panneaux de largeur egale poses sur un filet qui ne s'interrompt pas
 * disent l'inverse : un seul objet qui avance. Les largeurs egales comptent
 * autant que le filet — 190, 149 puis 109 px se lisaient comme trois
 * etiquettes de longueurs differentes.
 *
 * Le filet ne traverse pas les panneaux : il n'apparait que dans les
 * intervalles, ou la fleche se pose dessus avec le fond de la section
 * derriere elle pour ne pas etre barree.
 *
 * Les intervalles sont des `li` a leur tour, masques aux technologies
 * d'assistance : c'est la seule facon d'avoir trois panneaux reellement
 * egaux. Places dans les `li` des etats, ils volaient 64 px au premier et au
 * deuxieme, et le troisieme se retrouvait plus large que les autres.
 *
 * La rangee n'apparait qu'a partir de 1000 px. A 768 les panneaux tombaient a
 * 173 px et « Mission terminee » passait sur deux lignes : la piste devenait
 * bancale la ou elle doit etre la plus lisible. En dessous, elle se lit a la
 * verticale, filet compris.
 */
export function ReadyState() {
  const t = useTranslations('pret');

  return (
    <Section fond="fond-alt" aria-labelledby="pret-titre">
      <Reveal>
        <SectionHeader
          id="pret-titre"
          align="centre"
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          intro={t('corps')}
        />
      </Reveal>

      {/* Plafonnee a 900 px : au-dela, trois panneaux etires sur 1360 px
          redeviennent trois blocs isoles. */}
      <Reveal
        as="ol"
        group
        aria-label={t('etapesAria')}
        className="mt-titre mx-auto flex max-w-[900px] flex-col items-stretch desktop:flex-row desktop:items-stretch"
      >
        {ETATS.flatMap(({ cle, panneau, numero }, i) => {
          const panneauLi = (
            <li
              key={cle}
              style={{ ['--i' as string]: i }}
              className={`flex items-center justify-center gap-3 rounded-capsule border px-6 py-4 desktop:flex-1 ${panneau}`}
            >
              <span aria-hidden className={`text-numero font-semibold tabular-nums ${numero}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-intro font-semibold">{t(cle)}</span>
            </li>
          );
          if (i === 0) return [panneauLi];
          return [
            <li
              key={`${cle}-vers`}
              aria-hidden
              style={{ ['--i' as string]: i }}
              className="relative flex h-8 w-full shrink-0 items-center justify-center desktop:h-auto desktop:w-16"
            >
              {/* Le trait prend l'encre douce, celle de la fleche : meme ton
                  pour le rail et le glyphe, donc un seul objet. Le filet du
                  site ne mesure que 1,15:1 sur le Panneau de la section — un
                  trait qu'on ne voit pas ne relie rien ; l'encre douce y
                  mesure 5,21:1. */}
              <span className="absolute h-full w-px bg-encre-douce desktop:h-px desktop:w-full" />
              <Icon
                name="fleche"
                size={20}
                className="relative rotate-90 bg-fond-alt px-1 text-encre-douce desktop:rotate-0"
              />
            </li>,
            panneauLi,
          ];
        })}
      </Reveal>

    </Section>
  );
}
