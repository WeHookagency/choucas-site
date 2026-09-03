import { useTranslations } from 'next-intl';

import { useLocale } from 'next-intl';

import type { Locale } from '@/i18n/locales';
import { getPathname, Link } from '@/i18n/navigation';

import { ancres } from '../anchors';

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
/**
 * Lien vers une section de l'accueil, depuis n'importe quelle page.
 *
 * Une ancre nue ne vaut que sur l'accueil : ailleurs elle ne mene nulle part,
 * ce que les specs §12 interdisent. On prefixe donc du chemin d'accueil de la
 * langue courante — /fr#produit depuis les mentions legales.
 */
function lienSection(locale: Locale, ancre: string) {
  return `${getPathname({ href: '/', locale })}#${ancre}`;
}

export function SiteFooter() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const liens = [
    { href: lienSection(locale, ancres.produit), libelle: nav('produit') },
    { href: lienSection(locale, ancres.fonctionnement), libelle: nav('fonctionnement') },
    { href: lienSection(locale, ancres.implantation), libelle: nav('implantation') },
    { href: lienSection(locale, ancres.aPropos), libelle: nav('aPropos') },
  ];

  return (
    <footer className="border-t border-filet bg-fond text-encre">
      <div className="mx-auto flex max-w-scene flex-col gap-6 px-marge py-10 desktop:flex-row desktop:items-center desktop:justify-between">
        <div className="flex flex-col gap-6 desktop:flex-row desktop:items-center desktop:gap-10">
          <p className="text-label font-bold uppercase tracking-[0.14em]">{nav('marque')}</p>

          <nav aria-label={t('aria')}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {liens.map((lien) => (
                <li key={lien.href}>
                  <a
                    href={lien.href}
                    className="text-nav text-encre no-underline hover:text-accent"
                  >
                    {lien.libelle}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('ariaLegal')}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-nav text-encre-douce no-underline hover:text-encre"
                >
                  {t('mentions')}
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-nav text-encre-douce no-underline hover:text-encre"
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
