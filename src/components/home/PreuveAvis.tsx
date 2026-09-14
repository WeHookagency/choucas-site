import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { avis, intituleAvis } from '@/content/preuves';

/**
 * Ce que les conciergeries disent, en citations attribuees.
 *
 * NE REND RIEN TANT QU'IL N'Y A PAS D'AVIS. Meme mecanique que
 * `PreuveClients` : la liste de `content/preuves.ts` est vide, le composant
 * renvoie `null`.
 *
 * Jamais d'avis anonyme : un nom, un role, une conciergerie. Une citation sans
 * auteur ne prouve rien et se lit comme une invention — ce qu'elle est le plus
 * souvent, ailleurs.
 *
 * Posee juste avant le prix : on lit ce que d'autres en disent, puis on voit
 * le montant.
 */
export function PreuveAvis() {
  if (avis.length === 0) return null;

  return (
    <Section fond="fond" aria-labelledby="preuve-avis-titre">
      <Reveal>
        <h2 id="preuve-avis-titre" className="font-serif text-h3 max-w-[20ch] text-balance">
          {intituleAvis}
        </h2>
      </Reveal>

      <Reveal as="ul" group className="mt-titre grid gap-8 desktop:grid-cols-3">
        {avis.map((a) => (
          <li
            key={a.auteur + a.conciergerie}
            className="rounded-carte border border-filet bg-surface p-6 desktop:p-7"
          >
            <blockquote className="font-serif text-intro italic">{a.citation}</blockquote>
            <p className="text-micro mt-5 border-t border-filet pt-4 text-encre-douce">
              {a.auteur} · {a.role} · {a.conciergerie}
            </p>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
