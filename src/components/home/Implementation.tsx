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
    etape: 'tester',
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

      <Reveal as="ol" group className="mt-titre grid gap-5 tablette:grid-cols-2 desktop:grid-cols-4">
        {ETAPES.map(({ etape, moment, icone, tuile, encreMoment }, i) => (
          <li key={moment} style={{ ['--i' as string]: i }}>
            <Card accent="aucun" rayon="majeure" className={`flex h-full flex-col ${tuile}`}>
              {/* Le moment est un dessin, plus un mot : le soleil se leve,
                  culmine, se voile, puis cede a la nuit. Le nom du moment
                  reste le nom accessible de l'icone — remplacer un mot par une
                  image ne doit pas retirer l'information a qui ne voit pas
                  l'image. */}
              <Icon
                name={icone}
                size={28}
                title={t(`moments.${moment}`)}
                className={encreMoment}
              />
              <h3 className="font-serif text-h3 mt-3">{t(`etapes.${etape}.titre`)}</h3>
              <p className="text-corps mt-3">{t(`etapes.${etape}.texte`)}</p>
            </Card>
          </li>
        ))}
      </Reveal>

      {/* La cloture « Le soir, votre conciergerie a son application
          configuree. » est retiree le 7 septembre 2026.
          ⚠️ C'etait l'argument qui levait l'objection du delai de demarrage,
          et rien d'autre sur la Home ne le porte. `implantation.cloture` reste
          dans les deux fichiers de traduction. */}
    </Section>
  );
}
