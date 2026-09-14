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
 */
export function OperationalTension() {
  const t = useTranslations('tension');

  return (
    <Section fond="fond" aria-labelledby="tension-titre">
      <Reveal className="grid gap-10 desktop:grid-cols-12 desktop:gap-16">
        <div className="desktop:col-span-5">
          <p className="text-label font-semibold uppercase text-encre-douce">
            {t('label')}
          </p>
          <Photo
            src="/demo/Unsplash.jpg"
            alt={t('photoAlt')}
            className="mx-auto mt-8 max-w-[460px] desktop:mx-0 desktop:max-w-none"
          />
        </div>

        <div className="desktop:col-span-7 desktop:pt-20">
          <h2 id="tension-titre" className="font-serif text-h2 text-balance">
            {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          </h2>
        </div>
      </Reveal>
    </Section>
  );
}
