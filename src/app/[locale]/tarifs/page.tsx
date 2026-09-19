import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Accent } from '@/components/ui/Accent';
import { Cta } from '@/components/ui/Cta';
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

  const t = await getTranslations({ locale, namespace: 'tarifs' });
  const tPages = await getTranslations({ locale, namespace: 'pages' });

  return {
    title: tPages('tarifs.titre'),
    description: t('intro'),
    alternates: localeAlternates('/tarifs', locale),
  };
}

/**
 * Tarifs — modele du 11 septembre 2026 : un demarrage, puis un abonnement.
 *
 * La page precedente vendait une implantation a 2 490 € puis un abonnement en
 * cinq paliers de biens actifs. Ce modele n'existe plus : le demarrage passe a
 * 2 000 €, l'abonnement devient lineaire — 20 € par bien et par mois, minimum
 * 300 € — et deux etages s'ajoutent, les options et ce qui est en
 * construction.
 *
 * Sept sections, un H1, un H2 chacune, aucun H3 : c'est la contrainte posee.
 * Les options et les briques a venir sont donc des paragraphes a intitule en
 * gras, pas des titres — un niveau de titre pour une ligne de prix
 * encombrerait la navigation au clavier sans rien structurer.
 *
 * Les fonds alternent, avec une seule bande sombre : « Pouvez-vous tester
 * avant ? » est la section qui leve l'objection la plus chere, elle prend le
 * poids que le Sapin lui donne. Suite des fonds : Neige, Panneau, Neige,
 * Sapin, Neige, Panneau, Neige.
 *
 * ⚠️ ALLER-RETOUR. Cette page a ete fusionnee dans Solutions le 13 septembre
 * 2026, puis ressortie le meme jour. La fusion tenait tant que Solutions
 * existait ; elle ne tient plus des lors que « Produit » et « Solutions » se
 * revelent etre le meme mot pour un lecteur, et que Solutions disparait.
 *
 * La page est reprise telle qu'elle etait, au commit `b97a75f^`. Elle lit les
 * memes chaines, qui portent depuis la franchise en base : plus de « HT », et
 * `htMention` dit la mention de l'article 293 B.
 *
 * ⚠️ Trois reponses de la FAQ decrivent encore l'ancien modele et le
 * contredisent. Elles ne sont pas sur cette page, mais elles parlent d'elle.
 */
/*
 * `Colonnes` a vecu ici du 14 au 15 septembre 2026, et a disparu avec la
 * derniere rangee qui l'employait.
 *
 * Elle reglait un vrai probleme : la page etait une colonne de 529 px calee a
 * gauche dans un conteneur de 1 360, soit 791 px de vide a droite, sur six
 * sections. Elle la plafonnait a 940 et la centrait — 300 pour les titres,
 * 64 d'ecart, 529 pour la mesure de lecture.
 *
 * Ce qu'elle ne pouvait pas regler, c'est que les sept sections avaient alors
 * exactement la meme forme. Le plafond de 940 lui survit : chaque bloc de la
 * page le porte desormais lui-meme, avec la mise en page que son contenu
 * demande.
 */

/**
 * Un montant, sorti de son titre.
 *
 * Les deux prix vivaient dans les titres — « Le demarrage — 2 000 € » — ou le
 * chiffre se noyait dans une phrase en serif, et ou « L'abonnement — 20 € par
 * bien et par mois » cassait sur deux lignes a toutes les largeurs. Sur une
 * page de tarifs, le montant est la premiere chose qu'on cherche.
 *
 * Il ne peut plus se couper puisqu'il n'est plus dans une phrase. `text-hero`
 * serait trop : ce n'est pas un titre de page, c'est une donnee.
 *
 * En cuivre, l'accent de la charte. Il mesure 3,52:1 sur Neige et 3,22 sur
 * Panneau : sous le seuil du texte courant, au-dessus de celui des titres de
 * 24 px et plus. Le montant fait 75 px a 1440 et 43 au plus etroit — il est
 * donc dans le seul emploi que `tokens.css` autorise pour cette couleur, et
 * c'est exactement celui-la : un chiffre qu'on veut voir avant le reste.
 */
function Prix({ montant, unite }: { montant: string; unite: string }) {
  return (
    <p className="mt-5">
      <span className="font-serif text-h2 block leading-none tabular-nums text-accent">{montant}</span>
      <span className="text-corps mt-3 block text-encre-douce">{unite}</span>
    </p>
  );
}

/**
 * Les deux prix, cote a cote, dans deux panneaux.
 *
 * 15 septembre 2026. La page presentait le demarrage et l'abonnement comme
 * deux sections de plus, avec exactement la forme des cinq autres : un titre a
 * gauche, du texte a droite, un fond qui alterne. SEPT RANGEES IDENTIQUES, et
 * rien qui distingue un prix d'un paragraphe sinon un chiffre cuivre dans la
 * colonne de gauche.
 *
 * C'est ce que le fondateur a vu quand il a ecrit « la page tarifs est
 * toujours pas customisee ». Le defaut n'est pas un manque d'ornement : une
 * page de tarifs doit montrer L'OFFRE, et l'offre de Choucas tient en deux
 * nombres. Tant qu'ils sont distribues sur deux ecrans de defilement, on ne
 * les compare jamais.
 *
 * Les deux panneaux les remettent sur une ligne. Fond Glacier sur le Panneau
 * de la section, filet, et le rayon de carte du site — aucune valeur neuve.
 *
 * Le premier porte un filet cuivre : c'est celui par lequel on commence, et le
 * seul des deux qui se paie une fois. `border-accent` mesure 3,81:1 sur
 * Glacier, au-dessus du seuil des objets graphiques, et il ne porte aucune
 * information a lui seul — le chiffre 01 et le contenu de la carte le disent.
 *
 * ⚠️ PAS L'OMBRE SOLIDE. Elle avait ete posee ici d'abord, par reflexe : c'est
 * le traitement des cartes du brief sur la Home. Mais la-bas elles sont sur du
 * Sapin, ou `--web-cta-presse` (#17271D) se lit comme un noir discret. Sur le
 * Panneau de cette section, le meme decalage de 6 px devient une barre noire
 * franche le long de deux cotes — verifie en capture, pas deduit. L'ombre
 * douce du site suffit.
 */
function CartePrix({
  id,
  nom,
  montant,
  unite,
  rang,
  children,
}: {
  id: string;
  nom: string;
  montant: string;
  unite: string;
  rang: string;
  children: React.ReactNode;
}) {
  const premier = rang === '01';
  return (
    <div
      className={`flex w-full flex-col rounded-carte border bg-surface p-7 text-encre desktop:p-8 ${
        premier ? 'border-accent shadow-carte' : 'border-filet'
      }`}
    >
      {/* Le chiffre dit l'ordre : on paie le demarrage une fois, puis
          l'abonnement chaque mois. Il est decoratif — « d'abord » et
          « ensuite » ne sont pas ecrits, mais la carte 01 porte la
          justification du montant et la 02 les exemples, ce qui dit la
          sequence en toutes lettres. */}
      <div className="flex items-baseline gap-3">
        <span
          aria-hidden
          className="font-serif shrink-0 text-[1.75rem] leading-none tabular-nums text-accent"
        >
          {rang}
        </span>
        <h2 id={id} className="font-serif text-h3 text-balance">
          {nom}
        </h2>
      </div>
      <Prix montant={montant} unite={unite} />
      <div className="mt-titre border-t border-filet pt-6">{children}</div>
    </div>
  );
}

/**
 * Un item nomme : une option qui existe, ou une brique qui n'existe pas encore.
 *
 * 15 septembre 2026. Les deux dernieres sections de contenu enfilaient leurs
 * items en paragraphes a intitule gras — « <strong>Le dossier de litige.</strong>
 * L'export date d'un depart… ». Sur une page de tarifs, un item qui se vend
 * separement doit se lire comme un item, pas comme la suite du paragraphe
 * precedent.
 *
 * `aVenir` passe le filet en pointilles. Ce n'est pas un ornement : c'est le
 * meme vocabulaire que `Reserve`, qui marque partout sur ce site ce qui n'est
 * pas encore la. `arriveIntro` dit « ces deux briques sont en construction » —
 * le pointille le montre au lieu de compter sur le fait qu'on ait lu la phrase
 * au-dessus.
 *
 * Le filet pointille mesure 3,03:1 sur Panneau a 25 % d'encre. Il ne porte
 * aucune information a lui seul : la phrase d'introduction le dit en toutes
 * lettres, et « sur devis » figure dedans.
 */
function Item({
  nom,
  texte,
  aVenir = false,
}: {
  nom: string;
  texte: string;
  aVenir?: boolean;
}) {
  /* `lead` a vecu ici du 17 au 19 septembre 2026 : il portait la
     justification du montant de l'option. L'option a sa propre mise en page
     depuis, et les deux seuls items qui restent — les briques a venir — n'ont
     pas de prix, donc rien a justifier. Une prop optionnelle que personne ne
     passe est du code mort qui se lit comme une intention. */
  return (
    <div
      className={`flex h-full flex-col rounded-carte border bg-surface p-6 text-encre desktop:p-7 ${
        aVenir ? 'border-dashed border-encre/25' : 'border-filet shadow-carte'
      }`}
    >
      <p className="text-intro font-semibold">{nom}</p>
      <p className="text-corps mt-4 text-encre-douce">{texte}</p>
    </div>
  );
}

export default async function Page({ params }: PageProps<'/[locale]/tarifs'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('tarifs');
  const contact = await getTranslations('contact');
  // Les montants sont lus dans `tarifsHome`, la ou la section tarifs de la
  // Home les prend deja. Une seule source : l'accueil et cette page ne
  // peuvent plus annoncer des chiffres differents, ce que le commentaire de
  // `TarifsHome` signalait comme un risque depuis sa creation.
  const prix = await getTranslations('tarifsHome');

  return (
    <main>
      {/* ---------------------------------------------------------------
          LE HERO DE L'ACCUEIL, A L'IDENTIQUE. 19 septembre 2026.

          La page ouvrait sur le mot « Tarifs » en serif centre, puis deux
          paragraphes. C'etait un titre de document, pas un hero : aucune
          etiquette, aucun accent, aucune action.

          LES ROLES S'ECHANGENT, ET AUCUNE COPIE N'EST ECRITE. « Tarifs »
          descend a l'etiquette, ou un mot seul est a sa place ; le chapeau —
          « Un demarrage, puis un abonnement. » — monte en H1, ou c'est une
          phrase, donc quelque chose qui peut porter l'accent cuivre. Le titre
          du document, lui, reste « Tarifs » : il vient de `pages.tarifs.titre`
          et ne change pas.

          Meme structure que `Hero` : etiquette, H1 en `text-hero` avec
          l'accent en bloc, mesure de lecture a 62ch, puis l'action. Meme
          bascule aussi — cale a gauche en mobile, centre a partir de la
          tablette.

          UN SEUL BOUTON, la ou l'accueil en a deux. Le second de l'accueil
          mene a une ancre de la meme page ; ici il n'y a pas de second
          endroit ou envoyer quelqu'un qui vient lire des prix, et un bouton
          secondaire pose pour la symetrie serait un bouton de remplissage.
          --------------------------------------------------------------- */}
      <Section fond="fond" largeur="scene" aria-labelledby="tarifs-titre">
        <div className="tablette:text-center">
          <p className="text-label font-semibold uppercase text-encre-douce">{t('titre')}</p>

          <h1 id="tarifs-titre" className="font-serif text-hero mt-5 text-balance">
            {t.rich('chapeau', {
              accent: (chunks) => <Accent className="block">{chunks}</Accent>,
            })}
          </h1>

          <p className="text-intro mt-6 max-w-[62ch] text-encre-douce tablette:mx-auto">
            {t('intro')}
          </p>

          <div className="mt-8 flex flex-col tablette:flex-row tablette:justify-center">
            <Cta href={getPathname({ href: '/contact', locale })} fleche pleineLargeur>
              {contact('voies.impl.action')}
            </Cta>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          LES DEUX PRIX SUR UNE SEULE LIGNE. 15 septembre 2026.

          Ils occupaient deux sections consecutives de la meme forme que les
          cinq autres. On ne les comparait donc jamais : entre le 2 000 € et le
          15 €, il y avait un ecran de defilement.

          Deux panneaux cote a cote, et l'offre entiere tient dans un ecran.
          C'est la seule chose qu'une page de tarifs doit faire avant tout le
          reste.

          Une section porte desormais deux H2. La contrainte « un H2 par
          section » visait des sections qui se suivent ; deux cartes jumelles
          dans une meme rangee sont un cas different, et leur donner un seul
          titre commun aurait masque le fait qu'il y a DEUX prix.

          Fonds de la page apres fusion : Neige, Panneau, Sapin, Neige,
          Panneau, Neige, puis la bande de cloture en Lichen. Aucun repete
          d'une section a la suivante.
          --------------------------------------------------------------- */}
      <Section fond="fond-alt" aria-label={prix('aria')}>
        <Reveal
          group
          className="mx-auto grid max-w-[940px] items-stretch gap-6 desktop:grid-cols-2 desktop:gap-8"
        >
          <div style={{ ['--i' as string]: 0 }} className="flex">
            <CartePrix
              id="demarrage-titre"
              rang="01"
              nom={prix('demarrageNom')}
              montant={prix('demarragePrix')}
              unite={prix('demarrageQuoi')}
            >
              {/* La phrase qui justifie le montant vient en tete : c'est la
                  question posee juste apres avoir lu le chiffre. */}
              <p className="text-intro font-semibold">{prix('demarrageJustification')}</p>
              {/* L'acompte vient juste apres la justification : on lit ce
                  qu'on achete, puis ce qu'on engage. Le mettre en bas le
                  ferait decouvrir au moment de signer. */}
              <p className="text-corps mt-5">{t('demarrageAcompte')}</p>
              <p className="text-corps mt-4">{t('demarrageP1')}</p>
              <p className="text-corps mt-4 text-encre-douce">{t('demarrageP2')}</p>
            </CartePrix>
          </div>

          <div style={{ ['--i' as string]: 1 }} className="flex">
            <CartePrix
              id="abonnement-titre"
              rang="02"
              nom={prix('abonnementNom')}
              montant={prix('abonnementPrix')}
              unite={prix('abonnementQuoi')}
            >
              {/* La justification du montant vient en tete, comme sur la
                  carte du demarrage : c'est la question qu'on se pose juste
                  apres avoir lu le chiffre, et elle etait sans reponse ici
                  jusqu'au 17 septembre 2026.

                  Elle dit « c'est le prix du marche » et enchaine aussitot
                  sur autre chose. Une page de tarifs qui se justifie par le
                  marche invite a aller le verifier ; celle-ci constate le
                  prix et deplace l'argument sur le contenu, dont
                  `abonnementSocle` parle deux lignes plus bas. */}
              <p className="text-intro font-semibold">{prix('abonnementJustification')}</p>
              {/* `abonnementMinimum` n'est plus rendu : depuis que le prix est
                  sorti de son titre, l'unite sous le montant porte deja
                  « minimum 300 € », et le paragraphe le repetait vingt pixels
                  plus bas. La chaine reste au catalogue. */}
              <p className="text-corps mt-5">{t('abonnementExemples')}</p>
              <p className="text-corps mt-4 text-encre-douce">{t('abonnementSocle')}</p>
            </CartePrix>
          </div>
          {/* A QUI CETTE PAGE S'ADRESSE, ecrit une fois, sous les deux
              cartes parce que cela concerne les deux.

              Le lecteur devait le deduire d'une division : le plancher de
              300 € veut dire qu'a six biens on paie 50 € par bien, et la
              reponse `une-personne` de la FAQ dit qu'a une seule personne
              Choucas ne fonctionne pas. Les deux faits etaient publies ;
              aucun des deux n'etait pose comme la question « est-ce que
              c'est pour moi ». */}
          {/* `col-span-2` : sans lui, le paragraphe devient un TROISIEME enfant
              de la grille et tombe dans la colonne de gauche, sous la carte 01,
              ou son `mx-auto text-center` le centre dans une demi-largeur. Il
              parle des deux cartes, il doit traverser les deux. */}
          <p className="text-corps mx-auto mt-titre max-w-[62ch] text-center text-encre-douce desktop:col-span-2">
            {t('perimetre')}
          </p>
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------------
          Fond Sapin : c'est la section qui leve l'objection la plus chere — on
          ne s'engage pas a l'aveugle. Elle merite d'etre vue en defilant.

          ELLE ETAIT POURTANT UNE RANGEE COMME LES AUTRES, avec son titre a
          gauche et trois paragraphes a droite. La reponse a « pouvez-vous
          tester avant ? » — OUI, ET C'EST OFFERT — se lisait en 15 px au meme
          rang que le reste.

          Elle prend la forme de ce qu'elle dit. `testP1` est LA reponse : elle
          passe au centre, en serif, a la taille d'un titre de section. Puis
          deux cartes Glacier sur le Sapin — la grammaire de BriefIntake et du
          point de jonction — pour les deux temps qui suivent : ce qui se passe
          pendant la semaine, et ce qui se passe a l'issue.

          Deux cartes et non un paragraphe de deux blocs : ce sont deux moments
          distincts, et le second engage de l'argent.
          --------------------------------------------------------------- */}
      <Section fond="sapin" aria-labelledby="test-titre">
        <Reveal group className="mx-auto max-w-[940px]">
          {/* La question reste un titre. J'avais commence par la passer en
              etiquette de 11 px pour donner la vedette a la reponse : un H2
              rendu a la taille d'une legende est un titre qu'on ne lit plus,
              et celui-la est une phrase que la lectrice se pose vraiment.

              C'est la reponse qui prend le cuivre eclairci. La table de
              `tokens.css` le donne a 4,64:1 sur Sapin : au-dessus du seuil de
              4,5 du texte courant, et de peu — d'ou le gras, qui n'est pas
              decoratif ici. Le cuivre standard y tomberait a 2,79:1. */}
          <div style={{ ['--i' as string]: 0 }} className="mx-auto max-w-[640px] text-center">
            <h2 id="test-titre" className="font-serif text-h3 text-balance">
              {t('testTitre')}
            </h2>
            <p className="text-intro mt-5 font-semibold text-accent-inverse">{t('testP1')}</p>
          </div>

          {/* ---------------------------------------------------------------
              DEUX TEMPS, ET ILS SE LISENT MAINTENANT COMME TELS.

              C'etaient deux pavés de texte blancs, identiques, poses cote a
              cote. Rien ne disait que le second SUIT le premier : on lisait
              deux arguments paralleles, quand ce sont deux moments d'une meme
              semaine — ce qui se passe pendant, puis ce qui se passe a
              l'issue.

              Le chiffre le dit, et il ne coute aucune copie : c'est le
              traitement que BriefIntake, l'implantation et la page Contact
              emploient deja pour une sequence. Cuivre sur Glacier, 3,81:1,
              au-dessus du seuil des objets graphiques ; et il est decoratif —
              `testP3` commence par « A l'issue », l'ordre est ecrit.
              --------------------------------------------------------------- */}
          <ol className="mt-titre grid gap-6 desktop:grid-cols-2 desktop:gap-8">
            {(['testP2', 'testP3'] as const).map((cle, i) => (
              <li key={cle} style={{ ['--i' as string]: i + 1 }} className="flex">
                <div className="flex h-full w-full gap-4 rounded-carte border border-filet bg-surface p-6 text-encre desktop:p-7">
                  <span
                    aria-hidden
                    className="font-serif shrink-0 text-[2.125rem] leading-none tabular-nums text-accent"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-corps">{t(cle)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* Les deux sections d'items prennent le meme en-tete centre : un titre,
          sa phrase d'introduction, puis les items en cartes. Elles se lisent
          comme une paire — ce qui existe en option, ce qui n'existe pas
          encore — et c'est ce qu'elles sont. */}
      <Section fond="fond" aria-labelledby="options-titre">
        <Reveal group className="mx-auto max-w-[940px]">
          <div style={{ ['--i' as string]: 0 }} className="mx-auto max-w-[62ch] text-center">
            <h2 id="options-titre" className="font-serif text-h3 text-balance">
              {t('optionsTitre')}
            </h2>
            <p className="text-corps mt-4 text-encre-douce">{t('optionsIntro')}</p>
          </div>
          {/* ---------------------------------------------------------------
              L'OPTION CESSE D'ETRE UN PARAGRAPHE ENCADRE. 19 septembre 2026,
              verdict du fondateur : « trop simple et banal ».

              C'etait une carte de 560 px avec trois paragraphes empiles, dont
              le premier — le nom ET le prix — en gras de 15 px. Sur une page
              ou deux montants s'affichent a 75 px, le troisieme produit
              vendable de Choucas etait annonce dans la graisse d'un
              intertitre.

              Le nom passe donc en serif, a la taille d'un titre de section :
              c'est une offre, elle se lit comme une offre. Et la carte s'ouvre
              en deux colonnes — l'argument a gauche, ce que contient le
              document a droite — ce qui lui donne la largeur des cartes de
              prix au lieu de la moitie.

              ⚠️ LE PRIX SORT DU NOM, ET C'EST CE QUI REGLE LE « BANAL ».
              `optionsRapportNom` disait « Le rapport de saison proprietaire —
              120 € par bien et par saison » : a 40 px de serif, le montant
              devenait un morceau de titre noir de trois lignes, pendant que
              les deux montants du haut de page s'affichent a 75 px en cuivre.
              Le troisieme produit vendable etait le seul dont le prix ne se
              lisait pas comme un prix.

              LA CHAINE EST DONC REDISTRIBUEE EN TROIS — `optionsRapportNom`,
              `Prix`, `Unite` — AUX MEMES MOTS, sans en ajouter ni en retirer
              un seul. Ce n'est pas une reecriture, c'est un decoupage : je
              n'ai pas touche au vocabulaire du fondateur. L'option prend alors
              le composant `Prix` des deux cartes du haut, donc la meme
              grammaire, donc le meme statut.
              --------------------------------------------------------------- */}
          <div
            style={{ ['--i' as string]: 1 }}
            className="mt-titre grid gap-8 rounded-carte border border-filet bg-surface p-7 text-encre shadow-carte desktop:grid-cols-2 desktop:gap-12 desktop:p-10"
          >
            <div>
              <h3 className="font-serif text-h3 text-balance">{t('optionsRapportNom')}</h3>
              <Prix montant={t('optionsRapportPrix')} unite={t('optionsRapportUnite')} />
            </div>
            {/* Le filet separe les deux moitiés a partir du desktop ; en
                dessous il redevient horizontal, parce qu'elles s'empilent. */}
            <div className="border-t border-filet pt-8 desktop:border-l desktop:border-t-0 desktop:pl-12 desktop:pt-0">
              <p className="text-corps">{t('optionsRapportJustification')}</p>
              <p className="text-corps mt-4 text-encre-douce">{t('optionsRapportTexte')}</p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section fond="fond-alt" aria-labelledby="arrive-titre">
        <Reveal group className="mx-auto max-w-[940px]">
          <div style={{ ['--i' as string]: 0 }} className="mx-auto max-w-[62ch] text-center">
            <h2 id="arrive-titre" className="font-serif text-h3 text-balance">
              {t('arriveTitre')}
            </h2>
            <p className="text-corps mt-4 text-encre-douce">{t('arriveIntro')}</p>
          </div>
          <div className="mt-titre grid gap-6 desktop:grid-cols-2 desktop:gap-8">
            <div style={{ ['--i' as string]: 1 }} className="flex">
              <Item nom={t('arriveMemoireNom')} texte={t('arriveMemoireTexte')} aVenir />
            </div>
            <div style={{ ['--i' as string]: 2 }} className="flex">
              <Item nom={t('arriveLitigeNom')} texte={t('arriveLitigeTexte')} aVenir />
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Le paiement : deux phrases courtes qui occupaient une rangee entiere.
          Elles se centrent et se resserrent — c'est une mention de bas de page
          de tarifs, pas une section de contenu, et la traiter comme les autres
          lui donnait un poids qu'elle n'a pas. Le filet la separe sans lui
          creer un fond a elle. */}
      <Section fond="fond" aria-labelledby="paiement-titre">
        <Reveal className="mx-auto max-w-[62ch] border-t border-filet pt-titre text-center">
          <h2 id="paiement-titre" className="text-intro font-semibold">
            {t('paiementTitre')}
          </h2>
          <p className="text-corps mt-3">{t('paiementTexte')}</p>
          <p className="text-micro mt-4 text-encre-douce">{t('htMention')}</p>
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------------
          LE SEUL BOUTON DE LA PAGE ETAIT AU FOND DU DERNIER PARAGRAPHE.

          Une page de tarifs de 2 800 px sans appel a l'action visible : il
          fallait lire les sept sections, arriver a « Le paiement », descendre
          dans sa colonne de droite, et le bouton etait la, apres la phrase sur
          la facturation mensuelle. Personne ne l'atteint.

          Il devient une bande de cloture, comme sur Produit, avec la meme
          phrase — celle de la voie vers laquelle il mene, `voies.impl.texte`,
          qui dit ce qui se passe apres le clic.

          Lichen pour les memes raisons qu'a Produit : le Sapin toucherait le
          pied de page, et le bouton vert y disparaitrait dans son propre fond.
          Mesures composites : le bouton 4,03:1 sur Lichen, son texte 10,61:1
          sur le bouton, la phrase 6,57:1 sur Lichen.
          --------------------------------------------------------------- */}
      <Section fond="respiration" aria-label={contact('voies.impl.action')}>
        <Reveal className="flex flex-col items-center text-center">
          <p className="font-serif text-h3 max-w-[22ch] text-balance">
            {contact('voies.impl.texte')}
          </p>
          {/* Le lexique des CTA est fige : « Organiser une journée sur site »
              est le libelle de la voie principale de la page Contact, et c'est
              vers elle que ce bouton mene. */}
          <Cta href={getPathname({ href: '/contact', locale })} fleche className="mt-titre">
            {contact('voies.impl.action')}
          </Cta>
        </Reveal>
      </Section>
    </main>
  );
}
