import { useTranslations } from 'next-intl';

import { ancres, ATTRS_DEMO, LIEN_DEMO } from '../anchors';
import { Accent } from '../ui/Accent';
import { Cta } from '../ui/Cta';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * CTA final — specs §6.11.
 *
 * Fond encre, un seul CTA primaire, microcopie sous le bouton. C'est la
 * cible des liens « Demander une demo » de la barre et du hero.
 *
 * Animation : un reveal simple sur le bloc entier (brief V7, section 11).
 */
export function FinalCta() {
  const t = useTranslations('ctaFinal');

  return (
    <Section id={ancres.demo} fond="sombre" aria-labelledby="cta-titre">
      <Reveal className="text-center">
        <SectionHeader
          id="cta-titre"
          align="centre"
          inverse
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent ton="inverse">{chunks}</Accent> })}
          intro={t('intro')}
        />

        {/* Libelle propre a cette section : `actions.demo` sert la barre et
            le hero, le changer ici aurait renomme les trois. La ligne
            « 30 minutes · Avec vos cas operationnels » est retiree le
            7 septembre 2026 ; `ctaFinal.micro` reste dans les deux fichiers de
            traduction. */}
        <div className="mt-titre flex justify-center">
          <Cta href={LIEN_DEMO} {...ATTRS_DEMO} fleche>
            {t('action')}
          </Cta>
        </div>
      </Reveal>
    </Section>
  );
}
