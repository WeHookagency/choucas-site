import { useLocale, useTranslations } from 'next-intl';

import { Cta } from '../ui/Cta';
import { Reserve } from '../ui/Reserve';
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
 * Le detail vit sur `/tarifs`. Les tarifs ont ete fusionnes dans Solutions le
 * 13 septembre 2026 puis ressortis le meme jour, quand Solutions a fusionne
 * dans Produit : le lien mene de nouveau a une page.
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
      {/* Texte a gauche, ecran a droite — la grille que Produit et Solutions
          emploient deja. Le bloc etait une colonne centree de 720 px, qui
          laissait le reste de la largeur vide. */}
      <div className="grid items-start gap-10 desktop:grid-cols-[1fr_340px] desktop:gap-16">
        <div className="max-w-[62ch]">
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
              <span className="font-serif text-h3 tabular-nums text-accent">{tSection('demarragePrix')}</span>
              <span className="text-intro text-encre-douce">{tSection('demarrageQuoi')}</span>
            </p>
            <p className="text-corps mt-5">{t('demarrageP1')}</p>
            {/* Deuxieme paragraphe ajoute le 13 septembre 2026 : la journee
              demandait plus que sa seule description. Il dit ce qu'elle n'est
              pas, ce qui est la moitie de ce qu'un dirigeant veut savoir. */}
            <p className="text-corps mt-4 text-encre-douce">{t('demarrageP2')}</p>
          </Reveal>

          <Reveal className="mt-titre border-t border-filet pt-8">
            <p className="text-label font-semibold uppercase text-encre-douce">
              {tSection('abonnementNom')}
            </p>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-serif text-h3 tabular-nums text-accent">{tSection('abonnementPrix')}</span>
              <span className="text-intro text-encre-douce">{tSection('abonnementQuoi')}</span>
            </p>
          </Reveal>

          <Reveal className="mt-titre flex flex-col gap-6">
            <p className="text-micro text-encre-douce">{t('htMention')}</p>
            <Cta
              href={getPathname({ href: '/tarifs', locale })}
              variante="secondaire"
              fleche
              className="self-start"
            >
              {tSection('lien')}
            </Cta>
          </Reveal>
        </div>

        {/* ⚠️ L'ecran n'existe pas. Reserve dimensionnee au rapport des
            colonnes de Produit et de Solutions — 340/480, plafonnee a 340,
            teinte mousse. La capture attendue fait donc 1 036 px de large,
            recadree a ce rapport. Elle porte sa legende : une reserve muette
            ne se remplit jamais. */}
        <figure className="m-0 flex flex-col items-center gap-2 desktop:items-start">
          <Reserve ratio="340 / 480" largeurMax={340} teinte="mousse" />
          <figcaption
            style={{ maxWidth: '340px' }}
            className="text-micro text-center text-encre-douce"
          >
            {tSection('reserve')}
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
