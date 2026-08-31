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
 * Le plafond de largeur est commun aux deux captures. Comme elles partagent
 * la meme largeur source, elles s'affichent a la meme echelle et leurs
 * hauteurs restent celles de l'original : aucune n'est etiree pour rejoindre
 * l'autre.
 *
 * Le nom accessible est la description de l'ecran, suivie de l'action du
 * lien : le lecteur d'ecran annonce ce qu'il voit, puis ou il ira.
 */
export function CaptureProduit({
  src,
  alt,
  libelleLien,
  className,
}: {
  src: StaticImageData;
  alt: string;
  libelleLien: string;
  className?: string;
}) {
  return (
    <a
      href={LIEN_PWA}
      target="_blank"
      rel="noopener"
      className={`mx-auto block w-full max-w-[420px] overflow-hidden rounded-carte-majeure shadow-carte transition-transform duration-200 ease-choucas hover:-translate-y-0.5 ${className ?? ''}`}
    >
      <Image src={src} alt={alt} sizes="420px" className="h-auto w-full" />
      <span className="sr-only"> — {libelleLien}</span>
    </a>
  );
}
