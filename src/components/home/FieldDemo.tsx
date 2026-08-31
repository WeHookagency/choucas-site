'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

const POINTS = ['mission', 'taches', 'signalement'] as const;
const TACHES = ['chambres', 'bains', 'cuisine'] as const;
const NAV = ['planning', 'missions', 'stocks', 'equipe'] as const;

/**
 * Telephone de demonstration — specs §6.4.
 *
 * Base 370 x 760, rayon 48. Largeur fluide plafonnee a 370 plutot qu'une mise
 * a l'echelle par transform : le texte reste net et rien ne deborde en mobile.
 *
 * Les trois taches sont de vrais boutons a bascule, comme l'exigent les specs
 * §6.4 et §7. `aria-pressed` porte l'etat : la coche seule ne suffirait pas,
 * un changement d'etat ne peut pas dependre de la seule couleur.
 */
function Telephone() {
  const t = useTranslations('terrain.ecran');
  const noms = useTranslations('manager.noms');
  const [faites, setFaites] = useState<string[]>(['chambres']);
  const idTaches = useId();

  const bascule = (cle: string) =>
    setFaites((v) => (v.includes(cle) ? v.filter((c) => c !== cle) : [...v, cle]));

  return (
    <div
      aria-label={t('aria')}
      role="group"
      className="mx-auto w-full max-w-[370px] rounded-telephone border border-filet bg-surface p-4 shadow-carte"
    >
      <div className="rounded-produit bg-fond p-4">
        <p className="text-label font-semibold uppercase text-encre-douce">
          {t('mission')} · {t('heure')}
        </p>
        <p className="font-serif text-h3 mt-1">{noms('belvedere')}</p>
      </div>

      {/* Attention : Ambre assombri, 5,44:1 — l'Ambre clair de la charte
          echoue en texte, il ne sert qu'en aplat. */}
      <div className="mt-3 rounded-carte border border-filet bg-surface p-3">
        <p className="text-label flex items-center gap-2 font-semibold uppercase text-attention">
          <Icon name="alerte" size={16} />
          {t('alerteTitre')}
        </p>
        <p className="text-micro mt-1">{t('alerte')}</p>
      </div>

      <div className="mt-3 rounded-carte border border-filet bg-surface p-3">
        <div className="flex items-baseline justify-between">
          <p id={idTaches} className="text-label font-semibold uppercase text-encre-douce">
            {t('tachesTitre')}
          </p>
          <p className="text-micro font-semibold tabular-nums">
            {t('progression', { faites: faites.length, total: TACHES.length })}
          </p>
        </div>

        <ul aria-labelledby={idTaches} className="mt-2 space-y-1">
          {TACHES.map((cle) => {
            const fait = faites.includes(cle);
            return (
              <li key={cle}>
                <button
                  type="button"
                  onClick={() => bascule(cle)}
                  aria-pressed={fait}
                  className="text-micro flex min-h-11 w-full items-center gap-3 rounded-carte px-2 text-left transition-colors duration-200 ease-choucas hover:bg-fond"
                >
                  <span
                    aria-hidden
                    className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                      fait ? 'border-ok bg-ok text-cta-encre' : 'border-filet'
                    }`}
                  >
                    {fait ? <Icon name="coche" size={16} /> : null}
                  </span>
                  <span className={fait ? 'text-encre-douce line-through' : undefined}>
                    {t(cle)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        className="text-micro mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-capsule border border-erreur font-semibold text-erreur"
      >
        <Icon name="alerte" size={20} />
        {t('signaler')}
      </button>

      <nav aria-label={t('navAria')} className="mt-4 flex justify-between border-t border-filet pt-3">
        {NAV.map((cle, i) => (
          <button
            key={cle}
            type="button"
            aria-current={i === 1 ? true : undefined}
            className={`text-micro min-h-11 flex-1 ${i === 1 ? 'font-semibold text-encre' : 'text-encre-douce'}`}
          >
            {t(cle)}
          </button>
        ))}
      </nav>
    </div>
  );
}

/**
 * Demonstration mobile terrain — specs §6.4.
 *
 * Texte a gauche, telephone a droite sur desktop ; une colonne en dessous.
 * Animation : le texte d'abord, le telephone en dernier (brief V7, section 04).
 */
export function FieldDemo() {
  const t = useTranslations('terrain');

  return (
    <Section fond="fond" aria-labelledby="terrain-titre">
      {/* Un seul groupe : le texte entre d'abord, le telephone en dernier,
          « comme un element du groupe » — brief d'animation V7. */}
      <Reveal group className="grid items-center gap-12 desktop:grid-cols-[1fr_430px]">
        <div style={{ ['--i' as string]: 0 }}>
          <p className="text-label font-semibold uppercase text-encre-douce">{t('label')}</p>
          <h2 id="terrain-titre" className="font-serif text-h2 mt-4 text-balance">
            {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          </h2>
          <p className="text-intro mt-6 max-w-[62ch] text-encre-douce">{t('intro')}</p>
          <ul className="mt-titre space-y-3">
            {POINTS.map((cle) => (
              <li key={cle} className="text-corps flex items-start gap-3">
                <Icon name="coche" size={24} graisse="bold" className="mt-px shrink-0 text-ok" />
                {t(`points.${cle}`)}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ ['--i' as string]: 3 }}>
          <Telephone />
        </div>
      </Reveal>
    </Section>
  );
}
