import Image, { type StaticImageData } from 'next/image';

/** Demonstration publique du produit, ouverte dans un nouvel onglet. */
const LIEN_PWA = 'https://choucasv2.netlify.app';

/**
 * Capture d'un ecran de l'application, cliquable vers la demonstration.
 *
 * L'image est importee : `next/image` connait donc ses dimensions a la
 * compilation, reserve la place avant le chargement et ne fait bouger aucun
 * bloc — le §10 demande un CLS sous 0,1.
 *
 * Le plafond de largeur est commun aux deux captures de la Home. Comme elles
 * partagent la meme largeur source, elles s'affichent a la meme echelle et
 * leurs hauteurs restent celles de l'original : aucune n'est etiree pour
 * rejoindre l'autre. La page Solutions les reprend a 340 px, la largeur de sa
 * colonne d'ecran.
 *
 * L'ombre solide est facultative : le §0.5 des correctifs n'en autorise
 * qu'une par page, et sur Solutions elle revient au point de jonction.
 *
 * `hauteurMax` plafonne l'ecran, comme la maquette de Solutions : au-dela, la
 * capture est coupee et un fondu vers le fond du cadre dit qu'elle continue.
 * Le fondu n'apparait que si la coupe a lieu — la hauteur affichee se deduit
 * des dimensions intrinseques, connues a la compilation.
 *
 * Le nom accessible est la description de l'ecran, suivie de l'action du
 * lien : le lecteur d'ecran annonce ce qu'il voit, puis ou il ira.
 */
export function CaptureProduit({
  src,
  alt,
  libelleLien,
  largeurMax = 420,
  hauteurMax,
  ombre = true,
  className,
}: {
  src: StaticImageData;
  alt: string;
  libelleLien: string;
  largeurMax?: number;
  hauteurMax?: number;
  ombre?: boolean;
  className?: string;
}) {
  const hauteurAffichee = (largeurMax * src.height) / src.width;
  const coupee = hauteurMax !== undefined && hauteurAffichee > hauteurMax;
  return (
    <a
      href={LIEN_PWA}
      target="_blank"
      rel="noopener"
      style={{ maxWidth: `${largeurMax}px`, maxHeight: hauteurMax ? `${hauteurMax}px` : undefined }}
      className={`relative block w-full overflow-hidden rounded-carte-majeure border border-encre/20 bg-ok transition-transform duration-200 ease-choucas hover:-translate-y-0.5 ${
        ombre ? 'shadow-carte' : ''
      } ${className ?? ''}`}
    >
      <Image src={src} alt={alt} sizes={`${largeurMax}px`} className="h-auto w-full" />
      {coupee ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--web-ok))' }}
        />
      ) : null}
      <span className="sr-only"> — {libelleLien}</span>
    </a>
  );
}
