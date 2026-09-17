import { useTranslations } from 'next-intl';

import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * Les quatre temps de l'implantation, et le moment de la journee qui les
 * porte. Le moment remplace la numerotation : il dit deja l'ordre, et deux
 * systemes d'ordre superposes se genent.
 *
 * `fond`, `corps` et `moment` sont mesures contre le fond Panneau de la
 * section — la table de la fin du fichier donne les ratios.
 */
const ETAPES = [
  {
    etape: 'observer',
    moment: 'matin',
    icone: 'matin',
    tuile: 'bg-surface border border-encre/25 text-encre',
    encreMoment: 'text-encre/80',
  },
  {
    etape: 'structurer',
    moment: 'midi',
    icone: 'midi',
    tuile: 'bg-respiration/45 border border-encre/25 text-encre',
    encreMoment: 'text-encre/80',
  },
  {
    etape: 'configurer',
    moment: 'apresMidi',
    icone: 'apresMidi',
    tuile: 'bg-respiration border border-encre/25 text-encre',
    encreMoment: 'text-encre/80',
  },
  {
    etape: 'transmettre',
    moment: 'soir',
    icone: 'soir',
    tuile: 'bg-cta border border-cta text-cta-encre',
    encreMoment: 'text-numero-inverse',
  },
] as const;

/**
 * Implantation — brief V8 §12.
 *
 * Explique pourquoi Choucas n'est pas un outil vide a parametrer soi-meme.
 * Le vocabulaire est contraint : on configure un produit commun, on ne
 * developpe pas du sur-mesure.
 *
 * ---------------------------------------------------------------------------
 * LA JOURNEE, ET POURQUOI ELLE SE VOIT
 *
 * Quatre aplats Lichen identiques ne disaient pas que l'implantation tient en
 * une journee — l'objection du delai de demarrage restait entiere. Les tuiles
 * s'assombrissent donc du matin au soir, et la cloture nomme le resultat du
 * soir. La progression n'est pas un ornement : c'est l'argument.
 *
 * La section passe en fond Panneau. Sans cela la tuile du matin, en Glacier,
 * se serait posee sur la Neige a 1,08:1 — invisible ; et le retrait de
 * « Une autre facon de piloter » laissait trois fonds Neige a la suite.
 *
 * CONTRASTES MESURES — corps et moment sur leur propre fond, fond contre la
 * section. Seuils : 4,5 pour le texte courant, 3 pour un objet graphique.
 *
 *                fond        contre section   corps    moment   bordure
 *   Matin     Glacier            1,18          17,27    9,34     1,46
 *   Midi      Lichen 45 %        1,39          10,53    6,69     2,27
 *   Apres-midi Lichen            2,23           6,57    4,73     3,44
 *   Soir      Sapin              8,98          10,61    5,06    10,28
 *
 * Trois choses que ces chiffres imposent, et qui ne sont pas negociables :
 *
 * 1. Le Lichen n'a aucune marge. Il n'accepte que l'encre pleine (6,57) ou a
 *    80 % (4,73). L'encre douce y tombe a 2,34 et le cuivre a 1,45 — d'ou le
 *    corps en encre pleine sur les trois premieres tuiles.
 * 2. Le soir inverse tout : le Schiste y meurt a 1,63. L'encre passe au
 *    Glacier et le moment prend `--web-numero-inverse`, le token cree pour
 *    les chiffres sur fond sombre (5,06 sur Sapin).
 * 3. Les deux tuiles claires ne se detachent pas de la section — 1,18 et
 *    1,39, bordure comprise (1,46 et 2,27), sous le seuil des objets
 *    graphiques. Aucune bordure ne les y amene : il faudrait 55 % d'encre,
 *    soit un trait franchement sombre sur une carte presque blanche. Une
 *    progression qui commence clair sur une section claire commence
 *    discrete ; le contour n'est pas necessaire a la comprehension, le texte
 *    l'est et il passe partout.
 *
 * Porte l'ancre `implantation` de la navigation.
 */
export function Implementation() {
  const t = useTranslations('implantation');

  return (
    <Section id={ancres.implantation} fond="fond-alt" aria-labelledby="implantation-titre">
      <Reveal>
        <SectionHeader
          id="implantation-titre"
          align="centre"
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          intro={t('intro')}
        />
      </Reveal>

      {/* QUATRE RANGEES, PLUS QUATRE COLONNES. Chaque etape porte desormais
          trois textes — ce qu'on fait, pourquoi, et le but — la ou elle n'avait
          qu'une phrase. Les tuiles faisaient 305 px a 1440 et 221 a 1024 :
          elles ne pouvaient pas les tenir sans devenir des colonnes de mots.

          En rangees, le moment et le titre restent a gauche, les trois textes
          prennent la mesure de lecture a droite, et la course du soleil se lit
          toujours de haut en bas — les aplats s'assombrissent du matin au
          soir, ce qui etait deja leur role. */}
      <Reveal as="ol" group className="mt-titre flex flex-col gap-5">
        {ETAPES.map(({ etape, moment, icone, tuile, encreMoment }, i) => (
          <li key={moment} style={{ ['--i' as string]: i }}>
            <Card accent="aucun" rayon="majeure" className={tuile}>
              <div className="grid gap-5 desktop:grid-cols-[minmax(0,220px)_minmax(0,1fr)] desktop:gap-12">
                <div>
                  {/* ---------------------------------------------------
                      LE MOMENT REDEVIENT UN MOT. 17 septembre 2026, verdict
                      du fondateur sur cette section : « je ne comprends pas
                      cette section clairement ».

                      Il l'avait vue sur telephone, et c'est la que le defaut
                      se voit. L'en-tete de ce fichier expliquait que « le
                      moment remplace la numerotation : il dit deja l'ordre ».
                      Sauf qu'il ne le disait plus a personne : le mot Matin,
                      Midi, Apres-midi, Soir n'etait plus que le nom
                      ACCESSIBLE de l'icone. A l'ecran il ne restait qu'un
                      petit soleil, puis une lune.

                      L'ordre de la journee reposait donc entierement sur un
                      dessin de 28 px et sur un degrade de fonds qu'on ne
                      compare pas en defilant. Empilees, les quatre tuiles se
                      lisaient comme quatre sections sans rapport.

                      Le mot revient a cote de l'icone, en capitales espacees.
                      Aucune numerotation ajoutee pour autant : le raisonnement
                      de l'en-tete tient des lors que le moment se lit.
                      --------------------------------------------------- */}
                  <p className={`text-label flex items-center gap-2 font-bold uppercase tracking-[0.14em] ${encreMoment}`}>
                    <Icon name={icone} size={20} className="shrink-0" />
                    {t(`moments.${moment}`)}
                  </p>
                  <h3 className="font-serif text-h3 mt-3">{t(`etapes.${etape}.titre`)}</h3>
                </div>

                {/* « Pourquoi » et « But » en gras en tete de ligne, pas en
                    surtitres : douze surtitres sur quatre rangees peseraient
                    plus que les phrases qu'ils annoncent. */}
                <div className="max-w-[62ch]">
                  <p className="text-corps">{t(`etapes.${etape}.texte`)}</p>
                  <p className="text-corps mt-4">
                    <strong className="font-bold">{t('labels.pourquoi')}</strong>{' — '}
                    {t(`etapes.${etape}.pourquoi`)}
                  </p>
                  <p className="text-corps mt-2">
                    <strong className="font-bold">{t('labels.but')}</strong>{' — '}
                    {t(`etapes.${etape}.but`)}
                  </p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </Reveal>

      {/* La capture retiree le 12 septembre 2026. Elle montrait la partie
          basse de accueil-responsable.png : sur ses huit lignes, quatre
          missions « En retard » et un bouton « 1 alerte urgente ». Choisie
          pour montrer une exploitation qui tourne, elle montrait une journee
          qui va mal — le contraire d'un resultat. Elle commencait en outre en
          plein milieu d'un ecran dont ManagerDemo montre deja le haut, quatre
          sections plus haut sur la meme page.

          La phrase reste : c'est elle qui porte le resultat, pas l'image. Elle
          clot la section comme la cloture precedente le faisait.

          `implantation.exemple.captureAlt` reste dans le fichier de
          traduction, avec la recette du recadrage dans le message de commit,
          si une capture doit revenir ici. */}
      <Reveal className="mt-titre">
        <p className="text-intro mx-auto max-w-[62ch] text-center font-semibold">
          {t('exemple.legende')}
        </p>
      </Reveal>

    </Section>
  );
}
