import { useTranslations } from 'next-intl';

import { ListeFaq, type EntreeFaq } from '../faq/ListeFaq';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { questionsHome } from '@/content/faq';
import { Link } from '@/i18n/navigation';

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
          {/* Aucun accent cuivre dans ce titre : le motif « seconde moitie en
              italique » est deja porte par cinq sections au-dessus. */}
          <h2 id="faq-home-titre" className="font-serif text-h3 text-balance">
            {tSection('titre')}
          </h2>
        </Reveal>

        <Reveal className="mt-titre">
          <ListeFaq entrees={entrees} idBase="faq-home" />
        </Reveal>

        <Reveal className="mt-10">
          {/* Un lien de corps de texte, pas un bouton. En Sapin souligne et
              non en cuivre : a cette taille le cuivre mesure 3,52:1. */}
          <Link
            href="/faq"
            className="text-intro font-semibold text-lien underline underline-offset-4"
          >
            {tSection('lien')}
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
