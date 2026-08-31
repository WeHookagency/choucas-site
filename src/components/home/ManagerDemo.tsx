import { useTranslations } from 'next-intl';

import blocExceptions from '../../../public/demo/bloc-exceptions.png';
import { ancres } from '../anchors';
import { CaptureProduit } from '../ui/CaptureProduit';
import { Reveal } from '../ui/Reveal';

/**
 * Demonstration Manager — specs §6.3.
 *
 * Une capture reelle de l'application posee sur la surface mousse : le bloc
 * Exceptions, celui qui porte la promesse du §6.3 — « prouver que Choucas
 * est un produit operationnel reel ». Il montre ce que le manager voit
 * remonter, et rien d'autre.
 *
 * Le composant n'a pas d'etat : c'est un composant serveur, la page ne porte
 * aucun JavaScript pour cette section.
 */
export function ManagerDemo() {
  const t = useTranslations('manager');

  return (
    <section
      id={ancres.produit}
      aria-label={t('aria')}
      className="scroll-mt-[60px] bg-fond desktop:scroll-mt-[68px]"
    >
      <Reveal group className="mx-auto max-w-scene">
        {/* Surface mousse, rayon superieur 28 px — §6.3. Le Lichen est une
            surface : le texte pose dessus est du Schiste, 6,57:1. */}
        <div
          style={{ ['--i' as string]: 0 }}
          className="rounded-t-[28px] bg-respiration px-marge py-10"
        >
          <p className="text-label text-center font-semibold uppercase text-encre">
            {t('label')}
          </p>

          <CaptureProduit
            src={blocExceptions}
            alt={t('captureAlt')}
            libelleLien={t('lienDemo')}
            className="mt-8"
          />
        </div>
      </Reveal>
    </section>
  );
}
