import { useLocale, useTranslations } from 'next-intl';

import { Cta } from '../ui/Cta';
import { ListeFaq, type EntreeFaq } from '../faq/ListeFaq';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { questionsHome } from '@/content/faq';
import { getPathname } from '@/i18n/navigation';

/**
 * Section FAQ de la Home.
 *
 * Ce n'est pas un resume de la page FAQ : c'est un filtre pose au dernier
 * moment utile, cinq objections a lever avant que le CTA final n'arrive. La
 * question sur l'implantation sert de rampe vers lui.
 *
 * Les cinq questions sont choisies par identifiant dans `content/faq.ts` et
 * lues dans le meme espace de traductions que la page : une seule source,
 * aucune copie.
 *
 * Pas de donnees structurees ici. Le balisage `FAQPage` est sur `/faq` et
 * nulle part ailleurs — deux balisages sur un meme site en font ignorer un.
 *
 * Elle se termine sur un lien vers la page complete, jamais sur un second
 * appel a l'action : le lexique des CTA est fige ailleurs, et le CTA de la
 * Home suit dans la section d'apres.
 */
export function FaqHome() {
  const t = useTranslations('faq');
  const tSection = useTranslations('faqHome');
  // `Cta` rend un `<a>` brut : le chemin traduit se resout ici.
  const locale = useLocale();

  const entrees: EntreeFaq[] = questionsHome.map((cle) => ({
    id: cle,
    q: t(`questions.${cle}.q`),
    r: t(`questions.${cle}.r`),
  }));

  return (
    <Section fond="fond" aria-labelledby="faq-home-titre">
      {/* Colonne unique, mesure de lecture. Pas de sommaire : c'est la page
          FAQ qui en a un, pas cette section. */}
      <div className="mx-auto max-w-[720px]">
        <Reveal>
          {/* Titre entier en italique et centre, a la demande du 7 septembre
              2026. Ailleurs sur le site, l'italique ne marque que le fragment
              d'accent d'un titre ; ici il porte la phrase complete. Aucun
              cuivre : le motif « seconde moitie en italique » appartient aux
              sections du dessus. */}
          <h2 id="faq-home-titre" className="font-serif text-h2 text-center italic text-balance">
            {tSection('titre')}
          </h2>
        </Reveal>

        <Reveal className="mt-titre">
          <ListeFaq entrees={entrees} idBase="faq-home" />
        </Reveal>

        <Reveal className="mt-titre flex justify-center">
          {/* Bouton et non plus lien de corps de texte, a la demande du
              7 septembre 2026 — meme traitement que « Demander une demo » de
              la barre. ⚠️ Le lexique des CTA voulait qu'un seul appel a
              l'action porte la Home, et qu'il soit le dernier ; ce bouton en
              est un second, quatre ecrans avant lui. */}
          <Cta href={getPathname({ href: '/faq', locale })} fleche>
            {tSection('lien')}
          </Cta>
        </Reveal>
      </div>
    </Section>
  );
}
