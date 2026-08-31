import { useTranslations } from 'next-intl';

import { ancres } from '../anchors';

/**
 * Pied de page — specs §6.12.
 *
 * Marque, navigation courte et contexte geographique. Les entrees Contact,
 * Mentions legales et Confidentialite figurent sur la maquette mais n'ont pas
 * encore de page : les specs §12 interdisent les liens factices en
 * production, elles arriveront avec leurs pages. La mention « Maquette UX/UI ·
 * contenu provisoire » de la maquette n'est pas reprise, elle doit disparaitre
 * en production.
 */
export function SiteFooter() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  const liens = [
    { href: `#${ancres.pourquoi}`, libelle: nav('pourquoi') },
    { href: `#${ancres.produit}`, libelle: nav('produit') },
    { href: `#${ancres.fonctionnement}`, libelle: nav('fonctionnement') },
    { href: `#${ancres.aPropos}`, libelle: nav('aPropos') },
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
        </div>

        <p className="text-micro text-encre-douce">{t('contexte')}</p>
      </div>
    </footer>
  );
}
