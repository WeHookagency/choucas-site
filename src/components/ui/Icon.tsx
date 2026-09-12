import type { SVGProps } from 'react';

// Un point d'entree par icone : rien du reste de la famille n'entre dans le
// paquet. Les variantes `ssr` sont utilisables aussi bien dans un composant
// serveur que client, ce dont le site a besoin — les listes sont rendues sur
// le serveur, la barre et le telephone cote client.
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { CalendarBlankIcon } from '@phosphor-icons/react/dist/ssr/CalendarBlank';
import { CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { ClipboardTextIcon } from '@phosphor-icons/react/dist/ssr/ClipboardText';
import { CloudSunIcon } from '@phosphor-icons/react/dist/ssr/CloudSun';
import { ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { EnvelopeIcon } from '@phosphor-icons/react/dist/ssr/Envelope';
import { HouseIcon } from '@phosphor-icons/react/dist/ssr/House';
import { LinkedinLogoIcon } from '@phosphor-icons/react/dist/ssr/LinkedinLogo';
import { ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MoonStarsIcon } from '@phosphor-icons/react/dist/ssr/MoonStars';
import { PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { SunIcon } from '@phosphor-icons/react/dist/ssr/Sun';
import { SunHorizonIcon } from '@phosphor-icons/react/dist/ssr/SunHorizon';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/ssr/WhatsappLogo';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';

/**
 * Jeu d'icones du site — Phosphor, la famille de l'application.
 *
 * Les noms restent ceux du site, en francais : le code appelle une intention
 * — `coche`, `fleche`, `bien` — pas un nom de bibliotheque. Changer de
 * famille se ferait dans cette seule table.
 *
 * Graisse `regular` : c'est la variante contour de Phosphor, la plus proche
 * du trait de 1,7 px que demandent les specs §7. Les etats reduits et les
 * coches peuvent passer en `bold`, que les specs autorisent a 2–2,2 px.
 *
 * Decorative par defaut. Une icone qui constitue le seul contenu d'un bouton
 * recoit un `title` : elle prend alors un nom accessible.
 */
const FAMILLE = {
  fleche: ArrowRightIcon,
  coche: CheckIcon,
  menu: ListIcon,
  fermer: XIcon,
  calendrier: CalendarBlankIcon,
  mission: ClipboardTextIcon,
  bien: HouseIcon,
  equipe: UsersIcon,
  alerte: WarningIcon,
  horloge: ClockIcon,

  // Les trois canaux par lesquels un brief arrive. `whatsapp` est le trace
  // Phosphor, pas la marque deposee : meme graisse et meme grille que le
  // reste de la famille, donc il ne detonne pas et n'engage rien.
  telephone: PhoneIcon,
  whatsapp: WhatsappLogoIcon,
  mail: EnvelopeIcon,

  // Meme remarque que pour `whatsapp` : c'est le trace Phosphor, pas la
  // marque deposee. Meme graisse, meme grille, aucune dependance nouvelle —
  // la famille est deja au paquet.
  linkedin: LinkedinLogoIcon,

  // Les quatre moments de la journee d'implantation. Le soleil se leve,
  // culmine, se voile, puis cede a la nuit : la course est lisible sans
  // legende, ce qui est la condition pour qu'une icone remplace un mot.
  matin: SunHorizonIcon,
  midi: SunIcon,
  apresMidi: CloudSunIcon,
  soir: MoonStarsIcon,
} as const;

export type IconName = keyof typeof FAMILLE;

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'ref'> & {
  name: IconName;
  /** Taille en px. Echelle des specs : 16, 20, 24, 28, 32, 42. */
  size?: 16 | 20 | 24 | 28 | 32 | 42;
  /** Trait epaissi, pour les petits etats et les coches (§7). */
  graisse?: 'regular' | 'bold';
  /** Nom accessible. Sans lui l'icone est masquee aux lecteurs d'ecran. */
  title?: string;
};

export function Icon({ name, size = 24, graisse = 'regular', title, ...props }: IconProps) {
  const Dessin = FAMILLE[name];

  return (
    <Dessin
      size={size}
      weight={graisse}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
    </Dessin>
  );
}
