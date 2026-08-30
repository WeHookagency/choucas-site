import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * Equivalents localises des primitives de navigation de Next.
 *
 * Les composants importent `Link` d'ici, jamais de `next/link` : ce `Link`-la
 * prend un chemin interne (`/tarifs`) et ecrit l'URL de la langue courante
 * (`/en/pricing`). Le lien reste juste quand un slug est traduit ou ajoute.
 *
 * `getPathname` calcule ce meme chemin pour une langue donnee, sans rendre de
 * lien : c'est ce qui sert a fabriquer les hreflang.
 */
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
