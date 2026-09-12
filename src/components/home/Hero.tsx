import { useTranslations } from 'next-intl';

import { ancres, ATTRS_DEMO, LIEN_DEMO } from '../anchors';
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

  // La section est nommee par son H1, comme les huit autres de la page. Elle
  // etait la seule sans nom accessible : un lecteur d'ecran qui parcourt les
  // reperes de la page tombait sur une region muette, et c'etait la premiere.
  return (
    <section className="bg-fond text-encre" aria-labelledby="hero-titre">
      <div className="mx-auto max-w-scene px-marge py-12 tablette:py-16 desktop:py-20">
        <div className="tablette:text-center">
          <p className="text-label font-semibold uppercase text-encre-douce">
            {t('label')}
          </p>

          <h1 id="hero-titre" className="font-serif text-hero mt-5 text-balance">
            {t.rich('titre', {
              accent: (chunks) => <Accent className="block">{chunks}</Accent>,
            })}
          </h1>

          {/* Mesure de lecture. Les 720 px du §6.2 donnent 92 caracteres par
              ligne a cette taille ; le plafond des specs §3 est de 75. */}
          <p className="text-intro mt-6 max-w-[62ch] text-encre-douce tablette:mx-auto">
            {t('intro')}
          </p>

          <div className="mt-8 flex flex-col gap-3 tablette:flex-row tablette:justify-center tablette:gap-4">
            <Cta href={LIEN_DEMO} {...ATTRS_DEMO} fleche pleineLargeur>
              {actions('demo')}
            </Cta>
            <Cta href={`#${ancres.fonctionnement}`} variante="secondaire" pleineLargeur>
              {actions('fonctionnement')}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
