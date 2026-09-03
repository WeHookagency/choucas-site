import { useTranslations } from 'next-intl';

import carteMaintenant from '../../../public/demo/carte-maintenant.png';
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
 * colonne en dessous. La carte « Maintenant » montre ce que l'equipier a
 * sous les yeux : la mission en cours, sa progression, le contexte a savoir
 * avant d'entrer.
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
      <Reveal group className="grid items-center gap-12 desktop:grid-cols-[1fr_430px]">
        <div style={{ ['--i' as string]: 0 }}>
          <p className="text-label font-semibold uppercase text-encre-douce">{t('label')}</p>
          <h2 id="terrain-titre" className="font-serif text-h2 mt-4 text-balance">
            {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          </h2>
          <p className="text-intro mt-6 max-w-[62ch] text-encre-douce">{t('intro')}</p>
          <ul className="mt-titre space-y-3">
            {POINTS.map((cle) => (
              <li key={cle} className="text-corps flex items-start gap-3">
                <Icon name="coche" size={24} graisse="bold" className="mt-px shrink-0 text-ok" />
                {t(`points.${cle}`)}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ ['--i' as string]: 3 }}>
          <CaptureProduit
            src={carteMaintenant}
            alt={t('captureAlt')}
            libelleLien={manager('lienDemo')}
          />
        </div>
      </Reveal>
    </Section>
  );
}
