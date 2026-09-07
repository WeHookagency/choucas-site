import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * Les trois sources, dans le desordre ou elles arrivent vraiment, et l'icone
 * de leur canal.
 *
 * Le trace WhatsApp vient de Phosphor, la famille du site : meme graisse,
 * meme grille que le telephone et l'enveloppe. Ce n'est pas la marque
 * deposee, et il ne promet aucune integration — cette section montre par ou
 * une demande arrive chez la conciergerie, pas ce que l'application sait
 * lire. Le brief n'est toujours pas dans la PWA.
 */
const SOURCES = [
  { cle: 'appel', icone: 'telephone' },
  { cle: 'message', icone: 'whatsapp' },
  { cle: 'mail', icone: 'mail' },
] as const;

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
 * ⚠️ Aucune capture ici : les cartes sont des fragments de conversation et
 * une consigne ecrite, jamais du chrome d'interface, qui se lirait comme un
 * ecran qu'on peut aller ouvrir.
 *
 * ⚠️ EN REVANCHE, la liaison dit desormais « rassemble sur l'app Choucas »,
 * la ou elle disait « rassembles dans un seul brief ». Elle attribue donc le
 * rassemblement a l'application. La consigne d'origine de cette section
 * demandait l'inverse — « le brief n'est pas integre a la PWA : pas de
 * capture, pas de promesse de disponibilite ». Changement demande le
 * 7 septembre 2026 ; a rendre a l'ancienne formule si la fonction n'existe
 * toujours pas au lancement.
 *
 * Le conflit montre est celui du corpus produit : « personne dans la maison
 * avant 9 h » contre « des pancakes chaque matin ». Choucas ne transmet pas
 * les deux aveuglement.
 *
 * Rien n'y est porte par la seule couleur. L'ordre est un `ol` numerote et
 * ses trois temps sont nommes ; le canal de chaque source est ecrit ; la
 * sortie se distingue par sa pastille pleine et son ombre solide autant que
 * par son ton.
 *
 * La progression se lit sur une colonne de gauche : le chiffre d'etape au
 * traitement de la charte — Newsreader 400, 34 px en mobile et 52 px en
 * desktop, cuivre eclairci — et un fil vertical qui relie les trois temps en
 * traversant les liaisons ecrites, au lieu de les laisser flotter.
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
          titre={t.rich('titre', { accent: (chunks) => <Accent ton="inverse">{chunks}</Accent> })}
          intro={t('intro')}
        />
      </Reveal>

      <ol aria-label={t('sequenceAria')} className="mt-titre mx-auto max-w-[900px]">
        {ETAPES.map(({ cle, liaison }, i) => (
          <li
            key={cle}
            className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-5 desktop:grid-cols-[4.5rem_minmax(0,1fr)] desktop:gap-x-8"
          >
            {/* La liaison appartient a l'etape qu'elle introduit : elle dit ce
                qui vient de se passer, en toutes lettres. Le fil la traverse. */}
            {liaison ? (
              <>
                <Fil />
                <Liaison texte={t(`liaisons.${liaison}`)} />
              </>
            ) : null}

            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className="font-serif text-[2.125rem] leading-none tabular-nums text-numero-inverse desktop:text-[3.25rem]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {/* Le segment bas prend tout le reste : le fil longe donc le
                  contenu de l'etape jusqu'a la liaison suivante. */}
              {i < ETAPES.length - 1 ? <Fil className="mt-3 flex-1" /> : null}
            </div>

            <div>
              {/* Meme hauteur que le chiffre : le libelle se cale sur son
                  milieu optique sans dependre d'une ligne de base partagee,
                  que la grille ne peut pas donner.

                  15 px et non 11 : a cote d'un chiffre de 52 px, un libelle de
                  11 px ne nomme plus l'etape, il la legende. La lettre espacee
                  vient du token `label` qu'il quitte — les capitales sans
                  interlettrage se referment. */}
              <p className="text-intro flex min-h-[2.125rem] items-center font-semibold uppercase tracking-[0.08em] text-encre-inverse desktop:min-h-[3.25rem]">
                {t(`etapes.${cle}.temps`)}
              </p>

              <Reveal className="mt-5 w-full">
                {cle === 'arrivee' ? <Sources /> : null}
                {cle === 'arbitrage' ? <Arbitrage /> : null}
                {cle === 'consigne' ? <Consigne /> : null}
              </Reveal>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/**
 * Le fil qui relie les trois temps.
 *
 * Neige a 60 % : 4,68:1 sur le Sapin. Les 18 % du handoff n'y donnent que
 * 1,66:1, et le vert Mousse du parcours de la Home, qui tient sur le Schiste,
 * tombe a 1,98:1 ici — le fond change, la couleur du fil doit changer avec
 * lui. Il etait a 45 % (3,33:1), au-dessus du seuil mais pas assez present :
 * le fil est la liaison autant que la phrase qu'il traverse.
 *
 * Decoratif : l'ordre est deja porte par les chiffres et par la liste
 * ordonnee.
 */
function Fil({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`w-px justify-self-center bg-encre-inverse/60 ${className ?? 'self-stretch'}`}
    />
  );
}

/**
 * Le lien entre deux etapes, ecrit.
 *
 * En encre pleine, 9,81:1, et a 14 px et non 12 : ces deux phrases portent le
 * mecanisme — ce sont elles qui disent ce qui s'est passe entre deux etapes.
 * Elles ne peuvent etre ni le texte le moins contraste du bloc ni le plus
 * petit, ce qu'elles etaient.
 */
function Liaison({ texte }: { texte: string }) {
  return (
    <p className="text-corps flex max-w-[38ch] items-center py-6 text-encre-inverse">{texte}</p>
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
      {SOURCES.map(({ cle, icone }) => (
        <div
          key={cle}
          className="flex flex-col rounded-carte border border-filet bg-surface p-6 text-encre desktop:p-7"
        >
          <div className="flex items-center justify-between gap-3">
            {/* Le canal passe devant : icone, encre pleine et corps de bouton,
                la ou il etait en encre douce a 11 px. C'est lui qui dit d'ou
                vient le fragment — l'heure, elle, reste en retrait. */}
            <span className="text-bouton inline-flex items-center gap-2 rounded-capsule border border-encre/25 px-3 py-1.5 font-bold">
              <Icon name={icone} size={16} className="shrink-0" />
              {t(`${cle}.canal`)}
            </span>
            <span className="text-micro tabular-nums text-encre-douce">{t(`${cle}.quand`)}</span>
          </div>
          <p className="text-intro mt-5 font-serif italic">{t(`${cle}.mot`)}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Ce que le manager tranche. Le conflit est nomme, les deux demandes citees.
 *
 * Cadree a gauche, comme les trois sources : centree, la carte flottait
 * decalee par rapport au rail.
 */
function Arbitrage() {
  const t = useTranslations('briefIntake.arbitrage');

  return (
    <div className="max-w-[560px] rounded-carte border border-filet bg-surface p-6 text-encre">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-serif text-intro">{t('titre')}</span>
        <span className="text-label shrink-0 rounded-capsule border border-filet px-2.5 py-1 font-bold text-encre-douce">
          {t('etat')}
        </span>
      </div>
      <p className="text-corps mt-3">{t('corps')}</p>
      <p className="text-micro mt-4 max-w-[62ch] border-t border-filet pt-3 text-encre-douce">
        {t('meta')}
      </p>
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
    <div className="max-w-[560px] rounded-carte border border-filet bg-surface p-6 text-encre shadow-[6px_6px_0_0_var(--web-cta-presse)]">
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
