import { useTranslations } from 'next-intl';

import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/** Qui fait quoi, dans l'ordre : le terrain, l'outil, le manager. */
const LIGNES = ['terrain', 'choucas', 'manager'] as const;

/**
 * Philosophie — brief V8 §11. Cette section remplace `WhyChoucas`.
 *
 * Editoriale et courte : ni tableau avant/apres, ni indicateur. La regle
 * produit y est enoncee telle quelle — Choucas mesure les biens et les
 * missions, jamais les personnes.
 *
 * Porte l'ancre `a-propos` de la navigation.
 */
export function Philosophy() {
  const t = useTranslations('philosophie');

  return (
    <Section id={ancres.aPropos} fond="fond-alt" aria-labelledby="philosophie-titre">
      <Reveal>
        <SectionHeader
          id="philosophie-titre"
          align="centre"
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          intro={t('intro')}
        />
      </Reveal>

      <Reveal as="ul" group className="mt-titre grid gap-4 tablette:grid-cols-3">
        {LIGNES.map((cle, i) => (
          <li
            key={cle}
            style={{ ['--i' as string]: i }}
            className="text-corps border-t border-filet pt-4 font-semibold"
          >
            {t(`lignes.${cle}`)}
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
