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
 * 3,95:1, et le vert a 0,30 les laisse a 3,76:1.
 *
 * ---------------------------------------------------------------------------
 * ET POURTANT C'ETAIT ILLISIBLE. 19 septembre 2026, verdict du fondateur sur
 * la section rendue.
 *
 * LA MESURE DE CONTRASTE NE VOIT PAS CE DEFAUT-LA, et c'est la lecon. Un
 * rapport se calcule entre DEUX couleurs : le texte et son fond. Derriere ces
 * phrases, le fond n'est pas une couleur mais un motif — vingt-quatre traits
 * qui passent sous les lettres a intervalles irreguliers. Chaque point du
 * texte est au-dessus du seuil ; l'oeil, lui, doit separer les jambages des
 * traits a chaque ligne. Le chiffre etait bon, la lecture ne l'etait pas.
 *
 * Le motif est donc EFFACE LA OU LE TEXTE SE POSE, par un masque radial : plein
 * aux bords, transparent au centre. Il reste ce qu'il devait etre — une
 * texture de terrain sur les marges — et cesse d'etre un bruit de fond sous
 * une phrase de 15 px.
 *
 * Un masque et non une baisse d'opacite generale : baisser encore aurait fait
 * disparaitre le motif partout pour regler un probleme qui n'existe qu'au
 * milieu.
 * ---------------------------------------------------------------------------
 */
const TRACES = 24;

export function CourbesNiveau() {
  return (
    <svg
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 size-full"
      style={{
        // Transparent au centre — le motif y disparait — et plein aux bords.
        // `-webkit-` pour Safari, qui ne prend pas encore `mask` non prefixe
        // sur un SVG en position absolue.
        maskImage:
          'radial-gradient(ellipse 62% 58% at 50% 50%, transparent 0%, transparent 42%, black 88%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 62% 58% at 50% 50%, transparent 0%, transparent 42%, black 88%)',
      }}
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
