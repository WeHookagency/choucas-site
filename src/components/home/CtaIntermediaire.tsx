import { useTranslations } from 'next-intl';

import { ATTRS_DEMO, LIEN_DEMO } from '../anchors';
import { Cta } from '../ui/Cta';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Bande d'appel intermediaire, juste apres la section PRET.
 *
 * Le visiteur vient de lire que celui qui controle n'est jamais celui qui a
 * execute. La phrase lui retourne la regle ; le bouton ouvre la porte a celui
 * qui n'a pas besoin de lire les six sections suivantes.
 *
 * Ce n'est pas une section : ni titre, ni surtitre, ni ombre solide — ils
 * restent au CTA final, quatre a six ecrans plus bas, qui pose seul les
 * termes de la rencontre. Le bouton est en variante secondaire pour la meme
 * raison : meme libelle, meme destination, mais les deux cessent d'etre
 * jumeaux et la hierarchie se lit a l'oeil.
 *
 * Le fond prolonge celui de la section PRET, un filet l'en detache : la bande
 * se lit comme sa chute, pas comme une coupure dans la descente.
 *
 * Aucun titre, donc aucun nom accessible : le `section` n'est pas expose
 * comme repere et n'encombre pas la liste des regions.
 */
export function CtaIntermediaire() {
  const t = useTranslations('ctaIntermediaire');
  const actions = useTranslations('actions');

  return (
    <Section fond="fond-alt" sansRythme>
      <Reveal className="flex flex-col gap-5 border-t border-filet py-8 tablette:flex-row tablette:items-center tablette:justify-between tablette:gap-8 desktop:py-10">
        <p className="text-intro max-w-[42ch] font-semibold">{t('phrase')}</p>
        <Cta href={LIEN_DEMO} {...ATTRS_DEMO} variante="secondaire" className="shrink-0">
          {actions('demo')}
        </Cta>
      </Reveal>
    </Section>
  );
}
