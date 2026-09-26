'use client';

import { useRef, type ReactNode } from 'react';

import { HAUTEUR_BARRE_DESKTOP, HAUTEUR_BARRE_MOBILE } from '../anchors';

export type ElementAccordeon = {
  id: string;
  /** Contenu de l'en-tete cliquable. */
  entete: ReactNode;
  /** Contenu revele. */
  contenu: ReactNode;
};

export type EtatElement = {
  ouvert: boolean;
  index: number;
  premier: boolean;
  dernier: boolean;
};

type AccordeonProps = {
  elements: ElementAccordeon[];
  /** Prefixe des identifiants. Doit etre unique dans la page. */
  idBase: string;
  ouverts: string[];
  onChange: (ouverts: string[]) => void;
  /** Plusieurs elements ouverts simultanement — la FAQ le demande. */
  multiple?: boolean;
  /**
   * Interdit de tout refermer. Necessaire quand autre chose depend de la
   * selection : le parcours de la Home a une colonne d'illustration qui doit
   * toujours avoir une etape a montrer.
   */
  toujoursUn?: boolean;
  /** Ramene l'en-tete sous la barre collante apres l'ouverture. */
  ramenerDansLaVue?: boolean;
  /**
   * Deplie et replie la zone en 300 ms au lieu de la basculer d'un coup. Le
   * parcours de la Home le demande ; la FAQ garde la bascule franche.
   */
  anime?: boolean;
  /** Niveau du titre qui porte le bouton. La page decide de sa hierarchie. */
  niveau?: 'h2' | 'h3' | 'h4';
  className?: string;
  /** Rendu a gauche de l'en-tete et de la zone, sur toute leur hauteur. */
  avant?: (etat: EtatElement) => ReactNode;
  classeElement?: (etat: EtatElement) => string;
  classeEntete?: (etat: EtatElement) => string;
  classeZone?: (etat: EtatElement) => string;
};

/**
 * Accordeon accessible, extrait du parcours de la Home pour servir aussi a la
 * FAQ.
 *
 * Il porte la semantique et le clavier ; l'apparence reste a la page, par les
 * fonctions de classe. `avant` permet d'inserer une colonne qui longe
 * l'element entier — c'est par la que passe le fil du parcours.
 *
 * Motif ARIA accordeon : chaque en-tete est un bouton dans un titre, porte
 * `aria-expanded` et pointe vers sa region par `aria-controls` ; la region
 * renvoie au bouton par `aria-labelledby`.
 *
 * Clavier : les en-tetes sont tous dans l'ordre de tabulation. Fleches haut et
 * bas, Debut et Fin deplacent le focus de l'un a l'autre, ce que le motif
 * prevoit en option.
 */
export function Accordeon({
  elements,
  idBase,
  ouverts,
  onChange,
  multiple = false,
  toujoursUn = false,
  ramenerDansLaVue = false,
  anime = false,
  niveau = 'h3',
  className,
  avant,
  classeElement,
  classeEntete,
  classeZone,
}: AccordeonProps) {
  const Titre = niveau;
  const enTetes = useRef<Record<string, HTMLButtonElement | null>>({});

  /**
   * Ramene l'en-tete sous la barre collante apres l'ouverture.
   *
   * Sans cela, ouvrir la quatrieme etape d'une liste deroule un panneau dont
   * le titre est deja sorti par le haut : on lit un contenu sans savoir de
   * quoi il parle. La mesure se fait apres le rendu, sinon la boite lue est
   * celle d'avant l'ouverture.
   *
   * Ne bouge que si l'en-tete est reellement mal place — sous la barre ou trop
   * bas dans la fenetre. Un defilement qui se declenche a chaque clic, meme
   * quand tout est deja visible, se lit comme un bug.
   *
   * Avec `anime`, la mesure attend la fin du depli. Mesuree tout de suite,
   * elle lirait l'en-tete de l'etape 4 pendant que l'etape 1 se referme
   * au-dessus de lui : il remonte encore de toute la hauteur de ce panneau,
   * et le defilement tombe a cote. Le filet de 350 ms couvre une transition
   * qui ne se declencherait pas.
   */
  function ramener(id: string) {
    if (!anime) {
      requestAnimationFrame(() => mesurerEtRamener(id));
      return;
    }
    const zone = document.getElementById(`${idBase}-zone-${id}`);
    let fait = false;
    const finir = () => {
      if (fait) return;
      fait = true;
      zone?.removeEventListener('transitionend', surFin);
      clearTimeout(filet);
      mesurerEtRamener(id);
    };
    const surFin = (e: TransitionEvent) => {
      if (e.target === zone && e.propertyName === 'grid-template-rows') finir();
    };
    zone?.addEventListener('transitionend', surFin);
    const filet = setTimeout(finir, 350);
  }

  function mesurerEtRamener(id: string) {
    const el = enTetes.current[id];
    if (!el) return;
    const barre = window.innerWidth >= 1000 ? HAUTEUR_BARRE_DESKTOP : HAUTEUR_BARRE_MOBILE;
    const r = el.getBoundingClientRect();
    if (r.top >= barre + 8 && r.top <= window.innerHeight * 0.45) return;
    const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: window.scrollY + r.top - barre - 16,
      behavior: doux ? 'smooth' : 'auto',
    });
  }

  function basculer(id: string) {
    const estOuvert = ouverts.includes(id);
    if (multiple) {
      onChange(estOuvert ? ouverts.filter((o) => o !== id) : [...ouverts, id]);
      return;
    }
    if (estOuvert) {
      // Refermer le seul element ouvert laisserait la page sans selection.
      onChange(toujoursUn ? ouverts : []);
      return;
    }
    onChange([id]);
    if (ramenerDansLaVue) ramener(id);
  }

  function surTouche(e: React.KeyboardEvent, index: number) {
    let cible: number | null = null;
    if (e.key === 'ArrowDown') cible = (index + 1) % elements.length;
    else if (e.key === 'ArrowUp') cible = (index - 1 + elements.length) % elements.length;
    else if (e.key === 'Home') cible = 0;
    else if (e.key === 'End') cible = elements.length - 1;
    if (cible === null) return;
    e.preventDefault();
    enTetes.current[elements[cible].id]?.focus();
  }

  return (
    <ul className={className}>
      {elements.map((element, index) => {
        const etat: EtatElement = {
          ouvert: ouverts.includes(element.id),
          index,
          premier: index === 0,
          dernier: index === elements.length - 1,
        };

        return (
          <li key={element.id} className={classeElement?.(etat)}>
            {avant?.(etat)}

            <div className="min-w-0 flex-1">
              <Titre>
                <button
                  ref={(el) => {
                    enTetes.current[element.id] = el;
                  }}
                  type="button"
                  id={`${idBase}-entete-${element.id}`}
                  aria-expanded={etat.ouvert}
                  aria-controls={`${idBase}-zone-${element.id}`}
                  onClick={() => basculer(element.id)}
                  onKeyDown={(e) => surTouche(e, index)}
                  className={classeEntete?.(etat)}
                >
                  {element.entete}
                </button>
              </Titre>

              {anime ? (
                // La hauteur passe de 0fr a 1fr : c'est la seule facon de
                // transitionner vers une hauteur de contenu inconnue. Le
                // padding vit a l'interieur du rogne, sinon il resterait
                // visible zone fermee. `inert` tient le role de `hidden` :
                // hors tabulation, hors lecteur d'ecran.
                <div
                  id={`${idBase}-zone-${element.id}`}
                  role="region"
                  aria-labelledby={`${idBase}-entete-${element.id}`}
                  inert={!etat.ouvert}
                  className={`grid transition-[grid-template-rows] duration-300 ease-choucas ${
                    etat.ouvert ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className={classeZone?.(etat)}>{element.contenu}</div>
                  </div>
                </div>
              ) : (
                <div
                  id={`${idBase}-zone-${element.id}`}
                  role="region"
                  aria-labelledby={`${idBase}-entete-${element.id}`}
                  hidden={!etat.ouvert}
                  className={classeZone?.(etat)}
                >
                  {element.contenu}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
