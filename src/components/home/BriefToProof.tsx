'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
import { Panneau, Tablist, type Onglet } from '../ui/Tablist';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/** Les quatre onglets. Leurs libelles sont tous dessines. */
const ONGLETS = ['brief', 'rotations', 'missions', 'stocks'] as const;

/**
 * Panneaux dont la copie est ecrite. Le jour ou un panneau arrive, deposer
 * ses chaines puis ajouter sa cle ici : TypeScript refuse de compiler une
 * cle listee dont les chaines manquent.
 */
const PANNEAUX = ['brief', 'rotations', 'missions', 'stocks'] as const;
type PanneauCle = (typeof PANNEAUX)[number];

const estPret = (cle: string): cle is PanneauCle =>
  (PANNEAUX as readonly string[]).includes(cle);

/**
 * Du brief a la preuve — specs §6.6.
 *
 * Fond encre, texte clair. Quatre onglets, un seul panneau visible. Onglets
 * et panneau en deux colonnes sur desktop, empiles en dessous.
 *
 * Trois panneaux sur quatre n'ont pas encore de copie : la maquette ne
 * dessine que l'onglet actif. Leur onglet reste visible et inactivable —
 * `t.has` decide. Deposer les chaines suffit a les activer, sans toucher
 * a ce fichier.
 */
export function BriefToProof() {
  const t = useTranslations('brief');
  const [actif, setActif] = useState<PanneauCle>('brief');

  const onglets: Onglet[] = ONGLETS.map((cle, i) => ({
    id: cle,
    pret: estPret(cle),
    libelle: (
      <span className="flex items-baseline gap-3">
        <span aria-hidden className="text-label opacity-60">
          {String(i + 1).padStart(2, '0')}
        </span>
        {t(`onglets.${cle}`)}
      </span>
    ),
  }));

  return (
    <Section id={ancres.fonctionnement} fond="sombre" aria-labelledby="brief-titre">
      <SectionHeader
        id="brief-titre"
        align="centre"
        inverse
        label={t('label')}
        titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
      />

      <div className="mt-titre grid gap-6 desktop:grid-cols-2 desktop:gap-10">
        <Tablist
          idBase="brief"
          orientation="verticale"
          onglets={onglets}
          actif={actif}
          onChange={(id) => estPret(id) && setActif(id)}
          aria-label={t('label')}
          className="flex flex-col gap-3"
          classeOnglet={({ actif: sel, pret }) =>
            [
              'w-full rounded-carte border px-5 py-4 text-left text-corps',
              'transition-colors duration-200 ease-choucas',
              sel
                ? 'border-encre-inverse/45 bg-encre-inverse/10 font-semibold'
                : 'border-encre-inverse/15',
              // Un onglet sans copie s'annonce comme tel, sans disparaitre.
              pret ? 'hover:border-encre-inverse/40' : 'opacity-45',
            ].join(' ')
          }
        />

        <Panneau idBase="brief" id={actif} className="rounded-carte border border-encre-inverse/15 p-6 desktop:p-8">
          <h3 className="font-serif text-h3">{t(`panneaux.${actif}.titre`)}</h3>
          <p className="text-corps mt-4 text-encre-inverse/85">
            {t(`panneaux.${actif}.texte`)}
          </p>

          <p className="text-corps mt-6 rounded-carte border border-cta bg-cta/40 px-4 py-3">
            <span className="text-label font-semibold uppercase">
              {t('resultatLabel')}
            </span>
            <span aria-hidden> — </span>
            {t(`panneaux.${actif}.resultat`)}
          </p>
        </Panneau>
      </div>
    </Section>
  );
}
