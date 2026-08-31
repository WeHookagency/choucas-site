import type { ReactNode } from 'react';

type SectionHeaderProps = {
  /** Surtitre en capitales. Court : c'est une etiquette, pas une phrase. */
  label?: string;
  titre: ReactNode;
  intro?: ReactNode;
  /** Identifiant du titre, pour `aria-labelledby` sur la section. */
  id?: string;
  niveau?: 'h1' | 'h2';
  align?: 'gauche' | 'centre';
  /** Sur fond sombre, l'encre s'inverse et le label s'eclaircit. */
  inverse?: boolean;
  className?: string;
};

/**
 * En-tete de section : surtitre, titre editorial, chapeau.
 *
 * Le surtitre est en Encre douce et non en Cuivre, contrairement a la
 * maquette. Le Cuivre mesure 3,52:1 sur Neige : au-dessus du seuil du texte
 * large, sous celui du texte courant — or ce libelle fait 11 px. Le Cuivre
 * reste sur les fragments de titre en italique, ou sa taille le rend
 * conforme. Voir les regles d'usage de tokens.css.
 */
export function SectionHeader({
  label,
  titre,
  intro,
  id,
  niveau = 'h2',
  align = 'gauche',
  inverse = false,
  className,
}: SectionHeaderProps) {
  const Titre = niveau;

  return (
    <div
      className={[
        align === 'centre' ? 'text-center mx-auto' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label ? (
        <p
          className={`text-label font-semibold uppercase ${
            inverse ? 'text-encre-inverse/75' : 'text-encre-douce'
          }`}
        >
          {label}
        </p>
      ) : null}

      <Titre
        id={id}
        className={`font-serif text-balance ${
          niveau === 'h1' ? 'text-hero' : 'text-h2'
        } ${label ? 'mt-4' : ''}`}
      >
        {titre}
      </Titre>

      {intro ? (
        <p
          className={`text-intro mt-6 max-w-[62ch] ${
            align === 'centre' ? 'mx-auto' : ''
          } ${inverse ? 'text-encre-inverse/85' : 'text-encre-douce'}`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
