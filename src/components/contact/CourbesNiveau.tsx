/**
 * Courbes de niveau, motif du handoff pour la section « après l'envoi ».
 *
 * Vingt-quatre traces inclines, alternant vert et cuivre. Purement decoratif,
 * donc masque aux lecteurs d'ecran, et genere plutot qu'ecrit a la main : les
 * chemins se deduisent d'une seule formule, ce qui evite d'embarquer quelques
 * milliers de caracteres de coordonnees.
 *
 * `preserveAspectRatio="none"` : le motif s'etire avec la section, ce qui est
 * l'effet voulu — ce sont des courbes de terrain, pas un logo. Le trait, lui,
 * ne s'etire pas : a 100 unites de viewBox pour 1 400 px de large, il
 * deviendrait une bande.
 *
 * Les opacites du handoff — cuivre a 0,55, vert a 0,40 — ne tiennent pas ici.
 * Un trait cuivre a 0,55 fait tomber les chiffres d'etape a 2,62:1 la ou il
 * les traverse, sous le seuil de 3:1 du grand texte. A 0,22 ils remontent a
 * 3,95:1, et le vert a 0,30 les laisse a 3,76:1. Le motif reste lisible, le
 * texte le reste aussi.
 */
const TRACES = 24;

export function CourbesNiveau() {
  return (
    <svg
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <g transform="rotate(-16 50 50)">
        {Array.from({ length: TRACES }, (_, i) => {
          const y = -20 + (i * 140) / TRACES;
          const pair = i % 2 === 0;
          return (
            <path
              key={i}
              d={`M -30 ${y} C 10 ${y - 6}, 35 ${y + 7}, 70 ${y - 3} S 110 ${y + 5}, 130 ${y}`}
              fill="none"
              stroke={pair ? '#5C8A6B' : '#C97A4E'}
              strokeOpacity={pair ? 0.3 : 0.22}
              strokeWidth={pair ? 1.2 : 2}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </g>
    </svg>
  );
}
