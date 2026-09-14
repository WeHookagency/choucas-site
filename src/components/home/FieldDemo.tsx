import { useTranslations } from 'next-intl';

import accueilEquipier from '../../../public/demo/accueil-equipier.png';
import { Accent } from '../ui/Accent';
import { CaptureProduit } from '../ui/CaptureProduit';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Cinq avantages, et non plus trois, depuis le 15 septembre 2026.
 *
 * La section disait le contexte et les preuves, et s'arretait la. Il manquait
 * ce qui fait la difference sur le terrain : un ecran utilisable les mains
 * pleines, et le signalement qui remonte au lieu de se perdre.
 *
 * ⚠️ AUCUNE PHRASE N'EST INVENTEE ICI. Les cinq details sont assembles a
 * partir de copies deja publiees ailleurs sur le site — `solutions.terrain.*`,
 * `produit.imprevu.p1`, `journee.panneaux.controler`,
 * `hospitalite.principes.anomalie`, `faq.questions.aisance-numerique`. La Home
 * ne promet donc rien que le reste du site ne promette deja.
 *
 * ⚠️ CE QUI N'Y EST PAS, ET POURQUOI. Les codes d'acces auraient fait un
 * sixieme point evident — « les acces du bien arrivent avec la mission ». Ils
 * sont ecartes : `produit.mission.p1` et `solutions.terrain.suite` les citent
 * deja, et `references/promesses-du-site.md` §3.1 rappelle que la fenetre
 * d'acces et le journal des revelations n'existent pas encore dans la PWA. Les
 * mettre en vitrine sur la Home avant la protection ajouterait une dette la ou
 * il y en a deja deux.
 *
 * Le double controle non plus : « ne valide jamais sa propre mission » est
 * publie deux fois et reste faux dans l'application (promesses-du-site §1.2).
 * Un troisieme endroit n'aide pas.
 */
const POINTS = ['consigne', 'contexte', 'ergonomie', 'signalement', 'preuves'] as const;

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
