import type { Metadata } from 'next';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';


import accueilResponsable from '../../../../public/demo/accueil-responsable.png';

import { PointJonction } from '@/components/produit/PointJonction';
import { Accent } from '@/components/ui/Accent';
import { CaptureProduit } from '@/components/ui/CaptureProduit';
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
 * de l'imprevu. Le fond alterne, et la seule bande sombre de la page est le
 * point de jonction : c'est la demonstration de la regle la plus dure a faire
 * entendre, et c'est la preuve qui merite le poids, pas l'enonce.
 *
 * Suite des neuf fonds : Neige, Panneau, Neige, Panneau, Neige, Sapin, Neige,
 * Panneau, Neige — aucun repete d'une section a la suivante.
 *
 * `ecranAGauche` alterne le cote de l'ecran, comme `VoletRole`.
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
  // PRET perd son Sapin : la bande sombre passe au point de jonction, qui suit
  // immediatement et qui demontre la regle que ces deux sections enoncent.
  // Une seule bande sombre pour une seule regle, et elle est sur la preuve.
  { cle: 'pret', fond: 'fond', ecranAGauche: true, paras: ['pret.p1'] },
  {
    cle: 'imprevu',
    fond: 'fond',
    ecranAGauche: false,
    paras: ['imprevu.p1', 'imprevu.p2', 'imprevu.p3', 'imprevu.p4', 'imprevu.p5'],
  },
] as const;

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
 * La grille texte/ecran est celle que `VoletRole` emploie — ce n'est pas un
 * dessin neuf, c'est l'idiome du site, et il evite qu'une reserve de 340 px
 * reste seule sur une ligne de 1360.
 */
export default async function Page({ params }: PageProps<'/[locale]/produit'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('produit');
  const tApropos = await getTranslations('aPropos');
  const contact = await getTranslations('contact');
  // `manager.lienDemo` dit ce que fait le lien de la capture : ouvrir la
  // demonstration dans un nouvel onglet. J'y avais mis `voies.impl.action`
  // — « Organiser une journee sur site » — qui annonce a un lecteur d'ecran
  // une destination que le lien n'a pas.
  const manager = await getTranslations('manager');

  return (
    <main>
      {/* ---------------------------------------------------------------
          LE HERO A DESORMAIS SON ECRAN. 15 septembre 2026.

          Le titre tenait dans 20ch et l'intro dans 62ch, sur une colonne de
          1 200 : la moitie droite de l'ouverture etait vide. C'est le meme
          defaut que « Qui est derriere », le point de jonction et Contact — une
          mesure de texte dans une piste qui ne la connait pas.

          Il se corrige ici en posant quelque chose a cote, et non en centrant :
          cette page annonce « une journee de conciergerie » puis fait attendre
          le lecteur a travers cinq reserves avant le premier ecran. Le hero est
          l'endroit ou le produit doit paraitre.

          `accueil-responsable.png` EST une journee de conciergerie : 2 departs,
          10 missions, 6 arrivees dont 1 prete, et les trois exceptions du jour.
          Il ne fait pas doublon avec les cinq sections, qui montreront chacune
          un MORCEAU de cette journee — le brief, la mission, le controle, le
          PRET, l'imprevu. Le hero montre l'ensemble, elles montrent les pieces.

          ⚠️ Il montre une journee QUI VA MAL : quatre missions en retard, une
          alerte urgente, un chalet bloque. C'est pour cette raison qu'il avait
          ete retire d'Implementation le 12 septembre, ou la section promettait
          un resultat. Ici c'est le sujet meme de la page, qui consacre sa
          derniere section a l'imprevu. Arbitrage du fondateur, assume.

          Coupe a 520 px sur 985, avec le fondu qui dit qu'il continue : le
          hero ne peut pas faire un ecran de haut, et la journee ligne par ligne
          n'est pas ce qu'on lit en ouvrant une page.
          --------------------------------------------------------------- */}
      <Section fond="fond" aria-labelledby="produit-titre">
        <div className="mx-auto grid max-w-[940px] items-center gap-10 desktop:grid-cols-[1fr_340px] desktop:gap-16">
        <div className="max-w-[62ch]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        {/* L'accent cuivre, ajoute le 15 septembre 2026. C'etait le seul titre
            editorial du site a ne pas l'avoir : la Home, Contact et chaque
            en-tete de section portent leur derniere proposition en italique
            cuivre, et l'ouverture de Produit restait tout en encre. Un H1 nu a
            cette taille se lit comme un titre de document, pas comme une
            page. `tarifs`, `faq`, `mentions` et `confidentialite` n'en ont pas
            davantage, mais ce sont des titres d'un mot — il n'y a rien a
            accentuer. */}
        <h1 id="produit-titre" className="font-serif text-h2 mt-4 max-w-[20ch] text-balance">
          {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
        </h1>
        <p className="text-intro mt-8 max-w-[62ch] text-encre-douce">{t('intro')}</p>
        </div>

        <figure className="m-0 flex flex-col items-center gap-2">
          <CaptureProduit
            src={accueilResponsable}
            alt={t('captureAlt')}
            libelleLien={manager('lienDemo')}
            largeurMax={340}
            hauteurMax={520}
            cadre
            rayon="haut"
            ombre={false}
          />
          <figcaption className="text-micro max-w-[340px] text-center text-encre-douce">
            {t('captureLegende')}
          </figcaption>
        </figure>
        </div>
      </Section>

      {SECTIONS.map(({ cle, fond, ecranAGauche, paras }, i) => {
        return (
          <Fragment key={cle}>
          <Section fond={fond} aria-labelledby={`${cle}-titre`}>
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
                      'text-accent'
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
                    className={'text-corps mt-4 text-encre-douce'}
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
                <Reserve ratio="340 / 480" largeurMax={340} teinte="mousse" />
                <figcaption
                  style={{ maxWidth: '340px' }}
                  className={'text-micro text-center text-encre-douce'}
                >
                  {t(`${cle}.reserve`)}
                </figcaption>
              </figure>
            </Reveal>
          </Section>

          {/* La demonstration, juste apres les deux sections qui l'enoncent :
              « personne ne valide son propre travail » et « PRET est un etat
              valide ». Elle les prouve — deux cartes, une liaison, un nom de
              controleur — au lieu de les redire trois ecrans plus loin, ce
              qu'elle faisait au sortir de la fusion. */}
          {cle === 'pret' ? <PointJonction /> : null}
          </Fragment>
        );
      })}

      {/* La demonstration de la regle que la section 03 vient d'enoncer.
          Elle la prouve au lieu de la redire : deux cartes, une liaison, un
          nom de controleur. */}
      {/* Bloc venu de Solutions — trois metiers, deux volets de role, memoire
          d'entreprise — retire le 13 septembre 2026, quelques heures apres y
          avoir ete fusionne. La page racontait la mecanique puis repartait sur
          les roles, sans que rien ne dise au lecteur qu'il changeait de sujet.

          Rien n'est supprime : `TroisMetiers`, `VoletRole` et
          `MemoireEntreprise` vivent dans `components/produit/`, et toutes les
          chaines `solutions.*` restent au catalogue. Les remettre ici suffit.

          ⚠️ Ce qui part avec eux : la memoire d'entreprise, le meilleur
          argument du produit, et les deux seuls textes du site qui parlent au
          dirigeant et au responsable au registre du benefice. Ils ne sont
          plus nulle part. */}
      {/* Les cinq refus etaient enfiles dans une seule phrase, ou aucun ne
          pesait. A propos rend les memes cinq en liste a filets, et c'est le
          bloc le plus credible de cette page-la. Meme traitement ici, et une
          seule source : les intitules viennent de `aPropos.partis`, leurs
          justifications restent la-bas. `produit.refus.texte` reste dans le
          catalogue, la phrase condensee sert encore ailleurs. */}
      {/* Le titre et la liste sont plafonnes ensemble a 820 et centres. La
          liste l'etait deja, mais dans une piste de 1 360 : 460 px de vide a
          droite a 1440, avec des filets qui couraient jusqu'a 900 pour des
          phrases de cinq mots. Le titre, lui, flottait a part. */}
      <Section fond="fond-alt" aria-labelledby="refus-titre">
        <Reveal className="mx-auto max-w-[820px]">
          <h2 id="refus-titre" className="font-serif text-h3 max-w-[20ch] text-balance">
            {t('refus.titre')}
          </h2>
        </Reveal>

        <Reveal as="ul" group className="mt-titre mx-auto max-w-[820px]">
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
      {/* BANDE SOMBRE. Elle etait en Neige : une phrase de 15 px et un bouton
          au milieu d'un fond pale, la cloture la plus maigre du site. La page
          se termine maintenant comme la Home, sur une bande qui se voit.

          La phrase vient de la voie vers laquelle le bouton mene — elle dit ce
          qui se passe apres le clic, et n'existe qu'a un seul endroit. Elle
          passe de `text-intro` a `text-h3` : a 15 px elle ne portait pas une
          fin de page.

          Fonds de la page : Neige, Panneau, Neige, Panneau, Neige, Sapin,
          Neige, Panneau, Lichen. */}
      {/* ---------------------------------------------------------------
          LICHEN, ET NON PLUS SAPIN. 15 septembre 2026.

          La bande etait en Sapin, le pied de page l'est aussi, et le CTA
          primaire l'est une troisieme fois : trois Sapin empiles sans couture.
          Le bouton disparaissait purement et simplement dans sa propre bande —
          seule son ombre portee le trahissait, ce qu'on voit sur la capture du
          fondateur.

          C'est exactement le defaut deja corrige sur la page Contact, dont le
          commentaire note que Schiste ne reglerait rien : il ne differe du
          Sapin que de 1,63:1.

          Le Lichen est la seule teinte de la charte qui tranche des deux
          cotes — Panneau au-dessus, Sapin en dessous — et qui rende son
          bouton. Mesures composites :

            Sapin sur Lichen (le bouton)   4,03:1   seuil 3 pour un objet
            Glacier sur Sapin (son texte) 10,61:1
            Schiste sur Lichen (la phrase) 6,57:1

          Le bouton reste donc vert, comme le fondateur l'a demande ailleurs
          sur le site : ce n'est pas lui qui change de couleur, c'est le fond
          qui cesse d'etre la sienne.
          --------------------------------------------------------------- */}
      <Section fond="respiration" aria-label={t('cta')}>
        <Reveal className="flex flex-col items-center text-center">
          <p className="font-serif text-h3 max-w-[22ch] text-balance">
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
