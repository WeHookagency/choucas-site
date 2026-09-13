import { useLocale, useTranslations } from 'next-intl';

import { Cta } from '../ui/Cta';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { getPathname } from '@/i18n/navigation';

/**
 * Les deux chiffres du prix, sur la Home.
 *
 * Ce n'est pas un resume de la page : c'est ce qu'un dirigeant cherche avant
 * de decider s'il continue a lire. Deux montants, ce qu'ils achetent, et un
 * lien vers le detail.
 *
 * Elle arrive apres l'implantation et avant la FAQ : la journee sur site vient
 * d'etre racontee, le demarrage est le prix de cette journee-la. L'ordre
 * repond a la question au moment ou elle se pose.
 *
 * FOND PANNEAU, COMME L'IMPLANTATION QUI PRECEDE. C'est le seul endroit de la
 * Home ou deux sections partagent un fond, et c'est voulu : le demarrage
 * achete exactement la journee qu'on vient de lire, et l'absence de couture
 * les fait lire comme un seul mouvement. Meme raisonnement que le bandeau
 * d'A propos, qui partageait son Neige avec la cloture. Les seules autres
 * teintes disponibles ici sont sombres, et une quatrieme bande sombre sur dix
 * sections alourdirait la fin de page.
 *
 * Le detail vit dans le bloc `Tarifs` de la page Solutions, ou les tarifs ont
 * ete fusionnes le 13 septembre 2026. Le lien mene a son ancre.
 *
 * Deux chaines seulement viennent de `tarifs` — le chapeau qui titre la
 * section et le resume du demarrage. Le reste est dans `tarifsHome`, et rien
 * n'est duplique : si le modele change, il change dans `tarifs` et ici, aux
 * deux seuls endroits ou un montant est ecrit.
 *
 * ⚠️ Les montants sont ecrits en toutes lettres dans le catalogue, ici comme
 * dans `tarifs`. Un changement de prix se fait donc en deux endroits, et les
 * deux doivent bouger ensemble : la Home et Solutions ne peuvent pas annoncer
 * des montants differents.
 *
 * Comme `FaqHome`, elle se termine sur un lien vers la page complete. Le
 * lexique des CTA veut qu'un seul appel a l'action porte la Home et qu'il soit
 * le dernier ; celui-ci mene a une lecture, pas a une prise de rendez-vous.
 */
export function TarifsHome() {
  const t = useTranslations('tarifs');
  const tSection = useTranslations('tarifsHome');
  // `Cta` rend un `<a>` brut : le chemin traduit se resout ici.
  const locale = useLocale();

  return (
    <Section fond="fond-alt" aria-labelledby="tarifs-home-titre">
      <div className="mx-auto max-w-[720px]">
        <Reveal>
          <h2 id="tarifs-home-titre" className="font-serif text-h2 text-balance">
            {t('chapeau')}
          </h2>
        </Reveal>

        {/* Le demarrage porte le resume : c'est le seul des deux montants qui
            achete quelque chose qu'il faut expliquer. L'abonnement se comprend
            de sa seule formule. */}
        <Reveal className="mt-titre border-t border-filet pt-8">
          <p className="text-label font-semibold uppercase text-encre-douce">
            {tSection('demarrageNom')}
          </p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-serif text-h3 tabular-nums">{tSection('demarragePrix')}</span>
            <span className="text-intro text-encre-douce">{tSection('demarrageQuoi')}</span>
          </p>
          <p className="text-corps mt-5 max-w-[62ch]">{t('demarrageP1')}</p>
        </Reveal>

        <Reveal className="mt-titre border-t border-filet pt-8">
          <p className="text-label font-semibold uppercase text-encre-douce">
            {tSection('abonnementNom')}
          </p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-serif text-h3 tabular-nums">{tSection('abonnementPrix')}</span>
            <span className="text-intro text-encre-douce">{tSection('abonnementQuoi')}</span>
          </p>
        </Reveal>

        <Reveal className="mt-titre flex flex-col gap-6">
          <p className="text-micro text-encre-douce">{t('htMention')}</p>
          <Cta
            href={`${getPathname({ href: '/solutions', locale })}#tarifs`}
            variante="secondaire"
            fleche
            className="self-start"
          >
            {tSection('lien')}
          </Cta>
        </Reveal>
      </div>
    </Section>
  );
}
