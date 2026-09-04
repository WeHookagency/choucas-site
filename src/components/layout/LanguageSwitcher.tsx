'use client';

import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { locales, localeMetadata } from '@/i18n/locales';
import { Link, usePathname } from '@/i18n/navigation';

/**
 * Selecteur de langue.
 *
 * `usePathname` rend le chemin interne — celui de la table `pathnames` de
 * routing.ts, sans prefixe de langue. Le passer a `Link` avec une autre
 * locale produit l'URL traduite de la meme page : le jour ou /fr/tarifs
 * devient /en/pricing, la bascule suit sans un mot de code de plus.
 *
 * Les libelles viennent du registre des langues, dans leur propre langue :
 * un visiteur cherchant l'anglais reconnait « English », pas « Anglais ».
 * Ajouter une langue au registre l'ajoute ici.
 *
 * Le code a deux lettres est visible, le nom complet est lu par les lecteurs
 * d'ecran. Le nom accessible contient donc le texte visible, ce que demande
 * le critere « intitule dans le nom ».
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('languageSwitcher');
  const actuelle = useLocale();
  const chemin = usePathname();
  const params = useParams();

  // Depuis que la table des slugs contient une route parametree — /blog/[slug] —
  // `usePathname` peut rendre un gabarit, que `Link` n'accepte qu'accompagne de
  // ses parametres. TypeScript ne sait pas verifier que les parametres
  // correspondent au chemin ; c'est le seul endroit ou on l'affirme.
  const cible = { pathname: chemin, params } as unknown as Parameters<
    typeof Link
  >[0]['href'];

  return (
    <nav aria-label={t('label')} className={className}>
      <ul className="flex items-center">
        {locales.map((langue, i) => {
          const courante = langue === actuelle;
          return (
            <li key={langue} className="flex items-center">
              {i > 0 ? (
                <span aria-hidden className="px-1 text-encre-douce">
                  ·
                </span>
              ) : null}
              <Link
                href={cible}
                locale={langue}
                hrefLang={langue}
                aria-current={courante ? true : undefined}
                className={[
                  'text-nav inline-flex min-h-11 items-center px-1 no-underline',
                  'transition-colors duration-200 ease-choucas',
                  courante ? 'font-bold text-encre' : 'text-encre-douce hover:text-encre',
                ].join(' ')}
              >
                {langue.toUpperCase()}
                <span className="sr-only"> {localeMetadata[langue].label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
