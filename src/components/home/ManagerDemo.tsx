import { useTranslations } from 'next-intl';

import blocExceptions from '../../../public/demo/bloc-exceptions.png';
import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
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
      aria-labelledby="manager-titre"
      className="scroll-mt-[61px] bg-fond desktop:scroll-mt-[69px]"
    >
      <Reveal group className="mx-auto max-w-scene">
        {/* Surface mousse, rayon superieur 28 px — §6.3. Le Lichen est une
            surface : le texte pose dessus est du Schiste, 6,57:1. */}
        <div
          style={{ ['--i' as string]: 0 }}
          className="rounded-t-[28px] bg-respiration px-marge py-10"
        >
          {/* L'etiquette garde le mot « Demonstration » : la capture porte de
              vrais noms de chalets et pourrait sinon se lire comme un compte
              d'exploitation reel. Le brief V8 proposait « CHOUCAS MANAGER »
              seul, ecarte pour cette raison. */}
          <div className="mx-auto max-w-[62ch] text-center">
            <p className="text-label font-semibold uppercase text-encre">{t('label')}</p>
            <h2 id="manager-titre" className="font-serif text-h3 mt-4 text-balance">
              {/* Panneau Lichen : le cuivre y mesure 1,45:1. L'accent tient par
                  l'italique seul, en encre pleine a 6,57:1. */}
              {t.rich('titre', { accent: (chunks) => <Accent ton="encre">{chunks}</Accent> })}
            </h2>
            <p className="text-corps mt-4 text-encre">{t('intro')}</p>
          </div>

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
