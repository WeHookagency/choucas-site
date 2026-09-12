'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';

import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
import { Accordeon, type ElementAccordeon } from '../ui/Accordeon';
import { Reserve } from '../ui/Reserve';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionHeader } from '../ui/SectionHeader';

/** Les quatre etapes du parcours, dans l'ordre ou elles s'enchainent. */
const ETAPES = ['brief', 'controle', 'pret', 'rapport'] as const;
type EtapeCle = (typeof ETAPES)[number];

/**
 * Captures d'ecran des etapes.
 *
 * Vide pour l'instant : aucun des quatre ecrans n'est encore exporte. Pour en
 * ajouter un : importer le fichier, l'inscrire ici sous sa cle, et remplir
 * `panneaux.<cle>.captureAlt` dans les deux fichiers de traduction. L'image ne
 * s'affiche que si les deux sont presents — pas de capture sans texte
 * alternatif.
 *
 * Les quatre doivent partager le rapport 1340 x 1000, faute de quoi la colonne
 * de droite changerait de hauteur d'une etape a l'autre.
 */
const CAPTURES: Partial<Record<EtapeCle, StaticImageData>> = {};

/*
 * La reserve pointillee « RESERVE_PROVISOIRE » a disparu le 12 septembre 2026.
 *
 * Elle etait a `false` parce qu'un cadre en pointilles sur un site public se
 * lit comme une image qui n'a pas charge — le backlog l'interdisait en
 * production, et il avait raison. Mais l'eteindre supprimait aussi la colonne
 * de droite : le panneau ouvert occupait la moitie gauche et l'autre moitie
 * restait vide.
 *
 * La colonne est donc rendue en permanence, avec le traitement de reserve
 * employe sur Produit et Solutions : un aplat plein, pas des pointilles, et
 * une legende qui nomme l'ecran attendu. Une reserve qui se donne pour ce
 * qu'elle est ne se lit pas comme un defaut, et une reserve muette ne se
 * remplit jamais.
 */

/** Etat d'un maillon vis-a-vis de l'etape ouverte. */
type Position = 'passe' | 'courant' | 'avenir';

/**
 * Le fil qui relie les quatre etapes.
 *
 * Il longe le bloc entier — en-tete et zone depliee — parce qu'il porte la
 * continuite du parcours : une etape ouverte reste un maillon de la chaine,
 * pas un panneau detache.
 *
 * Le segment haut est de hauteur fixe, ce qui aligne le point sur le titre ;
 * le segment bas prend tout le reste et traverse donc le contenu deplie.
 *
 * Vert Mousse sur le parcouru — 3,23:1 sur le Schiste de la section, au-dessus
 * du seuil de 3:1 des elements graphiques. Le Sapin n'y arrive pas : 1,63:1.
 *
 * Decoratif : l'ordre est deja porte par les numeros et par `aria-expanded`.
 */
function Fil({
  position,
  premier,
  dernier,
}: {
  position: Position;
  premier: boolean;
  dernier: boolean;
}) {
  const avant = position === 'avenir' ? 'bg-encre-inverse/30' : 'bg-ok';
  const apres = position === 'passe' ? 'bg-ok' : 'bg-encre-inverse/30';
  const point =
    position === 'courant'
      ? 'size-3 border-ok bg-ok'
      : position === 'passe'
        ? 'size-2.5 border-ok bg-ok'
        : 'size-2.5 border-encre-inverse/50';

  return (
    <span aria-hidden className="flex w-3 shrink-0 flex-col items-center self-stretch">
      <span className={`w-px h-6 shrink-0 ${premier ? 'bg-transparent' : avant}`} />
      <span className={`shrink-0 rounded-full border transition-colors duration-200 ease-choucas ${point}`} />
      <span className={`w-px flex-1 ${dernier ? 'bg-transparent' : apres}`} />
    </span>
  );
}

/** Emplacement de la capture d'une etape, a hauteur constante. */
function Apercu({ etape, className }: { etape: EtapeCle; className?: string }) {
  const t = useTranslations('brief');
  const capture = CAPTURES[etape];
  const alt = t(`panneaux.${etape}.captureAlt`);

  if (capture && alt) {
    return (
      <Image
        src={capture}
        alt={alt}
        sizes="(min-width: 1000px) 600px, 100vw"
        className={`h-auto w-full rounded-carte border border-encre-inverse/15 ${className ?? ''}`}
      />
    );
  }

  // Pas de capture : la place est tenue, et ce qu'elle attend est nomme.
  return (
    <figure className={`m-0 flex flex-col gap-3 ${className ?? ''}`}>
      <Reserve ratio="1340 / 1000" teinte="mousse" />
      <figcaption className="text-micro text-encre-inverse/75">
        {t(`onglets.${etape}`)}
      </figcaption>
    </figure>
  );
}

/**
 * Du brief a la preuve — brief V8 §7, cœur commercial de la Home.
 *
 * Accordeon plutot qu'onglets : le detail d'une etape se deplie sous son
 * propre titre, a l'interieur de la chaine, au lieu de partir dans un panneau
 * separe. Le fil traverse la zone depliee, ce qui maintient la lecture du
 * parcours pendant qu'on lit une etape.
 *
 * Une seule etape ouverte a la fois, et jamais aucune : la colonne de droite
 * doit toujours avoir une capture a montrer. Cliquer l'en-tete ouvert ne le
 * referme donc pas.
 *
 * Clavier : les quatre en-tetes sont dans l'ordre de tabulation, Entree et
 * Espace ouvrent. Les fleches haut et bas, Debut et Fin deplacent le focus
 * d'un en-tete a l'autre — ce que le motif accordeon prevoit en option, et
 * que le tablist precedent offrait deja.
 */
export function BriefToProof() {
  const t = useTranslations('brief');
  const [ouverte, setOuverte] = useState<EtapeCle>('brief');
  const rangOuvert = ETAPES.indexOf(ouverte);

  /** Y a-t-il seulement quelque chose a montrer a droite ? */

  const elements: ElementAccordeon[] = ETAPES.map((cle, i) => {
    const estOuverte = cle === ouverte;
    return {
    id: cle,
    // L'en-tete porte le titre de l'etape, pas seulement son etiquette : le
    // motif ARIA veut le bouton dans un titre, et ce titre doit etre celui
    // qu'on lit. La ligne editoriale vivait auparavant dans la zone depliee,
    // en <p> a 40 px sous un h3 a 14 px — on lisait un titre qui n'en etait
    // pas un.
    entete: (
      <span className="flex flex-col gap-1">
        <span className="text-label flex items-baseline gap-2 font-semibold uppercase">
          <span aria-hidden className="text-numero tabular-nums text-numero-inverse">
            {String(i + 1).padStart(2, '0')}
          </span>
          {t(`onglets.${cle}`)}
        </span>
        {/* Les quatre phrases sont au meme niveau de titre, mais pas au meme
            etat. L'ouverte prend le poids plein — 32 a 40 px, graisse 500 ;
            les trois autres reculent en taille et en graisse, sans changer de
            niveau. Newsreader n'est sous-ensemble qu'en 400 et 500 : au-dela
            le navigateur graisserait le trait lui-meme. */}
        <span
          // La mesure suit la taille : 22 caracteres cadrent une ligne de
          // 40 px, ils hachent une ligne de 15.
          className={`font-serif not-italic ${
            estOuverte ? 'text-h3 max-w-[22ch] font-medium' : 'text-intro max-w-[48ch] font-normal'
          }`}
        >
          {t(`panneaux.${cle}.titre`)}
        </span>
      </span>
    ),
    contenu: (
      <>
        {/* Mesure de lecture. Sans plafond, le panneau prend les 1 360 px du
            conteneur des que la colonne d'apercu est absente : 167 caracteres
            par ligne a 1440, pour un plafond de 75 dans les specs §3. Il ne
            depend donc pas de la presence d'une capture. */}
        <p className="text-corps max-w-[62ch] text-encre-inverse/85">
          {t(`panneaux.${cle}.texte`)}
        </p>

        <p className="text-corps mt-5 max-w-[62ch] rounded-carte border border-cta bg-cta/40 px-4 py-3">
          <span className="text-label font-semibold uppercase">{t('resultatLabel')}</span>
          <span aria-hidden> — </span>
          {t(`panneaux.${cle}.resultat`)}
        </p>

        {/* Sous 1000 px, la capture appartient a l'etape ouverte et se lit avec
            elle. Au-dessus, elle vit dans la colonne de droite : l'exemplaire
            masque n'est jamais charge. */}
        <Apercu etape={cle} className="mt-5 desktop:hidden" />
      </>
    ),
    };
  });

  return (
    <Section id={ancres.fonctionnement} fond="sombre" aria-labelledby="brief-titre">
      <Reveal>
        <SectionHeader
          id="brief-titre"
          align="centre"
          inverse
          label={t('label')}
          titre={t.rich('titre', { accent: (chunks) => <Accent ton="inverse">{chunks}</Accent> })}
        />
      </Reveal>

      <Reveal
        className="mt-titre grid items-start gap-6 desktop:grid-cols-2 desktop:gap-10"
      >
        <Accordeon
          idBase="brief"
          elements={elements}
          ouverts={[ouverte]}
          onChange={([id]) => id && setOuverte(id as EtapeCle)}
          toujoursUn
          className="flex flex-col"
          classeElement={() => 'flex items-stretch gap-4'}
          avant={({ index, premier, dernier }) => (
            <Fil
              position={index < rangOuvert ? 'passe' : index === rangOuvert ? 'courant' : 'avenir'}
              premier={premier}
              dernier={dernier}
            />
          )}
          classeEntete={({ ouvert }) =>
            [
              'text-corps flex w-full rounded-carte px-4 py-4 text-left',
              'transition-colors duration-200 ease-choucas',
              ouvert
                ? 'bg-encre-inverse/10'
                : 'text-encre-inverse/70 hover:text-encre-inverse',
            ].join(' ')
          }
          classeZone={() => 'px-4 pb-4 pt-3'}
        />

        {/* Hauteur constante d'une etape a l'autre : la colonne ne saute pas
            quand on change d'etape. Collante, elle reste en vis-a-vis du
            panneau ouvert pendant qu'on descend dans l'accordeon. */}
        <div className="hidden desktop:block desktop:sticky desktop:top-24">
          <Apercu etape={ouverte} />
        </div>
      </Reveal>
    </Section>
  );
}
