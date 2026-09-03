import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/** Les trois etats d'une mission, dans l'ordre. */
const ETATS = ['etape1', 'etape2', 'etape3'] as const;

/**
 * Double controle et PRET — brief V8 §9.
 *
 * La regle produit avant le decor : la personne qui controle n'est pas celle
 * qui a execute. Le bien ne passe en PRET qu'apres validation.
 *
 * La frise nomme ses trois etats en toutes lettres et les numerote : aucune
 * information n'y est portee par la seule couleur, et l'ordre se lit meme
 * sans voir les fleches, qui sont decoratives.
 *
 * Pas de pourcentage, pas de compteur de personnes — le §9 les exclut, et le
 * §3 rappelle que Choucas mesure les biens, jamais les gens.
 */
export function ReadyState() {
  const t = useTranslations('pret');

  return (
    <Section fond="fond-alt" aria-labelledby="pret-titre">
      <Reveal>
        <SectionHeader
          id="pret-titre"
          align="centre"
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          intro={t('corps')}
        />
      </Reveal>

      <Reveal
        as="ol"
        group
        aria-label={t('etapesAria')}
        className="mt-titre flex flex-col items-stretch gap-3 tablette:flex-row tablette:items-center tablette:justify-center"
      >
        {ETATS.map((cle, i) => {
          const dernier = i === ETATS.length - 1;
          return (
            <li
              key={cle}
              style={{ ['--i' as string]: i }}
              className="flex items-center gap-3 tablette:contents"
            >
              <div
                className={[
                  'flex flex-1 items-center gap-3 rounded-capsule border px-5 py-3 tablette:flex-none',
                  // Le dernier etat est le seul en Sapin : c'est le moment de
                  // transformation, ce que la charte reserve a cette couleur.
                  dernier
                    ? 'border-cta bg-cta text-cta-encre'
                    : 'border-filet bg-surface text-encre',
                ].join(' ')}
              >
                <span
                  aria-hidden
                  className={`text-numero font-semibold tabular-nums ${
                    dernier ? 'text-cta-encre/70' : 'text-encre-douce'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-bouton font-semibold">{t(cle)}</span>
              </div>

              {!dernier ? (
                <Icon
                  name="fleche"
                  size={20}
                  className="shrink-0 rotate-90 text-encre-douce tablette:rotate-0"
                />
              ) : null}
            </li>
          );
        })}
      </Reveal>
    </Section>
  );
}
