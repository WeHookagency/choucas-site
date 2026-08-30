# Choucas — Spécifications UX/UI du site web

**Version :** 1.0 — 28 août 2026  
**Statut :** handoff développement  
**Périmètre :** site marketing Choucas uniquement  
**Maquette desktop :** https://choucas-direction-artistique.espace-de-tr-5941.chatgpt.site/homepage  
**Aperçu mobile de validation :** https://choucas-direction-artistique.espace-de-tr-5941.chatgpt.site/homepage-mobile

---

## 1. Objet du document

Ce document constitue la source de vérité pour l’habillage visuel et l’intégration front-end de la HomePage Choucas. Il décrit le système graphique, les composants, la structure des sections, les comportements responsive et les exigences d’accessibilité.

La maquette est une **direction UX/UI du site marketing**. Elle ne constitue ni une demande de refonte ni une spécification fonctionnelle complète de la PWA Choucas.

### Séparation impérative des périmètres

| Surface | Rôle | À développer ici |
| --- | --- | --- |
| Site marketing | Expliquer, montrer le produit et générer des demandes de démonstration | Oui |
| Démonstration Manager | Mise en scène interactive et simplifiée du produit réel | Oui, comme composant marketing |
| Démonstration mobile | Mise en scène du travail terrain | Oui, comme composant marketing |
| PWA Choucas réelle | Briefs, missions, rotations, stocks, linge, blanchisserie, iCal et opérations | Non |
| Backend, authentification et données réelles | Produit SaaS | Non |

Les données, noms, heures et situations visibles sur le site sont des **données de démonstration provisoires**.

---

## 2. Intention de marque

Choucas doit être perçu comme un logiciel métier fiable, humain et opérationnel pour les conciergeries indépendantes, traditionnelles et premium — pas comme un SaaS générique ni comme une marque de luxe décorative.

### Sensation recherchée

- Maîtrise calme
- Robustesse opérationnelle
- Technologie discrète
- Proximité avec le terrain
- Qualité alpine contemporaine
- Lisibilité immédiate

### Principes directeurs

1. **Le produit avant le discours.** Une interface Choucas doit apparaître rapidement dans la page.
2. **Montrer plutôt qu’expliquer.** Préférer interfaces, flux, chronologies, icônes et résultats courts aux paragraphes.
3. **Premium sans fragilité.** Typographie éditoriale, mais composants suffisamment contrastés et robustes.
4. **Terrain visible.** Le mobile, les missions, les rotations, le ménage, les stocks et le linge doivent être représentés.
5. **Densité maîtrisée.** Les sections restent compactes ; éviter les écrans composés uniquement d’un titre géant.

---

## 3. Design tokens

Le fichier joint `choucas-web-tokens.css` contient les variables prêtes à intégrer.

### Couleurs principales

| Token | HEX | Usage |
| --- | --- | --- |
| `--choucas-ink` | `#121512` | Texte principal, surfaces très sombres |
| `--choucas-paper` | `#F6F5EF` | Fond principal chaud |
| `--choucas-panel` | `#E8E9E0` | Sections secondaires, panneaux |
| `--choucas-moss` | `#95A184` | Grande surface de marque, montagne |
| `--choucas-fir` | `#263F30` | CTA primaire, cartes fortes |
| `--choucas-fir-deep` | `#17271D` | Ombres solides et états pressés |
| `--choucas-copper` | `#B7683F` | Accent éditorial et signal de marque |
| `--choucas-success` | `#3D7358` | Terminé, validé, disponible |
| `--choucas-warning` | `#986428` | Attention, linge à confirmer |
| `--choucas-danger` | `#A45C4F` | Retard, erreur, problème |
| `--choucas-white` | `#FFFFFF` | Cartes et textes inversés |

### Règles colorimétriques

- Le cuivre est un accent : maximum recommandé de 10 à 15 % d’une vue.
- Le vert sapin porte les actions principales et les moments de transformation.
- Le vert mousse est réservé aux grandes surfaces de respiration et aux sections de profils.
- Ne jamais utiliser le cuivre pour un long paragraphe.
- Tout texte fonctionnel doit respecter WCAG AA : ratio minimal 4,5:1.

### Typographies

| Fonction | Police | Graisses | Fallback |
| --- | --- | --- | --- |
| Titres éditoriaux | Newsreader | 400, 500 | Georgia, serif |
| Interface et contenu | Manrope | 400, 600, 700, 800 | Arial, sans-serif |

Chargement recommandé : fichiers WOFF2 auto-hébergés avec `font-display: swap`. Précharger uniquement les graisses réellement utilisées au-dessus de la ligne de flottaison.

### Échelle typographique

| Style | Desktop | Tablette | Mobile | Interligne |
| --- | ---: | ---: | ---: | ---: |
| Hero | `clamp(68px, 7.7vw, 112px)` | 72–82 px | 48 px | 0,86–0,90 |
| H2 principal | `clamp(48px, 5.4vw, 75px)` | 56–68 px | 43 px | 0,94–1,00 |
| H3 éditorial | 38–40 px | 34–38 px | 32–35 px | 1,00–1,08 |
| Introduction | 17 px | 16 px | 15 px | 1,55 |
| Corps principal | 15–16 px | 15 px | 14 px | 1,55–1,65 |
| Navigation | 13 px | 13 px | 14 px dans le menu | 1,30 |
| CTA | 14 px | 14 px | 14 px | 1,20 |
| Label capitales | 11 px | 10–11 px | 10 px | 1,45 |
| Microcopie | 11–12 px | 11 px | 10–11 px | 1,40 |

Ne pas descendre sous 12 px pour une information nécessaire à la compréhension. Les tailles inférieures sont réservées aux légendes décoratives ou aux interfaces de démonstration volontairement réduites.

### Espacement

Base : 4 px. Valeurs autorisées : `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 72, 84, 96`.

- Espacement vertical standard d’une section desktop : 84–90 px.
- Tablette : 72–76 px.
- Mobile : 64–68 px.
- Écart entre titre de section et contenu : 40–52 px desktop ; 28–36 px mobile.
- Largeur maximale du contenu : 1 360 px.
- Largeur maximale du hero et de la scène produit : 1 440 px.

### Rayons

- CTA capsule : `999px`
- Carte majeure : `22–24px`
- Carte standard : `14–18px`
- Interface produit : `18–26px`
- Téléphone : `48px`
- Badge : `999px`

### Bordures et ombres

- Bordure standard : `1px solid rgba(18,21,18,.14)`.
- Bordure de carte forte : 2 px.
- CTA : bordure 1 px, jamais 2 px.
- Ombre CTA : décalage solide 3 px maximum + halo léger.
- Ombre carte : décalage solide 6–9 px pour donner du volume sans effet « neumorphism ».
- Éviter les ombres floues seules : elles rendent les composants trop génériques.

---

## 4. Grille responsive

### Breakpoints de référence

| Nom | Plage | Usage |
| --- | --- | --- |
| Mobile | 320–699 px | Une colonne, navigation compacte |
| Tablette | 700–999 px | Une ou deux colonnes selon le contenu |
| Desktop | 1 000–1 439 px | Grille complète avec marges de 28–40 px |
| Large desktop | ≥ 1 440 px | Contenu plafonné et centré |

Les breakpoints sont guidés par le contenu. Ne pas ajouter de rupture arbitraire si le composant tient correctement.

### Marges latérales

- Large desktop : `max(40px, calc((100vw - 1360px) / 2))`
- Desktop : 40 px
- Tablette : 28 px
- Mobile : 18 px

### Règles générales mobile

- Aucun débordement horizontal de page.
- Cible tactile minimale : 44 × 44 px.
- CTA principaux pleine largeur lorsque deux actions sont empilées.
- Titres alignés à gauche sur mobile, même si le desktop est centré.
- Les tableaux sont à éviter ; convertir en cartes ou flux verticaux.
- Le produit Manager peut être simplifié, mais ses informations essentielles restent lisibles.

---

## 5. Architecture de la HomePage

Ordre retenu :

1. Navigation
2. Hero et proposition de valeur
3. Démonstration Manager desktop
4. Démonstration mobile terrain
5. Tension opérationnelle
6. Fonctionnalités : du brief à la preuve
7. Preuve photographique / hospitalité
8. Pourquoi Choucas : flux visuel
9. Une journée dans Choucas
10. Profils utilisateurs
11. CTA final
12. Footer

Ne pas ajouter de CTA « Voir sur mobile » sur la HomePage. La route d’aperçu mobile sert uniquement à la revue de maquette.

---

## 6. Spécifications par section

### 6.1 Navigation

**Objectif :** identifier la marque, donner accès aux sections principales et convertir.

- Hauteur desktop : 68 px ; mobile : 60 px.
- Fond : papier chaud à 93 % avec `backdrop-filter: blur(18px)` si supporté.
- Structure desktop : marque / liens centrés / CTA à droite.
- Liens : Pourquoi Choucas, Le produit, Fonctionnement, À propos.
- CTA : Demander une démo.
- Mobile : marque + bouton menu ; le CTA est intégré au menu ou placé dans le contenu, pas dans la barre.
- Sticky autorisé si la barre n’occupe pas plus de 68 px.
- Focus visible : contour cuivre de 2 px, offset 3 px.

### 6.2 Hero

**Objectif :** faire comprendre en moins de cinq secondes le public, la promesse et l’action principale.

- Axe central sur desktop ; axe gauche sur mobile.
- Label : « Logiciel métier · Conciergeries indépendantes, traditionnelles et premium ».
- Titre : « Votre conciergerie, parfaitement orchestrée. »
- Ligne accentuée en cuivre, italique Newsreader.
- Texte : largeur maximale 720 px.
- Actions : CTA primaire « Demander une démo », CTA secondaire « Découvrir le produit ».
- Ne pas dépasser environ 560–620 px de hauteur avant le début de la scène produit sur un écran desktop courant.
- Le produit doit apparaître dans ou juste sous le premier viewport selon la hauteur disponible.

### 6.3 Scène produit Manager

**Objectif :** prouver immédiatement que Choucas est un produit opérationnel réel.

- Surface mousse, largeur max 1 440 px, rayon supérieur 28 px.
- Fenêtre Manager : largeur max 1 080 px, hauteur de présentation 570 px desktop.
- Navigation interne interactive : Aujourd’hui, Missions, Biens, Équipe.
- Conserver les quatre états ; changement sans rechargement.
- L’état actif doit être annoncé avec `aria-current` ou une alternative accessible.
- Sur tablette, masquer la colonne de missions secondaire si nécessaire.
- Sur mobile, conserver l’essentiel de la rotation ; masquer les métadonnées non critiques.
- Cette démonstration ne doit appeler aucune donnée réelle.

### 6.4 Démonstration mobile terrain

**Objectif :** montrer que le produit sert concrètement aux équipes de ménage et d’exploitation.

- Composition desktop : texte 1fr + téléphone de 430 px.
- Téléphone de démonstration : base 370 × 760 px, mis à l’échelle selon le viewport.
- Contenu obligatoire : mission en cours, progression, alerte linge, tâches, signalement, navigation Planning/Missions/Stocks/Équipe.
- Les trois tâches sont cliquables et basculent entre fait/non fait.
- Les contrôles doivent être de vrais boutons.
- Sur mobile, la section devient une colonne et le téléphone est réduit sans créer de débordement.

### 6.5 Tension opérationnelle

**Objectif :** exprimer le problème avant de détailler les fonctionnalités.

- Mise en page desktop en deux colonnes asymétriques.
- Label court à gauche, déclaration éditoriale à droite.
- Pas de paragraphe explicatif supplémentaire.
- Une seule partie du message en cuivre.

### 6.6 Fonctionnalités « Du brief à la preuve »

**Objectif :** expliquer le continuum opérationnel, pas une collection de modules isolés.

- Fond encre, texte blanc.
- Quatre onglets : Brief, Rotations/iCal, Missions, Stocks/linge/blanchisserie.
- Un seul panneau de détail visible à la fois.
- Desktop : onglets et panneau en deux colonnes.
- Mobile : pile verticale ; conserver un retour visuel clair sur l’onglet actif.
- Interaction clavier : flèches entre onglets si sémantique `tablist`, Entrée/Espace pour activer.
- Animation : fondu ou translation de 180–240 ms maximum.

### 6.7 Photographie et principes d’hospitalité

**Objectif :** relier le logiciel aux gestes réels de la conciergerie.

- Desktop : photographie et texte en deux colonnes.
- Photo actuelle : placeholder de direction uniquement.
- Asset final attendu : shooting Choucas, préparation de linge ou mise en place d’un bien, lumière naturelle, geste humain, absence de pose publicitaire.
- Format recommandé : AVIF/WebP, source 1 600 × 2 000 px minimum, recadrage vertical.
- Fournir `srcset`, dimensions intrinsèques et texte alternatif contextuel.
- Chargement différé sous la ligne de flottaison.

### 6.8 « Pourquoi Choucas » — flux visuel

**Objectif :** faire comprendre la transformation sans lire un tableau.

Structure desktop :

`Informations dispersées → moteur Choucas → opérations synchronisées`

- Bloc avant : messages, calendriers, appels/imprévus, stocks.
- Bloc central vert sapin : Choucas — Centralise, Priorise, Attribue.
- Bloc après : rotations, missions, linge/stocks, preuves.
- Sous le flux : trois résultats visuels — 1 vue commune, 0 information perdue, 100 % du contexte terrain.
- Les chiffres sont une expression de design et devront être validés juridiquement/marketing avant publication définitive.
- Tablette : le flux peut être simplifié en deux moments si l’espace est insuffisant.
- Mobile : flux vertical complet avec flèches tournées à 90°.
- Interdiction de revenir à un tableau comparatif de six lignes.

### 6.9 Une journée dans Choucas

**Objectif :** montrer le produit dans le temps.

- Quatre moments : 08:00 Préparer, 11:30 Coordonner, 15:00 Contrôler, 17:30 Accueillir.
- Un moment actif à la fois.
- Desktop : quatre onglets horizontaux + détail en trois colonnes.
- Mobile : grille 2 × 2 pour les heures, détail en une colonne.
- Le changement doit mettre à jour label, titre, texte, carte et icône.

### 6.10 Profils utilisateurs

**Objectif :** permettre à chaque visiteur de s’identifier immédiatement.

- Titre : « Une même information. Trois façons d’agir. »
- Trois cartes : Dirigeant/Piloter, Responsable d’exploitation/Coordonner, Équipe terrain/Exécuter.
- Chaque carte contient : numéro, icône, verbe, rôle, phrase courte, bénéfice avec coche.
- Carte centrale en vert sapin ; cartes latérales papier chaud.
- Contraste fort et bordure 2 px.
- Desktop : trois colonnes ; tablette : deux cartes + troisième pleine largeur ; mobile : une colonne.
- Pas de CTA « Découvrir » répété dans chaque carte tant qu’aucune page de rôle n’existe.

### 6.11 CTA final

**Objectif :** transformer la compréhension en demande de démonstration.

- Fond encre.
- Message orienté usage : propres rotations, organisation, biens et équipes.
- Un seul CTA primaire.
- Microcopie : 30 minutes · Sans engagement.
- Le `mailto:` actuel est provisoire. Remplacer par le vrai mécanisme de prise de rendez-vous ou formulaire.

### 6.12 Footer

- Marque, navigation courte, contexte géographique et mentions légales.
- Ajouter avant mise en production : Mentions légales, Politique de confidentialité, gestion des cookies si nécessaire.
- Retirer « Maquette UX/UI · contenu provisoire » en production.

---

## 7. Composants

### CTA primaire

- Hauteur cible : 48–50 px.
- Padding horizontal : 20–22 px.
- Rayon : capsule.
- Fond sapin, texte blanc, police 14 px/700.
- Icône flèche 18–20 px.
- Hover : translation Y -1 px et ombre légèrement augmentée.
- Active : translation Y +2 px, ombre solide réduite.
- Disabled : opacité 45 %, aucune ombre, curseur interdit.

### CTA secondaire

- Même hauteur et typographie que le primaire.
- Fond blanc, texte encre, bordure 1 px.
- Ombre solide gris chaud de 3 px.
- Ne jamais utiliser une petite police pour le rendre visuellement secondaire.

### Cartes

- Rayon 14–24 px selon importance.
- Bordure 1 px standard ou 2 px pour les cartes de transformation/profil.
- Padding minimal mobile : 20 px ; desktop : 24–34 px.
- Ne pas imbriquer plus de deux niveaux de cartes visibles.

### Icônes

- SVG inline, `viewBox="0 0 24 24"`.
- Style outline, extrémités et jointures arrondies.
- Épaisseur standard : 1,7 px ; 2–2,2 px pour petits états ou coches.
- Tailles : 16, 20, 24, 28, 32, 42 px.
- `aria-hidden="true"` si décorative ; nom accessible si elle constitue le seul contenu du bouton.

### États de contrôle

Tous les boutons, onglets et liens doivent posséder : default, hover, focus-visible, active, disabled. Les changements d’état ne peuvent pas dépendre uniquement de la couleur.

---

## 8. Animations

- Durée standard : 180–240 ms.
- Courbe : `cubic-bezier(.2,.8,.2,1)`.
- Autorisé : légère translation de CTA, fondu des panneaux, progression, changement d’onglet.
- Interdit : parallaxe lourde, texte animé en continu, scroll hijacking, animations retardant la lecture.
- Respecter `prefers-reduced-motion: reduce` en supprimant transitions et défilement animé.

---

## 9. Accessibilité

- HTML sémantique : `nav`, `header`, `main`, `section`, `footer`.
- Un seul `h1`; hiérarchie de titres sans saut arbitraire.
- Contraste WCAG AA minimum.
- Focus visible sur chaque élément interactif.
- Navigation entièrement utilisable au clavier.
- Cibles tactiles 44 × 44 px minimum.
- `alt` utile pour la photo ; `alt=""` pour les images purement décoratives.
- Les contenus masqués en responsive ne doivent pas supprimer une information indispensable.
- Ne pas annoncer les icônes décoratives aux lecteurs d’écran.
- Les onglets doivent exposer leur état sélectionné.

---

## 10. Performance et SEO

- Objectif Lighthouse mobile : Performance ≥ 85, Accessibilité ≥ 95, SEO ≥ 95.
- LCP visé < 2,5 s sur connexion mobile standard.
- CLS < 0,1 : réserver les dimensions des images et démonstrations.
- JS initial minimal ; charger les interactions de démonstration sans dépendance lourde.
- Images AVIF/WebP, compression adaptée et lazy loading.
- Meta title cible : `Choucas — Le logiciel opérationnel des conciergeries`.
- Meta description cible : `Choucas coordonne les briefs, rotations, missions, équipes, stocks et linge des conciergeries, du bureau jusqu’au terrain.`
- Ajouter Open Graph lorsque les contenus et visuels finaux sont validés.

---

## 11. Données et contenus provisoires

À valider avant mise en production :

- Adresse de contact et système de prise de rendez-vous
- Noms et données visibles dans les démonstrations
- Affirmations chiffrées de la section Pourquoi Choucas
- Photographie finale Choucas
- Mention « de 5 à 150 biens »
- Terminologie finale : responsable d’exploitation, manager, gouvernante, équipier
- Disponibilité réelle des modules stocks, linge, blanchisserie et iCal
- Mentions légales et confidentialité

Ne pas présenter comme disponible une fonction qui n’est pas encore livrée. Utiliser, selon le statut, « disponible », « en cours de déploiement » ou « bientôt disponible ».

---

## 12. Critères d’acceptation

### Desktop

- Le hero, les CTA et le début du produit sont perçus comme un ensemble cohérent.
- Le produit apparaît rapidement sans titre occupant tout l’écran.
- Toutes les sections respectent une largeur maximale cohérente.
- Le flux Pourquoi Choucas est compris sans lire un tableau.
- Les trois profils sont lisibles et fortement contrastés.

### Tablette

- Aucun chevauchement entre titres, cartes ou démonstrations.
- Les grilles passent à une ou deux colonnes selon les règles définies.
- Le téléphone et le Manager restent lisibles sans débordement.

### Mobile

- Aucun débordement horizontal à 320, 375, 390 et 430 px.
- Le menu s’ouvre, se ferme et reste accessible au clavier.
- Les CTA sont pleine largeur dans le hero.
- Les onglets et tâches sont utilisables au toucher.
- Le flux Pourquoi Choucas devient vertical.
- Les profils apparaissent en une colonne.

### Global

- Aucune erreur console bloquante.
- Aucun lien factice en production.
- `prefers-reduced-motion` est respecté.
- Les polices disposent de fallbacks.
- Les composants sont testés avec zoom navigateur à 200 %.

---

## 13. Livrables attendus de l’équipe de développement

1. HomePage responsive conforme à ce document.
2. Bibliothèque de composants ou dossier UI documenté.
3. Tokens reliés au fichier CSS fourni.
4. Démonstrations Manager et mobile isolées des données réelles.
5. Vérification responsive aux largeurs de référence.
6. Rapport court accessibilité et performance.
7. Liste des écarts éventuels par rapport aux spécifications.

---

## 14. Références de validation

- La HomePage publiée sert de référence visuelle, mais ce document prime pour les règles techniques.
- L’aperçu `/homepage-mobile` est un outil de revue sur ordinateur ; il ne doit pas apparaître dans le parcours commercial.
- En cas de divergence entre une ancienne capture et la version publiée actuelle, utiliser la version actuelle.

