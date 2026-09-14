import Image from 'next/image';

import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { clients, intituleClients } from '@/content/preuves';

/**
 * Les conciergeries clientes, en bandeau.
 *
 * NE REND RIEN TANT QU'IL N'Y A PAS DE CLIENTE. La liste vit dans
 * `content/preuves.ts` et elle est vide : le composant renvoie `null`, la
 * section entiere disparait, titre compris. L'affichage se declenche en
 * remplissant ce fichier, pas en touchant a la Home.
 *
 * C'est la seule condition qui compte — « on a des clientes » — et elle est
 * verifiable par le code au lieu d'etre une intention.
 *
 * Un logo est facultatif : un nom ecrit en toutes lettres vaut mieux qu'un
 * logo flou, et beaucoup de conciergeries n'en ont pas de propre.
 */
export function PreuveClients() {
  if (clients.length === 0) return null;

  return (
    <Section fond="fond-alt" aria-labelledby="preuve-clients-titre">
      <Reveal>
        <h2
          id="preuve-clients-titre"
          className="text-label font-semibold uppercase text-encre-douce"
        >
          {intituleClients}
        </h2>
        <ul className="mt-titre flex flex-wrap items-center gap-x-12 gap-y-8">
          {clients.map((c) => (
            <li key={c.nom} className="flex items-center">
              {c.logo ? (
                <Image src={c.logo} alt={c.logoAlt ?? c.nom} width={140} height={44} unoptimized />
              ) : (
                <span className="font-serif text-intro">{c.nom}</span>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
