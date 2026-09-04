# Correspondance des tokens — handoff site ↔ code du site

**Le site fait autorité.** Le handoff `design_handoff_site_choucas/` a été produit sans
connaissance du code existant : ses valeurs de couleur ont dérivé de la charte. Aucune n'est
reprise. Ce tableau dit quel token du site employer là où le handoff en nomme un.

Aucun token neuf n'a été créé. Les cinq lignes sans équivalent sont traitées en §3.

---

## 1. Couleurs

| Token du handoff | Valeur | Token du site à employer | Valeur | Écart max | Verdict |
|---|---|---|---|---|---|
| `--ink` | `#121512` | `--web-encre` (Schiste) | `#151816` | 4 | proche |
| `--paper` | `#F6F5EF` | `--web-fond` (Neige) | `#F4F2EC` | 3 | proche |
| `--panel` | `#E8E9E0` | `--web-fond-alt` (Panneau) | `#E8E9E0` | 0 | identique |
| `--moss` | `#95A184` | `--web-respiration` (**Lichen**) | `#95A184` | 0 | identique, **nom en collision** |
| `--fir` | `#263F30` | `--web-cta-fond` (Sapin) | `#244238` | 8 | proche |
| `--fir-deep` | `#17271D` | `--web-cta-presse` | `#17271D` | 0 | identique |
| `--copper` | `#B7683F` | `--web-accent` (Cuivre) | `#B56F46` | 7 | proche |
| `--warning` | `#986428` | `--web-attention` | `#8A5E20` | 14 | divergent |
| `--danger` | `#A45C4F` | `--web-erreur` (Grenat) | `#A64B3F` | 17 | divergent |
| `--border` | `rgba(18,21,18,.14)` | `--web-filet` | `#DDD9CE` | — | mécanisme différent : opacité contre couleur pleine |
| — | `#dcd9cf` | — | — | — | plan de travail de la maquette, à ne jamais reprendre |

### La collision de nom

`--moss` du handoff vaut `#95A184`, qui est le **Lichen** du site. La **Mousse** du site est
`#3D7358`, une tout autre couleur — le vert de la preuve positive. Écrire « moss » en lisant le
handoff produirait un contresens à chaque fois. Dans le code du site, ce fond s'appelle
`bg-respiration`.

---

## 2. Contrastes mesurés

Le conflit n°4 du backlog demandait de mesurer le corps de texte sur le fond lichen. C'est fait :

| Texte sur `#95A184` | Ratio | |
|---|---|---|
| Schiste `#151816` — le token du site | 6,57:1 | conforme AA |
| `--ink` du handoff `#121512` | 6,75:1 | conforme |
| `--fir-deep` en eyebrow `#17271D` | 5,73:1 | conforme |
| Neige `#F4F2EC` | 2,43:1 | **échoue** |

Le fond lichen porte donc du corps de texte sans difficulté, à condition que l'encre soit sombre.
La règle des tokens du site tient : le Lichen est une surface, le texte posé dessus est du Schiste,
jamais l'inverse.

---

## 3. Cinq valeurs du handoff sans équivalent au site

Elles servent toutes sur fond sombre, où le Cuivre du site s'affaiblit.

| Valeur | Usage dans le handoff | Contraste sur Schiste | sur Sapin |
|---|---|---|---|
| `#DB9A72` | italiques de titre sur fond sombre | 7,56:1 | 4,64:1 |
| `#E4A177` | chiffres d'étape | 8,23:1 | 5,06:1 |
| `#C97A4E` | courbes de niveau, page Contact | 5,43:1 | 3,34:1 |
| `#5C8A6B` | courbes de niveau, vert | — | 2,77:1 |
| `rgba(246,245,239,.18)` | filets sur fond sombre | — | — |

Pour comparaison, le **Cuivre du site** donne 4,54:1 sur Schiste et **2,79:1 sur Sapin** — sous le
seuil de 3:1 même pour un élément graphique.

**Arbitré le 4 septembre 2026.** Deux des trois valeurs sont entrées dans les tokens du site — les
seuls tokens neufs autorisés, parce qu'ils comblent un trou réel :

| Token | Valeur | Usage |
|---|---|---|
| `--web-accent-inverse` | `#DB9A72` | italiques de titre sur fond sombre |
| `--web-numero-inverse` | `#E4A177` | chiffres sur fond sombre |

**La règle : cuivre standard sur fond clair, éclairci sur fond sombre, jamais l'inverse.** Ce ne
sont pas des variantes interchangeables mais deux jeux disjoints — l'éclairci mesure 2,11:1 sur
Neige, il y disparaît aussi sûrement que le standard disparaît sur Sapin.

`#C97A4E`, le cuivre des courbes de niveau de la page Contact, n'a pas été ajouté : il n'a pas
encore d'emploi. Il le sera au lot T2.4 si les courbes sont reprises.

Pour les filets sur fond sombre, le site a déjà son équivalent : `border-encre-inverse/15`.

---

## 4. Ce qui ne se négocie pas

**Polices.** Le handoff appelle Google Fonts. Le site auto-héberge Newsreader et Manrope en WOFF2,
sous-ensemble latin, `font-display: swap`. Aucun appel externe n'est ajouté.

**Ruptures.** Le handoff bascule à 1024 px. Le site travaille à 700, 1000 et 1440, avec des
gouttières de 18, 28 et 40 px. Les compositions du handoff sont transposées sur ces paliers.

**Le cuivre.** Jamais de corps de texte en cuivre. Jamais sous 24 px. Sur fond panneau il mesure
3,22:1 — conforme au texte large, avec 0,22 de marge.

**Rayons et ombres.** Le handoff prescrit une ombre dure `3px 3px 0`, décalée sur les deux axes. Le
site a déjà `--shadow-cta`, décalée sur un seul. Le site l'emporte : aucun second bouton n'est créé.
