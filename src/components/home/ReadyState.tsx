import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * PRET — le cœur du systeme.
 *
 * Section issue du §3 du fichier contenus, posee entre « Du brief a la
 * preuve » et « L'hospitalite en action ». Elle nomme l'etat vers lequel
 * toute la chaine converge, et la regle qui le fonde : le controle et
 * l'execution ne sont pas la meme personne.
 *
 * Fond panneau : la section precede l'hospitalite, en fond clair, et suit
 * « Du brief a la preuve », en fond encre. Le palier intermediaire evite deux
 * fonds identiques cote a cote.
 *
 * Aucune ancre de navigation : la barre ne pointe pas ici. L'identifiant du
 * titre ne sert qu'a nommer la section pour les lecteurs d'ecran.
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
    </Section>
  );
}
