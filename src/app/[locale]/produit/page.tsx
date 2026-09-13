import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import accueilResponsable from '../../../../public/demo/accueil-responsable.png';
import blocExceptions from '../../../../public/demo/bloc-exceptions.png';

import { MemoireEntreprise } from '@/components/produit/MemoireEntreprise';
import { PointJonction } from '@/components/produit/PointJonction';
import { TroisMetiers } from '@/components/produit/TroisMetiers';
import { VoletRole } from '@/components/produit/VoletRole';
import { Cta } from '@/components/ui/Cta';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reserve } from '@/components/ui/Reserve';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { localeAlternates } from '@/i18n/metadata';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'produit' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: tPages('produit.titre'),
    description: t('metaDescription'),
    alternates: localeAlternates('/produit', locale),
  };
}

/**
 * Les cinq sections illustrees, dans l'ordre d'une journee, puis le parcours
 * de l'imprevu. Le fond alterne et la bande sombre revient a l'etat PRET :
 * c'est la regle produit la plus dure a faire entendre, elle prend le poids
 * que le Sapin lui donne.
 *
 * Suite des fonds : Neige, Panneau, Neige, Panneau, Sapin, Neige, Panneau,
 * Neige — aucun repete d'une section a la suivante.
 *
 * `ecranAGauche` alterne le cote de l'ecran, comme `VoletRole` sur Solutions.
 * Cinq reserves au meme endroit formaient une colonnade qui ecrasait le texte,
 * et le defaut serait reste une fois les captures posees : c'etait un probleme
 * de composition, pas de reserve.
 *
 * L'alternance echange les pistes de la grille et place chaque colonne
 * explicitement. Pas `order` : `order` deplace l'enfant dans l'autre piste
 * sans echanger les pistes, et les deux sections inversees se retrouvaient
 * avec leur texte dans les 340 px et l'ecran dans le 1fr.
 *
 * LA GRILLE EST PLAFONNEE A 940 PX ET CENTREE — 529 de texte, 64 d'ecart,
 * 340 d'ecran. Sans ce plafond, la piste de texte prend tout le reste de la
 * colonne et le texte, cale a 62ch, n'en occupe qu'une part : il restait
 * 411 px de couloir vide entre la mesure et l'ecran, mesure a 1440, sur les
 * cinq sections. Les marges deviennent egales, et une respiration se lit
 * autrement qu'un trou.
 *
 * `items-center` et non `items-start`. L'ecran fait 505 px de haut quand le
 * texte des sections les plus courtes en fait 221 : cale en haut, il debordait
 * de 284 px sous le texte et donnait seul la hauteur de la section. Centre, le
 * debordement se repartit des deux cotes et devient une composition.
 */
const SECTIONS = [
  {
    cle: 'brief',
    fond: 'fond-alt',
    ecranAGauche: false,
    paras: ['brief.p1', 'brief.p2', 'brief.p3'],
  },
  { cle: 'mission', fond: 'fond', ecranAGauche: true, paras: ['mission.p1', 'mission.p2'] },
  {
    cle: 'controle',
    fond: 'fond-alt',
    ecranAGauche: false,
    paras: ['controle.p1', 'controle.p2'],
  },
  { cle: 'pret', fond: 'sapin', ecranAGauche: true, paras: ['pret.p1'] },
  {
    cle: 'imprevu',
    fond: 'fond',
    ecranAGauche: false,
    paras: ['imprevu.p1', 'imprevu.p2', 'imprevu.p3', 'imprevu.p4', 'imprevu.p5'],
  },
] as const;

/** Les trois blocs ajoutes au volet Exploitation, dans l'ordre du texte. */
const BLOCS_EXPLOITATION = ['entraide', 'mission', 'verification'] as const;

/**
 * Un point developpe a l'interieur d'un volet : son intitule, puis ce qu'il
 * change. Le titre du volet est un `h2`, ceux-ci sont donc des `h3` — la
 * hierarchie se lit au clavier autant qu'a l'oeil.
 *
 * Le bloc herite de l'encre du volet : sur Lichen tout est en encre pleine,
 * l'encre douce y tombe a 2,34:1.
 */
function BlocVolet({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="mt-2">
      <h3 className="font-serif text-intro font-semibold">{titre}</h3>
      <p className="text-corps mt-2">{texte}</p>
    </div>
  );
}

/** Les cinq refus, dans l'ordre de la page A propos, seule source des libelles. */
const REFUS = ['pms', 'personnes', 'sante', 'envoi', 'reseau'] as const;

// Les cles sont ecrites en entier, pas composees a la volee. Un produit
// cartesien `${cle}.${para}` fabriquerait `brief.p4`, qui n'existe pas — le
// typage des messages de next-intl l'a refuse, et il avait raison.

/**
 * Produit — reecriture du 11 septembre 2026.
 *
 * La page precedente ne couvrait qu'un seul parcours, le signalement
 * d'incident, sous un titre qui annoncait le produit entier. Elle couvre
 * maintenant les quatre piliers — le brief, la mission terrain, le double
 * controle, l'etat PRET — puis l'imprevu, puis ce que Choucas refuse de faire.
 *
 * Un H1, un H2 par section, aucun H3 : les phrases d'attaque de chaque section
 * sont donc des paragraphes en tete, pas des titres. Elles se lisent comme des
 * chapeaux, ce qu'elles sont.
 *
 * ⚠️ Les cinq ecrans n'existent pas. Ce sont des reserves dimensionnees, au
 * meme rapport et a la meme largeur que celles de la section memoire de
 * Solutions — 340/480, plafonnees a 340 px, teinte mousse. La capture attendue
 * fait donc 1036 px de large, recadree a ce rapport. Chaque reserve porte en
 * legende ce qu'elle montrera : une reserve muette ne se remplit jamais.
 *
 * Traitement visuel volontairement sobre : la passe UI viendra page par page.
 * La grille texte/ecran est celle que `VoletRole` emploie deja sur Solutions —
 * ce n'est pas un dessin neuf, c'est l'idiome du site, et il evite qu'une
 * reserve de 340 px reste seule sur une ligne de 1360.
 */
export default async function Page({ params }: PageProps<'/[locale]/produit'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('produit');
  const tApropos = await getTranslations('aPropos');
  const contact = await getTranslations('contact');
  // Le bloc venu de Solutions lit ses propres chaines : elles restent la ou
  // elles sont, la page a change, pas la copie.
  const sol = await getTranslations('solutions');
  const manager = await getTranslations('manager');

  return (
    <main>
      <Section fond="fond" aria-labelledby="produit-titre">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 id="produit-titre" className="font-serif text-h2 mt-4 max-w-[20ch] text-balance">
          {t('titre')}
        </h1>
        <p className="text-intro mt-8 max-w-[62ch] text-encre-douce">{t('intro')}</p>
      </Section>

      {SECTIONS.map(({ cle, fond, ecranAGauche, paras }, i) => {
        const sombre = fond === 'sapin';
        return (
          <Section key={cle} fond={fond} aria-labelledby={`${cle}-titre`}>
            {/* `group` decale l'ecran de 90 ms apres le texte : deux temps, ce
                que la regle d'apparition autorise au plus par section. La
                cascade suit l'ordre du DOM, pas l'ordre visuel — le texte
                reste premier a la lecture meme quand la grille le renvoie a
                droite. */}
            <Reveal
              group
              className={`mx-auto grid max-w-[940px] items-center gap-10 desktop:gap-16 ${
                ecranAGauche ? 'desktop:grid-cols-[340px_1fr]' : 'desktop:grid-cols-[1fr_340px]'
              }`}
            >
              <div
                style={{ ['--i' as string]: 0 }}
                className={`max-w-[62ch] desktop:row-start-1 ${
                  ecranAGauche ? 'desktop:col-start-2' : 'desktop:col-start-1'
                }`}
              >
                <div className="flex items-baseline gap-4">
                  {/* Le chiffre porte la sequence : c'est une journee dans
                      l'ordre, et la page etait la seule du site a l'enoncer
                      sans le montrer. Meme traitement que BriefIntake et la
                      page Contact.

                      Cuivre standard sur fond clair, cuivre des chiffres sur
                      Sapin ou le standard tombe a 2,79:1 — la regle est dans
                      tokens.css, les deux jeux sont disjoints. Le chiffre est
                      decoratif : le titre qui suit dit la meme chose en
                      toutes lettres. */}
                  <span
                    aria-hidden
                    className={`font-serif text-[2.125rem] leading-none tabular-nums desktop:text-[3.25rem] ${
                      sombre ? 'text-numero-inverse' : 'text-accent'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 id={`${cle}-titre`} className="font-serif text-h3 text-balance">
                    {t(`${cle}.titre`)}
                  </h2>
                </div>
                {/* Phrase d'attaque en tete : c'est un chapeau, pas un titre —
                    la page n'autorise qu'un niveau de titre par section.

                    Serif ET gras, les deux. Mesure a 1440 : `text-intro` rend
                    15 px et `text-corps` 14 px — leur clamp reste sur son
                    plancher jusqu'a 1889 px de fenetre. Un point d'ecart ne
                    distingue rien : le chapeau a besoin de la fonte et de la
                    graisse pour se detacher du corps, et il reste distinct du
                    H2 qui est serif maigre a 40 px. */}
                <p className="font-serif text-intro mt-6 font-semibold">{t(`${cle}.lead`)}</p>
                {paras.map((para) => (
                  <p
                    key={para}
                    className={`text-corps mt-4 ${sombre ? 'text-encre-inverse/85' : 'text-encre-douce'}`}
                  >
                    {t(para)}
                  </p>
                ))}
              </div>

              <figure
                style={{ ['--i' as string]: 1 }}
                className={`m-0 flex flex-col items-center gap-2 desktop:row-start-1 desktop:items-start ${
                  ecranAGauche ? 'desktop:col-start-1' : 'desktop:col-start-2'
                }`}
              >
                <Reserve ratio="340 / 480" largeurMax={340} teinte="mousse" sombre={sombre} />
                <figcaption
                  style={{ maxWidth: '340px' }}
                  className={`text-micro text-center ${sombre ? 'text-encre-inverse/85' : 'text-encre-douce'}`}
                >
                  {t(`${cle}.reserve`)}
                </figcaption>
              </figure>
            </Reveal>
          </Section>
        );
      })}

      {/* La demonstration de la regle que la section 03 vient d'enoncer.
          Elle la prouve au lieu de la redire : deux cartes, une liaison, un
          nom de controleur. */}
      <PointJonction />

      {/* Qui fait quoi, apres avoir dit ce qui se fait. */}
      <TroisMetiers />

      {/* Fond Lichen. Le titre y reste en encre pleine : le cuivre mesure
          1,45:1 sur ce fond, la moitie du titre y disparaitrait. */}
      <VoletRole
        id="dirigeants"
        fond="respiration"
        eyebrow={sol('dirigeants.eyebrow')}
        titre={sol('dirigeants.titre')}
        legende={sol('dirigeants.legende')}
        capture={blocExceptions}
        captureAlt={manager('captureAlt')}
        libelleLien={manager('lienDemo')}
      >
        {/* En tete de volet : le comptage avant l'analyse. Registre du
            benefice, comme l'exige la regle produit pour ce role — on dit ce
            que le dirigeant obtient, jamais ce qu'il fait dans l'application. */}
        <p className="font-serif text-intro">{sol('dirigeants.leadTitre')}</p>
        <p className="text-corps">{sol('dirigeants.leadTexte')}</p>
        <p className="text-corps">{sol('dirigeants.corps')}</p>
        <p className="text-corps">
          <strong className="font-bold">{sol('dirigeants.eviteLabel')} : </strong>
          {sol('dirigeants.evite')}
        </p>
      </VoletRole>

      {/* Panneau et non Neige : la memoire d'entreprise qui suit est en Neige,
          et les deux se lisaient comme un seul bloc. Suite des treize fonds
          apres correction : Neige, Panneau, Neige, Panneau, Sapin, Neige,
          Sapin, Panneau, Lichen, Panneau, Neige, Panneau, Neige. */}
      <VoletRole
        id="exploitation"
        fond="fond-alt"
        ecranAGauche
        eyebrow={sol('exploitation.eyebrow')}
        titre={sol('exploitation.titre')}
        legende={sol('exploitation.legende')}
        capture={accueilResponsable}
        captureAlt={sol('exploitation.captureAlt')}
        libelleLien={manager('lienDemo')}
      >
        <p className="text-corps text-encre-douce">{sol('exploitation.lead')}</p>
        {BLOCS_EXPLOITATION.map((cle) => (
          <BlocVolet
            key={cle}
            titre={sol(`exploitation.blocs.${cle}.titre`)}
            texte={sol(`exploitation.blocs.${cle}.texte`)}
          />
        ))}
      </VoletRole>

      <MemoireEntreprise />

      {/* Les cinq refus etaient enfiles dans une seule phrase, ou aucun ne
          pesait. A propos rend les memes cinq en liste a filets, et c'est le
          bloc le plus credible de cette page-la. Meme traitement ici, et une
          seule source : les intitules viennent de `aPropos.partis`, leurs
          justifications restent la-bas. `produit.refus.texte` reste dans le
          catalogue, la phrase condensee sert encore ailleurs. */}
      <Section fond="fond-alt" aria-labelledby="refus-titre">
        <Reveal>
          <h2 id="refus-titre" className="font-serif text-h3 max-w-[20ch] text-balance">
            {t('refus.titre')}
          </h2>
        </Reveal>

        <Reveal as="ul" group className="mt-titre max-w-[820px]">
          {REFUS.map((cle, i) => (
            <li
              key={cle}
              style={{ ['--i' as string]: i }}
              className="flex gap-4 border-t border-filet py-5"
            >
              <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
              <p className="text-intro font-semibold">{tApropos(`partis.${cle}.titre`)}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* Libelle propre a cette page. `actions.demo` sert la barre, le hero et
          le CTA final de la Home : le changer ici les aurait renommes tous. */}
      <Section fond="fond" aria-label={t('cta')}>
        <Reveal className="flex flex-col items-center text-center">
          {/* La bande etait un bouton seul sur un fond vide. La phrase vient
              de la voie vers laquelle le bouton mene : elle dit ce qui se
              passe apres le clic, et n'existe qu'a un seul endroit. */}
          <p className="font-serif text-intro max-w-[40ch] text-balance">
            {contact('voies.impl.texte')}
          </p>
          <Cta href={getPathname({ href: '/contact', locale })} fleche className="mt-titre">
            {t('cta')}
          </Cta>
        </Reveal>
      </Section>
    </main>
  );
}
