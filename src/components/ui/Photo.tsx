import Image, { type StaticImageData } from 'next/image';

/**
 * Photographie posee dans une reserve au rapport 4:5.
 *
 * Le cadre porte le rapport de forme, donc la place est reservee avant que
 * l'image n'arrive : rien ne bouge au chargement, ce que demande le §10
 * (CLS sous 0,1). `fill` laisse le cadre decider de la taille et `object-cover`
 * fait le recadrage, sans encodeur d'images dans le projet.
 *
 * Chargement differe par defaut : la plupart des photos sont sous la ligne
 * de flottaison, comme le prescrit le §6.7. `prioritaire` leve le differe
 * pour celles qui n'y sont pas — une image au-dessus de la ligne chargee en
 * differe arrive apres le premier paint et devient le LCP le plus lent.
 *
 * `sizes` annonce les largeurs reellement rendues — 520 px dans la colonne
 * de desktop, 460 au plafond de la tablette. Trop large, l'optimiseur
 * telechargerait une image plus grande que le cadre.
 */
export function Photo({
  src,
  alt,
  /** Point d'ancrage du recadrage, quand le centre ne convient pas. */
  cadrage,
  /** A poser sur une photo visible au premier ecran, jamais ailleurs. */
  prioritaire,
  className,
}: {
  src: string | StaticImageData;
  alt: string;
  cadrage?: string;
  prioritaire?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-4/5 w-full overflow-hidden rounded-carte bg-respiration/25 ${className ?? ''}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={prioritaire}
        sizes="(min-width: 1000px) 520px, (min-width: 700px) 460px, 100vw"
        className={`object-cover ${cadrage ?? ''}`}
      />
    </div>
  );
}
