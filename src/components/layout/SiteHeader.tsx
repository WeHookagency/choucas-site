'use client';

import { useEffect, useId, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';


import { ATTRS_DEMO, LIEN_DEMO } from '../anchors';
import { Cta } from '../ui/Cta';
import { Icon } from '../ui/Icon';

/**
 * Barre de navigation — specs §6.1.
 *
 * 68 px sur desktop, 60 px sur mobile, collante. Fond papier a 93 % avec un
 * flou d'arriere-plan la ou il est supporte : le texte qui defile dessous
 * reste lisible sans masquer completement la page.
 *
 * Sur mobile le CTA quitte la barre pour le menu, comme le demandent les
 * specs : une barre de 60 px ne peut pas porter marque, menu et action sans
 * descendre sous la cible tactile de 44 px.
 */
export function SiteHeader() {
  const t = useTranslations('nav');
  const actions = useTranslations('actions');
  const [ouvert, setOuvert] = useState(false);
  const idMenu = useId();

  // Echap referme le menu, et le focus doit pouvoir en sortir au clavier.
  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvert(false);
    };
    document.addEventListener('keydown', surTouche);
    return () => document.removeEventListener('keydown', surTouche);
  }, [ouvert]);

  /**
   * Trois entrees, decision du backlog. « A propos » descend au pied.
   *
   * Le Blog en est absent volontairement : le handoff ne fournit que trois
   * titres et leurs chapeaux, sans corps d'article. Un lien de navigation vers
   * trois pages vides est un lien mort au sens du §12.
   *
   * `desDesktop` : le lien n'apparait qu'a partir de 1000 px, faute de place
   * dans la barre a 768 avec la marque et le CTA.
   */
  const liens = [
    { href: '/produit', libelle: t('produit'), desDesktop: false },
    { href: '/solutions', libelle: t('solutions'), desDesktop: false },
    { href: '/tarifs', libelle: t('tarifs'), desDesktop: true },
  ] as const;

  return (
    <header
      className="sticky top-0 z-50 border-b border-filet bg-fond/93 backdrop-blur-[18px]"
    >
      <div className="mx-auto flex h-[60px] max-w-scene items-center justify-between px-marge desktop:h-[68px]">
        {/* La marque mene a l'accueil de la langue courante. Elle referme
            aussi le menu : sur la page d'accueil, la navigation ne change
            rien a l'ecran et le menu resterait ouvert par-dessus. */}
        <Link
          href="/"
          onClick={() => setOuvert(false)}
          className="text-label inline-flex min-h-11 items-center font-bold uppercase tracking-[0.14em] text-encre no-underline"
        >
          {t('marque')}
        </Link>

        {/* Sous 700 px les liens passent dans le menu, ou ils tiennent a
            44 px de haut. */}
        <nav aria-label={t('aria')} className="hidden tablette:block">
          <ul className="flex items-center gap-6 desktop:gap-8">
            {liens.map((lien) => (
              <li key={lien.href} className={lien.desDesktop ? 'hidden desktop:block' : undefined}>
                {/* Cible de 44 px, §9 des specs, comme la marque et le menu
                    mobile. La barre fait 60 px puis 68 : la boite y tient
                    sans deplacer quoi que ce soit, et `items-center` garde le
                    texte sur la meme ligne. */}
                <a
                  href={lien.href}
                  className="text-nav inline-flex min-h-11 items-center text-encre no-underline hover:text-accent"
                >
                  {lien.libelle}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Selecteur de langue retire le 3 septembre 2026, avec la version
            anglaise. Le composant existe toujours : le remettre ici et dans
            le menu suffira. Voir la marche a suivre dans i18n/locales.ts. */}
        <div className="hidden items-center gap-4 tablette:flex">
          {/* La visibilite est portee par l'enveloppe, pas par le CTA : sa
              classe `inline-flex` de base l'emporterait sur un `hidden` passe
              en className, les deux reglant la meme propriete. */}
          <Cta href={LIEN_DEMO} {...ATTRS_DEMO} fleche>
            {actions('demo')}
          </Cta>
        </div>

        <button
          type="button"
          onClick={() => setOuvert((v) => !v)}
          aria-expanded={ouvert}
          aria-controls={idMenu}
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-carte text-encre tablette:hidden"
        >
          <Icon name={ouvert ? 'fermer' : 'menu'} size={24} title={ouvert ? t('fermerMenu') : t('ouvrirMenu')} />
        </button>
      </div>

      {/* Le menu reste dans le flux : il repousse la page plutot que de la
          recouvrir, ce qui evite d'avoir a pieger le focus. */}
      <div id={idMenu} hidden={!ouvert} className="border-t border-filet bg-fond tablette:hidden">
        <nav aria-label={t('aria')} className="mx-auto max-w-scene px-marge py-6">
          <ul className="flex flex-col gap-1">
            {liens.map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  onClick={() => setOuvert(false)}
                  className="flex min-h-11 items-center text-intro text-encre no-underline"
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
          </ul>
          <Cta
            href={LIEN_DEMO}
            {...ATTRS_DEMO}
            fleche
            onClick={() => setOuvert(false)}
            className="mt-6 w-full"
          >
            {actions('demo')}
          </Cta>
        </nav>
      </div>
    </header>
  );
}
