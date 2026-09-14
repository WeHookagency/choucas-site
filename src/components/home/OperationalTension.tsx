import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Photo } from '../ui/Photo';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Tension operationnelle — specs §6.5.
 *
 * Deux colonnes asymetriques : etiquette courte et photo a gauche,
 * declaration editoriale a droite. Pas de paragraphe explicatif, les specs
 * l'interdisent — le probleme s'enonce, il ne se commente pas.
 *
 * Une seule partie du message est en cuivre, la derniere phrase.
 * Animation : un reveal unique sur l'ensemble (brief V7, section 05).
 *
 * Remis sur la Home le 14 septembre 2026, apres avoir ete deference : la page
 * ouvrait sur la solution et enchainait sur le fonctionnement, sans jamais
 * poser le probleme. Le lecteur doit reconnaitre sa propre journee avant
 * d'entendre la reponse.
 *
 * La photo est centree sous le seuil desktop. Plafonnee a 460 dans une
 * colonne de 712 a la tablette, elle laissait 252 px de trou d'un seul cote —
 * un trou symetrique se lit comme une marge, un trou d'un seul cote comme un
 * oubli.
 *
 * ---------------------------------------------------------------------------
 * L'ETIQUETTE A REJOINT LE TITRE, le 15 septembre 2026.
 *
 * Elle vivait dans la colonne de la photo. Sur desktop personne ne le voyait :
 * deux colonnes cote a cote, on lit l'etiquette puis le titre a droite. Sous
 * 1 000 px la grille s'empile et l'ordre du DOM devient l'ordre de lecture —
 * etiquette, PHOTO, titre. La phrase d'ouverture et la declaration qu'elle
 * annonce se retrouvaient separees par 300 px d'image, et le titre tombait
 * sans amorce.
 *
 * Les deux appartiennent au meme bloc de texte : elles voyagent ensemble a
 * toutes les largeurs. Et ce bloc passe DEVANT la photo en mobile — la phrase
 * pose le probleme, l'image l'incarne ; l'inverse fait legender la photo par
 * le titre.
 *
 * Sur desktop rien ne bouge a l'ecran : la photo est renvoyee en colonne 1 par
 * `col-start-1 row-start-1`, le texte en colonne 2. La composition asymetrique
 * des specs §6.5 — photo a gauche, declaration a droite — est intacte, seul
 * l'ordre du DOM a change.
 * ---------------------------------------------------------------------------
 */
export function OperationalTension() {
  const t = useTranslations('tension');

  return (
    <Section fond="fond" aria-labelledby="tension-titre">
      <Reveal className="grid gap-10 desktop:grid-cols-12 desktop:gap-16">
        {/* Etiquette et titre, indissociables. `desktop:pt-20` cale la
            declaration sur le tiers haut de la photo, comme avant. */}
        <div className="desktop:col-span-7 desktop:col-start-6 desktop:row-start-1 desktop:pt-20">
          <p className="text-label font-semibold uppercase text-encre-douce">
            {t('label')}
          </p>
          <h2 id="tension-titre" className="font-serif text-h2 mt-4 text-balance">
            {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          </h2>
        </div>

        <div className="desktop:col-span-5 desktop:col-start-1 desktop:row-start-1">
          <Photo
            src="/demo/Unsplash.jpg"
            alt={t('photoAlt')}
            className="mx-auto max-w-[460px] desktop:mx-0 desktop:max-w-none"
          />
        </div>
      </Reveal>
    </Section>
  );
}
