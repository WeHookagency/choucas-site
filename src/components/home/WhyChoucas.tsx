import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';

import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

const AVANT = ['messages', 'calendriers', 'appels', 'stocks'] as const;
const APRES = ['rotations', 'missions', 'stocks', 'preuves'] as const;

/** Fleche du flux. Horizontale sur desktop, tournee d'un quart de tour quand
 *  le flux se redresse en colonne — les specs §6.8 le demandent. */
function FlecheFlux({ style }: { style?: CSSProperties }) {
  return (
    <div style={style} className="flex justify-center text-encre-douce">
      <Icon name="fleche" size={24} className="rotate-90 desktop:rotate-0" />
    </div>
  );
}

/**
 * Pourquoi Choucas — specs §6.8.
 *
 * Le flux se lit « informations dispersees → moteur Choucas → operations
 * synchronisees ». Il se redresse en colonne sous 1000 px, fleches tournees,
 * plutot que de revenir au tableau comparatif que les specs interdisent.
 *
 * Les trois chiffres sont une expression de design : les specs §6.8 et §11
 * demandent leur validation juridique et marketing avant publication.
 *
 * Animation : avant, moteur, apres en sequence, puis les chiffres (brief V7).
 */
export function WhyChoucas() {
  const t = useTranslations('pourquoi');

  return (
    <Section id={ancres.pourquoi} fond="fond-alt" aria-labelledby="pourquoi-titre">
      <Reveal>
        <SectionHeader
          id="pourquoi-titre"
          align="centre"
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
        />
      </Reveal>

      <Reveal
        group
        className="mt-titre grid items-center gap-5 desktop:grid-cols-[1fr_auto_minmax(0,0.8fr)_auto_1fr]"
      >
        <Card style={{ '--i': 0 } as CSSProperties} rayon="majeure" className="h-full">
          <p className="text-label font-semibold uppercase text-encre-douce">
            {t('avant.titre')}
          </p>
          <ul className="mt-5 space-y-2">
            {AVANT.map((cle) => (
              <li key={cle} className="text-corps">
                {t(`avant.${cle}`)}
              </li>
            ))}
          </ul>
        </Card>

        <FlecheFlux style={{ '--i': 0 } as CSSProperties} />

        {/* Le Sapin porte les moments de transformation — c'est son role
            dans la charte, et le moteur est exactement cela. */}
        <div
          style={{ '--i': 1 } as CSSProperties}
          className="rounded-carte-majeure border-2 border-cta bg-cta px-6 py-8 text-center text-cta-encre shadow-carte"
        >
          <p className="font-serif text-h3">{t('moteur.nom')}</p>
          <p className="text-corps mt-3">{t('moteur.verbes')}</p>
        </div>

        <FlecheFlux style={{ '--i': 1 } as CSSProperties} />

        <Card
          style={{ '--i': 2 } as CSSProperties}
          accent="forte"
          rayon="majeure"
          className="h-full"
        >
          <p className="text-label font-semibold uppercase text-encre-douce">
            {t('apres.titre')}
          </p>
          <ul className="mt-5 space-y-2">
            {APRES.map((cle) => (
              <li key={cle} className="text-corps">
                {t(`apres.${cle}`)}
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>

      <Reveal as="ul" className="mt-titre grid gap-8 text-center tablette:grid-cols-3">
        {(
          [
            ['vueValeur', 'vueLibelle'],
            ['perteValeur', 'perteLibelle'],
            ['contexteValeur', 'contexteLibelle'],
          ] as const
        ).map(([valeur, libelle]) => (
          <li key={valeur}>
            <p className="font-serif text-h3 tabular-nums">{t(`resultats.${valeur}`)}</p>
            <p className="text-corps mt-1 text-encre-douce">{t(`resultats.${libelle}`)}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
