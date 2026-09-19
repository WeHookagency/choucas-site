# Les captures que le site attend de la PWA

Liste de courses pour le front-end de la PWA, page par page et section par
section. Mesurée dans un navigateur sur les emplacements réellement rendus, le
19 septembre 2026 — pas comptée dans le code.

**Dix captures.** Six en portrait, quatre en paysage.

---

## 1. Page d'accueil — `choucas.app/fr`

### Section « Du brief au PRÊT. Du PRÊT à la preuve. »

Un accordéon à quatre panneaux : **un seul est visible à la fois.** Les quatre
captures doivent donc se ressembler entre elles — même cadrage, même densité,
même échelle — sinon le passage d'un onglet à l'autre saute à l'œil.

| # | Panneau | Ce que l'écran doit montrer |
|---|---|---|
| 1 | Le brief devient opérationnel | La demande entrante transformée en consigne unique pour un bien |
| 2 | Terminé ne veut pas dire contrôlé | L'écart entre déclaré terminé et validé |
| 3 | Le check-in repose sur un état clair | Le parc du jour avec ses états, dont ce qui est PRÊT |
| 4 | Le travail accompli devient visible | Le rapport propriétaire |

**Format : 1340 × 1000 px** — paysage, rapport 1,34:1. Livrer à 1340 px de
large.

### Section « Un démarrage, puis un abonnement »

| # | Légende affichée | Ce que l'écran doit montrer |
|---|---|---|
| 5 | La journée sur site | La configuration posée : biens, rôles, workflows — ce qu'on obtient à la fin de la journée d'implantation |

**Format : 340 × 480 px** — portrait, rapport 0,708:1. **Livrer à 1036 px de
large.**

---

## 2. Page Produit — `choucas.app/fr/produit`

Cinq sections numérotées, une capture chacune, **toutes au même format :
340 × 480 px, rapport 0,708:1, à livrer à 1036 px de large.**

| # | Section | Légende affichée | Ce que l'écran doit montrer |
|---|---|---|---|
| 6 | 01 Le brief | Le brief consolidé | Un bien, sa consigne unique, et un conflit **posé** plutôt que transmis — c'est le cœur de la section |
| 7 | 02 La mission terrain | L'écran équipier | Une mission à la fois, en grand. Gros boutons, peu de texte |
| 8 | 03 Le double contrôle | L'écran de contrôle | Le geste de validation par un tiers, avec les deux noms |
| 9 | 04 Terminé ne veut pas dire PRÊT | Le verdict du jour | Le tableau du matin : ce qui est PRÊT et ce qui ne l'est pas |
| 10 | 05 Quand l'imprévu arrive | La fiche du bien | Historique des incidents, références des appareils, procédure de panne |

### Ce qui est déjà en place sur cette page — ne pas refaire

- **Le hero** utilise `accueil-responsable.png`, affiché à 480 px de large et
  recadré à 640 px de haut avec un fondu.
- **La section « Personne ne valide son propre travail »** utilise
  `bloc-exceptions.png`, affiché à 440 px de large, sans recadrage.

Ces deux fichiers existent et sont en ligne. S'ils sont refaits, **garder leurs
dimensions source** — 1036 × 3000 et 1036 × 1158 — sinon le recadrage du hero
tombe ailleurs.

---

## 3. Page Tarifs — `choucas.app/fr/tarifs`

**Aucune capture attendue.** Les deux blocs en pointillés de la section « Ce
qui arrive » ne sont pas des réserves : ce sont les deux briques en
construction, et le pointillé y dit qu'elles n'existent pas encore. Il doit
rester.

---

## Les deux qui ne peuvent pas encore exister

**#8 « L'écran de contrôle »** et **#10 « La fiche du bien »** supposent des
fonctions que la PWA n'a pas : l'étape 3 d'`identite-pwa.md` — le serveur
décide, le client affiche — et la fenêtre d'accès de `codes-acces-pwa.md`.

Les capturer avant que ces fonctions existent produirait l'image d'un écran qui
ment. **Ce sont les deux dernières de la liste, pas les premières.**

---

## Le piège du format portrait

Le gabarit vaut **0,708:1**. Ce n'est pas le rapport d'un téléphone, qui est
d'environ 0,46:1. **Une capture d'écran de téléphone entière ne rentrera pas.**

Il faut cadrer une portion d'écran, et **décider laquelle avant de capturer**,
pas après. Une capture trop haute recadrée à l'arrache perd toujours la ligne
qui portait le propos.

1036 px de large, c'est la largeur du gabarit à 340 px affichés sur un écran à
2×. En dessous, la capture est floue sur un MacBook ou un iPhone.

---

## Contraintes communes aux dix

**PNG, jamais JPEG.** Ce sont des interfaces, pas des photos : le JPEG salit
les aplats et les petits textes.

**Mode clair.** Le site pose ces captures sur des fonds Neige et Sapin ; une
capture en mode sombre y ferait un trou.

**Pas de barre d'état de téléphone** — heure, batterie, réseau. Le site
n'encadre pas ces captures dans une coque de téléphone. La seule exception est
la démonstration en iframe de l'accueil, qui est la vraie application et qui ne
demande aucune capture.

**Aucun code d'accès réel.** `447` est la valeur de démonstration déjà publiée.

**Les noms sont fixés, et ils se recoupent d'une page à l'autre.** Une capture
qui en introduit d'autres casse une continuité que le site a mis deux semaines
à construire — sur Produit, l'écran de la section 03 et les deux cartes posées
à côté racontent le même moment, au même chalet, à la même heure.

- Chalets : **L'Aiguille**, **La Tournette**, **Balme**, **Le Bossonnet**,
  **Cortibot**, **Beauregard**, **Merle Blanc**, **Les Troncs**, **Sous les
  Combes**, **Les Confins**, **Le Danay**
- Personnes : **Marie L.** équipière · **Sophie M.** responsable
  d'exploitation · **Karim B.** · **Elena V.** · **Sofia R.**
- Familles : **Roux**, **Bertin**, **Aubert**, **Vidal**
- Date : **samedi 5 septembre**

---

## Où elles se posent, côté site

`src/components/ui/Reserve.tsx` est le composant en pointillés qui les attend.
Remplacer une réserve demande trois choses :

1. le fichier dans `public/demo/` ;
2. un import statique en tête du composant — `next/image` connaît alors ses
   dimensions à la compilation et ne fait bouger aucun bloc ;
3. une chaîne `captureAlt` décrivant l'écran. **Une description de ce qu'on
   voit, pour quelqu'un qui ne le voit pas — pas un slogan.**
