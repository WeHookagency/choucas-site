import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

/**
 * Pied de page — specs §6.12.
 *
 * Fond Sapin. Marque inversee, deux colonnes de liens, puis une bande basse :
 * legal, editeur, contexte.
 *
 * Le haut est une grille plafonnee : la marque a sa largeur, puis les deux
 * colonnes de liens. Repousses aux deux bords, ils ouvraient 706 px de vide au
 * milieu a 1440 — un trou, pas une respiration. La marque ne prend plus une
 * colonne entiere qu'elle laisserait vide aux quatre cinquiemes : elle prend
 * sa taille, et la place qui reste tombe apres le contenu au lieu de le
 * couper en deux.
 *
 * Les liens passent par le `Link` de next-intl : ils suivent les slugs
 * traduits, /fr/mentions-legales devenant /en/legal-notice. Le Blog n'y
 * figure pas — quatre titres sans corps d'article ne font pas un index a
 * lier, et la route est en `noindex`.
 *
 * ---------------------------------------------------------------------------
 * CE QUE LE FOND SAPIN INTERDIT, ET CE QU'IL AUTORISE
 *
 * L'encre douce du pied clair y tombe a 1,72:1 : elle disparait. Le cuivre
 * standard a 2,79:1 : il disparait aussi. Le pied ne peut donc pas garder sa
 * hierarchie d'avant, il la refait avec ce qui passe.
 *
 *   Neige pleine        9,81:1   liens et ligne de marque
 *   Neige a 70 %        5,73:1   bande basse, editeur, contexte
 *   cuivre eclairci     4,64:1   survol des liens
 *   Neige a 45 %        ~3,3:1   les deux filets, objets graphiques
 *
 * La marque inversee tient sur ce fond : son disque creme y mesure 10,06:1,
 * et a l'interieur l'arc vaut 10,47 et la coche 3,80. C'est exactement le
 * calcul de references/marque-choucas.md, refait sur le Sapin du site.
 *
 * LA COUTURE AVEC LE CTA FINAL. Celui-ci est en Schiste, le pied en Sapin :
 * les deux fonds ne different que de 1,63:1. Sans rien, la limite ne se voit
 * pas et les deux blocs se lisent comme un seul pave sombre de deux ecrans.
 * D'ou le filet superieur, qui n'est pas une bordure de decor mais la seule
 * chose qui dise ou le CTA finit.
 */
export function SiteFooter() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const mentions = useTranslations('mentions');

  /** Les deux colonnes, dans l'ordre demande. */
  const colonnes = [
    [
      { href: '/produit', libelle: nav('produit') },
      { href: '/solutions', libelle: nav('solutions') },
      { href: '/tarifs', libelle: nav('tarifs') },
    ],
    [
      { href: '/faq', libelle: nav('faq') },
      { href: '/a-propos', libelle: nav('aPropos') },
      { href: '/contact', libelle: nav('contact') },
    ],
  ] as const;

  return (
    <footer className="border-t border-encre-inverse/45 bg-cta text-encre-inverse">
      <div className="mx-auto max-w-scene px-marge py-12 desktop:py-16">
        <div className="grid gap-10 desktop:max-w-[720px] desktop:grid-cols-[auto_1fr_1fr] desktop:gap-x-20 desktop:gap-y-0">
          {/* `unoptimized` : l'optimiseur de Next refuse le SVG sans
              `dangerouslyAllowSVG`, et une marque de 500 octets n'a rien a
              gagner a passer par lui. Le nom accessible porte la marque. */}
          <Image
            src="/choucas-mark-inverse.svg"
            alt={t('marqueAlt')}
            width={52}
            height={52}
            unoptimized
          />

          {/* Un seul `nav` pour les deux colonnes : elles se separent a
              l'oeil, pas au sens, et deux reperes de navigation pour six
              liens encombreraient la liste des regions. */}
          <nav aria-label={t('ariaPages')} className="desktop:col-span-2">
            <div className="grid grid-cols-2 gap-x-8">
              {colonnes.map((colonne) => (
                <ul key={colonne[0].href}>
                  {colonne.map((page) => (
                    <li key={page.href}>
                      {/* Cible de 44 px, §9 des specs : la hauteur vient de la
                          boite, le texte ne bouge pas. */}
                      <Link
                        href={page.href}
                        className="text-intro inline-flex min-h-11 items-center text-encre-inverse no-underline hover:text-accent-inverse"
                      >
                        {page.libelle}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-x-6 gap-y-1 border-t border-encre-inverse/45 pt-4 desktop:flex-row desktop:items-center desktop:justify-between">
          <nav aria-label={t('ariaLegal')}>
            <ul className="flex flex-wrap gap-x-6">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-micro inline-flex min-h-11 items-center text-encre-inverse/70 no-underline hover:text-encre-inverse"
                >
                  {t('mentions')}
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-micro inline-flex min-h-11 items-center text-encre-inverse/70 no-underline hover:text-encre-inverse"
                >
                  {t('confidentialite')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* L'editeur vient des mentions legales : une seule source pour un
              nom qui engage juridiquement. */}
          <p className="text-micro text-encre-inverse/70">
            {mentions('editeurNom')} · {t('contexte')}
          </p>
        </div>
      </div>
    </footer>
  );
}
