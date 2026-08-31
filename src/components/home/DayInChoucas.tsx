'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Card } from '../ui/Card';
import { Icon, type IconName } from '../ui/Icon';
import { Panneau, Tablist, type Onglet } from '../ui/Tablist';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/** Les quatre moments. `icone` vient du §6.9, qui demande que le changement
 *  mette a jour l'icone aussi — la maquette n'en dessine pas. */
const MOMENTS = [
  { cle: 'preparer', icone: 'calendrier' },
  { cle: 'coordonner', icone: 'equipe' },
  { cle: 'controler', icone: 'mission' },
  { cle: 'accueillir', icone: 'bien' },
] as const satisfies readonly { cle: string; icone: IconName }[];

/**
 * Moments dont le panneau est ecrit. Meme regle qu'au §6.6 : deposer les
 * chaines, puis ajouter la cle ici.
 */
const PANNEAUX = ['preparer', 'coordonner', 'controler', 'accueillir'] as const;
type PanneauCle = (typeof PANNEAUX)[number];

const estPret = (cle: string): cle is PanneauCle =>
  (PANNEAUX as readonly string[]).includes(cle);

/**
 * Une journee dans Choucas — specs §6.9.
 *
 * Quatre onglets horizontaux et un detail en trois colonnes sur desktop ;
 * grille 2 x 2 pour les heures et detail en une colonne sur mobile.
 *
 * Comme au §6.6, trois panneaux attendent leur copie : leur onglet reste
 * visible et inactivable jusqu'a ce que les chaines arrivent.
 */
export function DayInChoucas() {
  const t = useTranslations('journee');
  const [actif, setActif] = useState<PanneauCle>('preparer');

  const onglets: Onglet[] = MOMENTS.map(({ cle }) => ({
    id: cle,
    pret: estPret(cle),
    libelle: (
      <span className="flex flex-col items-center gap-0.5 tablette:flex-row tablette:gap-2">
        <span className="font-semibold">{t(`moments.${cle}.heure`)}</span>
        <span aria-hidden className="hidden tablette:inline opacity-50">
          ·
        </span>
        <span>{t(`moments.${cle}.verbe`)}</span>
      </span>
    ),
  }));

  const icone = MOMENTS.find((m) => m.cle === actif)?.icone ?? 'horloge';

  return (
    <Section fond="fond" aria-labelledby="journee-titre">
      <SectionHeader
        id="journee-titre"
        align="centre"
        label={t('label')}
        titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
      />

      <Tablist
        idBase="journee"
        onglets={onglets}
        actif={actif}
        onChange={(id) => estPret(id) && setActif(id)}
        aria-label={t('label')}
        // Grille 2 x 2 sur mobile, ligne unique des la tablette.
        className="mt-titre grid grid-cols-2 gap-3 tablette:flex tablette:justify-center"
        classeOnglet={({ actif: sel, pret }) =>
          [
            'min-h-11 rounded-capsule border px-5 py-3 text-bouton',
            'transition-colors duration-200 ease-choucas',
            sel
              ? 'border-cta bg-cta text-cta-encre font-semibold'
              : 'border-filet bg-surface text-encre',
            pret ? '' : 'opacity-45',
          ].join(' ')
        }
      />

      <Panneau idBase="journee" id={actif} className="mt-titre">
        <div className="grid gap-8 desktop:grid-cols-3 desktop:gap-12">
          <div>
            <p className="text-label font-semibold uppercase text-encre-douce">
              {t(`moments.${actif}.heure`)} · {t(`moments.${actif}.verbe`)}
            </p>
            <h3 className="font-serif text-h3 mt-4 text-balance">
              {t(`panneaux.${actif}.titre`)}
            </h3>
          </div>

          <p className="text-corps text-encre-douce">{t(`panneaux.${actif}.texte`)}</p>

          <Card rayon="majeure" ombre>
            <p className="text-label flex items-center gap-2 font-semibold uppercase text-encre-douce">
              <Icon name={icone} size={20} />
              {t(`panneaux.${actif}.carteTitre`)}
            </p>
            {t(`panneaux.${actif}.carteLigne`) ? (
              <p className="text-corps mt-3">{t(`panneaux.${actif}.carteLigne`)}</p>
            ) : null}
            {/* Mousse sur Glacier : preuve positive, 4,95:1 sur Neige. */}
            <p className="text-corps mt-1 text-ok">{t(`panneaux.${actif}.carteEtat`)}</p>
          </Card>
        </div>
      </Panneau>
    </Section>
  );
}
