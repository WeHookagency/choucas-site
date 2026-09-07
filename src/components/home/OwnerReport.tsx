import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { Accent } from '../ui/Accent';
import { Icon } from '../ui/Icon';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

const POINTS = ['fait', 'attention', 'photos', 'passage'] as const;

/** Les quatre lignes du releve, dans l'ordre de la maquette. */
const FAIT = ['chaufferie', 'evacuations', 'robinet', 'zone'] as const;

/** Les quatre vignettes, et ce que chacune montrerait. */
const PHOTOS = ['chaufferie', 'evacuations', 'robinet', 'zone'] as const;

/** Les quatre mesures de l'intervention, dans l'ordre de la maquette. */
const CHIFFRES = ['arrivee', 'depart', 'duree', 'points'] as const;

/**
 * Apercu d'un rapport proprietaire.
 *
 * Reprend la structure de choucas-rapport-intervention.html : c'est un
 * courriel adresse au proprietaire, pas un ecran de l'application. D'ou
 * l'en-tete d'expediteur, la salutation, la ligne de mesures, les deux
 * boutons du point d'attention, le bloc du prochain client et la signature.
 *
 * ---------------------------------------------------------------------------
 * QUI SIGNE CE RAPPORT — la correction la plus importante du bloc
 *
 * La maquette posait la marque Choucas dans l'en-tete et signait « Choucas
 * Conciergerie ». C'est faux, et pas qu'un peu : le rapport est emis par la
 * conciergerie cliente, pour son propre proprietaire. Choucas est le logiciel
 * qui le prepare, il n'apparait nulle part dans le courriel — pas plus qu'un
 * traitement de texte ne signe une lettre.
 *
 * L'expediteur et la signature portent donc « Votre conciergerie ». Aucun
 * logo n'est dessine a cet endroit : celui de la conciergerie n'est pas a
 * nous de l'inventer, et y remettre le notre reintroduirait l'erreur.
 *
 * ---------------------------------------------------------------------------
 * Ce n'est pas une capture, et tout dans son traitement le dit :
 *
 * - c'est du HTML, pas une image servie par `CaptureProduit` — son texte est
 *   selectionnable et traduisible, ce qu'aucun export d'ecran ne serait ;
 * - rien n'y est cliquable : les boutons de la maquette sont rendus en
 *   `span`, lisibles mais inertes, la ou les deux vraies captures ouvrent la
 *   demonstration publique ;
 * - une pastille et une legende le disent en toutes lettres. Le module
 *   n'existe toujours pas.
 *
 * Les couleurs sont celles du site, pas celles de la maquette : elle pose le
 * Sapin #263F30 de la marque et un creme #FDF8F0 qui n'existent pas ici.
 *
 * Le contenu se limite a ce que le brief §10 autorise : ce qui a ete fait, un
 * point d'attention, des photos, le prochain passage. Les quatre mesures de
 * l'en-tete decrivent l'intervention — heure d'arrivee, de depart, duree,
 * points traites — donc la mission, jamais la personne qui l'a menee.
 */
function ApercuRapport() {
  const t = useTranslations('rapport.apercu');

  return (
    <figure className="m-0">
      {/* Pas de `role="img"` : le texte de l'apercu doit rester lisible aux
          lecteurs d'ecran. C'est la legende qui dit ce qu'il est. */}
      {/* Plafonne a 70 % de la hauteur de fenetre, avec un fondu qui dit que
          le courriel continue. Sans plafond, l'apercu faisait 1 200 px de haut
          a 1440 et 1 479 a 390 — plus d'un ecran et demi. Un rapport EST plus
          long qu'un ecran ; le montrer en entier ne le rend pas plus vrai, ca
          le rend seulement impossible a embrasser du regard.

          Le plafond est en `vh` et non en pixels : c'est la fenetre du lecteur
          qui decide, pas une valeur choisie sur la mienne.

          Rien de focalisable sous la coupe — les boutons de la maquette sont
          des `span` inertes — donc rien ne peut recevoir le focus hors du
          cadre. Le texte coupe reste dans le document et reste lu. */}
      <div className="relative max-h-[70vh] overflow-hidden rounded-carte border border-filet bg-surface">
        {/* En-tete d'expediteur, sur le Sapin de la maquette. */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-cta px-5 py-4 text-cta-encre desktop:px-7">
          <span className="text-label font-bold uppercase tracking-[0.14em]">
            {t('expediteur')}
          </span>
          <span className="text-micro text-cta-encre/80">{t('enTete')}</span>
        </div>

        <div className="flex flex-col gap-6 px-5 py-6 desktop:px-7">
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="text-corps text-encre-douce">{t('salutation')}</p>
              <span className="text-label shrink-0 rounded-capsule bg-fond-alt px-2.5 py-1 font-semibold uppercase text-encre-douce">
                {t('pastille')}
              </span>
            </div>
            <p className="font-serif text-h3 mt-3 max-w-[22ch] text-balance">{t('titre')}</p>
            {/* Un courriel se lit sur 600 px environ, comme la maquette le
                pose. Sans plafond, l'apercu s'etirait a 92 caracteres. */}
            <p className="text-corps mt-3 max-w-[62ch] text-encre-douce">{t('chapeau')}</p>
          </div>

          {/* Les quatre mesures de l'intervention. Deux colonnes sous 700 px :
              a 390, quatre colonnes ecrasaient « Points traites » sur trois
              lignes. */}
          <dl className="grid grid-cols-2 gap-4 border-y border-filet py-4 tablette:grid-cols-4">
            {CHIFFRES.map((cle, i) => (
              <div
                key={cle}
                className={`flex flex-col gap-1 ${
                  i % 2 === 1 ? 'border-l border-filet pl-4' : ''
                } tablette:border-l tablette:border-filet tablette:pl-4 tablette:first:border-l-0 tablette:first:pl-0`}
              >
                <dt className="text-label font-semibold uppercase tracking-[0.14em] text-encre-douce">
                  {t(`chiffres.${cle}Label`)}
                </dt>
                <dd className="text-intro m-0 font-semibold tabular-nums">
                  {t(`chiffres.${cle}Valeur`)}
                  {cle === 'points' ? (
                    <span className="text-corps font-normal text-encre-douce">
                      {' '}
                      {t('chiffres.pointsTotal')}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          <div>
            <Etiquette>{t('faitLabel')}</Etiquette>
            <ul className="mt-3 flex flex-col gap-2">
              {FAIT.map((cle) => (
                <li key={cle} className="text-corps flex items-start gap-2">
                  <Icon name="coche" size={16} graisse="bold" className="mt-1 shrink-0 text-ok" />
                  {t(`fait.${cle}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Le point d'attention. L'icone double le libelle : l'alerte ne
              repose pas sur la seule couleur, ce que le §9 des specs
              interdit. */}
          <div className="rounded-carte border border-filet bg-fond-alt p-4">
            <p className="text-label flex items-center gap-2 font-semibold uppercase tracking-[0.14em] text-attention">
              <Icon name="alerte" size={16} />
              {t('attentionLabel')}
            </p>
            <p className="text-corps mt-2 max-w-[62ch]">
              <strong className="font-bold">{t('attentionTitre')}</strong>
              {t('attentionTexte')}
            </p>
            {/* Boutons de la maquette, rendus inertes : l'apercu depeint un
                courriel, il ne le fait pas fonctionner. */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-micro inline-flex items-center rounded-capsule bg-cta px-4 py-2 font-bold text-cta-encre">
                {t('attentionDevis')}
              </span>
              <span className="text-micro inline-flex items-center rounded-capsule border border-filet px-4 py-2 font-semibold text-encre">
                {t('attentionPhoto')}
              </span>
            </div>
          </div>

          <div>
            <Etiquette>{t('photosLabel')}</Etiquette>
            {/* Reserves neutres : aucune photographie n'est inventee. La
                legende dit ce que chacune montrerait. */}
            <ul className="mt-3 grid grid-cols-4 gap-2">
              {PHOTOS.map((cle) => (
                <li key={cle} className="flex min-w-0 flex-col gap-1.5">
                  <span aria-hidden className="aspect-4/3 rounded-[8px] bg-respiration/30" />
                  <span className="text-micro truncate text-encre-douce">
                    {t(`photos.${cle}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <span className="text-micro inline-flex items-center rounded-capsule border border-filet px-5 py-3 font-semibold">
              {t('rapportComplet')}
            </span>
          </div>

          {/* Le prochain client. Sur Sapin : Glacier a 10,61:1, et le pave de
              date en Glacier porte du Schiste. */}
          <div className="flex flex-wrap items-center gap-5 rounded-carte bg-cta p-5 text-cta-encre">
            <div className="min-w-0 flex-1 basis-60">
              <p className="text-label font-semibold uppercase tracking-[0.14em] text-cta-encre/80">
                {t('prochainLabel')}
              </p>
              <p className="font-serif text-intro mt-2 text-balance">{t('prochainTexte')}</p>
            </div>
            {/* A 390 le groupe passe a la ligne : il y occupait 129 px sur
                272 et laissait un trou a sa droite. Une fois seul sur sa
                ligne, il la prend entiere et l'ecart tombe entre le libelle
                et le pave de date. */}
            <div className="flex w-full shrink-0 items-center justify-between gap-3 tablette:w-auto tablette:justify-end">
              <span className="text-label font-semibold uppercase tracking-[0.14em] text-cta-encre/80">
                {t('prochainJusqu')}
              </span>
              <span className="flex size-13 flex-col items-center justify-center rounded-carte bg-surface text-encre">
                <span className="text-micro font-semibold uppercase tracking-[0.14em] text-encre-douce">
                  {t('prochainJour')}
                </span>
                <span className="text-intro font-semibold tabular-nums">{t('prochainDate')}</span>
              </span>
            </div>
          </div>

          <div className="border-t border-filet pt-5 text-center">
            <p className="text-micro text-encre-douce">{t('signature')}</p>
            <p className="text-micro text-encre-douce">{t('reponse')}</p>
          </div>
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--web-surface))' }}
        />
      </div>

      <figcaption className="text-micro mt-3 text-encre-douce">{t('legende')}</figcaption>
    </figure>
  );
}

/** Etiquette de rubrique : la pastille pleine de la maquette. */
function Etiquette({ children }: { children: ReactNode }) {
  return (
    <span className="text-label inline-flex rounded-capsule bg-cta px-3.5 py-1.5 font-semibold uppercase tracking-[0.2em] text-cta-encre">
      {children}
    </span>
  );
}

/**
 * Rapport proprietaire — brief V8 §10, quatrieme pilier.
 *
 * Texte a gauche, apercu a droite sur desktop ; une colonne en dessous.
 * La microcopie rappelle la regle produit : l'envoi reste un geste humain,
 * Choucas prepare, le manager relit.
 */
export function OwnerReport() {
  const t = useTranslations('rapport');

  return (
    <Section fond="fond" aria-labelledby="rapport-titre">
      <Reveal group className="grid items-start gap-12 desktop:grid-cols-12">
        <div style={{ ['--i' as string]: 0 }} className="desktop:col-span-5">
          <p className="text-label font-semibold uppercase text-encre-douce">{t('label')}</p>
          <h2 id="rapport-titre" className="font-serif text-h2 mt-4 text-balance">
            {t.rich('titre', { accent: (chunks) => <Accent>{chunks}</Accent> })}
          </h2>
          <p className="text-intro mt-6 max-w-[62ch] text-encre-douce">{t('intro')}</p>

          <ul className="mt-titre space-y-3">
            {POINTS.map((cle) => (
              <li key={cle} className="text-corps flex items-start gap-3">
                <Icon name="coche" size={24} graisse="bold" className="mt-px shrink-0 text-ok" />
                {t(`points.${cle}`)}
              </li>
            ))}
          </ul>

          {/* « Le manager relit avant envoi. » retire le 7 septembre 2026.
              ⚠️ C'etait la seule phrase de la Home qui disait qu'aucun rapport
              ne part tout seul. La regle tient toujours dans la FAQ et sur
              /a-propos ; `rapport.micro` reste dans les deux fichiers de
              traduction. */}
        </div>

        <div style={{ ['--i' as string]: 2 }} className="desktop:col-span-7">
          <ApercuRapport />
        </div>
      </Reveal>
    </Section>
  );
}
