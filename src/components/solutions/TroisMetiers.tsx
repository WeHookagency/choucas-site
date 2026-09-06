import { useTranslations } from 'next-intl';

import { FiletAccent } from '../ui/FiletAccent';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Les trois metiers de la conciergerie, avant les volets qui les detaillent.
 *
 * Le titre ne parle pas d'ecrans, contrairement a la maquette : seuls le
 * Manager et le Terrain ouvrent Choucas. Le dirigeant garde sa place — c'est
 * un metier de la journee — mais sa ligne est au registre du benefice, ce que
 * le service devient, jamais ce qu'il ferait dans l'outil.
 *
 * Aucune illustration : les photographies de la maquette n'existent pas, et
 * trois aplats vides en haut de page valaient moins que trois colonnes de
 * texte.
 */
const METIERS = ['dirigeant', 'exploitation', 'terrain'] as const;

export function TroisMetiers() {
  const t = useTranslations('solutions.metiers');

  return (
    <Section fond="fond" aria-labelledby="metiers-titre">
      <Reveal>
        <FiletAccent />
        <h2 id="metiers-titre" className="font-serif text-h3 mt-6 max-w-[20ch] text-balance">
          {t('titre')}
        </h2>
      </Reveal>

      <Reveal as="ul" group className="mt-titre grid gap-8 tablette:grid-cols-3">
        {METIERS.map((cle) => (
          <li key={cle} className="border-t border-filet pt-6">
            <h3 className="font-serif text-h3 text-balance">{t(`${cle}.role`)}</h3>
            <p className="text-corps mt-3 text-encre-douce">{t(`${cle}.phrase`)}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
