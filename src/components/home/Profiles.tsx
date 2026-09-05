import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Card } from '../ui/Card';
import { Icon, type IconName } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * Les trois profils, dans l'ordre de la maquette. `icone` vient des specs
 * §6.10, qui demandent une icone par carte la ou la maquette n'en dessine
 * pas — le document prime pour les regles techniques.
 */
const PROFILS = [
  { cle: 'dirigeant', icone: 'bien' },
  { cle: 'exploitation', icone: 'calendrier' },
  { cle: 'terrain', icone: 'mission' },
] as const satisfies readonly { cle: string; icone: IconName }[];

/**
 * Profils utilisateurs — specs §6.10.
 *
 * Trois colonnes sur desktop ; en tablette, deux cartes puis la troisieme
 * pleine largeur ; une colonne en mobile. Carte centrale en Sapin, laterales
 * en surface claire, bordure 2 px partout.
 *
 * Aucun CTA « Decouvrir » dans les cartes : les specs l'interdisent tant
 * qu'aucune page de role n'existe.
 */
export function Profiles() {
  const t = useTranslations('profils');

  return (
    <Section fond="fond-alt" aria-labelledby="profils-titre">
      <Reveal>
        <SectionHeader
          id="profils-titre"
          align="centre"
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
        />
      </Reveal>

      <Reveal
        group
        as="ul"
        className="mt-titre grid gap-5 tablette:grid-cols-2 desktop:grid-cols-3"
      >
        {PROFILS.map(({ cle, icone }, i) => {
          const central = i === 1;
          return (
            <li
              key={cle}
              style={{ '--i': i } as CSSProperties}
              // La troisieme carte prend toute la largeur en tablette : deux
              // colonnes laisseraient un vide a sa droite.
              className={i === 2 ? 'tablette:col-span-2 desktop:col-span-1' : undefined}
            >
              <Card
                accent={central ? 'sapin' : 'forte'}
                rayon="majeure"
                ombre
                className="flex h-full flex-col"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    aria-hidden
                    className={`text-numero font-semibold tabular-nums ${central ? 'text-cta-encre/70' : 'text-encre-douce'}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-label font-semibold uppercase">
                    {t(`${cle}.verbe`)}
                  </span>
                </div>

                <Icon name={icone} size={28} className="mt-6" />

                {/* Titre de la carte : il en a le poids visuel, il en prend
                    le niveau. */}
                <h3 className="font-serif text-h3 mt-4">{t(`${cle}.role`)}</h3>
                <p className="text-corps mt-3">{t(`${cle}.phrase`)}</p>

                <p className="text-corps mt-auto flex items-start gap-2 pt-6 font-semibold">
                  <Icon name="coche" size={24} className="mt-0.5 shrink-0" />
                  {t(`${cle}.benefice`)}
                </p>
              </Card>
            </li>
          );
        })}
      </Reveal>
    </Section>
  );
}
