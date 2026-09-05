import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';


/**
 * Pied de page — specs §6.12.
 *
 * Marque, navigation courte, pages legales et contexte geographique.
 *
 * Les liens legaux passent par le `Link` de next-intl : ils suivent les slugs
 * traduits, /fr/mentions-legales devenant /en/legal-notice. L'entree Contact
 * de la maquette reste absente, faute de page — les specs §12 interdisent les
 * liens factices. La mention « Maquette UX/UI · contenu provisoire » n'est pas
 * reprise non plus, elle doit disparaitre en production.
 */
export function SiteFooter() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  /**
   * Le pied recoit ce que la barre ne porte pas : « A propos », decision du
   * backlog, et les deux pages legales.
   *
   * Le Blog n'y figure pas non plus : trois titres sans corps d'article ne
   * font pas un index a lier.
   */
  const pages = [
    { href: '/produit', libelle: nav('produit') },
    { href: '/solutions', libelle: nav('solutions') },
    { href: '/tarifs', libelle: nav('tarifs') },
    { href: '/faq', libelle: nav('faq') },
    { href: '/contact', libelle: nav('contact') },
    { href: '/a-propos', libelle: nav('aPropos') },
  ] as const;

  return (
    <footer className="border-t border-filet bg-fond text-encre">
      <div className="mx-auto flex max-w-scene flex-col gap-3 px-marge py-7 desktop:flex-row desktop:items-center desktop:justify-between">
        <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-10">
          <p className="text-label font-bold uppercase tracking-[0.14em]">{nav('marque')}</p>

          <nav aria-label={t('ariaPages')}>
            {/* Les liens portent une cible de 44 px, §9 des specs. La hauteur
                vient de la boite, pas du texte : `gap-y` retombe a zero, les
                boites se separant deja d'elles-memes. L'ecart horizontal de
                24 px, lui, ne bouge pas. */}
            <ul className="flex flex-wrap gap-x-6">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-nav inline-flex min-h-11 items-center text-encre no-underline hover:text-accent"
                  >
                    {page.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('ariaLegal')}>
            <ul className="flex flex-wrap gap-x-6">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-nav inline-flex min-h-11 items-center text-encre-douce no-underline hover:text-encre"
                >
                  {t('mentions')}
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-nav inline-flex min-h-11 items-center text-encre-douce no-underline hover:text-encre"
                >
                  {t('confidentialite')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="text-micro text-encre-douce">{t('contexte')}</p>
      </div>
    </footer>
  );
}
