import { getTranslations } from 'next-intl/server';

import { manrope, newsreader } from '@/fonts';
import { defaultLocale } from '@/i18n/locales';
import { getPathname } from '@/i18n/navigation';
import '@/styles/globals.css';

/**
 * 404 du site.
 *
 * Ce fichier est volontairement hors de `[locale]/` — il ne peut pas etre
 * dedans. Quand le layout racine vit sous un segment dynamique, un
 * `not-found.tsx` place dans ce segment n'est jamais atteint : Next resout le
 * 404 au-dessus, la ou aucune langue n'est encore connue. C'est la limite que
 * documente `global-not-found`, et la raison pour laquelle ce fichier porte
 * son propre <html> et recharge polices et styles.
 *
 * Consequence : la page est rendue dans la langue par defaut, pas dans celle
 * du visiteur. C'est delibere. La langue ne pourrait venir que du cookie ou
 * des en-tetes, or ce composant fait partie de l'arbre de rendu de *toutes*
 * les routes : y lire une API dynamique bascule la page d'accueil elle-meme
 * en rendu a la demande. Une 404 dans la mauvaise langue coute moins cher
 * qu'un site entier non statique.
 *
 * A revoir avec le lot de contenu, quand la 404 sera dessinee : soit via
 * `experimental.globalNotFound`, qui court-circuite l'arbre de rendu, soit en
 * pre-rendant une 404 par langue.
 */
export default async function RootNotFound() {
  const t = await getTranslations({ locale: defaultLocale, namespace: 'notFound' });

  return (
    <html
      lang={defaultLocale}
      className={`${newsreader.variable} ${manrope.variable}`}
    >
      <body className="bg-fond text-encre">
        <main className="mx-auto flex min-h-dvh max-w-contenu flex-col justify-center px-marge">
          <h1 className="font-serif text-h2">{t('title')}</h1>
          <p className="text-intro mt-6 max-w-[48ch] text-encre-douce">
            {t('description')}
          </p>
          <p className="mt-titre">
            <a
              href={getPathname({ href: '/', locale: defaultLocale })}
              className="text-bouton font-bold"
            >
              {t('backHome')}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
