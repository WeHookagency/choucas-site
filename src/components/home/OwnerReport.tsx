import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

const POINTS = ['fait', 'attention', 'photos', 'passage'] as const;

/**
 * Apercu d'un rapport proprietaire.
 *
 * Ce n'est pas une capture, et tout dans son traitement le dit :
 *
 * - c'est du HTML, pas une image servie par `CaptureProduit` — son texte est
 *   selectionnable et traduisible, ce qu'aucun export d'ecran ne serait ;
 * - il n'est pas cliquable, la ou les deux vraies captures ouvrent la
 *   demonstration publique ;
 * - son cadre est un rayon de carte et un filet, sans l'ombre solide ni le
 *   rayon majeur des captures ;
 * - une pastille et une legende le disent en toutes lettres.
 *
 * Le contenu se limite a ce que le brief §10 autorise : ce qui a ete fait, un
 * point d'attention, des photos, le prochain passage. Aucun rendement, aucun
 * score, aucune statistique proprietaire.
 */
function ApercuRapport() {
  const t = useTranslations('rapport');

  return (
    <figure className="m-0">
      <div className="relative rounded-carte border border-filet bg-surface p-5 desktop:p-7">
        <span className="text-label absolute right-5 top-5 rounded-capsule bg-fond-alt px-2.5 py-1 font-semibold uppercase text-encre-douce">
          {t('apercuPastille')}
        </span>

        <p className="font-serif text-h3">{t('apercuTitre')}</p>
        <p className="text-micro mt-1 text-encre-douce">{t('apercuDate')}</p>

        <dl className="mt-6 flex flex-col gap-4">
          <div className="border-t border-filet pt-4">
            <dt className="text-label font-semibold uppercase text-encre-douce">
              {t('points.fait')}
            </dt>
            <dd className="text-corps mt-1 ml-0">{t('apercuFait')}</dd>
          </div>

          <div className="border-t border-filet pt-4">
            <dt className="text-label flex items-center gap-2 font-semibold uppercase text-attention">
              <Icon name="alerte" size={16} />
              {t('points.attention')}
            </dt>
            {/* L'icone double le libelle : l'attention ne repose pas sur la
                seule couleur, ce que le §9 des specs interdit. */}
            <dd className="text-corps mt-1 ml-0">{t('apercuAttention')}</dd>
          </div>

          <div className="border-t border-filet pt-4">
            <dt className="text-label font-semibold uppercase text-encre-douce">
              {t('points.photos')}
            </dt>
            <dd className="ml-0 mt-2">
              <p className="text-micro text-encre-douce">{t('apercuPhotos')}</p>
              {/* Reserves neutres : aucune photographie n'est inventee. */}
              <div aria-hidden className="mt-2 grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="aspect-4/5 rounded-[6px] bg-respiration/30" />
                ))}
              </div>
            </dd>
          </div>

          <div className="border-t border-filet pt-4">
            <dt className="text-label font-semibold uppercase text-encre-douce">
              {t('points.passage')}
            </dt>
            <dd className="text-corps mt-1 ml-0">{t('apercuPassage')}</dd>
          </div>
        </dl>
      </div>

      <figcaption className="text-micro mt-3 text-encre-douce">
        {t('apercuLegende')}
      </figcaption>
    </figure>
  );
}

/**
 * Rapport proprietaire — brief V8 §10, quatrieme pilier.
 *
 * Texte a gauche, apercu a droite sur desktop ; une colonne en dessous.
 * La microcopie rappelle la regle produit : l'envoi reste un geste humain,
 * Choucas prepare, le manager relit.
 */
export function OwnerReport() {
  const t = useTranslations('rapport');

  return (
    <Section fond="fond" aria-labelledby="rapport-titre">
      <Reveal group className="grid items-start gap-12 desktop:grid-cols-12">
        <div style={{ ['--i' as string]: 0 }} className="desktop:col-span-5">
          <p className="text-label font-semibold uppercase text-encre-douce">{t('label')}</p>
          <h2 id="rapport-titre" className="font-serif text-h2 mt-4 text-balance">
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

          <p className="text-micro mt-8 text-encre-douce">{t('micro')}</p>
        </div>

        <div style={{ ['--i' as string]: 2 }} className="desktop:col-span-7">
          <ApercuRapport />
        </div>
      </Reveal>
    </Section>
  );
}
