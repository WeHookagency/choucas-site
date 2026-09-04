'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';

import { ancres } from '../anchors';
import { Accent } from '../ui/Accent';
import { Accordeon, type ElementAccordeon } from '../ui/Accordeon';
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

/**
 * Reserve grise au format 1340 x 1000 a la place des captures manquantes.
 *
 * Sert a juger une mise en page, jamais a partir en production : une reserve
 * pointillee sur un site public se lit comme une image qui n'a pas charge.
 */
const RESERVE_PROVISOIRE = false;

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

  if (!RESERVE_PROVISOIRE) return null;

  /* ⚠️ PROVISOIRE — voir RESERVE_PROVISOIRE en tete de fichier. */
  return (
    <div
      aria-hidden
      className={`text-micro grid aspect-[1340/1000] w-full place-items-center rounded-carte border border-dashed border-encre-inverse/30 bg-encre-inverse/5 text-encre-inverse/50 ${className ?? ''}`}
    >
      Réserve provisoire · 1340 × 1000
    </div>
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
  const avecApercu = RESERVE_PROVISOIRE || ETAPES.some((cle) => CAPTURES[cle]);

  const elements: ElementAccordeon[] = ETAPES.map((cle, i) => ({
    id: cle,
    entete: (
      <>
        <span aria-hidden className="text-numero tabular-nums opacity-60">
          {String(i + 1).padStart(2, '0')}
        </span>
        {t(`onglets.${cle}`)}
      </>
    ),
    contenu: (
      <>
        <p className="text-corps font-serif text-h3 not-italic">{t(`panneaux.${cle}.titre`)}</p>
        <p className="text-corps mt-3 text-encre-inverse/85">{t(`panneaux.${cle}.texte`)}</p>

        <p className="text-corps mt-5 rounded-carte border border-cta bg-cta/40 px-4 py-3">
          <span className="text-label font-semibold uppercase">{t('resultatLabel')}</span>
          <span aria-hidden> — </span>
          {t(`panneaux.${cle}.resultat`)}
        </p>

        {/* Sous 1000 px, la capture appartient a l'etape ouverte et se lit avec
            elle. Au-dessus, elle vit dans la colonne de droite : l'exemplaire
            masque n'est jamais charge. */}
        {avecApercu ? <Apercu etape={cle} className="mt-5 desktop:hidden" /> : null}
      </>
    ),
  }));

  return (
    <Section id={ancres.fonctionnement} fond="sombre" aria-labelledby="brief-titre">
      <SectionHeader
        id="brief-titre"
        align="centre"
        inverse
        label={t('label')}
        titre={t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
      />

      <div
        className={`mt-titre grid items-start gap-6 desktop:gap-10 ${
          avecApercu ? 'desktop:grid-cols-2' : ''
        }`}
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
              'text-corps flex w-full items-baseline gap-3 rounded-carte px-4 py-3 text-left',
              'transition-colors duration-200 ease-choucas',
              ouvert
                ? 'bg-encre-inverse/10 font-semibold'
                : 'text-encre-inverse/70 hover:text-encre-inverse',
            ].join(' ')
          }
          classeZone={() => 'px-4 pb-4 pt-3'}
        />

        {/* Hauteur constante d'une etape a l'autre : la colonne ne saute pas.
            Tant qu'aucune capture n'existe, la colonne n'est pas rendue du
            tout — une moitie de section vide vaut moins que rien. */}
        {avecApercu ? (
          <div className="hidden desktop:block desktop:sticky desktop:top-24">
            <Apercu etape={ouverte} />
          </div>
        ) : null}
      </div>
    </Section>
  );
}
