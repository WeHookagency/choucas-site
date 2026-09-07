import { useTranslations } from 'next-intl';

import accueilManager from '../../../public/demo/accueil-manager.png';
import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
import { CaptureProduit } from '../ui/CaptureProduit';
import { Reveal } from '../ui/Reveal';

/**
 * Demonstration Manager — specs §6.3.
 *
 * Une capture reelle de l'application posee sur la surface mousse, qui porte
 * la promesse du §6.3 — « prouver que Choucas est un produit operationnel
 * reel ». Elle montre l'accueil manager dans l'ordre ou il se lit : le verdict
 * du jour, les trois exceptions qui demandent une attention, puis le debut de
 * la journee avec ses horaires.
 *
 * Le titre annonce trois choses : la capture doit en montrer exactement trois,
 * sinon il devient faux. C'est une contrainte sur l'image, pas une preference
 * — remplacer la capture sans recompter les exceptions casse la section.
 *
 * La capture rejoint le bord bas de la tuile : elle y est coupee en pleine
 * liste, et cette coupe dit que l'ecran continue. Auparavant elle flottait au
 * milieu, avec une bande de Lichen sous elle qui laissait la tuile inachevee.
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
          className="rounded-t-[28px] bg-respiration px-marge pt-10"
        >
          {/* Les mesures sont posees sur les elements, pas sur l'enveloppe.
              Un `max-w-[62ch]` pose ici enfermait le titre dans 529 px : `ch`
              se resout sur la police du div — Manrope 16 px herite — et non
              sur les 75 px du H2. La boite ne grandissait donc pas de 1024 a
              1440 alors que le corps passait de 55 a 75 px, et le titre
              tombait a quatre lignes. Chaque bloc porte desormais sa propre
              mesure, dans sa propre police, comme `SectionHeader` le fait. */}
          <div className="text-center">
            <p className="text-label font-semibold uppercase text-encre">{t('label')}</p>
            {/* 24ch : le dernier palier qui tient deux lignes a 768, 1024 et
                1440 — a 22ch il en faut trois, sans plafond le titre s'etire
                sur 1 360 px et perd sa colonne. */}
            <h2
              id="manager-titre"
              className="font-serif text-h2 mx-auto mt-4 max-w-[24ch] text-balance"
            >
              {/* Panneau Lichen : le cuivre y mesure 1,45:1. L'accent tient par
                  l'italique seul, en encre pleine a 6,57:1. */}
              {t.rich('titre', { accent: (chunks) => <Accent ton="encre">{chunks}</Accent> })}
            </h2>
            <p className="text-corps mx-auto mt-4 max-w-[62ch] text-encre">{t('intro')}</p>
          </div>

          {/* Sans ombre : elle se posait sur la coupe et refermait l'ecran
              que la coupe doit laisser ouvert. */}
          <CaptureProduit
            src={accueilManager}
            alt={t('captureAlt')}
            libelleLien={t('lienDemo')}
            rayon="haut"
            ombre={false}
            className="mt-8"
          />
        </div>
      </Reveal>
    </section>
  );
}
