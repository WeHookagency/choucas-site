import { useTranslations } from 'next-intl';

import { Section } from '../ui/Section';

/** Les trois canaux par lesquels une demande arrive. Aucun n'a le pas. */
const SOURCES = ['appel', 'message', 'email'] as const;

/**
 * La prise de brief : trois sources en desordre, une consigne en sortie.
 *
 * Pendant du point de jonction, sur la meme bande sapin, et avant lui : le
 * brief entre au debut de la journee, la preuve en sort a la fin.
 *
 * Le lien entre les etapes est ecrit, pas seulement dessine. Les deux
 * liaisons sont des phrases — « Choucas les rassemble », « Ce qui est valide
 * descend » — et non des fleches : un lecteur d'ecran suit la chaine aussi
 * bien qu'un oeil, et la relation ne repose pas sur un trait.
 *
 * Le titre reste en encre pleine : le seul titre colore de la page revient au
 * point de jonction (§0.4). La bande porte l'ombre solide des deux blocs,
 * comptee comme un seul element (§0.5).
 *
 * Aucune capture, et aucune promesse : la prise de brief n'est pas construite
 * dans l'application. Ce bloc montre le principe, pas un ecran.
 */
export function PriseDeBrief() {
  const t = useTranslations('solutions.priseDeBrief');

  return (
    <Section fond="sapin" aria-labelledby="brief-solutions-titre">
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-10">
        <h2
          id="brief-solutions-titre"
          className="font-serif text-h3 max-w-[16ch] text-balance text-center"
        >
          {t('titre')}
        </h2>

        {/* Trois sources de meme rang : meme carte, meme largeur, aucun ordre
            visuel qui suggererait une priorite. */}
        <ul className="grid w-full gap-4 desktop:grid-cols-3">
          {SOURCES.map((cle) => (
            <li key={cle} className="flex h-full flex-col gap-2 rounded-carte border border-filet bg-surface p-5 text-encre shadow-[6px_6px_0_0_var(--web-cta-presse)]">
              <span className="text-label font-semibold uppercase text-encre-douce">
                {t(`sources.${cle}.canal`)}
              </span>
              <p className="text-corps">{t(`sources.${cle}.texte`)}</p>
            </li>
          ))}
        </ul>

        <Liaison texte={t('liaisonRassemble')} />

        <p className="text-intro w-full max-w-[420px] rounded-carte border border-filet bg-surface p-5 text-center font-semibold text-encre shadow-[6px_6px_0_0_var(--web-cta-presse)]">
          {t('arbitrage')}
        </p>

        <Liaison texte={t('liaisonDescend')} />

        <p className="text-intro w-full max-w-[420px] rounded-carte border-2 border-encre bg-surface p-5 text-center font-semibold text-encre shadow-[6px_6px_0_0_var(--web-cta-presse)]">
          {t('consigne')}
        </p>
      </div>
    </Section>
  );
}

/**
 * Le chainon entre deux etapes. La phrase porte la relation ; les deux traits
 * ne font que la souligner, et ils sont masques aux lecteurs d'ecran.
 */
function Liaison({ texte }: { texte: string }) {
  return (
    <p className="flex flex-col items-center gap-2 text-center">
      <span aria-hidden className="h-6 w-px bg-encre-inverse/30" />
      <span className="text-micro max-w-[42ch] text-encre-inverse/75">{texte}</span>
      <span aria-hidden className="h-6 w-px bg-encre-inverse/30" />
    </p>
  );
}
