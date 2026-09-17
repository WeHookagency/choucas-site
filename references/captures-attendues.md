# Les captures que le site attend de la PWA

Liste de courses pour le front-end de la PWA. Écrite le 17 septembre 2026, à
partir des réserves réellement rendues sur le site — mesurées dans un
navigateur, pas lues dans le code.

**Dix captures.** Quatre en paysage, six en portrait.

---

## Portrait — ratio 340 × 480, à livrer en **1036 px de large**

Le rapport vaut **0,708:1**. Ce n'est pas le rapport d'un téléphone (0,46:1) :
**une capture de téléphone entière ne rentrera pas.** Il faut cadrer une
portion d'écran, et décider laquelle *avant* de capturer.

1036 px de large, c'est la largeur du gabarit à 340 px affichés sur un écran à
2×. En dessous, la capture est floue sur un MacBook ou un iPhone.

| # | Légende affichée | Page | Ce que l'écran doit montrer |
|---|---|---|---|
| 1 | La journée sur site | Accueil, section tarifs | La configuration posée : biens, rôles, workflows — le résultat de la journée d'implantation |
| 2 | Le brief consolidé | Produit 01 | Un bien, sa consigne unique, et le conflit posé plutôt que transmis |
| 3 | L'écran équipier | Produit 02 | Une mission à la fois, en grand. Gros boutons, peu de texte |
| 4 | L'écran de contrôle | Produit 03 | Le geste de validation par un tiers, avec les deux noms |
| 5 | Le verdict du jour | Produit 04 | Le tableau du matin : ce qui est PRÊT et ce qui ne l'est pas |
| 6 | La fiche du bien | Produit 05 | Historique des incidents, références des appareils, procédure de panne |

## Paysage — ratio 1340 × 1000, à livrer en **1340 px de large**

Ce sont les quatre panneaux de l'accordéon « Du brief au PRÊT » sur l'accueil.
Un seul est visible à la fois — ils doivent donc se ressembler entre eux, sinon
le passage d'un onglet à l'autre saute.

| # | Panneau | Ce que l'écran doit montrer |
|---|---|---|
| 7 | Le brief devient opérationnel | La demande entrante transformée en consigne |
| 8 | Terminé ne veut pas dire contrôlé | L'écart entre déclaré et validé |
| 9 | Le check-in repose sur un état clair | Le parc, avec ses états |
| 10 | Le travail accompli devient visible | Le rapport propriétaire |

---

## Deux captures qui ne peuvent pas encore exister

**#4 « L'écran de contrôle »** et **#6 « La fiche du bien »** supposent des
fonctions que la PWA n'a pas : l'étape 3 d'`identite-pwa.md` — le serveur
décide, le client affiche — et la fenêtre d'accès de `codes-acces-pwa.md`.

Les capturer avant que ces fonctions existent produirait une image d'un écran
qui ment. Ce sont les deux dernières de la liste, pas les premières.

---

## Contraintes communes

- **PNG**, pas de JPEG : ce sont des interfaces, pas des photos. Le JPEG salit
  les aplats et les petits textes.
- **Données fictives cohérentes avec le site.** Les noms sont déjà fixés et
  se recoupent d'une page à l'autre : Chalet L'Aiguille, Chalet La Tournette,
  Chalet Balme, Le Bossonnet, Chalet Cortibot ; Marie L. équipière, Sophie M.
  responsable d'exploitation, Karim B., Elena V., Sofia R. ; samedi
  5 septembre. **Une capture qui introduit d'autres noms casse la continuité
  que le site a mis deux semaines à construire.**
- **Aucun code d'accès réel**, évidemment. `447` est la valeur de
  démonstration déjà publiée.
- **Mode clair.** Le site pose les captures sur des fonds Neige et Sapin ; une
  capture en mode sombre y ferait un trou.
- **Pas de barre d'état de téléphone** (heure, batterie, réseau) : le site
  n'encadre pas ces captures dans une coque, sauf la démonstration en iframe
  qui, elle, est la vraie application.

## Où elles se posent

`src/components/ui/Reserve.tsx` est le composant en pointillés qui les
attend. Remplacer une réserve par `CaptureProduit` demande trois choses : le
fichier dans `public/demo/`, l'import statique, et une chaîne `captureAlt`
décrivant l'écran — **pas un slogan, une description de ce qu'on voit**, pour
quelqu'un qui ne le voit pas.
