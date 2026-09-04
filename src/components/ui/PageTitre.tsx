import type { ReactNode } from 'react';

import { Section } from './Section';

/**
 * Coquille d'une page dont le contenu n'est pas encore construit.
 *
 * Le routage existe, la page repond, mais elle ne porte qu'un titre. Elle est
 * declaree `noindex` a l'endroit ou elle est rendue : huit pages vides
 * indexees valent moins que pas de pages du tout.
 *
 * A remplacer par le contenu de chaque page au fil des lots T2, en retirant
 * alors la directive `noindex`.
 */
export function PageTitre({ titre, children }: { titre: string; children?: ReactNode }) {
  return (
    <main>
      <Section fond="fond" aria-labelledby="page-titre">
        <h1 id="page-titre" className="font-serif text-h2 text-balance">
          {titre}
        </h1>
        {children}
      </Section>
    </main>
  );
}
