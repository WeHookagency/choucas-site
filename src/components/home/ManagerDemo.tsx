import Image from 'next/image';
import { useTranslations } from 'next-intl';

import accueilManager from '../../../references/captures-accueil/accueil-responsable-clair.png';
import { ancres } from '../anchors';
import { Reveal } from '../ui/Reveal';

/** Demonstration publique du produit, ouverte dans un nouvel onglet. */
const LIEN_PWA = 'https://choucasv2.netlify.app';

/**
 * Demonstration Manager — specs §6.3.
 *
 * Une capture reelle de l'application, dans un cadre de telephone pose sur la
 * surface mousse. Plus de mise en scene simulee : l'ecran montre est celui du
 * produit, ce que demandait le §6.3 — « prouver que Choucas est un produit
 * operationnel reel ».
 *
 * La capture fait 1036 x 3036 : elle couvre trois hauteurs d'ecran. Le cadre
 * garde les proportions d'un telephone (370 x 760, §3) et montre le haut de
 * l'ecran — l'alerte et les exceptions, la partie qui raconte. L'image est
 * importee, donc ses dimensions sont connues a la compilation et la place est
 * reservee avant le chargement.
 *
 * Le composant n'a plus d'etat : il redevient un composant serveur, et la
 * page ne porte plus le JavaScript des quatre onglets simules.
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

          <a
            href={LIEN_PWA}
            target="_blank"
            rel="noopener"
            style={{ ['--i' as string]: 1 }}
            className="mx-auto mt-8 block w-full max-w-[370px] rounded-telephone border border-filet bg-surface p-3 shadow-carte transition-transform duration-200 ease-choucas hover:-translate-y-0.5"
          >
            <span className="relative block aspect-[370/760] overflow-hidden rounded-[2.25rem]">
              <Image
                src={accueilManager}
                alt={t('captureAlt')}
                fill
                sizes="370px"
                className="object-cover object-top"
              />
            </span>
            <span className="sr-only"> — {t('lienDemo')}</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
