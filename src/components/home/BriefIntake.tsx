import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/** Les trois sources, dans le desordre ou elles arrivent vraiment. */
const SOURCES = ['appel', 'message', 'mail'] as const;

/**
 * Les trois temps de la sequence, et la phrase qui mene a chacun.
 *
 * La premiere etape n'a pas de liaison : rien ne la precede. Lui inventer une
 * cle vide pour uniformiser le typage ecrirait un mensonge dans le fichier de
 * traduction.
 */
const ETAPES = [
  { cle: 'arrivee', liaison: null },
  { cle: 'arbitrage', liaison: 'rassemble' },
  { cle: 'consigne', liaison: 'arbitre' },
] as const;

/**
 * Le brief de sejour : plusieurs sources en desordre, une consigne en sortie.
 *
 * Declinaison du point de jonction de la page Solutions — meme grammaire :
 * fond Sapin, cartes claires, et une liaison ecrite entre les etats plutot
 * qu'une fleche seule. Ce qui relie deux cartes est une phrase, pas un trait.
 *
 * Ce bloc illustre ce que la premiere etape du parcours affirme en prose :
 * « une demande recue par message, appel, email ou note est structuree en
 * actions ». Il la montre au lieu de la dire.
 *
 * ⚠️ Le brief n'est pas dans l'application : aucune capture ici, et aucune
 * phrase qui promette une disponibilite. Les cartes sont des fragments de
 * conversation et une consigne ecrite — jamais du chrome d'interface, qui se
 * lirait comme un ecran qu'on peut aller ouvrir.
 *
 * Le conflit montre est celui du corpus produit : « personne dans la maison
 * avant 9 h » contre « des pancakes chaque matin ». Choucas ne transmet pas
 * les deux aveuglement.
 *
 * Rien n'y est porte par la seule couleur. L'ordre est un `ol` numerote et
 * ses trois temps sont nommes ; le canal de chaque source est ecrit ; la
 * sortie se distingue par sa pastille pleine et son ombre solide autant que
 * par son ton.
 */
export function BriefIntake() {
  const t = useTranslations('briefIntake');

  return (
    <Section fond="sapin" aria-labelledby="brief-intake-titre">
      <Reveal>
        <SectionHeader
          id="brief-intake-titre"
          align="centre"
          inverse
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent inverse>{chunks}</Accent> })}
          intro={t('intro')}
        />
      </Reveal>

      <ol
        aria-label={t('sequenceAria')}
        className="mt-titre mx-auto flex max-w-[900px] flex-col items-stretch"
      >
        {ETAPES.map(({ cle, liaison }, i) => (
          <li key={cle} className="flex flex-col items-center">
            {/* La liaison appartient a l'etape qu'elle introduit : elle dit ce
                qui vient de se passer, en toutes lettres. */}
            {liaison ? <Liaison texte={t(`liaisons.${liaison}`)} /> : null}

            <p className="text-label flex items-baseline justify-center gap-2 font-semibold uppercase text-encre-inverse/75">
              <span aria-hidden className="text-numero-inverse tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              {t(`etapes.${cle}.temps`)}
            </p>

            <Reveal className="mt-5 w-full">
              {cle === 'arrivee' ? <Sources /> : null}
              {cle === 'arbitrage' ? <Arbitrage /> : null}
              {cle === 'consigne' ? <Consigne /> : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/**
 * Le lien entre deux etapes, ecrit.
 *
 * Les deux filets sont decoratifs : la phrase suffit a comprendre le passage
 * d'une etape a la suivante, filets masques ou non.
 */
function Liaison({ texte }: { texte: string }) {
  return (
    <p className="flex flex-col items-center gap-2 py-6 text-center">
      <span aria-hidden className="h-6 w-px bg-encre-inverse/30" />
      <span className="text-micro max-w-[38ch] text-encre-inverse/75">{texte}</span>
      <span aria-hidden className="h-6 w-px bg-encre-inverse/30" />
    </p>
  );
}

/**
 * Ce qui arrive : trois canaux, trois moments, aucun ordre.
 *
 * Les heures ne se suivent pas — 18:40, 21:12, 07:05 — parce que c'est ainsi
 * qu'un brief arrive. Le desordre est dans les donnees, pas dans une
 * inclinaison de carte qui nuirait a la lecture.
 */
function Sources() {
  const t = useTranslations('briefIntake.sources');

  return (
    <div className="grid gap-4 tablette:grid-cols-3">
      {SOURCES.map((cle) => (
        <div
          key={cle}
          className="flex flex-col rounded-carte border border-filet bg-surface p-5 text-encre"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-label rounded-capsule border border-filet px-2.5 py-1 font-bold text-encre-douce">
              {t(`${cle}.canal`)}
            </span>
            <span className="text-micro tabular-nums text-encre-douce">{t(`${cle}.quand`)}</span>
          </div>
          <p className="text-corps mt-4 font-serif italic">{t(`${cle}.mot`)}</p>
        </div>
      ))}
    </div>
  );
}

/** Ce que le manager tranche. Le conflit est nomme, les deux demandes citees. */
function Arbitrage() {
  const t = useTranslations('briefIntake.arbitrage');

  return (
    <div className="mx-auto max-w-[560px] rounded-carte border border-filet bg-surface p-6 text-encre">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-serif text-intro">{t('titre')}</span>
        <span className="text-label shrink-0 rounded-capsule border border-filet px-2.5 py-1 font-bold text-encre-douce">
          {t('etat')}
        </span>
      </div>
      <p className="text-corps mt-3">{t('corps')}</p>
      <p className="text-micro mt-4 border-t border-filet pt-3 text-encre-douce">{t('meta')}</p>
    </div>
  );
}

/**
 * Ce qui en sort : une consigne, pas un resume du brief.
 *
 * Seule carte a porter l'ombre solide et la pastille pleine — le §0.5 n'en
 * autorise qu'une par page, et sur la Home elle revient a ce moment-la.
 */
function Consigne() {
  const t = useTranslations('briefIntake.consigne');

  return (
    <div className="mx-auto max-w-[560px] rounded-carte border border-filet bg-surface p-6 text-encre shadow-[6px_6px_0_0_var(--web-cta-presse)]">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-serif text-intro">{t('bien')}</span>
        <span className="text-label shrink-0 rounded-capsule bg-cta px-2.5 py-1 font-bold text-cta-encre">
          {t('etat')}
        </span>
      </div>
      <p className="text-corps mt-3">{t('texte')}</p>
      <p className="text-micro mt-4 border-t border-filet pt-3 text-encre-douce">{t('meta')}</p>
    </div>
  );
}
