'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import accueilManager from '../../../public/demo/accueil-manager.png';

import { LIEN_DEMO_APP } from '../anchors';
import { Cta } from '../ui/Cta';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/** Mesures interieures du cadre : un telephone, a l'echelle reelle. */
const LARGEUR = 390;
const HAUTEUR = 844;
/** Epaisseur de la coque, de chaque cote. */
const COQUE = 10;

/**
 * La demonstration publique, dans la page, dans un cadre de telephone.
 *
 * LA SEULE IFRAME DU SITE, et elle n'existe qu'ici. Le reste du site ne charge
 * aucune origine tierce : c'est une propriete mesurable qu'on tient depuis le
 * debut, et elle ne cede qu'a cet endroit, pour une raison qui vaut le prix.
 *
 * ---------------------------------------------------------------------------
 * ELLE NE SE CHARGE PAS AVEC LA PAGE. C'est un clic qui la cree.
 *
 * Tant que `charge` est faux, il n'y a pas d'iframe dans le document : une
 * iframe masquee en CSS se chargerait quand meme, et c'est l'erreur classique.
 * Le poster est une capture deja presente sur le site, donc deja telechargee
 * plus haut dans la page — la section n'ajoute aucun octet a qui ne clique
 * pas.
 *
 * Le declenchement au defilement etait l'autre option. Le clic a ete retenu
 * parce qu'il est le seul qui garantisse que le visiteur qui traverse la page
 * sans s'arreter ne paie rien : « je ne veux pas tripler la Home pour les
 * visiteurs qui ne descendent jamais jusque-la ».
 * ---------------------------------------------------------------------------
 *
 * DESKTOP SEULEMENT, et verrouille a deux endroits. Le bouton est masque sous
 * 1 000 px — donc hors du tabulateur et hors de l'arbre d'accessibilite — et
 * la fonction qui cree l'iframe verifie elle-meme la largeur avant d'agir.
 * Le masquage seul aurait suffi en pratique ; le verrou rend la regle vraie
 * plutot que probable. Un lien vers un nouvel onglet prend sa place.
 *
 * Une iframe de 390 px dans une fenetre de 390 px n'a aucun sens, et le
 * reseau d'un telephone en montagne encore moins.
 *
 * Le cadre reprend les mesures d'un telephone, 390 x 844, et l'iframe les
 * occupe a l'identique : la demonstration s'affiche dans sa mise en page
 * mobile, celle pour laquelle elle est dessinee.
 *
 * `referrerPolicy="no-referrer"` : l'adresse de la page courante ne part pas
 * chez le tiers. `sandbox` laisse a la demonstration ses scripts et son propre
 * stockage — `allow-same-origin` lui rend SON origine, pas la notre, et elle
 * ne peut donc rien lire de cette page.
 */
export function DemoLive() {
  const t = useTranslations('demoLive');
  const manager = useTranslations('manager');
  const [charge, setCharge] = useState(false);

  /**
   * Le seuil est lu ici et non seulement en CSS : le masquage empeche le clic,
   * il n'empeche pas un appel. La regle « desktop seulement » devient donc une
   * garantie du code.
   */
  const lancer = () => {
    if (window.innerWidth < 1000) return;
    setCharge(true);
  };

  return (
    <Section fond="fond-alt" aria-labelledby="demo-live-titre">
      <Reveal className="flex flex-col items-center text-center">
        <h2 id="demo-live-titre" className="font-serif text-h3 max-w-[24ch] text-balance">
          {t('titre')}
        </h2>
        <p className="text-intro mt-4 max-w-[52ch] text-encre-douce">{t('intro')}</p>
      </Reveal>

      <Reveal className="mt-titre flex flex-col items-center gap-8">
        {/* Le cadre porte les dimensions, donc la place est reservee avant le
            clic : rien ne bouge quand l'iframe remplace le poster. */}
        <div
          style={{ width: LARGEUR + COQUE * 2, maxWidth: '100%' }}
          className="overflow-hidden rounded-[2.5rem] border-[10px] border-cta-presse bg-cta-presse shadow-[6px_6px_0_0_var(--web-cta-presse)]"
          /* La largeur porte la coque en plus : l'interieur fait donc 390 px
             pile, et non 370. */
        >
          <div style={{ aspectRatio: `${LARGEUR} / ${HAUTEUR}` }} className="relative bg-surface">
            {charge ? (
              <iframe
                src={LIEN_DEMO_APP}
                title={manager('aria')}
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                className="absolute inset-0 size-full border-0"
              />
            ) : (
              <Image
                src={accueilManager}
                alt={manager('captureAlt')}
                fill
                sizes="390px"
                className="object-cover object-top"
              />
            )}
          </div>
        </div>

        {/* Deux commandes qui s'excluent. Le bouton est masque sous 1 000 px,
            donc hors du tabulateur ; et `lancer` verifie la largeur, donc meme
            un appel force ne cree rien — verifie dans le navigateur. */}
        {!charge ? (
          <button
            type="button"
            onClick={lancer}
            className="text-bouton hidden min-h-11 items-center gap-2 rounded-capsule bg-cta px-6 py-3 font-bold text-cta-encre desktop:inline-flex"
          >
            {t('bouton')}
          </button>
        ) : null}

        {/* La visibilite est portee par l'enveloppe, pas par le CTA : sa
            classe `inline-flex` de base l'emporterait sur un `hidden` passe en
            className, les deux reglant la meme propriete. Le piege est
            documente dans l'en-tete du site, il vient de se reproduire ici. */}
        <div className="desktop:hidden">
          <Cta href={LIEN_DEMO_APP} target="_blank" rel="noopener" variante="secondaire">
            {manager('lienDemo')}
          </Cta>
        </div>
      </Reveal>
    </Section>
  );
}
