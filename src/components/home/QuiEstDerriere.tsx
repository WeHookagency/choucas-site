import { useTranslations } from 'next-intl';

import { Photo } from '../ui/Photo';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

/**
 * Qui vend, et ou en est le produit. Deux sections, posees le 14 septembre
 * 2026.
 *
 * Le site n'avait plus personne derriere lui depuis la suppression de la page
 * A propos : un dirigeant qui s'apprete a engager 2 000 € puis 300 € par mois
 * avec un independant veut savoir a qui il parle, et rien ne le lui disait.
 *
 * La copie vient de `aPropos.qui`, restee au catalogue quand la page A propos
 * est partie.
 *
 * ---------------------------------------------------------------------------
 * REECRITE LE 15 SEPTEMBRE 2026, a la demande du fondateur : « un peu moins
 * personnalise mais plus oriente pour aider les gens ».
 *
 * Ce qui a change, et pourquoi. Le lead disait « Moi, seul. » — la phrase la
 * plus tournee vers lui de toute la section, et la premiere qu'on lit. Elle
 * portait pourtant un fait qui compte pour un dirigeant sur le point
 * d'engager 2 000 €, alors elle n'est pas supprimee mais retournee : une
 * seule personne, et c'est celle que vous aurez au telephone. Meme fait,
 * dit du cote du client.
 *
 * La biographie — La Clusaz, douze ans au Quebec — ne tient plus toute seule
 * dans le premier paragraphe. Elle a rejoint le dernier, celui ou elle
 * DEMONTRE quelque chose : je vis dans la vallee ou sont mes clients. Une
 * biographie qui argumente n'est plus une biographie.
 *
 * Ajoute : la petite dizaine d'annees en marketing et en web. Elle n'est pas
 * la comme ligne de CV mais comme ce qu'elle donne au client — savoir
 * regarder travailler une equipe avant d'ecrire du code. Et le ski, qui
 * etait une anecdote en fin de phrase, devient l'argument : c'est le meme
 * metier.
 *
 * ⚠️ QUATRE CHAINES DE MA MAIN. Le fondateur a donne la matiere — le
 * parcours, « j'aime aider les gens » — pas les phrases. A relire.
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 * DEUXIEME PASSE, 17 septembre 2026, et elle corrige la premiere.
 *
 * Verdict du fondateur : « qui est derriere devrait etre plutot la personne
 * qui vous accompagne, vous conseille, et plus clair et moins je raconte mon
 * histoire. Le but est que les conciergeries gardent leurs clients — les
 * proprietaires — et Choucas est fait pour ca. »
 *
 * Ma version de la veille avait deplace le registre du bon cote — de la
 * biographie vers ce que le parcours donne au client — mais elle etait restee
 * une page A propos. Elle racontait le ski, le Quebec, ce qui m'interesse. Sur
 * une Home qui vend, la question n'est pas « qui es-tu » mais « qu'est-ce que
 * tu fais pour moi ».
 *
 * CE QUI CHANGE :
 *   - le titre passe de « Qui est derriere » a « Qui vous accompagne » ;
 *   - le paragraphe sur le ski disparait — son idee utile, regarder travailler
 *     avant d'ecrire du code, a rejoint le premier ;
 *   - un paragraphe neuf porte l'enjeu du client : garder ses proprietaires,
 *     et la preuve comme moyen de les garder.
 *
 * ⚠️ QUATRE CHAINES DE MA MAIN, DE NOUVEAU. Le fondateur a donne l'intention,
 * pas les phrases. A relire.
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 * LE SAMEDI ET LA CONTINUITE, REMIS LE 17 SEPTEMBRE 2026. AUCUNE COPIE NEUVE.
 *
 * En relisant le site du point de vue d'un dirigeant qui ne le connait pas,
 * deux objections arrivaient avant toutes les autres, et le site n'y repondait
 * nulle part :
 *
 *   1. « Qui je joins le samedi a 14 h, quand ca casse ? » Il va payer 300 €
 *      par mois pour un outil dont sa journee la plus dure depend.
 *   2. « Et si tu t'arretes ? » Il engage 2 000 € et son exploitation entiere
 *      aupres d'un independant seul.
 *
 * LES DEUX REPONSES EXISTAIENT DEJA, ecrites et validees, et n'etaient rendues
 * nulle part : `aPropos.samedi.*` et `aPropos.etat.p3`. Elles sont parties avec
 * la page A propos le 12 septembre, et l'avertissement en tete de ce fichier
 * signalait deja la perte de la seconde. Rien a ecrire — juste a remettre.
 *
 * Elles tombent ici et pas ailleurs parce que la section vient de promettre
 * « une seule personne, et c'est celle que vous aurez au telephone ». Le
 * samedi en est la preuve, et la continuite en est la contrepartie. Les poser
 * a trois ecrans de distance aurait laisse la promesse sans garantie.
 *
 * ⚠️ `aPropos.etat.titre`, `.lead`, `.p1` et `.p2` NE REVIENNENT PAS. C'est
 * la section « Ou en est Choucas » que le fondateur a retiree, et seul son
 * dernier paragraphe est repris. Il commence par « Et », ce qui enchainait
 * sur `p2` : la copie n'est pas reecrite pour autant — a cette place, l'aparte
 * se tient.
 *
 * Tout le texte est en encre pleine. Sur Lichen, l'encre douce mesure 2,34:1.
 * ---------------------------------------------------------------------------
 *
 * Fond Lichen, une premiere sur la Home : il tombe entre la section tarifs, en
 * Panneau, et la FAQ, en Neige, et c'est la seule teinte claire de la charte
 * qui evite une repetition aux deux bords. Sur Lichen tout le texte est en
 * encre pleine : l'encre douce y mesure 2,34:1.
 */
export function QuiEstDerriere() {
  const t = useTranslations('aPropos');

  // Section « Ou en est Choucas » retiree le 14 septembre 2026, a la demande
  // du fondateur. Elle disait honnetement ou en est le produit — « au debut,
  // et je prefere le dire » — et servait de preuve sociale tant qu'il n'y a
  // pas de clientes.
  //
  // ⚠️ Ce qui part avec elle : la seule reponse du site a « depuis quand
  // existez-vous, combien etes-vous », et la phrase « si je disparais demain,
  // votre configuration ne disparait pas avec moi ». Les chaines
  // `aPropos.etat.*` restent au catalogue.
  return (
    <Section fond="respiration" aria-labelledby="qui-titre">
      {/* Plafonne a 980 et centre. La colonne de texte etait en `flex-1` : elle
          prenait toute la largeur restante, quand les paragraphes s'arretent a
          leur mesure de 62ch, soit 529 px. Tout le reste devenait du vide, et
          du vide d'un seul cote — 243 px a 1280, 307 px a 1440, et il grandit
          avec la fenetre.

          529 de texte + 48 de gouttiere + 380 de portrait = 957. A 980 les
          deux colonnes se touchent presque, et le bloc se centre dans la
          section au lieu de s'etaler. Sous 1 024 rien ne change : la largeur
          de contenu y est deja inferieure au plafond. */}
      {/* `items-center` et non `items-start`, depuis que la legende allonge la
          colonne de droite. Cale en haut, le texte finissait 260 px avant la
          figure et laissait un vide sous lui — le defaut qu'on venait de
          corriger, deplace d'un cran. Centre, le debordement se repartit des
          deux cotes et devient une composition. C'est le raisonnement deja
          ecrit pour les cinq sections de Produit, au mot pres. */}
      {/* ---------------------------------------------------------------
          CONDENSEE POUR DE BON. 19 septembre 2026, troisieme passe.

          Les deux premieres n'ont pas condense — elles ont deplace le vide.
          En sortant la biographie du mur pour la poser en legende, j'ai
          raccourci la colonne de gauche de 85 px et rallonge celle de droite
          de 110 : LA SECTION A GRANDI. Mesure a 1440 avant cette passe :
          texte 326 px, figure 585, soit 259 px d'ecart et 44 % de la colonne
          de droite face a du vide. `items-center` a rendu ce vide symetrique,
          pas plus petit.

          Deux leviers, tires ensemble, avec une cible chiffree : moins de
          80 px d'ecart entre les deux colonnes.

          1. LA MESURE DE TEXTE PASSE DE 62 A 48 CARACTERES. Les memes 126 mots
             occupent alors plus de lignes, donc plus de hauteur. 48 reste dans
             la plage de lecture confortable, dont le plancher usuel est 45.
          2. LE PORTRAIT PASSE DE 4:5 A 5:4. La source a beaucoup de sous-bois
             au-dessus de la tete ; le recadrage prend dedans, pas dans le
             visage. `object-cover` fait le travail, aucun fichier a refaire.

          Le bloc se replafonne a 880 en consequence — 410 de texte, 48
          d'ecart, 380 de portrait — sinon on rouvrirait un couloir horizontal
          en fermant le vide vertical.
          --------------------------------------------------------------- */}
      <Reveal className="desktop:mx-auto desktop:flex desktop:max-w-[880px] desktop:items-center desktop:gap-12 large:gap-12">
        <div className="desktop:min-w-0 desktop:max-w-[48ch] desktop:flex-1">
          <h2 id="qui-titre" className="font-serif text-h3 text-balance">
            {t('qui.titre')}
          </h2>
          <p className="font-serif text-intro mt-6 font-semibold">{t('qui.lead')}</p>
          <p className="text-corps mt-5 max-w-[62ch]">{t('qui.p1')}</p>
          {/* L'enjeu du client, et non le parcours de l'auteur : c'est le
              paragraphe que le fondateur a demande le 17 septembre, et c'est
              le seul de la section qui parle de ce que la conciergerie a a
              gagner. Il est en encre pleine quand les deux autres pourraient
              s'effacer — mais sur Lichen l'encre douce mesure 2,34:1, donc
              tout y est deja en encre pleine. */}
          <p className="text-corps mt-4 max-w-[62ch]">{t('qui.p2')}</p>
          {/* `qui.p3` — La Clusaz, le Quebec, la vallee — a quitte ce bloc le
              19 septembre 2026. Il est desormais la LEGENDE DU PORTRAIT, juste
              en dessous. Voir la figure. */}
          {/* `qui.p4` — la clause de continuite — a quitte ce mur le
              19 septembre 2026. Elle est en bas de section, a cote du samedi :
              voir le bloc des garanties. La chaine reste au catalogue.

              CE QUI L'A DECIDE, mesure sur la section : quatre paragraphes de
              meme poids, 198 mots, tous a la premiere personne. Le seul
              ENGAGEMENT CONTRACTUEL de la page y figurait en quatrieme
              position, avec exactement le meme traitement que « j'ai grandi a
              La Clusaz ». Une clause opposable ne se lit pas comme une
              anecdote. */}
        </div>

        {/* Le portrait bascule une seule fois, au seuil desktop : empile et
            centre en dessous, colonne a droite au-dessus. Entre les deux il
            n'existe pas de largeur ou il soit cale d'un cote avec la moitie de
            la colonne vide. Reglage repris de la page A propos, ou il avait
            ete mesure.

            LARGEUR FIXE ET NON PLUS 34 %, depuis que le bloc est plafonne a
            980 : 34 % de 980 ne font que 333 px, la ou le reglage d'origine
            visait 380. Le pourcentage avait un sens dans une colonne qui
            suivait la fenetre ; il n'en a plus dans un bloc de largeur
            connue, ou il ne fait que rendre le portrait plus petit. */}
        {/* ---------------------------------------------------------------
            LA BIOGRAPHIE DESCEND SOUS LE PORTRAIT. 19 septembre 2026,
            « condenser cette section, cela n'est pas esthetique ».

            Le bloc de gauche etait quatre paragraphes de meme poids, 168 mots.
            Le dernier — « j'ai grandi a La Clusaz, je suis parti douze ans au
            Quebec, je vis dans la vallee ou sont mes clients » — est le plus
            biographique des quatre, et le fondateur a deja demande deux fois
            moins de « je raconte mon histoire ».

            Il ne part pas pour autant : il DIT OU EST CETTE PERSONNE, et c'est
            un argument. Il devient donc la legende du portrait, qui est
            exactement l'endroit ou une phrase de ce genre se lit — a cote du
            visage dont elle parle, et non au milieu d'un argumentaire.

            Le mur tombe a trois blocs et 126 mots ; la colonne de droite cesse
            d'etre une image posee et devient une figure. Les deux colonnes se
            rapprochent en hauteur par la meme occasion.

            Encre pleine : sur Lichen, l'encre douce mesure 2,34:1.
            --------------------------------------------------------------- */}
        <figure className="m-0 mx-auto mt-10 max-w-[420px] desktop:mx-0 desktop:mt-0 desktop:w-[380px] desktop:max-w-none desktop:shrink-0">
          <Photo src="/demo/mathieu.jpg" alt={t('portraitAlt')} rapport="5 / 4" />
          <figcaption className="text-corps mt-5">{t('qui.p3')}</figcaption>
        </figure>
      </Reveal>

      {/* Meme plafond de 980 que le bloc au-dessus, pour rester sur son axe.
          Le filet separe sans changer de fond : la section n'a qu'une teinte
          et n'a pas besoin d'une seconde.

          DEUX COLONNES, et j'ai commence par une seule. Une mesure de 62ch
          dans une piste de 980 laissait 450 px de vide a droite — le defaut
          que la sonde du 16 septembre a chasse sur les sept pages, et que je
          venais de reintroduire ici. La revendication a gauche, les deux
          garanties a droite : la piste est remplie, et la lecture y gagne un
          ordre qu'une colonne unique n'avait pas.

          LE TITRE NE PREND PAS `text-h3`. Rendu ainsi, il faisait 40 px —
          exactement la taille du H2 « Qui est derriere » vingt lignes plus
          haut, et il se lisait comme une seconde section plutot que comme un
          bloc de celle-ci. Il prend le traitement des libelles d'etape de
          BriefIntake : 15 px, capitales espacees, encre pleine. Le poids
          revient a la phrase en serif, qui est ce qu'on doit lire.

          Tout est en encre pleine : mesure composite a 6,57:1 sur le Lichen.
          L'encre douce y tomberait a 2,34:1. */}
      {/* ---------------------------------------------------------------
          DEUX GARANTIES, MEME GRAMMAIRE. 19 septembre 2026.

          Le bas de section ne portait qu'une reponse — le samedi — en deux
          colonnes : l'enonce a gauche en gros serif, la reponse a droite en
          corps. Et la clause de continuite, qui est la SECONDE garantie de la
          page, etait restee dans le mur de paragraphes au-dessus.

          Les deux sont la meme chose : ce qui vous protege quand ca va mal. Le
          samedi repond a « et si ca lache ? », la clause a « et si tu
          t'arretes ? ». Elles se lisent donc cote a cote, avec la meme
          structure — un intitule en capitales, un enonce en serif, une
          reponse en corps — au lieu d'etre l'une un bloc et l'autre un
          paragraphe noye.

          ⚠️ `qui.p4` A ETE COUPEE EN TROIS pour entrer dans cette grammaire :
          `continuite.titre`, `.lead`, `.p1`. C'est de la copie de ma main
          — ecrite le 17 — et non du fondateur, sinon je ne l'aurais pas
          touchee. `qui.p4` reste au catalogue, intacte.

          L'enonce en serif passe de `text-h3` a `text-intro` : a 40 px, deux
          enonces cote a cote pesaient plus que le H2 de la section et
          faisaient de ce bas de page le sujet principal.
          --------------------------------------------------------------- */}
      {/* ---------------------------------------------------------------
          LA PAIRE S'APPARIE DES 700 PX, ET NON 1 000. 19 septembre 2026,
          « pourquoi ces sections sont toujours la ? » sur une capture prise
          dans cette bande-la.

          Le defaut se voyait exactement entre 700 et 999 px, et nulle part
          ailleurs. Mesure : la barre de navigation y est DEJA en mode desktop
          — ses liens paraissent des 700 — pendant que ces deux garanties
          restaient empilees jusqu'a 1 000. Le visiteur lisait donc une page
          large ou deux blocs se suivaient verticalement, chacun avec son
          intitule en capitales et son filet : trois separations pour ce qui
          est une paire.

          Elles passent au seuil tablette, celui de la barre. La colonne y fait
          306 px pour un intitule, un enonce et un paragraphe — mesure, ca
          tient. Et le filet de separation, qui n'existe que pour l'empilement,
          tombe au meme seuil.

          CE NE SONT PAS DEUX SECTIONS. Le samedi repond a « et si ca lache ? »,
          la clause a « et si tu t'arretes ? » : ce qui vous protege quand ca va
          mal, deux fois. Les poser cote a cote le dit sans l'ecrire.
          --------------------------------------------------------------- */}
      <Reveal
        group
        className="mx-auto mt-titre max-w-[980px] border-t border-encre/25 pt-titre tablette:grid tablette:grid-cols-2 tablette:gap-8 desktop:gap-16"
      >
        <div style={{ ['--i' as string]: 0 }}>
          <h3 className="text-intro font-bold uppercase tracking-[0.08em]">
            {t('samedi.titre')}
          </h3>
          <p className="font-serif text-intro mt-4 max-w-[34ch] font-semibold">
            {t('samedi.lead')}
          </p>
        {/* ---------------------------------------------------------------
            LA REPONSE EST LE PRODUIT, PAS MON NUMERO. 17 septembre 2026.
            (Ce commentaire vaut pour la colonne du samedi ; le bloc est
            devenu une paire le 19 — voir plus bas.)

            J'avais mis ici `samedi.p1` — « je suis joignable le samedi en
            saison, de 9 h a 18 h. Pas un formulaire, pas un ticket : mon
            numero » — et `etat.p3`, sur la continuite si je m'arrete.

            Demande du fondateur : « plutot dire que Choucas le produit fait
            en sorte qu'un samedi a 14 h ca ne lache pas ».

            Il a raison, et c'est plus solide : une disponibilite personnelle
            repond a la panne une fois qu'elle est arrivee ; un produit qui
            tient evite d'avoir a appeler. La premiere version transformait la
            question « est-ce que ca tient ? » en « est-ce que tu reponds ? ».

            `samedi.produit` n'invente rien : la file locale vient de
            `faq.questions.hors-reseau`, « le reseau n'est pas suppose » de
            `produit.mission.p2`, le filtre des exceptions de
            `produit.imprevu.p3`, et le tableau qui ne compte que les biens
            controles de `produit.pret.p1`.

            ⚠️ `samedi.p1` ET `etat.p3` RESTENT AU CATALOGUE. La seconde
            repondait a une objection reelle — « et si tu t'arretes ? » — et
            plus rien n'y repond sur le site. A trancher.
            --------------------------------------------------------------- */}
          <p className="text-corps mt-4 max-w-[52ch]">{t('samedi.produit')}</p>
        </div>

        {/* Le filet ne sert que sous 700 px, la ou les deux blocs s'empilent :
            il leur rend ce que la colonne leur donne au-dessus — une
            frontiere, pas un ecart. Au-dela, la grille suffit. */}
        <div
          style={{ ['--i' as string]: 1 }}
          className="mt-8 border-t border-encre/25 pt-8 tablette:mt-0 tablette:border-t-0 tablette:pt-0"
        >
          <h3 className="text-intro font-bold uppercase tracking-[0.08em]">
            {t('continuite.titre')}
          </h3>
          <p className="font-serif text-intro mt-4 max-w-[34ch] font-semibold">
            {t('continuite.lead')}
          </p>
          <p className="text-corps mt-4 max-w-[52ch]">{t('continuite.p1')}</p>
        </div>
      </Reveal>
    </Section>
  );
}
