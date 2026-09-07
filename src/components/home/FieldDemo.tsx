import { useTranslations } from 'next-intl';

import accueilEquipier from '../../../public/demo/accueil-equipier.png';
import { Accent } from '../ui/Accent';
import { CaptureProduit } from '../ui/CaptureProduit';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

const POINTS = ['consigne', 'contexte', 'preuves'] as const;

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
          <ul className="mt-titre space-y-3">
            {POINTS.map((cle) => (
              <li key={cle} className="text-corps flex items-start gap-3">
                <Icon name="coche" size={28} graisse="bold" className="shrink-0 text-ok" />
                {t(`points.${cle}`)}
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
