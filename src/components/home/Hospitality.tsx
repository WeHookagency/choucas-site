import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';

import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
import { Photo } from '../ui/Photo';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/** Ordre d'affichage des principes. Les cles nomment le propos, pas le rang :
 *  en inserer un plus tard ne renumerote rien. */
const PRINCIPES = ['responsable', 'contexte', 'anomalie', 'rotation'] as const;

/**
 * Photographie et principes d'hospitalite — specs §6.7.
 *
 * Deux colonnes sur desktop : photographie verticale a gauche, texte a droite.
 * Animation : la photo, puis la liste des quatre principes decales de 90 ms
 * (brief V7, section 07).
 */
export function Hospitality() {
  const t = useTranslations('hospitalite');

  return (
    <Section id={ancres.aPropos} fond="fond" aria-labelledby="hospitalite-titre">
      <div className="grid items-center gap-10 desktop:grid-cols-12 desktop:gap-16">
        <Reveal className="desktop:col-span-5">
          <Photo
            src="/demo/hospitalite.jpg"
            alt={t('photoAlt')}
            cadrage="object-[50%_25%]"
            className="max-w-[460px] desktop:max-w-none"
          />
        </Reveal>

        <div className="desktop:col-span-7">
          <Reveal>
            <p className="text-label font-semibold uppercase text-encre-douce">
              {t('label')}
            </p>
            <h2 id="hospitalite-titre" className="font-serif text-h2 mt-4 text-balance">
              {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
            </h2>
          </Reveal>

          {/* Liste ordonnee : le rang porte du sens, les numeros visibles ne
              font que le montrer — ils sont donc masques aux lecteurs
              d'ecran, qui annoncent deja la numerotation de la liste. */}
          <Reveal as="ol" group className="mt-titre space-y-4">
            {PRINCIPES.map((cle, i) => (
              <li
                key={cle}
                style={{ '--i': i + 1 } as CSSProperties}
                className="flex gap-4"
              >
                <span aria-hidden className="text-label pt-1 font-semibold text-encre-douce">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-corps">{t(`principes.${cle}`)}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
