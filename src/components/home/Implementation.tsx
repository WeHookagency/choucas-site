import { useTranslations } from 'next-intl';

import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
import { Card } from '../ui/Card';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/** Les quatre temps de l'implantation. L'ordre porte du sens : chacun
 *  suppose le precedent, d'ou la numerotation visible. */
const ETAPES = ['observer', 'structurer', 'configurer', 'tester'] as const;

/**
 * Implantation — brief V8 §12.
 *
 * Explique pourquoi Choucas n'est pas un outil vide a parametrer soi-meme.
 * Le vocabulaire est contraint : on configure un produit commun, on ne
 * developpe pas du sur-mesure.
 *
 * Porte l'ancre `implantation` de la navigation.
 */
export function Implementation() {
  const t = useTranslations('implantation');

  return (
    <Section id={ancres.implantation} fond="fond" aria-labelledby="implantation-titre">
      <Reveal>
        <SectionHeader
          id="implantation-titre"
          align="centre"
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          intro={t('intro')}
        />
      </Reveal>

      <Reveal as="ol" group className="mt-titre grid gap-5 tablette:grid-cols-2 desktop:grid-cols-4">
        {ETAPES.map((cle, i) => (
          <li key={cle} style={{ ['--i' as string]: i }}>
            <Card rayon="majeure" className="flex h-full flex-col">
              <span aria-hidden className="text-numero font-semibold tabular-nums text-encre-douce">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-h3 mt-3">{t(`etapes.${cle}.titre`)}</h3>
              <p className="text-corps mt-3 text-encre-douce">{t(`etapes.${cle}.texte`)}</p>
            </Card>
          </li>
        ))}
      </Reveal>

      <Reveal className="mt-titre">
        <p className="text-intro text-center font-semibold">{t('cloture')}</p>
      </Reveal>
    </Section>
  );
}
