import { useTranslations } from 'next-intl';

import { ancres, LIEN_DEMO } from '../anchors';
import { Accent } from '../ui/Accent';
import { Cta } from '../ui/Cta';

/**
 * Hero — specs §6.2.
 *
 * Axe central sur desktop, axe gauche sur mobile. Aucune animation : le brief
 * V5 le dit explicitement, le hero doit etre lisible des le premier paint.
 * Rien ici ne porte de `Reveal`.
 *
 * La hauteur reste sous les 620 px que demandent les specs pour qu'une part
 * de la scene produit entre dans le premier viewport.
 *
 * Le fragment en cuivre est un bloc : il tombe ainsi toujours sur sa propre
 * ligne, comme sur la maquette, sans <br> qui se briserait au responsive.
 */
export function Hero() {
  const t = useTranslations('hero');
  const actions = useTranslations('actions');

  return (
    <section className="bg-fond text-encre">
      <div className="mx-auto max-w-scene px-marge py-12 tablette:py-16 desktop:py-20">
        <div className="tablette:text-center">
          <p className="text-label font-semibold uppercase text-encre-douce">
            {t('label')}
          </p>

          <h1 className="font-serif text-hero mt-5 text-balance">
            {t.rich('titre', {
              accent: (chunks) => <Accent className="block">{chunks}</Accent>,
            })}
          </h1>

          {/* Largeur de lecture plafonnee a 720 px, §6.2. */}
          <p className="text-intro mt-6 max-w-[720px] text-encre-douce tablette:mx-auto">
            {t('intro')}
          </p>

          <div className="mt-8 flex flex-col gap-3 tablette:flex-row tablette:justify-center tablette:gap-4">
            <Cta href={LIEN_DEMO} fleche pleineLargeur>
              {actions('demo')}
            </Cta>
            <Cta href={`#${ancres.produit}`} variante="secondaire" pleineLargeur>
              {actions('fonctionnement')}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
