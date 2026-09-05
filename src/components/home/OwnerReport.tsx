import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

const POINTS = ['fait', 'attention', 'photos', 'passage'] as const;

/** Les quatre lignes du releve, dans l'ordre de la maquette. */
const FAIT = ['chaufferie', 'evacuations', 'robinet', 'zone'] as const;

/**
 * Apercu d'un rapport proprietaire.
 *
 * Reprend la structure et le contenu de la maquette du 28 aout : c'est un
 * courriel adresse au proprietaire, pas un ecran de l'application. D'ou
 * l'en-tete d'expediteur, la salutation, les deux boutons du point
 * d'attention et la signature.
 *
 * Ce n'est pas une capture, et tout dans son traitement le dit :
 *
 * - c'est du HTML, pas une image servie par `CaptureProduit` — son texte est
 *   selectionnable et traduisible, ce qu'aucun export d'ecran ne serait ;
 * - rien n'y est cliquable : les boutons de la maquette sont rendus en
 *   `span`, lisibles mais inertes, la ou les deux vraies captures ouvrent la
 *   demonstration publique ;
 * - son cadre est un rayon de carte et un filet, sans l'ombre solide ni le
 *   rayon majeur des captures ;
 * - une pastille et une legende le disent en toutes lettres.
 *
 * Les couleurs sont celles du site, pas celles de la maquette : elle pose un
 * bleu et deux ocres qui n'existent nulle part ici.
 *
 * Le contenu se limite a ce que le brief §10 autorise : ce qui a ete fait, un
 * point d'attention, des photos, le prochain passage. Aucun rendement, aucun
 * score, aucune statistique proprietaire.
 */
function ApercuRapport() {
  const t = useTranslations('rapport.apercu');

  return (
    <figure className="m-0">
      {/* Pas de `role="img"` : le texte de l'apercu doit rester lisible aux
          lecteurs d'ecran. C'est la legende qui dit ce qu'il est. */}
      <div className="relative overflow-hidden rounded-carte border border-filet bg-surface">
        {/* En-tete d'expediteur. */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-filet px-5 py-4 desktop:px-7">
          <span className="text-label font-bold uppercase">{t('expediteur')}</span>
          <span className="text-micro text-encre-douce">{t('enTete')}</span>
        </div>

        <span className="text-label absolute right-5 top-16 rounded-capsule bg-fond-alt px-2.5 py-1 font-semibold uppercase text-encre-douce">
          {t('pastille')}
        </span>

        <div className="flex flex-col gap-6 px-5 py-6 desktop:px-7">
          <div>
            <p className="text-corps text-encre-douce">{t('salutation')}</p>
            <p className="font-serif text-h3 mt-3 max-w-[22ch] text-balance">{t('titre')}</p>
            {/* Un courriel se lit sur 600 px environ, comme la maquette le
                pose. Sans plafond, l'apercu s'etirait a 92 caracteres. */}
            <p className="text-corps mt-3 max-w-[62ch] text-encre-douce">{t('chapeau')}</p>
          </div>

          <div>
            <p className="text-label font-semibold uppercase text-encre-douce">
              {t('faitLabel')}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {FAIT.map((cle) => (
                <li key={cle} className="text-corps flex items-start gap-2">
                  <Icon name="coche" size={16} graisse="bold" className="mt-1 shrink-0 text-ok" />
                  {t(`fait.${cle}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Le point d'attention. L'icone double le libelle : l'alerte ne
              repose pas sur la seule couleur, ce que le §9 des specs
              interdit. */}
          <div className="rounded-carte border border-filet bg-fond-alt p-4">
            <p className="text-label flex items-center gap-2 font-semibold uppercase text-attention">
              <Icon name="alerte" size={16} />
              {t('attentionLabel')}
            </p>
            <p className="text-corps mt-2 max-w-[62ch]">
              <strong className="font-bold">{t('attentionTitre')}</strong>
              {t('attentionTexte')}
            </p>
            {/* Boutons de la maquette, rendus inertes : l'apercu depeint un
                courriel, il ne le fait pas fonctionner. */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-micro inline-flex items-center rounded-capsule bg-cta px-4 py-2 font-bold text-cta-encre">
                {t('attentionDevis')}
              </span>
              <span className="text-micro inline-flex items-center rounded-capsule border border-filet px-4 py-2 font-semibold text-encre">
                {t('attentionPhoto')}
              </span>
            </div>
          </div>

          <div>
            <p className="text-label font-semibold uppercase text-encre-douce">
              {t('photosLabel')}
            </p>
            {/* Reserves neutres : aucune photographie n'est inventee. */}
            <div aria-hidden className="mt-3 grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-[8px] bg-respiration/30" />
              ))}
            </div>
          </div>

          <p className="text-corps max-w-[62ch] rounded-carte bg-fond-alt p-4 text-encre-douce">
            <strong className="font-bold text-encre">{t('passageLabel')}</strong>
            {t('passageTexte')}
          </p>

          <div className="border-t border-filet pt-5 text-center">
            <span className="text-micro inline-flex items-center rounded-capsule border border-filet px-5 py-3 font-semibold">
              {t('rapportComplet')}
            </span>
            <p className="text-micro mt-5 text-encre-douce">{t('signature')}</p>
            <p className="text-micro text-encre-douce">{t('reponse')}</p>
          </div>
        </div>
      </div>

      <figcaption className="text-micro mt-3 text-encre-douce">{t('legende')}</figcaption>
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
