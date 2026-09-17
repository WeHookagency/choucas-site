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
      <Reveal className="desktop:mx-auto desktop:flex desktop:max-w-[980px] desktop:items-start desktop:gap-12 large:gap-16">
        <div className="desktop:min-w-0 desktop:flex-1">
          <h2 id="qui-titre" className="font-serif text-h3 text-balance">
            {t('qui.titre')}
          </h2>
          <p className="font-serif text-intro mt-6 font-semibold">{t('qui.lead')}</p>
          <p className="text-corps mt-5 max-w-[62ch]">{t('qui.p1')}</p>
          <p className="text-corps mt-4 max-w-[62ch]">{t('qui.p2')}</p>
          <p className="text-corps mt-4 max-w-[62ch]">{t('qui.p3')}</p>
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
        <Photo
          src="/demo/mathieu.jpg"
          alt={t('portraitAlt')}
          className="mx-auto mt-10 max-w-[420px] desktop:mx-0 desktop:mt-0 desktop:w-[380px] desktop:max-w-none desktop:shrink-0"
        />
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
      <Reveal className="mx-auto mt-titre max-w-[980px] border-t border-encre/25 pt-titre desktop:grid desktop:grid-cols-2 desktop:gap-16">
        <div>
          <h3 className="text-intro font-bold uppercase tracking-[0.08em]">
            {t('samedi.titre')}
          </h3>
          <p className="font-serif text-h3 mt-4 max-w-[20ch] text-balance">{t('samedi.lead')}</p>
        </div>
        <div className="mt-8 desktop:mt-0">
          <p className="text-corps max-w-[52ch]">{t('samedi.p1')}</p>
          <p className="text-corps mt-5 max-w-[52ch]">{t('etat.p3')}</p>
        </div>
      </Reveal>
    </Section>
  );
}
