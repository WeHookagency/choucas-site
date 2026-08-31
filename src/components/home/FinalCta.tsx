import { useTranslations } from 'next-intl';

import { ancres, LIEN_DEMO } from '../anchors';
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
  const actions = useTranslations('actions');

  return (
    <Section id={ancres.demo} fond="sombre" aria-labelledby="cta-titre">
      <Reveal className="text-center">
        <SectionHeader
          id="cta-titre"
          align="centre"
          inverse
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          intro={t('intro')}
        />

        <div className="mt-titre flex flex-col items-center gap-4">
          <Cta href={LIEN_DEMO} fleche pleineLargeur>
            {actions('demo')}
          </Cta>
          <p className="text-micro text-encre-inverse/75">{t('micro')}</p>
        </div>
      </Reveal>
    </Section>
  );
}
