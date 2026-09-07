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
 * L'ombre solide est facultative. Le §0.5 des correctifs n'en autorisait
 * qu'une par page ; la regle est levee pour la Home depuis le 7 septembre
 * 2026, ou les cinq cartes du brief la portent. Elle tient toujours sur
 * Solutions, ou l'ombre revient au point de jonction.
 *
 * `cadre` pose le filet et le fond Mousse de la maquette de Solutions, ou
 * la capture est presentee comme un ecran dans son cadre. Sur la Home elle
 * est posee a plat, sans filet ni fond : c'est le traitement d'origine.
 *
 * `rayon` a `haut` laisse le bas droit : la capture rejoint alors le bord de
 * sa tuile sans s'y arrondir, et se lit comme un ecran qui continue plutot
 * que comme une vignette posee.
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
  cadre = false,
  rayon = 'tout',
  className,
}: {
  src: StaticImageData;
  alt: string;
  libelleLien: string;
  largeurMax?: number;
  hauteurMax?: number;
  ombre?: boolean;
  /** `haut` quand la capture se termine sur le bord de son contenant : le
   *  bas reste droit, l'ecran se poursuit au lieu de se refermer. */
  rayon?: 'tout' | 'haut';
  /** Filet et fond Mousse, comme la maquette de Solutions. */
  cadre?: boolean;
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
      className={`relative mx-auto block w-full overflow-hidden ${
        rayon === 'haut' ? 'rounded-t-carte-majeure' : 'rounded-carte-majeure'
      } transition-transform duration-200 ease-choucas hover:-translate-y-0.5 ${
        cadre ? 'border border-encre/20 bg-ok' : ''
      } ${ombre ? 'shadow-carte' : ''} ${className ?? ''}`}
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
