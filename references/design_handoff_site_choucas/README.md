# Handoff développement — Site Choucas

## 1. Objet

Site marketing public de **Choucas**, système opérationnel pour conciergeries de location saisonnière (marché d'origine : stations de montagne). Six pages maquettées en haute fidélité, prêtes à être reconstruites dans un environnement de production.

## 2. Nature des fichiers fournis

Les fichiers `*.dc.html` de ce dossier sont des **références de design réalisées en HTML** : des prototypes qui montrent l'apparence et le comportement attendus. Ce n'est **pas du code de production à copier tel quel**.

Le travail attendu est de **reproduire ces maquettes dans l'environnement du projet cible** (Next.js / React, Astro, Vue, Nuxt…) en utilisant ses conventions, ses composants et ses outils existants. Si aucun environnement n'existe encore, choisir la stack adaptée à un site marketing multilingue à contenu éditorial (recommandation : **Next.js App Router + Tailwind**, ou **Astro** si la priorité est le SEO et le poids de page) et y implémenter les maquettes.

Particularités des fichiers de référence :
- Tous les styles sont **inline** (contrainte de l'outil de maquettage). En production, passer par la couche de styles du projet (Tailwind, CSS modules, styled…). Les valeurs exactes sont listées en §7.
- Chaque page contient **deux arbres DOM distincts** : une version desktop (largeur 1280) et une version mobile (largeur 390), affichées côte à côte dans la maquette. En production, il s'agit d'**une seule page responsive** : les deux arbres sont deux états du même composant. Breakpoint de bascule recommandé : **1024px**.
- Les balises `<sc-for>`, `<sc-if>`, `{{ … }}` sont la syntaxe de template de l'outil de maquettage. À traduire en `.map()` / rendu conditionnel.
- Les données de contenu (FAQ, articles, listes) sont dans le bloc `<script data-dc-script>` en fin de fichier, dans `renderVals()`. Ce sont les **contenus définitifs** validés, à reprendre verbatim.
- `support.js` est le runtime de l'outil de maquettage. **À ignorer complètement.**
- `image-slot.js` est un composant de placeholder d'image utilisé pendant le design. À remplacer par les vraies images (voir §8).

## 3. Fidélité

**Haute fidélité (hifi).** Couleurs, typographies, tailles, espacements et interactions sont définitifs. La reconstruction doit être fidèle au pixel. Les seuls éléments non définitifs sont les photographies (§8) et deux entrées FAQ marquées `[À ARBITRER]`.

## 4. Pages

| Fichier de référence | Route recommandée | Rôle |
|---|---|---|
| `Solutions.dc.html` | `/solutions` | Le produit vu par trois rôles métier |
| `A-propos.dc.html` | `/a-propos` | Origine, partis pris, terrain |
| `Blog.dc.html` | `/blog` | Index des articles |
| `Article.dc.html` | `/blog/[slug]` | Gabarit d'article |
| `FAQ.dc.html` | `/faq` | FAQ par catégories, accordéon |
| `Contact.dc.html` | `/contact` | Deux voies de contact + formulaire |

Pages référencées dans la navigation mais **non maquettées** : `Produit`, `Tarifs`. À prévoir dans le routage, sans contenu pour l'instant.

### 4.1 Solutions

Structure desktop, de haut en bas :

1. **Nav** — logo texte `CHOUCAS` (Manrope 800, 15px, letter-spacing .08em) à gauche ; liens Produit / Solutions / Tarifs / Blog (13px) au centre-droite ; bouton CTA à droite. `padding: 24px 64px`, `border-bottom: 1px solid var(--border)`.
2. **Hero** — `padding: 128px 64px`, colonne de 720px alignée à gauche. H1 Newsreader 400 / 56px / line-height 1.02 : « Trois rôles. » + seconde moitié en *italique cuivre*. Sous-titre 17px, opacity .8.
3. **Barre de navigation de section** — sticky, juste sous le hero. Trois pastilles : *Dirigeants*, *Exploitation*, *Terrain*. Actif = **soulignement cuivre 2px**, pas de changement de fond ; inactif = `opacity: .6`. Clic → scroll fluide vers la section, avec repli synchrone si `prefers-reduced-motion` désactive le smooth. L'état actif est aussi mis à jour au scroll.
4. **« Trois métiers, trois écrans, une même journée »** — filet cuivre 40×2px au-dessus du H2, puis grille 3 colonnes (`gap: 32px`) de portraits.
5. **Section Dirigeants** (`#dirigeants`) — fond `--moss`, `padding: 128px 64px`, grille `1fr 340px`, `gap: 96px`. Texte à gauche, capture produit à droite (340px de large, dégradé de fondu en bas). Eyebrow Manrope 800 / 12px / uppercase / `--fir-deep`. `scroll-margin-top: 158px`.
6. **Section Exploitation** (`#exploitation`) — fond `--paper`, grille **inversée** `340px 1fr`, capture à gauche. `border-top: 1px solid rgba(18,21,18,.12)`.
7. **Section Terrain** (`#terrain`) — fond `--moss`, grille `1fr 340px`, gros plan mobile à droite.
8. **« Une seule chose à la fois »** — section sombre, texte centré, largeur 640px, italiques en `#DB9A72` (cuivre éclairci pour le contraste sur fond sombre).
9. **« Personne ne valide son propre travail »** — section sombre, séquence de la doctrine de double contrôle.
10. **CTA « Une journée sur site »** — image paysage 21:9 + texte + bouton pilule (fond `--fir`, `border-radius: 999px`, `box-shadow: 3px 3px 0 var(--fir-deep)`).
11. **Footer**.

La version mobile reprend les mêmes sections avec les ids suffixés `-m` (`#dirigeants-m`…), en une seule colonne, `padding: 72px 24px`, H1 43px, H2 32px, corps 14px.

**État à gérer** : `{ active, activeM }` — la section courante pour chacune des deux barres de navigation.

### 4.2 FAQ

Sommaire deux colonnes en haut de page, puis un groupe par catégorie. Six catégories, dans cet ordre : **Le produit**, **Périmètre**, **Équipe et adoption**, **Données**, **Prix et engagement** (+ le sixième groupe présent dans le fichier).

Chaque entrée est un `<button>` (question) suivi d'une réponse révélée en accordéon. Réponse : 16px / line-height 1.6 / opacity .85 / `max-width: 680px`.

**État** : `{ open: { [clé]: bool }, active: <id de catégorie> }`. Plusieurs entrées peuvent être ouvertes simultanément. L'`active` suit le scroll (intervalle de tracking dans la maquette → à remplacer par un `IntersectionObserver` en production).

Le contenu des 25+ questions/réponses est dans `renderVals()`, tableau `raw`. **À reprendre verbatim** — ces réponses ont été arbitrées. Deux entrées portent la mention `[À ARBITRER]` : elles doivent être validées par le client avant mise en ligne.

**SEO** : baliser cette page en `FAQPage` / `Question` / `Answer` (JSON-LD).

### 4.3 Contact

- **Hero** : H1 « Parlons d'une vraie journée » (seconde moitié italique cuivre), sous-titre.
- **Deux voies côte à côte** : « VOIE PRINCIPALE » (journée d'implantation) et voie secondaire (question simple). Eyebrow 12px / weight 700 / letter-spacing .04em.
- **Formulaire** : deux jeux de champs selon la voie choisie. Champs de la voie implantation : nom, conciergerie, station, nombre de biens, personnes terrain, email, téléphone. Un jeu de valeurs de démonstration existe dans le fichier (`FILLED_IMPL`) — c'est un **état de démo de la maquette**, pas des données à conserver.
- **« Ce qui se passe après l'envoi »** : section fond sapin `--fir`, trois étapes numérotées (chiffres Newsreader 400 / 52px / `#E4A177`), séparées par des filets verticaux `rgba(246,245,239,.18)`. Fond décoré de **courbes de niveau** en SVG : 24 tracés bézier inclinés à `rotate(-16deg)`, alternance vert `#5C8A6B` (opacity .4, 1.2px) et cuivre `#C97A4E` (opacity .55, 2px), en `position: absolute; inset: 0`, `preserveAspectRatio="none"`, sous un contenu en `z-index: 1`. Motif purement décoratif → `aria-hidden="true"`.
- **Footer**.

**État** : `{ voie, …valeurs de champs }`. Validation à implémenter côté production : email requis et bien formé, nom requis, nombre de biens numérique. Destination de soumission à définir avec le client (CRM / email transactionnel).

### 4.4 Blog et Article

**Blog** — H1 « Notes d'expérience » (italique cuivre sur le second mot), sous-titre, puis liste d'articles. Données dans `renderVals().articles`.

**Article** — gabarit éditorial : fil d'ariane / méta (12px, opacity .65), titre, corps de texte, puis bloc « articles liés » (`relatedArticles`). Corps de texte : mesure de 720px maximum, 16-17px, line-height 1.6.

### 4.5 À propos

Hero (eyebrow « CONÇU DANS LES ALPES »), section « Ce qui se perd entre un départ et une arrivée » (avec une illustration à fournir), section « Ce qu'on a choisi de ne pas faire » sur fond `--panel` (liste `partisPris`, entrées séparées par `border-top: 1px solid var(--border)`, `padding: 28px 0`), section « Terrain d'origine » (Aravis, Megève, Chamonix, Courchevel, Val d'Isère — Newsreader 22px), clôture « Né dans les Alpes. Pensé pour aller plus loin. »

## 5. Interactions et comportements

| Comportement | Détail |
|---|---|
| Scroll vers section (Solutions, FAQ) | `window.scrollTo({ top, behavior: 'smooth' })`, offset = hauteur de la nav sticky (158px desktop, 24px mobile). Repli en saut sec si le smooth est ignoré. |
| Suivi de section active | Mettre à jour la pastille/le sommaire actif au scroll. Utiliser `IntersectionObserver` (la maquette utilise un intervalle, à ne pas reproduire). |
| Accordéon FAQ | Toggle indépendant par entrée. `<button>` accessible, `aria-expanded`, `aria-controls`. |
| Bascule de voie (Contact) | Change le jeu de champs affiché. |
| Survol boutons | Boutons pilule à ombre portée dure (`3px 3px 0`) : au survol, réduire l'offset d'ombre et translater le bouton de la même valeur. |
| `prefers-reduced-motion` | À respecter : pas de scroll fluide, pas de transition. |

## 6. Responsive

Deux compositions, bascule à **1024px**.

| | Desktop | Mobile |
|---|---|---|
| Largeur de référence | 1280px | 390px |
| Padding de section | `128px 64px` | `72px 24px` |
| Contenu centré | 720px (texte) / 900-1200px (large) | pleine largeur |
| H1 | 56px / lh 1.02 | 43px / lh 1.05 |
| H2 | 38px / lh 1.05 | 30-32px / lh 1.1 |
| Corps | 16-17px / lh 1.6 | 14-15px / lh 1.6 |
| Nav | liens horizontaux | logo + burger 24×18px, 3 barres de 2px |
| Cibles tactiles | — | 44px minimum |

## 7. Design tokens

### Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--ink` | `#121512` | Texte principal |
| `--paper` | `#F6F5EF` | Fond clair principal |
| `--panel` | `#E8E9E0` | Fond de section alterné |
| `--moss` | `#95A184` | Fond de section (Solutions : Dirigeants, Terrain) |
| `--fir` | `#263F30` | Fond sombre, boutons primaires |
| `--fir-deep` | `#17271D` | Ombres dures, bordures de bouton, eyebrows sur `--moss` |
| `--copper` | `#B7683F` | Accent : italiques de titre, filets, soulignement actif |
| `--warning` | `#986428` | État d'avertissement (captures produit) |
| `--danger` | `#A45C4F` | État bloqué (captures produit) |
| `--border` | `rgba(18,21,18,.14)` | Filets sur fond clair |
| — | `#dcd9cf` | Fond du plan de travail de la maquette. **Ne pas reprendre en production.** |

Variantes cuivre pour fond sombre (contraste) : `#DB9A72` (italiques de titre), `#E4A177` (chiffres), `#C97A4E` (courbes de niveau).
Filets sur fond sombre : `rgba(246,245,239,.18)`. Vert des courbes de niveau : `#5C8A6B`.

**Règle d'usage du cuivre** : réservé aux italiques de titre, aux filets et à l'état actif. Jamais sur un eyebrow ni sur du corps de texte (échecs de contraste constatés). Maximum deux couleurs de fond par page.

### Typographie

Deux familles, via Google Fonts :

```
Newsreader : ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500
Manrope    : wght@400;600;700;800
```

| Rôle | Police | Poids | Taille | Line-height | Autres |
|---|---|---|---|---|---|
| H1 | Newsreader | 400 | 56 / 43 | 1.02 / 1.05 | seconde moitié en italique cuivre |
| H2 | Newsreader | 500 | 38 / 30-32 | 1.05 / 1.1 | |
| Citation / clôture | Newsreader | 400 | 22-28 | 1.2-1.25 | |
| Chiffres d'étape | Newsreader | 400 | 52 / 34 | 1 | |
| Logo | Manrope | 800 | 15 / 13 | — | uppercase, letter-spacing .08em |
| Eyebrow | Manrope | 700-800 | 11-12 | — | uppercase, letter-spacing .06-.08em |
| Nav | Manrope | 400 | 13 | — | |
| Corps | Manrope | 400 | 16-17 / 14-15 | 1.55-1.6 | `text-wrap: pretty` |
| Méta / légende | Manrope | 400 | 12 | — | opacity .65 |
| Bouton | Manrope | 600 | 14 | — | |

Fallbacks : `'Newsreader', Georgia, serif` et `'Manrope', Arial, sans-serif`.
Reset global : `* { box-sizing: border-box; -webkit-font-smoothing: antialiased }`.

Les liens (`a`, `a:hover`) doivent recevoir une couleur explicite du palette — ne pas laisser le bleu par défaut du navigateur.

### Espacement

Échelle utilisée : **8 / 10 / 12 / 14 / 16 / 20 / 24 / 32 / 40 / 48 / 56 / 64 / 96 / 128 px**.
Espacement entre siblings toujours par `gap` de flex/grid, jamais par marges individuelles.

### Rayons, bordures, ombres

- Rayons : `0` (sections, cartes de contenu), `12-14px` (blocs images), `999px` (boutons pilule, points d'état).
- Bordures : `1px solid var(--border)` sur clair ; `1px solid rgba(246,245,239,.18)` sur sombre ; `1px solid var(--fir-deep)` sur les boutons.
- Filet d'accent : `width: 40px; height: 2px; background: var(--copper)` (32px en mobile).
- Ombre : uniquement l'ombre dure des boutons, `3px 3px 0 var(--fir-deep)`. Pas d'ombre floue nulle part.

## 8. Assets

### À fournir par le client — bloquant

| Emplacement | Format | Contenu attendu |
|---|---|---|
| Solutions — bande « Trois métiers, trois écrans » | 3 portraits verticaux | Dirigeant, responsable d'exploitation, personne de terrain |
| Solutions — CTA « Une journée sur site » | 1 paysage 21:9 | Scène d'implantation sur site |
| À propos — « Ce qui se perd… » | 1 image 720×320 (desktop) / 342×240 (mobile) | À définir |

Dans les fichiers de référence, ces emplacements sont des `<image-slot>` ou des fonds rayés diagonaux. Tous doivent être remplacés par de vraies photographies avant mise en ligne.

### Captures produit

Les sections Dirigeants / Exploitation / Terrain de `Solutions.dc.html` affichent de **vraies captures de l'application**, cadrées à 340px de large avec un dégradé de fondu en pied. À exporter en haute résolution (2×) depuis l'application. **Point ouvert** : la capture desktop de la section Exploitation doit être fournie en version définitive.

### Icônes

Aucune bibliothèque d'icônes. Les seuls éléments graphiques non typographiques sont les filets, les points d'état (`999px`, 10px) et les courbes de niveau SVG de la page Contact.

## 9. Contenu et copie

Les textes sont **définitifs et validés** (source : documents « CONTENUS V3 » et « CORRECTIFS-PAGES-ITERATION-2 », dans `uploads/`). Ne pas réécrire, ne pas reformuler, ne pas raccourcir.

Points de vocabulaire à respecter à la lettre :
- **PRÊT** en capitales — c'est un état produit, pas un adjectif.
- Le double contrôle : « L'exécutant déclare terminé. Un tiers contrôle. Le bien passe PRÊT. »
- Les appels à l'action sont fixés : une formulation par niveau d'engagement. Ne pas en inventer d'autres.
- Le corps de texte cite des données d'écran réelles (« six arrivées, un prêt, quatre en préparation, un bloqué », horaires, noms de chalets). Si les captures produit changent, **ces chiffres doivent être resynchronisés avec ce que montre la capture**.

Langue : français. Typographie française à respecter : apostrophes courbes (`\u2019`), guillemets « … », espaces insécables avant `: ; ? !` et à l'intérieur des guillemets.

## 10. Points ouverts

1. Photographies (§8) — bloquant pour la mise en ligne.
2. Capture desktop définitive pour la section Exploitation.
3. Deux entrées FAQ marquées `[À ARBITRER]` à valider.
4. Pages Produit et Tarifs non maquettées.
5. Destination de soumission du formulaire de contact à définir.
6. Multilingue : non prévu dans les maquettes. À confirmer avant de choisir l'architecture de routage.

## 11. Fichiers de ce dossier

```
Solutions.dc.html    Page Solutions (desktop + mobile)
A-propos.dc.html     Page À propos
Blog.dc.html         Index blog
Article.dc.html      Gabarit article
FAQ.dc.html          Page FAQ
Contact.dc.html      Page Contact
image-slot.js        Composant placeholder d'image (design uniquement)
```

Pour consulter une maquette : ouvrir le `.dc.html` dans un navigateur. `support.js` doit être présent à côté pour le rendu, mais n'a aucune valeur pour la production.
