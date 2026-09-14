import { useTranslations } from 'next-intl';

import accueilEquipier from '../../../public/demo/accueil-equipier.png';
import { Accent } from '../ui/Accent';
import { CaptureProduit } from '../ui/CaptureProduit';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Sept avantages, et non plus trois. 15 septembre 2026.
 *
 * La section disait le contexte et les preuves, et s'arretait la. Il manquait
 * ce qui fait la difference sur le terrain : les acces qui arrivent avec la
 * mission, un ecran utilisable les mains pleines, le signalement qui remonte
 * au lieu de se perdre, et la regle du double controle.
 *
 * ⚠️ AUCUNE PHRASE N'EST INVENTEE ICI. Les sept details sont assembles a
 * partir de copies deja publiees ailleurs sur le site — `solutions.terrain.*`,
 * `produit.mission.p1`, `produit.imprevu.p1`, `journee.panneaux.controler`,
 * `hospitalite.principes.anomalie`, `faq.questions.aisance-numerique`. La Home
 * ne promet donc rien que le reste du site ne promette deja.
 *
 * ---------------------------------------------------------------------------
 * `acces` ET `controle` ONT ETE POSES PUIS RETIRES PUIS REMIS, dans la meme
 * journee. La trace vaut d'etre gardee, parce que c'est une doctrine qui a
 * change et non un reglage.
 *
 * Je les avais ecartes au motif que la PWA ne les tient pas encore — la
 * fenetre d'acces et le journal des revelations n'existent pas, et
 * `?role=manager` suffit aujourd'hui a se declarer controleur
 * (`references/promesses-du-site.md` §1.2 et §3.1). Publier avant de tenir
 * ajoutait une dette.
 *
 * Arbitrage du fondateur, le 15 septembre : « si le site dit quelque chose
 * c'est que la PWA va suivre aussi ». Le site n'est pas le compte rendu de ce
 * que l'application fait, il est le cahier des charges de ce qu'elle doit
 * faire. Les deux points reviennent donc.
 *
 * CE QUE CELA ENGAGE, ET C'EST ECRIT DANS promesses-du-site.md : ces phrases
 * sont au present et lues par une gerante qui signe. Elles datent le travail
 * PWA — l'etape 3 d'`identite-pwa.md` et la fenetre d'acces doivent etre
 * livrees avant la premiere journee d'implantation, pas avant la mise en ligne
 * du site.
 * ---------------------------------------------------------------------------
 */
const POINTS = [
  'consigne',
  'contexte',
  'acces',
  'ergonomie',
  'signalement',
  'preuves',
  'controle',
] as const;

/**
 * Demonstration mobile terrain — specs §6.4.
 *
 * Texte a gauche, capture de l'application a droite sur desktop ; une
 * colonne en dessous. L'ecran d'accueil de l'equipier en entier, et non plus
 * la seule carte « Maintenant » : on y lit la journee complete — le compte de
 * missions, la mission en cours avec sa progression et ce qu'il faut savoir
 * avant d'entrer, puis le check-in qui suit. Le recadrage precedent montrait
 * la bonne carte, mais pas qu'elle appartenait a une journee.
 *
 * La mise en scene simulee a disparu au profit de l'ecran reel. Le composant
 * n'a donc plus d'etat et redevient un composant serveur.
 *
 * Animation : le texte d'abord, la capture en dernier — « le produit clot le
 * groupe », brief V7 section 04.
 */
export function FieldDemo() {
  const t = useTranslations('terrain');
  const manager = useTranslations('manager');

  return (
    <Section fond="fond" aria-labelledby="terrain-titre">
      <Reveal group className="grid items-center gap-12 desktop:grid-cols-[1fr_500px]">
        <div style={{ ['--i' as string]: 0 }}>
          <p className="text-label font-semibold uppercase text-encre-douce">{t('label')}</p>
          <h2 id="terrain-titre" className="font-serif text-h2 mt-4 text-balance">
            {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          </h2>
          <p className="text-intro mt-6 max-w-[62ch] text-encre-douce">{t('intro')}</p>
          {/* Chaque point porte desormais son titre et ce qu'il change. Les
              coches passent de 28 a 20 px : a cinq points au lieu de trois,
              une coche de 28 px en tete de chaque ligne devenait la premiere
              colonne du bloc. Elle ponctue, elle ne rythme pas. 20 et non 22 :
              l'echelle d'icones de la charte n'a pas de 22, et Icon la refuse
              au type.

              `mt-0.5` cale la coche sur la ligne de base du titre plutot que
              sur le haut de sa boite. */}
          <ul className="mt-titre space-y-5">
            {POINTS.map((cle) => (
              <li key={cle} className="flex items-start gap-3">
                <Icon
                  name="coche"
                  size={20}
                  graisse="bold"
                  className="mt-0.5 shrink-0 text-ok"
                />
                <div>
                  <p className="text-corps font-semibold">{t(`points.${cle}.titre`)}</p>
                  <p className="text-corps mt-1 max-w-[52ch] text-encre-douce">
                    {t(`points.${cle}.detail`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ ['--i' as string]: 3 }}>
          <CaptureProduit
            src={accueilEquipier}
            alt={t('captureAlt')}
            libelleLien={manager('lienDemo')}
            largeurMax={480}
          />
        </div>
      </Reveal>
    </Section>
  );
}
